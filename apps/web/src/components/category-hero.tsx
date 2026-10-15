import Image from "next/image";
import Link from "@/components/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { BrandCategory } from "@/lib/brand-categories";
import type { Locale } from "@/i18n";

interface CategoryHeroProps {
  category: BrandCategory;
  brandSlug: string;
  brandName?: string;
  lang: Locale;
}

export function CategoryHero({
  category,
  brandSlug,
  brandName,
  lang,
}: CategoryHeroProps) {
  const isThai = lang === "th";
  const accent = category.accentColor || "#7e22ce";

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 md:py-24 border-b border-line bg-gradient-to-b from-[#180b22] via-[#100717] to-sand/20 text-white">
      {/* Background Banner image if available */}
      {category.bannerUrl ? (
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={category.bannerUrl}
            alt={category.name}
            fill
            sizes="100vw"
            priority
            className="object-cover object-top filter blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#100717]/80 to-[#100717]" />
        </div>
      ) : (
        /* Ambient dynamic radial glow */
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        >
          <div
            style={{ backgroundColor: accent }}
            className="h-[420px] w-[680px] max-w-[90vw] rounded-full opacity-25 blur-[140px]"
          />
        </div>
      )}

      <div className="container-page relative z-10">
        {/* Back navigation button */}
        <div className="mb-6">
          <Link
            href={`/products/${brandSlug}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-white hover:text-ink hover:scale-[1.02]"
          >
            <ArrowLeft className="size-3.5" />
            <span>
              {isThai
                ? `ดูหมวดหมู่ทั้งหมดของ ${brandName || "แบรนด์"}`
                : `All ${brandName || "Brand"} Categories`}
            </span>
          </Link>
        </div>

        {/* Floating Centered White Card (matches Image 2) */}
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white p-6 sm:p-10 md:p-12 text-ink shadow-2xl backdrop-blur-xl">
          {/* Eyebrow / Tag */}
          <div className="text-center">
            <span
              style={{ color: accent }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.25em]"
            >
              <Sparkles className="size-3.5" />
              <span>{brandName || "BRAND COLLECTION"}</span>
              <Sparkles className="size-3.5" />
            </span>

            {/* Category Main Headline */}
            <h1 className="mt-3 font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-neutral-900">
              <span style={{ color: accent }}>{category.name.slice(0, 2)}</span>
              {category.name.slice(2)}
            </h1>

            {/* Subtitle / Key Concept */}
            {category.subtitle && (
              <p
                style={{ color: accent }}
                className="mt-3 font-medium text-xs sm:text-sm md:text-base tracking-wide"
              >
                {category.subtitle}
              </p>
            )}
          </div>

          {/* Detailed Description */}
          {category.description && (
            <div className="mt-6 text-sm sm:text-base leading-relaxed text-muted/95 text-justify sm:text-center max-w-2xl mx-auto">
              <p>{category.description}</p>
            </div>
          )}

          {/* Highlights Box / 360° Blonde Protection (matches Image 2) */}
          {category.highlights && (
            <div
              style={{ borderColor: `${accent}40`, backgroundColor: `${accent}0c` }}
              className="mt-8 rounded-2xl border p-4 sm:p-6 text-left"
            >
              <p className="text-xs sm:text-sm leading-relaxed text-neutral-800 font-normal">
                {category.highlights}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
