import Image from "next/image";
import Link from "@/components/link";
import { ArrowLeft } from "lucide-react";
import type { BrandCategory } from "@/lib/brand-categories";
import type { Locale } from "@/i18n";

interface CategoryHeroProps {
  category: BrandCategory;
  brandSlug: string;
  brandName?: string;
  lang: Locale;
}

/** Same look as the home hero (soft pink-to-white, pink-line eyebrow); the category's accent colour marks the title. */
export function CategoryHero({ category, brandSlug, brandName, lang }: CategoryHeroProps) {
  const isThai = lang === "th";
  const accent = category.accentColor || "#d6297f";

  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-[linear-gradient(160deg,#fdf2f8_0%,#fdfcfb_60%,#fdfcfb_100%)] py-10 sm:py-14 lg:py-20">
      {category.bannerUrl && (
        <div aria-hidden className="absolute inset-0">
          <Image src={category.bannerUrl} alt="" fill priority sizes="100vw" className="object-cover object-top opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdf2f8]/70 via-[#fdfcfb]/80 to-[#fdfcfb]" />
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}26, transparent 70%)` }}
      />

      <div className="container-page relative animate-fade-up">
        <Link
          href={`/products/${brandSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          {isThai ? `ดูหมวดหมู่ทั้งหมดของ ${brandName || "แบรนด์"}` : `All ${brandName || "brand"} categories`}
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="eyebrow flex items-center gap-2">
            <span aria-hidden className="h-px w-6 bg-brand-pink" />
            {brandName || "Brand Collection"}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.15] text-balance sm:text-5xl lg:text-6xl">
            <span style={{ color: accent }}>{category.name.slice(0, 2)}</span>
            {category.name.slice(2)}
          </h1>
          {category.subtitle && (
            <p className="mt-3 text-base font-medium sm:text-lg" style={{ color: accent }}>
              {category.subtitle}
            </p>
          )}
          {category.description && <p className="mt-5 max-w-2xl text-base text-pretty text-muted sm:text-lg">{category.description}</p>}
          {category.highlights && (
            <p
              className="mt-6 max-w-2xl rounded-2xl border p-4 text-sm leading-relaxed text-ink sm:p-5"
              style={{ borderColor: `${accent}40`, backgroundColor: `${accent}0c` }}
            >
              {category.highlights}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
