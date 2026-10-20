import Link from "@/components/link";
import { LoadingImage } from "./loading-image";
import type { Brand } from "@/lib/types";

/** Infinite luxury brand strip. Pauses on hover; seamless 60fps loop. Falls back to a static centered row with no tag/logo when `marquee` is off. */
export function BrandMarquee({
  brands,
  label,
  marquee = true,
  showTag = true,
  showLogo = true,
}: {
  brands: Brand[];
  label: string;
  marquee?: boolean;
  showTag?: boolean;
  showLogo?: boolean;
}) {
  const href = (b: Brand) => (b.type === "SALON" ? `/products/${b.slug}` : "/shop");

  const item = (b: Brand, hidden: boolean) => (
    <li key={b.slug + (hidden ? "-dup" : "")} className="relative hover:z-20">
      <Link
        href={href(b)}
        tabIndex={hidden ? -1 : undefined}
        className="btn-pill group/brand relative !gap-3 !px-5 !py-2.5 hover:z-20"
      >
        {showLogo && b.logoUrl ? (
          <LoadingImage
            src={b.logoUrl}
            alt=""
            className="h-6 w-auto max-w-[72px] object-contain sm:h-7"
          />
        ) : (
          /* Elegant Brand Pink Accent Dot (only when there's no logo to anchor the pill) */
          <span className="size-1.5 shrink-0 rounded-full bg-brand-pink/60 transition-transform duration-300 group-hover/brand:scale-150 group-hover/brand:bg-brand-pink" />
        )}

        <span className="font-display text-base sm:text-lg font-medium tracking-wide whitespace-nowrap transition-colors group-hover/brand:text-brand-pink">
          {b.name}
        </span>

        {showTag && (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-pink/80 transition-colors group-hover/brand:bg-brand-pink/15 group-hover/brand:text-brand-pink">
            {b.type === "SALON" ? "Salon" : "Luxury"}
          </span>
        )}
      </Link>
    </li>
  );

  if (!marquee) {
    return (
      <section aria-label={label} className="relative border-y border-line/60 bg-gradient-to-r from-cream via-sand/30 to-cream py-4 sm:py-5">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(214_41_127/0.06),transparent_70%)]"
          aria-hidden="true"
        />
        <ul className="container-page relative flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {brands.map((b) => item(b, false))}
        </ul>
      </section>
    );
  }

  return (
    <section aria-label={label} className="relative border-y border-line/60 bg-gradient-to-r from-cream via-sand/30 to-cream py-3 sm:py-4 overflow-hidden">
      {/* Self-contained 100% cache-proof animation for brand marquee */}
      <style>{`
        @keyframes brandMarqueeLoop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .brand-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: brandMarqueeLoop 160s linear infinite !important;
        }
        .brand-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Ambient pink aura backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(214_41_127/0.06),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Smooth fade mask on left and right edges */}
      <div className="relative flex overflow-hidden py-2 -my-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="brand-marquee-track">
          <ul className="flex shrink-0 items-center gap-4 py-4 pr-4 sm:gap-6 sm:py-5 sm:pr-6">
            {brands.map((b) => item(b, false))}
          </ul>
          <ul className="flex shrink-0 items-center gap-4 py-4 pr-4 sm:gap-6 sm:py-5 sm:pr-6" aria-hidden>
            {brands.map((b) => item(b, true))}
          </ul>
        </div>
      </div>
    </section>
  );
}
