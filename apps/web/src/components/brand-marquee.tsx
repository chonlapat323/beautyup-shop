import Link from "@/components/link";
import type { Brand } from "@/lib/types";

/** Infinite brand strip. Pauses on hover; static for reduced motion. */
export function BrandMarquee({ brands, label }: { brands: Brand[]; label: string }) {
  const href = (b: Brand) => (b.type === "SALON" ? `/products/${b.slug}` : "/shop");
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
      {brands.map((b) => (
        <li key={b.slug}>
          <Link
            href={href(b)}
            tabIndex={hidden ? -1 : undefined}
            className="font-display text-xl whitespace-nowrap text-ink/35 transition-colors hover:text-brand-pink sm:text-2xl"
          >
            {b.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className="border-y border-line bg-mist py-6 sm:py-8">
      <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
