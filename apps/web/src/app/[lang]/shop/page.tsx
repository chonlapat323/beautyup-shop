import type { Metadata } from "next";
import { GrowYourVision } from "@/components/grow-your-vision";
import { MenuContentRenderer } from "@/components/menu-content-renderer";
import { ProductGrid } from "@/components/product-grid";
import { Media, PageHero, SectionHeading } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getGrowVision, getMenuItemByHref, getProducts, getShopPageData } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.shop.title };
}

export default async function ShopPage({ params }: PageProps<"/[lang]/shop">) {
  const { lang } = await resolveLang(params);
  const [brands, products, growVision, shopPage, menuItem] = await Promise.all([
    getBrands(lang, "COUNTER"),
    getProducts(lang, { brandType: "COUNTER" }),
    getGrowVision(lang),
    getShopPageData(lang),
    getMenuItemByHref(lang, "/shop"),
  ]);
  const brandNames = Object.fromEntries([
    ...products.map((p) => [p.brandSlug, p.brandName ?? p.brandSlug]),
    ...brands.map((b) => [b.slug, b.name]),
  ]);

  return (
    <>
      <PageHero
        eyebrow={shopPage.eyebrow || menuItem?.hero?.eyebrow}
        title={shopPage.headline || menuItem?.hero?.headline || ""}
        description={shopPage.lead || menuItem?.hero?.lead}
      />

      {menuItem && <MenuContentRenderer menu={menuItem} lang={lang} />}

      <section className="container-page py-12 md:py-16">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-7">
          {brands.map((b) => (
            <li
              key={b.slug}
              className="flex min-h-24 flex-col items-center justify-center gap-2 bg-white p-4 text-center font-display text-base text-ink/80 transition-colors hover:bg-mist hover:text-accent sm:min-h-28 sm:text-lg"
            >
              {b.logoUrl ? (
                <img src={b.logoUrl} alt={b.name} className="max-h-12 w-auto object-contain" />
              ) : null}
              <span>{b.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="container-page grid grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
          <Media
            src={shopPage.ceoImageUrl || menuItem?.sections?.[0]?.imageUrl || menuItem?.slides?.[0]?.imageUrl || undefined}
            label="I'm Amy"
            tone={1}
            className="aspect-[4/5] w-full rounded-3xl"
          />
          <div>
            <p className="eyebrow">{shopPage.ceoEyebrow}</p>
            <p className="mt-4 font-display text-3xl leading-snug sm:text-4xl whitespace-pre-line">
              {shopPage.ceoQuote}
            </p>
            <p className="mt-5 text-muted whitespace-pre-line">
              {shopPage.ceoText}
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container-page">
          <SectionHeading eyebrow={shopPage.productsEyebrow} title={shopPage.productsTitle} description={shopPage.productsLead} />
          <ProductGrid products={products} brandNames={brandNames} />
        </div>
      </section>

      <GrowYourVision data={growVision} />
    </>
  );
}
