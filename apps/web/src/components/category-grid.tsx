"use client";

import Link from "@/components/link";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { LoadingImage } from "./loading-image";
import { MockImagePlaceholder } from "./mock-image-placeholder";
import {
  ArrowUpRight,
  Heart,
  LayoutGrid,
  Grid,
  Search,
  X,
} from "lucide-react";
import type { BrandCategory, BrandMainCategory } from "@/lib/brand-categories";
import { useDict } from "@/i18n/client";

interface CategoryGridProps {
  categories: BrandCategory[];
  mainCategories?: BrandMainCategory[];
  brandSlug: string;
  brandName?: string;
  activeCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  /** Anchor for in-page links, e.g. "collections" */
  id?: string;
}

export function CategoryGrid({
  categories,
  mainCategories = [],
  brandSlug,
  brandName,
  activeCategory,
  onSelectCategory,
  title,
  eyebrow,
  subtitle,
  id,
}: CategoryGridProps) {
  const dict = useDict();
  const isThai = dict.common.loading === "กำลังโหลด";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [layoutMode, setLayoutMode] = useState<"masonry" | "grid">("grid");
  const [savedPins, setSavedPins] = useState<Record<string, boolean>>({});

  const toggleSavePin = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedPins((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  // Dynamic filter pills strictly from DB MainCategories that have collections in this list
  const filterGroups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of categories) {
      if (c.mainCategorySlug) {
        counts.set(c.mainCategorySlug, (counts.get(c.mainCategorySlug) ?? 0) + 1);
      }
    }
    const dbGroups = mainCategories
      .filter((m) => (counts.get(m.slug) ?? 0) > 0)
      .map((m) => ({ id: m.slug, label: m.name, count: counts.get(m.slug) ?? 0 }));
    if (dbGroups.length <= 1) return [];
    return [{ id: "all", label: isThai ? "ทั้งหมด" : "All", count: categories.length }, ...dbGroups];
  }, [categories, mainCategories, isThai]);

  // Filtered categories
  const displayedCategories = useMemo(() => {
    let result = categories;

    if (activeFilter !== "all") {
      result = result.filter((cat) => cat.mainCategorySlug === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((cat) => {
        return (
          cat.name.toLowerCase().includes(q) ||
          cat.slug.toLowerCase().includes(q) ||
          (cat.subtitle && cat.subtitle.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [categories, activeFilter, searchQuery]);

  // Pinterest-style varied aspect ratios for dynamic masonry waterfall rhythm
  const getMasonryAspect = (idx: number) => {
    const mod = idx % 5;
    if (mod === 0) return "aspect-[3/4]"; // tall portrait pin
    if (mod === 1) return "aspect-square"; // clean square pin
    if (mod === 2) return "aspect-[4/5]"; // elegant medium tall pin
    if (mod === 3) return "aspect-[1/1.15]"; // slightly tall pin
    return "aspect-[3/4]"; // tall pin
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden py-12 sm:py-20 bg-gradient-to-b from-sand/20 via-white to-sand/20 border-b border-line/60">
      {/* Dreamy ambient light backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 -z-10 h-96 w-[60rem] max-w-full rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.06),transparent_70%)] blur-3xl"
      />

      <div className="container-page">
        {/* Luxury Editorial Header + Search Row (Full Container Width) */}
        <div className="mb-8 sm:mb-10 space-y-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <span aria-hidden className="h-px w-6 bg-brand-pink" />
                <span>{brandName || eyebrow || "Collections"}</span>
              </p>
              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                  {title || (isThai ? "คอลเลกชันผลิตภัณฑ์" : "Product Collections")}
                </h2>
                <span className="rounded-full bg-sand/80 px-3 py-0.5 text-xs font-medium text-muted">
                  {isThai ? `${displayedCategories.length} คอลเลกชัน` : `${displayedCategories.length} collections`}
                </span>
              </div>
              {subtitle && (
                <p className="mt-2.5 text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right Tools: Search Bar & View Mode Toggle */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isThai ? "ค้นหาชื่อคอลเลกชัน..." : "Search collections..."}
                  className="w-full rounded-full border border-line bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/70 focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/15 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted hover:text-ink"
                    aria-label={isThai ? "ล้างการค้นหา" : "Clear search"}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="hidden sm:flex items-center rounded-full border border-line bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLayoutMode("grid")}
                  className={clsx(
                    "rounded-full p-1.5 transition-all",
                    layoutMode === "grid"
                      ? "bg-ink text-white shadow-xs"
                      : "text-muted hover:text-ink",
                  )}
                  title={isThai ? "มุมมองตารางมาตรฐาน" : "Grid View"}
                >
                  <Grid className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("masonry")}
                  className={clsx(
                    "rounded-full p-1.5 transition-all",
                    layoutMode === "masonry"
                      ? "bg-ink text-white shadow-xs"
                      : "text-muted hover:text-ink",
                  )}
                  title={isThai ? "มุมมองแกลเลอรี" : "Masonry View"}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Single-Row Category Filter Pills (Full Width) */}
          {filterGroups.length > 0 && (
            <div
              role="tablist"
              aria-label={isThai ? "กรองตามหมวดหมู่หลัก" : "Filter by category"}
              className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 border-t border-line/60 pt-4"
            >
              {filterGroups.map((group) => {
                const isSelected = activeFilter === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveFilter(group.id)}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 border",
                      isSelected
                        ? "bg-ink text-white border-ink shadow-sm"
                        : "bg-white text-ink/80 border-line hover:border-brand-pink/50 hover:text-brand-pink",
                    )}
                  >
                    <span>{group.label}</span>
                    <span
                      className={clsx(
                        "rounded-full px-1.5 py-0.2 text-[11px]",
                        isSelected ? "bg-white/20 text-white" : "bg-sand text-muted",
                      )}
                    >
                      {group.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Pins Container */}
        {displayedCategories.length > 0 ? (
          <div
            className={clsx(
              layoutMode === "masonry"
                ? "columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3.5 sm:gap-4 md:gap-5 [column-fill:_balance]"
                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5",
            )}
          >
            {displayedCategories.map((cat, idx) => {
              const isActive = activeCategory === cat.slug;
              const isSaved = !!savedPins[cat.slug];
              const targetHref = `/products/${brandSlug}?category=${cat.slug}#category-view`;
              const aspectClass = layoutMode === "masonry" ? getMasonryAspect(idx) : "aspect-square";

              return (
                <div
                  key={cat.slug}
                  data-reveal
                  suppressHydrationWarning
                  style={{ animationDelay: `${(idx % 10) * 35}ms` }}
                  className={clsx(
                    "group relative transition-all duration-300",
                    layoutMode === "masonry" && "break-inside-avoid mb-4 sm:mb-6",
                  )}
                >
                  <Link
                    href={targetHref}
                    onClick={(e) => {
                      if (onSelectCategory) {
                        e.preventDefault();
                        onSelectCategory(cat.slug);
                      }
                    }}
                    className="block"
                    aria-label={`${isThai ? "ดูหมวดหมู่" : "View"} ${cat.name}`}
                  >
                    {/* Pinterest Pin Image Box */}
                    <div
                      className={clsx(
                        "relative w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-100 transition-all duration-500 shadow-sm",
                        aspectClass,
                        isActive
                          ? "ring-2 ring-brand-pink shadow-xl scale-[1.02]"
                          : "border border-line/60 hover:shadow-2xl hover:shadow-neutral-900/10 hover:-translate-y-1",
                      )}
                    >
                      {/* Photo with smooth zoom or neutral gray mock placeholder */}
                      {cat.imageUrl ? (
                        <LoadingImage
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      ) : (
                        <MockImagePlaceholder label={cat.name} subLabel="Category Mock" className="absolute inset-0 size-full" />
                      )}

                      {/* Dark Vignette Overlay on Hover */}
                      <div
                        className={clsx(
                          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-300",
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        )}
                      />

                      {/* Top Right: Pinterest-Style Red/Pink Explore Pill */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-pink px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-pink-600 active:scale-95">
                          <span>{isThai ? "ดูคอลเลกชัน" : "Explore"}</span>
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </div>

                      {/* Bottom-right Heart / Favorite Button */}
                      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                        <button
                          type="button"
                          onClick={(e) => toggleSavePin(cat.slug, e)}
                          className={clsx(
                            "rounded-full p-2 backdrop-blur-md shadow-md transition-all",
                            isSaved
                              ? "bg-brand-pink text-white scale-110"
                              : "bg-white/90 text-neutral-800 hover:bg-white hover:text-brand-pink",
                          )}
                          title={isThai ? "บันทึกคอลเลกชัน" : "Save Pin"}
                        >
                          <Heart
                            className={clsx("size-3.5", isSaved && "fill-current")}
                          />
                        </button>
                      </div>

                      {/* Bottom Image Caption Overlay (Shows on Hover for extra flair) */}
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hidden sm:block">
                        <p className="text-[11px] text-white/80 line-clamp-1 font-medium">
                          {cat.subtitle || (isThai ? "คลิกเพื่อดูผลิตภัณฑ์ในซีรีส์นี้" : "Click to view series")}
                        </p>
                      </div>
                    </div>

                    {/* Pinterest Pin Details (Under Image - Authentic Pinterest Feed) */}
                    <div className="mt-2.5 px-1 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-semibold text-xs sm:text-sm md:text-base text-ink line-clamp-1 group-hover:text-brand-pink transition-colors">
                          {cat.name}
                        </h4>
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: cat.accentColor || "#d6297f" }}
                          title={cat.name}
                        />
                      </div>

                      {cat.subtitle ? (
                        <p className="mt-0.5 text-[11px] sm:text-xs text-muted line-clamp-1 leading-snug">
                          {cat.subtitle}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-[11px] sm:text-xs text-brand-pink/90 font-medium">
                          {brandName || "Fanola"} Professional
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-3xl border border-dashed border-line bg-white/70 p-10 sm:p-14 text-center max-w-md mx-auto">
            <p className="text-sm sm:text-base text-muted">
              {isThai
                ? `ไม่พบคอลเลกชันที่ตรงกับ "${searchQuery}"`
                : `No collections found matching "${searchQuery}"`}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-4 btn btn-outline btn-sm rounded-full"
            >
              {isThai ? "ล้างการค้นหา" : "Reset Filter"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
