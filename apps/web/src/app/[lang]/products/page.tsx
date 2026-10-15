import type { Metadata } from "next";
import Link from "@/components/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { MenuContentRenderer } from "@/components/menu-content-renderer";
import { MenuSlideCarousel } from "@/components/menu-slide-carousel";
import { OvalHairCarousel } from "@/components/oval-hair-carousel";
import { Media, PageHero, SocialLinks } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getGrowVision, getHeroSlides, getMenuItemByHref } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.products.title };
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.products;
  const [brands, growVision, menuItem, heroSlides] = await Promise.all([
    getBrands(lang, "SALON"),
    getGrowVision(lang),
    getMenuItemByHref(lang, "/products"),
    getHeroSlides(lang),
  ]);

  // Priority: Custom slides configured under Admin > Menu Items (/products),
  // fallback to heroSlides linked to salon products or brands
  const slides = (menuItem?.slides && menuItem.slides.length > 0)
    ? menuItem.slides
    : heroSlides
        .filter((s) => s.href.includes("/products") || s.brandSlug.includes("fanola") || s.brandSlug.includes("nook") || s.brandSlug.includes("sweet") || s.brandSlug.includes("slide"))
        .slice(0, 5)
        .map((s) => ({
          imageUrl: s.imageUrl || "",
          title: s.product,
          caption: s.caption,
          href: s.href,
        }));

  const hasCustomOval = menuItem?.sections?.some((s) => s.layout === "oval-carousel");

  return (
    <>
      <PageHero
        eyebrow="Professional Salon Products"
        title={d.headline}
        description={d.lead}
      />

      {/* 1. Banner Slides Carousel (Configured in Admin > Menu Items > /products or Hero Slides) */}
      {slides.length > 0 && (
        <section className="border-b border-line/60 bg-gradient-to-b from-sand/20 via-white to-sand/10">
          <MenuSlideCarousel slides={slides} />
        </section>
      )}

      {/* 2. Oval Hair Showcase Carousel (Matching user's reference: Oval capsules with gold title) */}
      {!hasCustomOval && (
        <OvalHairCarousel
          title={lang === "en" ? "Professional Salon Products" : "ผลิตภัณฑ์ซาลอนมืออาชีพ"}
          lang={lang}
        />
      )}

      {/* 3. Custom Menu Content Sections if configured in Admin */}
      {menuItem?.sections && menuItem.sections.length > 0 && (
        <MenuContentRenderer menu={menuItem} lang={lang} />
      )}

      <div className="container-page">
        {brands.map((b, i) => (
          <section
            key={b.slug}
            aria-labelledby={`brand-${b.slug}`}
            className="grid grid-cols-1 items-center gap-8 border-b border-line py-14 last:border-b-0 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-20"
          >
            <Media
              src={b.logoUrl}
              label={b.name}
              tone={i}
              className={`aspect-[4/3] w-full rounded-3xl ${i % 2 ? "md:order-2" : ""}`}
            />
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
