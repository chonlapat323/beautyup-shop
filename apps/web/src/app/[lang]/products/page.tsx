import type { Metadata } from "next";
import Link from "@/components/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { MenuContentRenderer } from "@/components/menu-content-renderer";
import { Media, PageHero, SocialLinks } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getGrowVision, getMenuItemByHref } from "@/lib/data";
import { langAlternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  return {
    title: dict.products.title,
    alternates: langAlternates("/products", lang),
  };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.products;
  // Everything above the brand list is edited on the "/products" menu item (Admin → เมนูและหน้าเว็บ)
  const [brands, growVision, menuItem] = await Promise.all([
    getBrands(lang, "SALON"),
    getGrowVision(lang),
    getMenuItemByHref(lang, "/products"),
  ]);
  const hero = menuItem?.hero;

  return (
    <>
      <PageHero eyebrow={hero?.eyebrow || d.eyebrow} title={hero?.headline || d.headline} description={hero?.lead || d.lead} />

      {menuItem && <MenuContentRenderer menu={menuItem} lang={lang} />}

      <div className="container-page">
        {brands.map((b, i) => (
          <section
            key={b.slug}
            aria-labelledby={`brand-${b.slug}`}
            className="grid grid-cols-1 items-center gap-8 border-b border-line py-14 last:border-b-0 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-20"
          >
            <div className={`flex items-center justify-center overflow-hidden rounded-3xl bg-white p-8 sm:p-12 ${i % 2 ? "md:order-2" : ""}`}>
              <Media src={b.logoUrl} label={b.name} tone={i} fit="contain" className="aspect-[4/3] w-full" />
            </div>
            <div>
              <p className="eyebrow">{b.country && dict.common.importedFrom(b.country)}</p>
              <h2 id={`brand-${b.slug}`} className="mt-3 font-display text-4xl sm:text-5xl">
                {b.nameTh}
                <span className="mt-1 block text-2xl text-muted sm:text-3xl">{b.name}</span>
              </h2>
              <p className="mt-5 text-lg text-muted">{b.description}</p>
              {b.highlights && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {b.highlights.map((h) => (
                    <li key={h} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent-dark">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 font-display text-xl italic">“{b.tagline}”</p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <Link href={`/products/${b.slug}`} className="btn btn-primary">
                  {d.viewProducts}
                </Link>
                {b.catalogUrl && (
                  <a href={b.catalogUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                    {d.catalog}
                  </a>
                )}
              </div>
              <SocialLinks socials={b.socials} className="mt-6" />
            </div>
          </section>
        ))}
      </div>

      <GrowYourVision data={growVision} />
    </>
  );
}
