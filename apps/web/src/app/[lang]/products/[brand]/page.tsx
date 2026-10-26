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
import type { BrandCategory, BrandMainCategory } from "@/lib/brand-categories";
import { getBrand, getBrandCategories, getBrandMainCategories, getBrands, getGrowVision, getMenuItemByHref, getProducts } from "@/lib/data";
import type { Product } from "@/lib/types";

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

/**
 * Brand page -> main category (?group=) -> collection (?category=) -> product.
 * Main categories and collections are edited in Admin; the brand's menu item adds free content.
 */
export default async function BrandPage({
  params,
  searchParams,
}: PageProps<"/[lang]/products/[brand]"> & {
  searchParams?: Promise<{ category?: string; group?: string }>;
}) {
  const { lang, dict } = await resolveLang(params);
  const { brand: slug } = await params;
  const sp = await searchParams;
  const th = lang === "th";

  const [brand, menuItem, growVision, categories, mainCategories] = await Promise.all([
    getBrand(lang, slug),
    getMenuItemByHref(lang, `/products/${slug}`),
    getGrowVision(lang),
    getBrandCategories(lang, slug),
    getBrandMainCategories(lang, slug),
  ]);

  if (!brand || brand.type !== "SALON") notFound();

  const bySlug = <T extends { slug: string }>(list: T[], want?: string) =>
    want ? list.find((x) => x.slug.toLowerCase() === want.toLowerCase()) : undefined;
  const currentCategory = bySlug(categories, sp?.category);
  const currentMain = currentCategory ? undefined : bySlug(mainCategories, sp?.group);

  // A brand page always lists its own brand's products; the menu item can only hide them
  const showProducts = menuItem?.showProducts ?? true;
  const products = showProducts ? await getProducts(lang, { brandSlug: slug }) : [];
  const brandNames = { [brand.slug]: brand.name };
  const groupHref = (m: BrandMainCategory) => `/products/${slug}?group=${m.slug}`;

  // Main category cards, in the same look as the menu's card blocks
  const mainCards = (list: BrandMainCategory[], title: string) =>
    list.length > 0 && (
      <MenuContentRenderer
        lang={lang}
        menu={{
          label: title,
          href: `/products/${slug}`,
          sections: [
            {
              layout: "columns",
              title,
              cards: list.map((m) => ({ title: m.name, description: m.description, imageUrl: m.imageUrl, href: groupHref(m) })),
            },
          ],
        }}
      />
    );

  // Products under their collection headings, in the collections' order
  const productList = (list: Product[], cats: BrandCategory[]) => {
    const groups = cats
      .map((c) => ({ title: c.name, items: list.filter((p) => p.collection?.slug === c.slug) }))
      .filter((g) => g.items.length > 0);
    const rest = list.filter((p) => !groups.some((g) => g.items.includes(p)));
    if (rest.length && groups.length) groups.push({ title: th ? "ผลิตภัณฑ์เพิ่มเติม" : "Additional Products", items: rest });
    return (
      <section id="products" className="container-page scroll-mt-24 py-12 md:py-20">
        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line p-10 text-center sm:p-16">
            <p className="font-display text-2xl">{dict.common.comingSoon}</p>
            <p className="mt-2 text-muted">{dict.common.askTeam}</p>
            <Link href="/contact/salon-partner" className="btn btn-primary mt-6">
              {dict.common.contactToOrder}
            </Link>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {(groups.length ? groups : [{ title: dict.products.headline, items: list }]).map((g) => (
              <div key={g.title}>
                <SectionHeading eyebrow={brand.name} title={g.title} description={dict.common.itemsCount(g.items.length)} />
                <ProductGrid products={g.items} brandNames={brandNames} showFilter={false} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  // 3. One collection and its products
  if (currentCategory) {
    const main = bySlug(mainCategories, currentCategory.mainCategorySlug);
    const siblings = main ? categories.filter((c) => c.mainCategorySlug === main.slug) : categories;
    return (
      <div id="category-view">
        <CategoryHero
          category={currentCategory}
          brandSlug={slug}
          brandName={brand.name}
          lang={lang}
          back={main ? { href: groupHref(main), label: th ? `กลับไปหมวด ${main.name}` : `Back to ${main.name}` } : undefined}
        />
        <CategoryProductsView
          category={currentCategory}
          products={products.filter((p) => p.collection?.slug === currentCategory.slug)}
          brandName={brand.name}
          brandSlug={slug}
        />
        <div className="border-t border-line bg-mist/30">
          <CategoryGrid
            categories={siblings}
            brandSlug={slug}
            brandName={brand.name}
            activeCategory={currentCategory.slug}
            title={
              th
                ? `คอลเลกชันอื่น ๆ ${main ? `ในหมวด ${main.name}` : `ของ ${brand.name}`}`
                : `Other ${main ? main.name : brand.name} Collections`
            }
            eyebrow="Explore Collections"
          />
        </div>
        <GrowYourVision data={growVision} />
      </div>
    );
  }

  // 2. One main category: its collections and their products
  if (currentMain) {
    const cats = categories.filter((c) => c.mainCategorySlug === currentMain.slug);
    const slugs = new Set(cats.map((c) => c.slug));
    return (
      <>
        <CategoryHero
          category={{
            slug: currentMain.slug,
            brandSlug: slug,
            name: currentMain.name,
            description: currentMain.description,
            imageUrl: currentMain.imageUrl,
            bannerUrl: currentMain.imageUrl,
            accentColor: "#d6297f",
          }}
          brandSlug={slug}
          brandName={brand.name}
          lang={lang}
          back={{ href: `/products/${slug}`, label: th ? `กลับไปหน้า ${brand.name}` : `Back to ${brand.name}` }}
        />
        <CategoryGrid
          id="collections"
          categories={cats}
          brandSlug={slug}
          brandName={brand.name}
          title={th ? `คอลเลกชันในหมวด ${currentMain.name}` : `${currentMain.name} Collections`}
          eyebrow="Collections"
        />
        {showProducts && productList(products.filter((p) => p.collection && slugs.has(p.collection.slug)), cats)}
        {mainCards(mainCategories.filter((m) => m.slug !== currentMain.slug), th ? "หมวดหมู่อื่น ๆ" : "Other Categories")}
        <GrowYourVision data={growVision} />
      </>
    );
  }

  // 1. The brand: main categories, the menu's own content, all collections, all products
  const hasMenuContent = !!(menuItem?.sections?.length || menuItem?.slides?.length);
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

      {mainCards(mainCategories, th ? "หมวดหมู่ผลิตภัณฑ์หลัก" : "Main Product Categories")}

      {/* Content from the brand's menu item (Admin → เมนูและหน้าเว็บ) */}
      {hasMenuContent && menuItem && <MenuContentRenderer menu={menuItem} lang={lang} />}

      <CategoryGrid
        id="collections"
        categories={categories}
        brandSlug={slug}
        brandName={brand.name}
        title={th ? "คอลเลกชันผลิตภัณฑ์" : "Product Collections"}
        eyebrow="Collections"
      />

      {showProducts && productList(products, categories)}

      <GrowYourVision data={growVision} />
    </>
  );
}
