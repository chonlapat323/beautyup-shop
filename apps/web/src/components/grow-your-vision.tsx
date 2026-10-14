import Link from "@/components/link";
import { LoadingImage } from "./loading-image";
import type { Dictionary } from "@/i18n";

export function GrowYourVision({
  dict,
  imageUrl = "/slides/14.jpg",
  imageAlt = "BeautyUp Grow Your Vision - Heona, No Yellow, Sweet",
}: {
  dict: Dictionary["grow"];
  imageUrl?: string;
  imageAlt?: string;
}) {
  const items = dict.items;
  const photo = imageUrl || "/slides/14.jpg";

  return (
    <section className="section">
      <div className="container-page">
        <div data-reveal suppressHydrationWarning className="overflow-hidden rounded-3xl border border-line bg-mist md:grid md:grid-cols-2">
          {/* Left: Content & Links */}
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="eyebrow text-brand-pink font-semibold">BeautyUp</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl text-ink">
              Grow Your Vision
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {items.map((item) => {
                const external = item.href.startsWith("http");
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      {...(external && { target: "_blank", rel: "noreferrer" })}
                      className="group flex min-h-16 items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block text-lg font-medium transition-colors group-hover:text-brand-pink">{item.title}</span>
                        <span className="block text-sm text-muted">{item.text}</span>
                      </span>
                      <span className="text-2xl transition-all group-hover:translate-x-1 group-hover:text-brand-pink">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: Real Image with Badge */}
          <div className="relative min-h-72 sm:min-h-80 md:min-h-full overflow-hidden bg-sand/30">
            <LoadingImage
              src={photo}
              alt={imageAlt}
              loading="lazy"
              className="size-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white drop-shadow-md sm:bottom-6 sm:left-6">
              <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs sm:text-sm backdrop-blur-md uppercase tracking-wider font-medium text-white/95 border border-white/20">
                Heona · No Yellow · Sweet
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
