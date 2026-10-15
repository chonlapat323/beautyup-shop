"use client";

import Image from "next/image";
import Link from "@/components/link";
import clsx from "clsx";
import type { BrandCategory } from "@/lib/brand-categories";
import { useDict } from "@/i18n/client";

interface CategoryGridProps {
  categories: BrandCategory[];
  brandSlug: string;
  activeCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
  title?: string;
  eyebrow?: string;
}

export function CategoryGrid({
  categories,
  brandSlug,
  activeCategory,
  onSelectCategory,
  title,
  eyebrow,
}: CategoryGridProps) {
  const dict = useDict();
  const isThai = dict.common.loading === "กำลังโหลด";

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-10 sm:py-16">
      <div className="container-page">
        {(title || eyebrow) && (
          <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
            {eyebrow && (
              <p className="eyebrow text-brand-pink font-semibold uppercase tracking-wider">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl text-ink">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* 5-Column Responsive Visual Category Grid (Image 1 reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 md:gap-4.5">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat.slug;
            const targetHref = `/products/${brandSlug}?category=${cat.slug}#category-view`;

            return (
              <div
                key={cat.slug}
                data-reveal
                suppressHydrationWarning
                style={{ animationDelay: `${(idx % 10) * 40}ms` }}
                className="group relative"
              >
                <Link
                  href={targetHref}
                  onClick={(e) => {
                    if (onSelectCategory) {
                      e.preventDefault();
                      onSelectCategory(cat.slug);
                    }
                  }}
                  className={clsx(
                    "relative block aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500",
                    isActive
                      ? "border-brand-pink shadow-xl ring-2 ring-brand-pink/50 scale-[1.02]"
                      : "border-line/70 hover:border-brand-pink/60 hover:shadow-xl hover:shadow-brand-pink/10",
                  )}
                  aria-label={`${isThai ? "ดูหมวดหมู่" : "View"} ${cat.name}`}
                >
                  {/* Category Image */}
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    priority={idx < 5}
                  />

                  {/* Gradient & Vignette Overlay */}
                  <div
                    className={clsx(
                      "absolute inset-0 transition-opacity duration-300",
                      isActive
                        ? "bg-gradient-to-t from-black/85 via-black/40 to-black/20 opacity-100"
                        : "bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-100",
                    )}
                  />

                  {/* Category Title & 'คลิก' Pill Action (matches Image 1) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center z-10 transition-all duration-300">
                    <span
                      className={clsx(
                        "font-display text-sm sm:text-base md:text-lg font-semibold tracking-wide text-white drop-shadow-md transition-all duration-300",
                        isActive
                          ? "opacity-100 translate-y-0 text-white font-bold"
                          : "opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0",
                      )}
                    >
                      {cat.name}
                    </span>

                    {/* Frosted Glass Button (คลิก / Click) */}
                    <div
                      className={clsx(
                        "mt-2.5 transition-all duration-300",
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:scale-95 sm:group-hover:scale-100",
                      )}
                    >
                      <span className="inline-flex items-center justify-center rounded-xl border border-white/60 bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200 group-hover:bg-brand-pink group-hover:border-brand-pink shadow-md">
                        {isThai ? "คลิก" : "Click"}
                      </span>
                    </div>
                  </div>

                  {/* Ambient accent border highlight on hover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-brand-pink/40 pointer-events-none"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
