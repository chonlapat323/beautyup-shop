import type { Metadata } from "next";
import { GrowYourVision } from "@/components/grow-your-vision";
import { ProductGrid } from "@/components/product-grid";
import { Media, PageHero, SectionHeading } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getProducts } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.shop.title };
}

export default async function ShopPage({ params }: PageProps<"/[lang]/shop">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.shop;
  const [brands, products] = await Promise.all([
    getBrands(lang, "COUNTER"),
    getProducts(lang, { brandType: "COUNTER" }),
  ]);
  const brandNames = Object.fromEntries(brands.map((b) => [b.slug, b.name]));

  return (
    <>
      <PageHero
        eyebrow={d.eyebrow}
        title={d.headline}
        description={d.lead}
      />

      <section className="container-page py-12 md:py-16">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-7">
          {brands.map((b) => (
            <li key={b.slug} className="grid min-h-24 place-items-center bg-white p-4 text-center font-display text-base text-ink/80 transition-colors hover:bg-mist hover:text-accent sm:min-h-28 sm:text-lg">
              {b.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <Media label="I'm Amy" tone={1} className="aspect-[4/5] w-full rounded-3xl" />
          <div>
            <p className="eyebrow">{d.ceoEyebrow}</p>
            <p className="mt-4 font-display text-3xl leading-snug sm:text-4xl">
              {d.ceoQuote}
            </p>
            <p className="mt-5 text-muted">
              {d.ceoText}
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container-page">
          <SectionHeading eyebrow="Shop" title={d.productsTitle} description={d.productsLead} />
          <ProductGrid products={products} brandNames={brandNames} />
        </div>
      </section>

      <GrowYourVision dict={dict.grow} />
    </>
  );
}
