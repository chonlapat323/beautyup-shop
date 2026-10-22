import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryHero } from "@/components/category-hero";
import { CategoryProductsView } from "@/components/category-products-view";
import { GrowYourVision } from "@/components/grow-your-vision";
import { MenuContentRenderer } from "@/components/menu-content-renderer";
import { ProductGrid } from "@/components/product-grid";
import { PageHero, SectionHeading, SocialLinks } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getBrand, getBrandCategories, getBrands, getGrowVision, getMenuItemByHref, getProducts } from "@/lib/data";

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
  searchParams?: Promise<{ category?: string }>;
}) {
  const { lang, dict } = await resolveLang(params);
  const { brand: slug } = await params;
  const sp = await searchParams;
  const selectedCatSlug = sp?.category;

  const [brand, menuItem, growVision, categories] = await Promise.all([
    getBrand(lang, slug),
    getMenuItemByHref(lang, `/products/${slug}`),
    getGrowVision(lang),
    getBrandCategories(lang, slug),
  ]);

  if (!brand || brand.type !== "SALON") notFound();

  const currentCategory = selectedCatSlug
    ? categories.find((c) => c.slug.toLowerCase() === selectedCatSlug.toLowerCase())
    : undefined;

  // A brand page always lists its own brand's products; the menu item can only hide them
  const showProducts = menuItem?.showProducts ?? true;

  const products = showProducts ? await getProducts(lang, { brandSlug: slug }) : [];

  // List products under their collection headings, in the collections' order
  const groups = categories
    .map((c) => ({ title: c.name, items: products.filter((p) => p.collection?.slug === c.slug) }))
    .filter((g) => g.items.length > 0);
  const ungrouped = products.filter((p) => !groups.some((g) => g.items.includes(p)));
  const hasMenuContent = menuItem && ((menuItem.sections && menuItem.sections.length > 0) || (menuItem.slides && menuItem.slides.length > 0));

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
          products={products.filter((p) => p.collection?.slug === currentCategory.slug)}
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

      {/* Content from the brand's menu item (Admin → เมนูและหน้าเว็บ) */}
      {hasMenuContent && <MenuContentRenderer menu={menuItem} lang={lang} />}

      {/* Visual Category Grid (Pinterest Moodboard - Below Specialized Collections) */}
      {categories.length > 0 && (
        <CategoryGrid
          categories={categories}
          brandSlug={slug}
          brandName={brand.name}
          title={
            lang === "th"
              ? "คอลเลกชันผลิตภัณฑ์"
              : "Product Collections"
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
          ) : groups.length > 0 ? (
            <div className="space-y-16 md:space-y-24">
              {[...groups, ...(ungrouped.length ? [{ title: lang === "th" ? "ผลิตภัณฑ์เพิ่มเติม" : "Additional Products", items: ungrouped }] : [])].map((g) => (
                <div key={g.title} className="scroll-mt-24">
                  <SectionHeading eyebrow={brand.name} title={g.title} description={dict.common.itemsCount(g.items.length)} />
                  <ProductGrid products={g.items} brandNames={{ [brand.slug]: brand.name }} showFilter={false} />
                </div>
              ))}
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
