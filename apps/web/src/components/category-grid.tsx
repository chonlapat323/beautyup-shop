"use client";

import Image from "next/image";
import Link from "@/components/link";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { ArrowUpRight, Search, Sparkles, X } from "lucide-react";
import type { BrandCategory } from "@/lib/brand-categories";
import { useDict } from "@/i18n/client";

interface CategoryGridProps {
  categories: BrandCategory[];
  brandSlug: string;
  brandName?: string;
  activeCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
}

export function CategoryGrid({
  categories,
  brandSlug,
  brandName,
  activeCategory,
  onSelectCategory,
  title,
  eyebrow,
  subtitle,
}: CategoryGridProps) {
  const dict = useDict();
  const isThai = dict.common.loading === "กำลังโหลด";

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Category filter groups for quick navigation
  const filterGroups = useMemo(
    () => [
      { id: "all", label: isThai ? "ทั้งหมด" : "All" },
      {
        id: "color",
        label: isThai ? "ทำสี & บลอนด์" : "Color & Blonde",
        keywords: ["yellow", "orange", "red", "colour", "color"],
      },
      {
        id: "care",
        label: isThai ? "ฟื้นฟู & บำรุงลึก" : "Repair & Care",
        keywords: ["nutri", "botugen", "fiber", "keraterm", "oro", "keratin"],
      },
      {
        id: "scalp",
        label: isThai ? "หนังศีรษะ & สุขภาพผม" : "Scalp & Wellness",
        keywords: ["sensi", "daily", "purity", "rebalance", "energy", "hygiene"],
      },
      {
        id: "style",
        label: isThai ? "ลอน & จัดแต่งทรง" : "Curl & Styling",
        keywords: ["curly", "volume", "more"],
      },
    ],
    [isThai],
  );

  // Filtered categories based on selected group & search query
  const displayedCategories = useMemo(() => {
    let result = categories;

    // Filter by group tab
    if (activeFilter !== "all") {
      const selectedGroup = filterGroups.find((g) => g.id === activeFilter);
      if (selectedGroup && selectedGroup.keywords) {
        result = result.filter((cat) => {
          const s = cat.slug.toLowerCase();
          const n = cat.name.toLowerCase();
          return selectedGroup.keywords!.some((kw) => s.includes(kw) || n.includes(kw));
        });
      }
    }

    // Filter by search query
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
  }, [categories, activeFilter, searchQuery, filterGroups]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 sm:py-20 bg-gradient-to-b from-mist/20 via-white to-mist/20 border-b border-line/60">
      {/* Ambient background soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 -z-10 h-80 w-[54rem] max-w-full rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.08),transparent_70%)] blur-3xl"
      />

      <div className="container-page">
        {/* Modern Section Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
          {/* Eyebrow Capsule Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-pink/25 bg-brand-pink/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-pink shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-brand-pink animate-pulse" />
            <span>{eyebrow || (isThai ? "คอลเลกชันระดับมืออาชีพ" : "Collections")}</span>
            <span className="h-3 w-px bg-brand-pink/30" />
            <span className="font-mono text-[11px] font-bold text-brand-pink">
              {categories.length} {isThai ? "หมวดหมู่" : "Series"}
            </span>
          </div>

          {/* Luxury Two-Tone Headline */}
          <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
            {title ? (
              title
            ) : isThai ? (
              <>
                คอลเลกชัน & หมวดหมู่{" "}
                <span className="bg-gradient-to-r from-brand-pink via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ผลิตภัณฑ์ซาลอน
                </span>
              </>
            ) : (
              <>
                Product Collections{" "}
                <span className="bg-gradient-to-r from-brand-pink via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  & Categories
                </span>
              </>
            )}
          </h2>

          {/* Subtitle / Lead */}
          <p className="mt-3.5 text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
            {subtitle
              ? subtitle
              : isThai
                ? `เลือกดูนวัตกรรมผลิตภัณฑ์ดูแลและฟื้นบำรุงเส้นผมระดับมืออาชีพจาก ${brandName || "อิตาลี"} ออกแบบเฉพาะสำหรับทุกสภาพเส้นผม`
                : `Explore premium salon-grade hair care series engineered by ${brandName || "professionals"} for tailored hair treatments.`}
          </p>

          {/* Interactive Filter Pills & Search Bar */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Filter Pills */}
            <div
              role="tablist"
              className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
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
                      "rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 shrink-0 border",
                      isSelected
                        ? "bg-brand-pink text-white border-brand-pink shadow-md shadow-brand-pink/25 scale-[1.03]"
                        : "bg-white/90 text-muted border-line hover:border-brand-pink/40 hover:text-ink hover:bg-white shadow-sm",
                    )}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isThai ? "ค้นหาคอลเลกชัน..." : "Search collection..."}
                className="w-full rounded-full border border-line bg-white/90 pl-9 pr-8 py-1.5 text-xs sm:text-sm text-ink placeholder:text-muted/70 focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/20 shadow-sm transition-all"
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
          </div>
        </div>

        {/* 5-Column Responsive Visual Category Grid (Image 1 reference) */}
        {displayedCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-4.5">
            {displayedCategories.map((cat, idx) => {
              const isActive = activeCategory === cat.slug;
              const targetHref = `/products/${brandSlug}?category=${cat.slug}#category-view`;
              const globalIndex = categories.findIndex((c) => c.slug === cat.slug);
              const serialNumber = globalIndex >= 0 ? globalIndex + 1 : idx + 1;
              const serialStr = serialNumber < 10 ? `0${serialNumber}` : `${serialNumber}`;

              return (
                <div
                  key={cat.slug}
                  data-reveal
                  suppressHydrationWarning
                  style={{ animationDelay: `${(idx % 10) * 35}ms` }}
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
                      "relative block aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 bg-neutral-900 shadow-sm",
                      isActive
                        ? "border-brand-pink shadow-xl ring-2 ring-brand-pink/60 scale-[1.02]"
                        : "border-line/70 hover:border-brand-pink/70 hover:shadow-2xl hover:shadow-brand-pink/20 hover:-translate-y-1",
                    )}
                    aria-label={`${isThai ? "ดูหมวดหมู่" : "View"} ${cat.name}`}
                  >
                    {/* Category Image with smooth scale on hover */}
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                      priority={idx < 5}
                    />

                    {/* Gradient & Vignette Overlay */}
                    <div
                      className={clsx(
                        "absolute inset-0 transition-opacity duration-300",
                        isActive
                          ? "bg-gradient-to-t from-black/90 via-black/45 to-black/20 opacity-100"
                          : "bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-65 sm:opacity-0 sm:group-hover:opacity-100",
                      )}
                    />

                    {/* Top Serial Number Pill (Modern Aesthetic) */}
                    <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-medium text-white/90 backdrop-blur-md shadow-sm transition-all group-hover:border-brand-pink/60 group-hover:bg-black/70">
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: cat.accentColor || "#d6297f" }}
                        />
                        <span>{serialStr}</span>
                      </span>
                    </div>

                    {/* Category Title & 'คลิก' Pill Action (matches Image 1) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center z-10 transition-all duration-300">
                      <span
                        className={clsx(
                          "font-display text-sm sm:text-base md:text-lg font-bold tracking-wide text-white drop-shadow-lg transition-all duration-300",
                          isActive
                            ? "opacity-100 translate-y-0 text-white"
                            : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0",
                        )}
                      >
                        {cat.name}
                      </span>

                      {/* Frosted Glass Button (คลิก / Click) with Arrow icon */}
                      <div
                        className={clsx(
                          "mt-2.5 transition-all duration-300",
                          isActive
                            ? "opacity-100 scale-100"
                            : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:scale-95 sm:group-hover:scale-100",
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-md transition-all duration-300 group-hover:bg-brand-pink group-hover:border-brand-pink group-hover:shadow-brand-pink/50 group-hover:gap-2">
                          <span>{isThai ? "คลิก" : "Click"}</span>
                          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>

                    {/* Ambient subtle glow ring on hover */}
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-brand-pink/50 pointer-events-none"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-3xl border border-dashed border-line bg-white/60 p-10 sm:p-14 text-center max-w-md mx-auto">
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
              className="mt-4 btn btn-outline btn-sm"
            >
              {isThai ? "ล้างการค้นหา" : "Reset Filter"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
