import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrowYourVision } from "@/components/grow-your-vision";
import { MenuContentRenderer } from "@/components/menu-content-renderer";
import { ProductGrid } from "@/components/product-grid";
import { PageHero, SectionHeading } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getGrowVision, getMenuItemByHref, getPage, getProducts } from "@/lib/data";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/[...rest]">): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  const rest = (await params).rest;
  const slug = rest.join("/");
  const pathHref = "/" + slug;

  const [menuItem, page] = await Promise.all([
    getMenuItemByHref(lang, pathHref),
    getPage(lang, slug),
  ]);

  if (menuItem) {
    return { title: menuItem.label };
  }
  if (page) {
    return { title: page.title };
  }
  return {};
}

export default async function DynamicCatchAllPage({ params }: PageProps<"/[lang]/[...rest]">) {
  const { lang, dict } = await resolveLang(params);
  const rest = (await params).rest;
  const slug = rest.join("/");
  const pathHref = "/" + slug;

  const [menuItem, page, growVision] = await Promise.all([
    getMenuItemByHref(lang, pathHref),
    getPage(lang, slug),
    getGrowVision(lang),
  ]);

  if (!menuItem && !page) notFound();

  // If matched to a Menu Item with custom content / layout
  if (menuItem) {
    const brandSlug = menuItem.brandSlug;
    const showProducts = menuItem.showProducts ?? true;
    const products = brandSlug && showProducts ? await getProducts(lang, { brandSlug }) : [];

    return (
      <>
        <PageHero eyebrow="BeautyUp" title={menuItem.label} />

        {/* Dynamic Menu Content (Slides & Left/Right or Wix Column Sections) */}
        <MenuContentRenderer menu={menuItem} lang={lang} />

        {/* Product Component Showcase (if a brand is assigned to this menu) */}
        {showProducts && products.length > 0 && (
          <section id="products" className="container-page py-12 md:py-20 border-t border-line mt-12">
            <SectionHeading
              eyebrow={menuItem.brandName || (lang === "th" ? "ผลิตภัณฑ์" : "Products")}
              title={
                lang === "th"
                  ? `ผลิตภัณฑ์ ${menuItem.brandName || menuItem.label}`
                  : `Products: ${menuItem.brandName || menuItem.label}`
              }
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
              brandNames={menuItem.brandName && brandSlug ? { [brandSlug]: menuItem.brandName } : {}}
              showFilter={false}
            />
          </section>
        )}

        <GrowYourVision data={growVision} />
      </>
    );
  }

  // Fallback: Static / Markdown Page
  if (page) {
    const sections: { title?: string; paragraphs: string[] }[] = [];
    for (const line of page.body) {
      if (line.startsWith("## ")) {
        sections.push({ title: line.slice(3).trim(), paragraphs: [] });
      } else if (line.trim()) {
        if (sections.length === 0) sections.push({ paragraphs: [] });
        sections.at(-1)?.paragraphs.push(line);
      }
    }

    return (
      <>
        <PageHero eyebrow="BeautyUp" title={page.title} />

        <main className="container-page max-w-4xl py-12 md:py-20">
          <article className="prose prose-neutral max-w-none space-y-8">
            {sections.map((sec, i) => (
              <div key={i} className="rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-sm">
                {sec.title && (
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink border-b border-line pb-4 mb-4">
                    {sec.title}
                  </h2>
                )}
                <div className="space-y-4">
                  {sec.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-muted leading-relaxed text-base sm:text-lg">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </article>
        </main>

        <GrowYourVision data={growVision} />
      </>
    );
  }

  notFound();
}
