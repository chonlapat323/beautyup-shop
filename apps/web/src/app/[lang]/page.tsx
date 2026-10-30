import type { Metadata } from "next";
import Link from "@/components/link";
import { BrandMarquee } from "@/components/brand-marquee";
import { GrowYourVision } from "@/components/grow-your-vision";
import { HomeHero } from "@/components/home-hero";
import { ProductGrid } from "@/components/product-grid";
import { ArrowLink, Media, SectionHeading, VideoPlayer, stagger } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getGrowVision, getHeroSlides, getProducts, getRegions, getVideos } from "@/lib/data";
import { langAlternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: langAlternates("/", lang),
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang, dict } = await resolveLang(params);
  const h = dict.home;
  const [slides, regions, videos, brands, products, growVision] = await Promise.all([
    getHeroSlides(lang),
    getRegions(lang),
    getVideos(lang),
    getBrands(lang),
    getProducts(lang),
    getGrowVision(lang),
  ]);
  const salonBrands = brands.filter((b) => b.type === "SALON");
  const counterBrands = brands.filter((b) => b.type === "COUNTER");
  const brandNames = Object.fromEntries(brands.map((b) => [b.slug, b.name]));
  const salonCount = regions.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <HomeHero slides={slides} salonCount={salonCount} />
      <BrandMarquee brands={salonBrands} label={h.ourSalonBrands} marquee={false} />
      <BrandMarquee brands={counterBrands} label={h.ourBrands} />

      {/* Featured Video */}
      <section className="section border-b border-line bg-mist/50">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <p className="eyebrow">Video</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl">
                {videos[0]?.title || h.videosTitle}
              </h2>
            </div>
            <div data-reveal suppressHydrationWarning className="overflow-hidden rounded-3xl shadow-xl border border-line bg-black">
              <VideoPlayer
                src={videos[0]?.url || "https://www.youtube.com/watch?v=5qap5aO4i9A"}
                title={videos[0]?.title || "BeautyUp Official"}
                aspectRatio="16/9"
                rounded="rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="section border-b border-line">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">{h.welcome}</p>
            <blockquote className="mt-4 font-display text-2xl leading-snug text-balance sm:text-4xl">
              {h.quote}
            </blockquote>
            <p className="mt-6 text-muted">{h.quoteBy}</p>
          </div>
          <nav aria-label={h.quickLinks} className="lg:col-span-5">
            <ul className="divide-y divide-line border-y border-line">
              {h.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex min-h-14 items-center justify-between gap-4 text-lg transition-colors hover:text-accent"
                  >
                    {l.label}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Brands */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow={h.brandsEyebrow}
            title={h.brandsTitle}
            description={h.brandsLead}
            action={<ArrowLink href="/products">{h.allProducts}</ArrowLink>}
          />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {salonBrands.map((b, i) => (
              <li key={b.slug} data-reveal suppressHydrationWarning style={stagger(i)}>
                <Link
                  href={`/products/${b.slug}`}
                  className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white"
                >
                  <div className="flex items-center justify-center overflow-hidden bg-white p-6 sm:p-8">
                    <Media
                      src={b.logoUrl}
                      label={b.name}
                      tone={i}
                      fit="contain"
                      className="card-img aspect-[16/10] w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs tracking-wide text-muted uppercase">
                      {b.country && dict.common.importedFrom(b.country)}
                    </p>
                    <p className="mt-2 font-display text-2xl">
                      {b.nameTh} <span className="text-muted">({b.name})</span>
                    </p>
                    <p className="mt-3 flex-1 text-muted">{b.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-medium group-hover:text-accent">
                      {h.viewProducts} <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Counter Brands */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow={h.counterBrandsEyebrow}
            title={h.counterBrandsTitle}
            description={h.counterBrandsLead}
            action={<ArrowLink href="/shop">{h.allProducts}</ArrowLink>}
          />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {counterBrands.slice(0, 3).map((b, i) => {
              const cardClassName = "card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white";
              const cardBody = (
                <>
                  <div className="flex items-center justify-center overflow-hidden bg-white p-6 sm:p-8">
                    <Media
                      src={b.logoUrl}
                      label={b.name}
                      tone={i}
                      fit="contain"
                      className="card-img aspect-[16/10] w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs tracking-wide text-muted uppercase">
                      {b.country && dict.common.importedFrom(b.country)}
                    </p>
                    <p className="mt-2 font-display text-2xl">
                      {b.nameTh} <span className="text-muted">({b.name})</span>
                    </p>
                    <p className="mt-3 flex-1 text-muted">{b.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-medium group-hover:text-accent">
                      {b.website ? h.visitWebsite : h.viewProducts} <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </>
              );
              return (
                <li key={b.slug} data-reveal suppressHydrationWarning style={stagger(i)}>
                  {b.website ? (
                    <a href={b.website} target="_blank" rel="noopener noreferrer" className={cardClassName}>
                      {cardBody}
                    </a>
                  ) : (
                    <Link href="/shop" className={cardClassName}>
                      {cardBody}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Products */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow={h.productsEyebrow}
            title={h.productsTitle}
          />
          <ProductGrid products={products} brandNames={brandNames} />
        </div>
      </section>

      <GrowYourVision data={growVision} />
    </>
  );
}
