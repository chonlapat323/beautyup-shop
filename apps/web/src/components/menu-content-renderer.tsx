import Image from "next/image";
import Link from "@/components/link";
import { LoadingImage } from "@/components/loading-image";
import type { MenuItem } from "@/lib/types";

export function MenuContentRenderer({ menu }: { menu: MenuItem }) {
  const slides = menu.slides || [];
  const sections = menu.sections || [];

  if (slides.length === 0 && sections.length === 0) return null;

  return (
    <div className="space-y-16 md:space-y-24">
      {/* 1. Optional Slides Banner */}
      {slides.length > 0 && (
        <section className="relative overflow-hidden border-b border-line bg-black">
          <div className="relative aspect-[16/7] min-h-[300px] w-full max-h-[560px]">
            <Image
              src={slides[0].imageUrl}
              alt={slides[0].title || menu.label}
              fill
              priority
              className="object-cover opacity-90"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-14 lg:p-20 text-white container-page">
              {slides[0].title && (
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl">
                  {slides[0].title}
                </h2>
              )}
              {slides[0].caption && (
                <p className="mt-4 text-base sm:text-xl text-white/80 max-w-xl">
                  {slides[0].caption}
                </p>
              )}
              {slides[0].href && (
                <div className="mt-6">
                  <Link href={slides[0].href} className="btn btn-primary">
                    ดูเพิ่มเติม →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. Sections */}
      {sections.map((sec, idx) => {
        // Layout: 4 Columns (Wix Style - Tall photo card with bottom floating card)
        if (sec.layout === "columns" && sec.cards && sec.cards.length > 0) {
          return (
            <section key={idx} className="container-page py-6">
              {sec.title && (
                <div className="mb-10 text-center max-w-3xl mx-auto">
                  <h2 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
                    {sec.title}
                  </h2>
                  {sec.description && (
                    <p className="mt-3 text-muted text-base sm:text-lg">{sec.description}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sec.cards.map((card, cIdx) => (
                  <div
                    key={cIdx}
                    data-reveal
                    suppressHydrationWarning
                    className="group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-line bg-mist shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl aspect-[3/4] sm:aspect-[4/6] lg:aspect-[3/5]"
                  >
                    {/* Background Photo */}
                    {card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/20 to-mist" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Glassmorphic White Card at Bottom */}
                    <div className="relative z-10 m-4 rounded-2xl bg-white/95 p-5 sm:p-6 backdrop-blur-md border border-white/50 shadow-xl transition-all duration-300 group-hover:bg-white">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-ink group-hover:text-accent transition-colors">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted line-clamp-6">
                          {card.description}
                        </p>
                      )}
                      <div className="mt-4 pt-3 border-t border-line/50">
                        <Link
                          href={card.href || "#products"}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent group-hover:text-accent-dark transition-transform group-hover:translate-x-1"
                        >
                          ดูสินค้า <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // Layout: Left Image / Right Text
        if (sec.layout === "left-image") {
          return (
            <section key={idx} className="container-page py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20 items-center">
                {sec.imageUrl && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line shadow-md bg-mist">
                    <LoadingImage
                      src={sec.imageUrl}
                      alt={sec.title || "Section Image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  {sec.title && (
                    <h2 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
                      {sec.title}
                    </h2>
                  )}
                  {sec.description && (
                    <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed whitespace-pre-line">
                      {sec.description}
                    </p>
                  )}
                  {sec.buttonText && (
                    <div className="mt-8">
                      <Link href={sec.buttonHref || "#products"} className="btn btn-primary">
                        {sec.buttonText} →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // Layout: Right Image / Left Text (Alternating)
        if (sec.layout === "right-image") {
          return (
            <section key={idx} className="container-page py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 lg:gap-20 items-center">
                <div className="order-2 md:order-1">
                  {sec.title && (
                    <h2 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
                      {sec.title}
                    </h2>
                  )}
                  {sec.description && (
                    <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed whitespace-pre-line">
                      {sec.description}
                    </p>
                  )}
                  {sec.buttonText && (
                    <div className="mt-8">
                      <Link href={sec.buttonHref || "#products"} className="btn btn-primary">
                        {sec.buttonText} →
                      </Link>
                    </div>
                  )}
                </div>
                {sec.imageUrl && (
                  <div className="order-1 md:order-2 relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line shadow-md bg-mist">
                    <LoadingImage
                      src={sec.imageUrl}
                      alt={sec.title || "Section Image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          );
        }

        // Layout: Text Only
        return (
          <section key={idx} className="container-page py-6">
            <div className="max-w-3xl mx-auto text-center rounded-3xl border border-line bg-mist/40 p-8 sm:p-14">
              {sec.title && (
                <h2 className="font-display text-3xl sm:text-4xl text-ink font-semibold">
                  {sec.title}
                </h2>
              )}
              {sec.description && (
                <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed whitespace-pre-line">
                  {sec.description}
                </p>
              )}
              {sec.buttonText && (
                <div className="mt-8">
                  <Link href={sec.buttonHref || "#products"} className="btn btn-primary">
                    {sec.buttonText} →
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
