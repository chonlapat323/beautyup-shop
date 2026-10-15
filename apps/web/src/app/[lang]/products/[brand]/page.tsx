import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryHero } from "@/components/category-hero";
import { CategoryProductsView } from "@/components/category-products-view";
import { GrowYourVision } from "@/components/grow-your-vision";
import { MenuContentRenderer } from "@/components/menu-content-renderer";
import { PinkBlackHoleEffect } from "@/components/pink-black-hole";
import { ProductGrid } from "@/components/product-grid";
import { ArrowLink, Media, PageHero, SectionHeading, SocialLinks, stagger } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getBrandCategories, getBrandCategory } from "@/lib/brand-categories";
import { getBrand, getBrands, getGrowVision, getMenuItemByHref, getProducts } from "@/lib/data";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const brands = await getBrands(params.lang as Locale, "SALON");
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[brand]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const brand = await getBrand(lang, (await params).brand);
  if (!brand) return { title: dict.products.notFound };
  return {
    title: brand.nameTh && brand.nameTh !== brand.name ? `${brand.name} (${brand.nameTh})` : brand.name,
    description: brand.description,
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: PageProps<"/[lang]/products/[brand]"> & {
  searchParams?: Promise<{ category?: string; series?: string }>;
}) {
  const { lang, dict } = await resolveLang(params);
  const { brand: slug } = await params;
  const sp = await searchParams;
  const selectedCatSlug = sp?.category || sp?.series;

  const [brand, menuItem, growVision] = await Promise.all([
    getBrand(lang, slug),
    getMenuItemByHref(lang, `/products/${slug}`),
    getGrowVision(lang),
  ]);

  if (!brand || brand.type !== "SALON") notFound();

  const categories = getBrandCategories(slug, lang);
  const currentCategory = selectedCatSlug ? getBrandCategory(slug, selectedCatSlug, lang) : undefined;

  // If menu specifies a brand or default to current slug
  const targetBrandSlug = menuItem?.brandSlug || slug;
  const showProducts = menuItem?.showProducts ?? true;

  const products = showProducts ? await getProducts(lang, { brandSlug: targetBrandSlug }) : [];

  // Group products by category (e.g. "Fanola Salon", "Fanola Hair Care")
  const categoryOrder: string[] = [];
  const categorized: Record<string, typeof products> = {};
  const uncategorized: typeof products = [];

  for (const p of products) {
    const cat = p.category?.trim();
    if (cat) {
      if (!categorized[cat]) {
        categorized[cat] = [];
        categoryOrder.push(cat);
      }
      categorized[cat].push(p);
    } else {
      uncategorized.push(p);
    }
  }

  const hasCategories = categoryOrder.length > 0;
  const hasMenuContent = menuItem && ((menuItem.sections && menuItem.sections.length > 0) || (menuItem.slides && menuItem.slides.length > 0));

  // Filter products for category if selected
  const categoryProducts = currentCategory
    ? products.filter((p) => {
        const name = p.name.toLowerCase();
        const pSlug = p.slug.toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const ser = (p.series || "").toLowerCase();
        const target = currentCategory.slug.toLowerCase();

        if (target === "no-yellow-care") {
          return (
            pSlug.includes("no-yellow") ||
            pSlug.includes("shield-protective") ||
            pSlug.includes("2-phase-potion") ||
            pSlug.includes("thermo-protective") ||
            pSlug.includes("incredible-foam") ||
            name.includes("no yellow") ||
            name.includes("โนเยลโล")
          );
        }
        if (target === "no-orange") {
          return (
            pSlug.includes("no-orange") ||
            pSlug.includes("blue-foam") ||
            name.includes("no orange") ||
            name.includes("โนออเรนจ์")
          );
        }
        if (target === "no-red") {
          return (
            pSlug.includes("no-red") ||
            name.includes("no red") ||
            name.includes("โนเรด")
          );
        }
        if (target === "nutri-care") {
          return (
            pSlug.includes("nutri-care") ||
            name.includes("nutri") ||
            name.includes("นูทริ")
          );
        }
        return (
          pSlug.includes(target) ||
          name.includes(target) ||
          cat.includes(target) ||
          ser.includes(target)
        );
      })
    : [];

  const displayCategoryProducts =
    categoryProducts.length > 0 ? categoryProducts : products;

  // Render dedicated Category View when a category is selected (Image 2 reference)
  if (currentCategory) {
    return (
      <div id="category-view">
        <CategoryHero
          category={currentCategory}
          brandSlug={slug}
          brandName={brand.name}
          lang={lang}
        />
        <CategoryProductsView
          category={currentCategory}
          products={displayCategoryProducts}
          brandName={brand.name}
          brandSlug={slug}
        />
        <div className="border-t border-line bg-mist/30">
          <CategoryGrid
            categories={categories}
            brandSlug={slug}
            brandName={brand.name}
            activeCategory={currentCategory.slug}
            title={
              lang === "th"
                ? `คอลเลกชันอื่น ๆ ของ ${brand.name}`
                : `Other ${brand.name} Collections`
            }
            eyebrow="Explore Collections"
          />
        </div>
        <GrowYourVision data={growVision} />
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={brand.country ? dict.common.importedFrom(brand.country) : undefined}
        title={
          <>
            {brand.nameTh} <span className="text-muted">{brand.name}</span>
          </>
        }
        description={brand.description}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {brand.website && (
            <a href={brand.website} target="_blank" rel="noreferrer" className="btn btn-outline">
              {dict.products.website}
            </a>
          )}
          {brand.catalogUrl && (
            <a href={brand.catalogUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
              {dict.products.catalog}
            </a>
          )}
          <SocialLinks socials={brand.socials} />
        </div>
      </PageHero>

      {/* 1. Dynamic Menu Content (Configured directly in Admin > Menu Items) */}
      {hasMenuContent ? (
        <MenuContentRenderer menu={menuItem} />
      ) : (
        /* Fallback: Brand Pillars / Feature Highlights */
        brand.features && brand.features.length > 0 && (
          <section className="relative border-b border-line bg-gradient-to-b from-mist/50 via-blush/20 to-mist/30 py-12 md:py-20 overflow-hidden">
            {/* Ambient Brand-Pink Glow Backdrop (Aura ละอองแสงสีชมพู เหมือนหน้า Home) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[36rem] sm:size-[52rem] rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.15),transparent_70%)] blur-3xl animate-drift motion-reduce:animate-none" />
              <div className="absolute -top-12 -right-12 size-96 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.13),transparent_65%)] blur-3xl" />
              <div className="absolute -bottom-12 -left-12 size-96 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.11),transparent_65%)] blur-3xl" />
            </div>

            {/* Floating Dreamy Pink Dust Particles (ละอองสีชมพูเหมือนหน้า Home) */}
            <PinkBlackHoleEffect count={70} className="absolute inset-0 size-full pointer-events-none z-0" />

            <div className="container-page relative z-10">
              <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
                <p className="eyebrow text-brand-pink font-semibold">Specialized Collections</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
                  {lang === "th" ? "หมวดหมู่ผลิตภัณฑ์หลัก" : "Specialized Collections"}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-muted">
                  {lang === "th"
                    ? "4 คอลเลกชันคุณภาพเพื่อช่างผมมืออาชีพและร้านซาลอนชั้นนำ"
                    : "4 Professional collections for salons and stylists"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {brand.features.map((feat, i) => (
                  <div
                    key={i}
                    data-reveal
                    suppressHydrationWarning
                    style={stagger(i)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-pink/30"
                  >
                    <div>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-sm font-semibold text-accent-dark">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 font-display text-xl sm:text-2xl font-semibold text-ink group-hover:text-accent transition-colors">
                        {feat.title}
                      </h3>
                      {feat.description && (
                        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-6">
                          {feat.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-line/60">
                      <Link
                        href={feat.href || "#products"}
                        className="btn-pill !text-xs sm:!text-sm group-hover:border-brand-pink group-hover:text-brand-pink"
                      >
                        <span>{dict.common.viewProducts || (lang === "th" ? "ดูสินค้า" : "View products")}</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      )}

      {/* 2. Series Quick Links / Pills */}
      {brand.series && brand.series.length > 0 && (
        <section className="border-b border-line bg-white py-6">
          <div className="container-page flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-2">
              {lang === "th" ? "ซีรีส์ยอดนิยม:" : "Popular Series:"}
            </span>
            {brand.series.map((item, idx) => (
              <Link
                key={idx}
                href={item.href || "#products"}
                className="btn-pill relative hover:z-10 !text-xs sm:!text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Visual Category Grid (Pinterest Moodboard - Below Specialized Collections) */}
      {categories.length > 0 && (
        <CategoryGrid
          categories={categories}
          brandSlug={slug}
          brandName={brand.name}
          title={
            lang === "th"
              ? "คอลเลกชันและหมวดหมู่ผลิตภัณฑ์"
              : "Product Collections & Categories"
          }
          eyebrow="Collections"
        />
      )}

      {/* 3. Product Showcase (if showProducts is enabled) */}
      {showProducts && (
        <section id="products" className="container-page py-12 md:py-20">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line p-10 text-center sm:p-16">
              <p className="font-display text-2xl">{dict.common.comingSoon}</p>
              <p className="mt-2 text-muted">{dict.common.askTeam}</p>
              <Link href="/contact/salon-partner" className="btn btn-primary mt-6">
                {dict.common.contactToOrder}
              </Link>
            </div>
          ) : hasCategories ? (
            <div className="space-y-16 md:space-y-24">
              {categoryOrder.map((catName) => {
                const catItems = categorized[catName] || [];
                return (
                  <div key={catName} className="scroll-mt-24">
                    <SectionHeading
                      eyebrow={brand.name}
                      title={catName}
                      description={
                        dict.common.itemsCount
                          ? dict.common.itemsCount(catItems.length)
                          : lang === "th"
                            ? `${catItems.length} รายการ`
                            : `${catItems.length} items`
                      }
                    />
                    <ProductGrid
                      products={catItems}
                      brandNames={{ [brand.slug]: brand.name }}
                      showFilter={false}
                    />
                  </div>
                );
              })}

              {uncategorized.length > 0 && (
                <div className="scroll-mt-24 pt-8 border-t border-line">
                  <SectionHeading
                    eyebrow={brand.name}
                    title={lang === "th" ? "ผลิตภัณฑ์เพิ่มเติม" : "Additional Products"}
                    description={
                      dict.common.itemsCount
                        ? dict.common.itemsCount(uncategorized.length)
                        : lang === "th"
                          ? `${uncategorized.length} รายการ`
                          : `${uncategorized.length} items`
                    }
                  />
                  <ProductGrid
                    products={uncategorized}
                    brandNames={{ [brand.slug]: brand.name }}
                    showFilter={false}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <SectionHeading
                eyebrow={brand.name}
                title={dict.products.headline}
                description={
                  dict.common.itemsCount
                    ? dict.common.itemsCount(products.length)
                    : lang === "th"
                      ? `${products.length} รายการ`
                      : `${products.length} items`
                }
              />
              <ProductGrid
                products={products}
                brandNames={{ [brand.slug]: brand.name }}
                showFilter={false}
              />
            </div>
          )}
        </section>
      )}

      {/* 4. Bottom CTA */}
      <GrowYourVision data={growVision} />
    </>
  );
}
