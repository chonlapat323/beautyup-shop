import Link from "@/components/link";
import type { Brand } from "@/lib/types";

/** Infinite luxury brand strip. Pauses on hover; seamless 60fps loop. */
export function BrandMarquee({ brands, label }: { brands: Brand[]; label: string }) {
  const href = (b: Brand) => (b.type === "SALON" ? `/products/${b.slug}` : "/shop");

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-4 py-4 pr-4 sm:gap-6 sm:py-5 sm:pr-6">
      {brands.map((b) => (
        <li key={b.slug + (hidden ? "-dup" : "")} className="relative hover:z-20">
          <Link
            href={href(b)}
            tabIndex={hidden ? -1 : undefined}
            className="btn-pill group/brand relative !gap-3 !px-5 !py-2.5 hover:z-20"
          >
            {/* Elegant Brand Pink Accent Dot */}
            <span className="size-1.5 shrink-0 rounded-full bg-brand-pink/60 transition-transform duration-300 group-hover/brand:scale-150 group-hover/brand:bg-brand-pink" />

            <span className="font-display text-base sm:text-lg font-medium tracking-wide whitespace-nowrap transition-colors group-hover/brand:text-brand-pink">
              {b.name}
            </span>

            {b.type === "SALON" ? (
              <span className="rounded-full bg-sand/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted transition-colors group-hover/brand:bg-brand-pink/10 group-hover/brand:text-brand-pink">
                Salon
              </span>
            ) : (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-pink/80 transition-colors group-hover/brand:bg-brand-pink/15 group-hover/brand:text-brand-pink">
                Luxury
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

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
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
