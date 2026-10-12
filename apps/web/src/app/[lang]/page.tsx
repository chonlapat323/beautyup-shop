import { Play } from "lucide-react";
import Link from "@/components/link";
import { BrandMarquee } from "@/components/brand-marquee";
import { GrowYourVision } from "@/components/grow-your-vision";
import { HomeHero } from "@/components/home-hero";
import { ProductGrid } from "@/components/product-grid";
import { ArrowLink, Media, SectionHeading, stagger } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getHeroSlides, getProducts, getRegions, getVideos } from "@/lib/data";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang, dict } = await resolveLang(params);
  const h = dict.home;
  const [slides, regions, videos, brands, products] = await Promise.all([
    getHeroSlides(lang),
    getRegions(lang),
    getVideos(lang),
    getBrands(lang),
    getProducts(lang),
  ]);
  const salonBrands = brands.filter((b) => b.type === "SALON");
  const brandNames = Object.fromEntries(brands.map((b) => [b.slug, b.name]));
  const salonCount = regions.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <HomeHero slides={slides} salonCount={salonCount} />
      <BrandMarquee brands={brands} label={h.ourBrands} />

      {/* Welcome */}
      <section className="section border-b border-line">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
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
            action={<ArrowLink href="/products">{h.allProducts}</ArrowLink>}
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {salonBrands.map((b, i) => (
              <li key={b.slug} data-reveal style={stagger(i)}>
                <Link
                  href={`/products/${b.slug}`}
                  className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white"
                >
                  <div className="overflow-hidden">
                    <Media
                      src={b.logoUrl}
                      label={b.name}
                      tone={i}
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

      {/* Videos */}
      <section className="section border-y border-line bg-mist">
        <div className="container-page">
          <div className="mb-10 md:mb-14">
            <p className="eyebrow">Videos</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">{h.videosTitle}</h2>
          </div>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {videos.map((v, i) => (
              <li key={v.title} data-reveal style={stagger(i)} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <a
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <Media tone={i} className="aspect-video w-full transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-all group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                        <Play className="ml-0.5 size-5 fill-current" />
                      </span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted transition-colors group-hover:text-accent">{v.title}</p>
                </a>
              </li>
            ))}
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

      <GrowYourVision dict={dict.grow} />
    </>
  );
}
