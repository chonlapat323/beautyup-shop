"use client";

import clsx from "clsx";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  ImageOff,
  Laptop,
  MessageCircle,
  Phone,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { Option } from "@/lib/fields";
import type { Locale } from "./fields";

type L = { th?: string; en?: string };

function pick(val: unknown, locale: Locale): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    const o = val as L;
    return (locale === "en" ? o.en || o.th : o.th || o.en) ?? "";
  }
  return String(val);
}

function resolveImg(src: unknown): string {
  if (!src) return "";
  const raw = Array.isArray(src) ? String(src[0] ?? "") : String(src);
  const s = raw.trim();
  if (!s) return "";
  try {
    const u = new URL(s);
    if ((u.hostname === "localhost" || u.hostname === "127.0.0.1") && u.pathname.startsWith("/uploads/")) {
      return u.pathname;
    }
  } catch {
    // relative path such as /uploads/... works directly via Next.js rewrite
  }
  return s;
}

function resolveImgs(src: unknown, fallback?: unknown): string[] {
  const arr = Array.isArray(src) ? src.map((x) => resolveImg(x)).filter(Boolean) : [];
  if (arr.length > 0) return arr;
  const fb = resolveImg(fallback);
  return fb ? [fb] : [];
}

const SOCIAL_ICONS: Record<string, { label: string; icon: ReactNode }> = {
  facebook: {
    label: "Facebook",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  tiktok: {
    label: "TikTok",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  youtube: {
    label: "YouTube",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  line: {
    label: "LINE",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.019 9.572.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.589-3.844 2.589-5.956zm-15.011 2.378h-2.136a.669.669 0 0 1-.669-.669V7.987a.669.669 0 0 1 .669-.669h2.136a.669.669 0 1 1 0 1.338H7.523v1.025h1.466a.669.669 0 1 1 0 1.338H7.523v1.025h1.466a.669.669 0 1 1 0 1.338zm3.328 0h-1.338a.669.669 0 0 1-.669-.669V7.987a.669.669 0 0 1 1.338 0v4.026a.669.669 0 0 1-.669.669zm4.675 0a.669.669 0 0 1-.502-.227l-2.007-2.615v2.173a.669.669 0 1 1-1.338 0V7.987a.669.669 0 0 1 .502-.227.669.669 0 0 1 .502.227l2.007 2.615V8.428a.669.669 0 1 1 1.338 0v4.253a.669.669 0 0 1-.669.669zm3.328 0h-2.136a.669.669 0 0 1-.669-.669V7.987a.669.669 0 0 1 1.338 0v3.357h1.467a.669.669 0 1 1 0 1.338z" />
      </svg>
    ),
  },
};

function SocialLinksPreview({ socials, className }: { socials?: Record<string, string>; className?: string }) {
  if (!socials) return null;
  const entries = Object.entries(socials).filter(([, href]) => Boolean(href && href.trim()));
  if (entries.length === 0) return null;

  return (
    <ul className={clsx("flex flex-wrap items-center gap-1.5", className)}>
      {entries.map(([key, href]) => {
        const item = SOCIAL_ICONS[key];
        if (!item) return null;
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title={item.label}
              aria-label={item.label}
              className="flex size-8 items-center justify-center rounded-full border border-[#e8e6e1] bg-white text-stone-700 shadow-xs"
            >
              {item.icon}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function ResourcePreviewModal({
  open,
  onClose,
  resourceName,
  values,
  relations = {},
  initialLocale = "th",
}: {
  open: boolean;
  onClose: () => void;
  resourceName?: string;
  values: Record<string, unknown>;
  relations?: Record<string, Option[]>;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const th = locale === "th";
  const isMobile = device === "mobile";

  const lookupRelation = (res: string, id: unknown, fallback: string) => {
    if (!id) return fallback;
    const found = relations[res]?.find((o) => o.value === String(id));
    return found?.label || fallback;
  };

  /* -------------------------------------------------------------------------
   * 1. BRAND PREVIEW (brands)
   * ----------------------------------------------------------------------- */
  const renderBrandPreview = () => {
    const name = String(values.name ?? "").trim() || "Brand Name";
    const localName = pick(values.localName, locale) || name;
    const country = pick(values.country, locale);
    const importedLabel = country ? (th ? `นำเข้าจาก${country}` : `Imported from ${country}`) : "";
    const tagline = pick(values.tagline, locale);
    const description = pick(values.description, locale);
    const logoUrl = resolveImg(values.logoUrl);
    const website = String(values.website ?? "").trim();
    const catalogUrl = String(values.catalogUrl ?? "").trim();
    const brandType = String(values.type ?? "SALON");
    const highlightsRaw = Array.isArray(values.highlights) ? values.highlights : [];
    const highlights = highlightsRaw.map((h) => pick(h, locale)).filter(Boolean);
    const socials = (values.socials as Record<string, string> | undefined) ?? {};

    return (
      <div className="space-y-10 text-[#1c1917]">
        {/* Section 1: หน้ารวมแบรนด์ (/products) */}
        {brandType === "SALON" && (
          <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
            <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
              <span className="font-semibold text-[#1c1917]">1. การแสดงผลในหน้ารวมแบรนด์ (/{locale}/products)</span>
              <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
                {isMobile ? "มุมมองมือถือ" : "มุมมองคอมพิวเตอร์"}
              </span>
            </div>

            <div className={clsx("bg-white", isMobile ? "px-4" : "px-6 sm:px-10")}>
              <section
                className={clsx(
                  "grid items-center gap-8",
                  isMobile ? "grid-cols-1 py-10" : "grid-cols-1 py-14 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-20",
                )}
              >
                <div className={clsx("flex items-center justify-center overflow-hidden rounded-3xl bg-white", isMobile ? "p-6" : "p-8 sm:p-12")}>
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt={name} className="aspect-[4/3] w-full object-contain" />
                  ) : (
                    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e8e6e1] text-[#6b6762]">
                      <ImageOff className="size-6 opacity-50" />
                      <span className="text-xs">ยังไม่ได้อัปโหลดโลโก้แบรนด์</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-[0.18em] text-[#9a5b3f] uppercase wrap-break-word">{importedLabel}</p>
                  <h2 className={clsx("mt-3 font-serif leading-tight text-[#1c1917] wrap-break-word", isMobile ? "text-4xl" : "text-4xl sm:text-5xl")}>
                    {localName}
                    <span className={clsx("mt-1 block text-[#6b6762] wrap-break-word", isMobile ? "text-2xl" : "text-2xl sm:text-3xl")}>{name}</span>
                  </h2>
                  {description && <p className="mt-5 text-lg text-[#6b6762] whitespace-pre-line wrap-break-word">{description}</p>}
                  {highlights.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {highlights.map((h, i) => (
                        <li key={i} className="rounded-full bg-[#f3e6dd] px-3 py-1 text-sm text-[#7c4630]">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  {tagline && <p className="mt-6 font-serif text-xl italic text-[#1c1917] wrap-break-word">“{tagline}”</p>}
                  <div className={clsx("mt-8 flex gap-2", isMobile ? "flex-col" : "flex-col sm:flex-row")}>
                    <span className={clsx("inline-flex min-h-11 items-center justify-center rounded-full bg-[#1c1917] px-6 text-[15px] font-medium text-white", isMobile && "w-full")}>
                      {th ? "ชมสินค้า" : "View Products"}
                    </span>
                    {catalogUrl && (
                      <span className={clsx("inline-flex min-h-11 items-center justify-center rounded-full border border-[#e8e6e1] bg-white px-6 text-[15px] font-medium text-[#1c1917]", isMobile && "w-full")}>
                        {th ? "แคตตาล็อก" : "Catalog"}
                      </span>
                    )}
                  </div>
                  <SocialLinksPreview socials={socials} className="mt-6" />
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Section 2: ส่วนหัวหน้าแบรนด์เดี่ยว (/products/[brand]) */}
        {brandType === "SALON" && (
          <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
            <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
              <span className="font-semibold text-[#1c1917]">
                2. ส่วนหัวเมื่อคลิกเข้าหน้าแบรนด์ (/{locale}/products/{String(values.slug || "brand")})
              </span>
              <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
                PageHero
              </span>
            </div>

            <section
              className={clsx(
                "relative overflow-hidden bg-[linear-gradient(160deg,#fdf2f8_0%,#fdfcfb_60%,#fdfcfb_100%)]",
                isMobile ? "px-5 py-10" : "px-6 py-12 sm:px-10 sm:py-16 lg:py-20",
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.15),transparent_70%)] blur-3xl"
              />
              <div className="relative min-w-0">
                {importedLabel && (
                  <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#9a5b3f] uppercase wrap-break-word">
                    <span aria-hidden className="h-px w-6 shrink-0 bg-[#d6297f]" />
                    {importedLabel}
                  </p>
                )}
                <h1
                  className={clsx(
                    "mt-3 max-w-4xl font-serif leading-[1.15] text-[#1c1917] wrap-break-word",
                    isMobile ? "text-4xl" : "text-4xl sm:text-5xl lg:text-6xl",
                  )}
                >
                  {localName} <span className="text-[#6b6762]">{name}</span>
                </h1>
                {description && (
                  <p className={clsx("mt-5 max-w-2xl text-[#6b6762] whitespace-pre-line wrap-break-word", isMobile ? "text-base" : "text-base sm:text-lg")}>
                    {description}
                  </p>
                )}
                {(website || catalogUrl || Object.values(socials).some(Boolean)) && (
                  <div className={clsx("mt-8 flex gap-4", isMobile ? "flex-col" : "flex-col sm:flex-row sm:items-center")}>
                    {website && (
                      <span className={clsx("inline-flex min-h-11 items-center justify-center rounded-full border border-[#e8e6e1] bg-white px-6 text-[15px] font-medium text-[#1c1917]", isMobile && "w-full")}>
                        {th ? "เว็บไซต์แบรนด์" : "Brand Website"}
                      </span>
                    )}
                    {catalogUrl && (
                      <span className={clsx("inline-flex min-h-11 items-center justify-center rounded-full border border-[#e8e6e1] bg-white px-6 text-[15px] font-medium text-[#1c1917]", isMobile && "w-full")}>
                        {th ? "แคตตาล็อก" : "Catalog"}
                      </span>
                    )}
                    <SocialLinksPreview socials={socials} />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Section 3: การ์ดแบรนด์บนหน้าแรก (/) */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">
              {brandType === "SALON" ? "3" : "1"}. การ์ดแบรนด์บนหน้าแรก (/{locale}) —{" "}
              {brandType === "SALON" ? "ผลิตภัณฑ์ซาลอน" : "เคาน์เตอร์แบรนด์"}
            </span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              การ์ดหน้าแรก
            </span>
          </div>
          <div className={clsx("bg-white", isMobile ? "p-4" : "p-6 md:p-10")}>
            <div className="mx-auto max-w-sm flex flex-col overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white">
              <div className="flex items-center justify-center overflow-hidden bg-white p-6 sm:p-8">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={name} className="aspect-[16/10] w-full object-contain" />
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-dashed border-[#e8e6e1] text-xs text-[#6b6762]">
                    ยังไม่มีโลโก้
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 min-w-0">
                <p className="text-xs tracking-wide text-[#6b6762] uppercase wrap-break-word">{importedLabel}</p>
                <p className="mt-2 font-serif text-2xl text-[#1c1917] wrap-break-word">
                  {localName} <span className="text-[#6b6762]">({name})</span>
                </p>
                {description && <p className="mt-3 flex-1 text-[#6b6762] wrap-break-word">{description}</p>}
                <span className="mt-6 inline-flex items-center gap-2 font-medium text-[#1c1917]">
                  {brandType === "COUNTER" && website
                    ? th
                      ? "ไปที่เว็บไซต์แบรนด์"
                      : "Visit Brand Website"
                    : th
                      ? "ดูผลิตภัณฑ์"
                      : "View Products"}{" "}
                  <span>→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------
   * 2. MAIN CATEGORY PREVIEW (main-categories)
   *    - 1. การ์ดหมวดหมู่ผลิตภัณฑ์หลักบนหน้าแบรนด์ (MenuContentRenderer layout="columns")
   *    - 2. ส่วนหัวเมื่อคลิกเข้าหมวดหมู่หลัก (/products/[brand]?group=[slug] -> CategoryHero)
   * ----------------------------------------------------------------------- */
  const renderMainCategoryPreview = () => {
    const name = pick(values.name, locale) || (th ? "ชื่อหมวดหมู่หลัก" : "Main Category Name");
    const description = pick(values.description, locale);
    const imageUrl = resolveImg(values.imageUrl);
    const brandName = lookupRelation("brands", values.brandId, "Fanola");
    const slug = String(values.slug || "main-category");

    return (
      <div className="space-y-10 text-[#1c1917]">
        {/* Section 1: การ์ดหมวดหมู่หลักบนหน้าแบรนด์ (MenuContentRenderer layout="columns") */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">
              1. การ์ดในส่วน “หมวดหมู่ผลิตภัณฑ์หลัก” บนหน้าแบรนด์ ({brandName})
            </span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              การ์ดหมวดหมู่หลัก
            </span>
          </div>

          <section className={clsx("relative overflow-hidden bg-gradient-to-b from-[#f7f7f5]/50 via-[#fcebf3]/20 to-[#f7f7f5]/30", isMobile ? "p-5" : "p-8 md:p-12")}>
            <div className="mb-8 text-center">
              <h2 className={clsx("font-sans font-bold tracking-tight text-[#1c1917]", isMobile ? "text-2xl" : "text-3xl sm:text-4xl")}>
                {th ? "หมวดหมู่ผลิตภัณฑ์หลัก" : "Main Product Categories"}
              </h2>
            </div>

            <div className="mx-auto max-w-xs">
              <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7f7f5]">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={name} className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#d6297f]/20 to-[#f7f7f5] p-4 text-center text-sm text-[#6b6762]">
                      <ImageOff className="size-6 opacity-50" />
                      <span>{name}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between bg-white p-5 sm:p-6 min-w-0">
                  <div>
                    <h3 className="font-sans text-xl font-bold leading-snug text-[#1c1917] sm:text-2xl wrap-break-word">
                      {name}
                    </h3>
                    {description && (
                      <p className="mt-3 line-clamp-5 text-xs leading-relaxed text-[#6b6762] sm:text-sm whitespace-pre-line wrap-break-word">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 border-t border-[#e8e6e1]/60 pt-3.5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e6e1] bg-white px-4 py-1.5 text-xs font-medium text-[#1c1917] shadow-2xs sm:text-sm">
                      <span>{th ? "ดูสินค้า" : "View products"}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section 2: ส่วนหัวหน้าหมวดหมู่หลักเมื่อคลิกเข้ามา (?group=[slug] -> CategoryHero) */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">
              2. ส่วนหัวเมื่อคลิกเข้าหมวดหมู่หลัก (?group={slug})
            </span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              CategoryHero
            </span>
          </div>

          <section
            className={clsx(
              "relative overflow-hidden bg-[linear-gradient(160deg,#fdf2f8_0%,#fdfcfb_60%,#fdfcfb_100%)]",
              isMobile ? "px-5 py-10" : "px-6 py-10 sm:px-10 sm:py-14 lg:py-20",
            )}
          >
            {imageUrl && (
              <div aria-hidden className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="h-full w-full object-cover object-top opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdf2f8]/70 via-[#fdfcfb]/80 to-[#fdfcfb]" />
              </div>
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, #d6297f26, transparent 70%)" }}
            />

            <div className="relative min-w-0">
              <span className="inline-flex items-center gap-2 text-sm text-[#6b6762]">
                <ArrowLeft className="size-4" />
                {th ? `กลับไปหน้า ${brandName}` : `Back to ${brandName}`}
              </span>

              <div className="mt-8 max-w-3xl">
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#9a5b3f] uppercase">
                  <span aria-hidden className="h-px w-6 bg-[#d6297f]" />
                  {brandName}
                </p>
                <h1 className={clsx("mt-3 font-serif leading-[1.15] text-[#1c1917] wrap-break-word", isMobile ? "text-4xl" : "text-4xl sm:text-5xl lg:text-6xl")}>
                  <span className="text-[#d6297f]">{name.slice(0, 2)}</span>
                  {name.slice(2)}
                </h1>
                {description && (
                  <p className={clsx("mt-5 max-w-2xl text-[#6b6762] whitespace-pre-line wrap-break-word", isMobile ? "text-base" : "text-base sm:text-lg")}>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------
   * 3. COLLECTION PREVIEW (categories)
   *    - 1. การ์ดคอลเลกชันแบบ Pinterest Pin ใน CategoryGrid
   *    - 2. ส่วนหัวเมื่อคลิกเข้าคอลเลกชัน (?category=[slug] -> CategoryHero)
   * ----------------------------------------------------------------------- */
  const renderCollectionPreview = () => {
    const name = pick(values.name, locale) || (th ? "ชื่อคอลเลกชัน" : "Collection Name");
    const subtitle = pick(values.subtitle, locale);
    const description = pick(values.description, locale);
    const highlights = pick(values.highlights, locale);
    const imageUrl = resolveImg(values.imageUrl);
    const bannerUrl = resolveImg(values.bannerUrl) || imageUrl;
    const accent = String(values.accentColor || "#d6297f").trim() || "#d6297f";
    const brandName = lookupRelation("brands", values.brandId, "Fanola");
    const mainCategoryName = lookupRelation("main-categories", values.mainCategoryId, th ? "หมวดหมู่หลัก" : "Main Category");
    const slug = String(values.slug || "collection");

    return (
      <div className="space-y-10 text-[#1c1917]">
        {/* Section 1: การ์ดคอลเลกชันใน CategoryGrid (Pinterest Pin Card) */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">
              1. การ์ดคอลเลกชันในตาราง “คอลเลกชันผลิตภัณฑ์” (หมวด: {mainCategoryName})
            </span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              CategoryGrid Pin
            </span>
          </div>

          <div className={clsx("bg-[#f7f7f5]/60", isMobile ? "p-5" : "p-8 md:p-12")}>
            <div className="mx-auto max-w-[260px]">
              <div className="group relative">
                {/* Pinterest Pin Image Box */}
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#e8e6e1]/60 bg-neutral-100 shadow-sm">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={name} className="size-full object-cover object-center" />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 bg-neutral-100 p-4 text-center text-xs text-[#6b6762]">
                      <ImageOff className="size-6 opacity-50" />
                      <span>ยังไม่มีรูปการ์ดคอลเลกชัน</span>
                    </div>
                  )}

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

                  {/* Top Right: Explore Pill */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d6297f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg">
                      <span>{th ? "ดูคอลเลกชัน" : "Explore"}</span>
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>

                  {/* Bottom Right: Heart Button */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="inline-flex rounded-full bg-white/90 p-2 text-neutral-800 shadow-md">
                      <Heart className="size-3.5" />
                    </span>
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 text-left">
                    <p className="line-clamp-1 text-[11px] font-medium text-white/90">
                      {subtitle || (th ? "คลิกเพื่อดูผลิตภัณฑ์ในซีรีส์นี้" : "Click to view series")}
                    </p>
                  </div>
                </div>

                {/* Under Image Details */}
                <div className="mt-2.5 px-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="line-clamp-1 font-serif text-base font-semibold text-[#1c1917]">
                      {name}
                    </h4>
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: accent }}
                      title={accent}
                    />
                  </div>
                  {subtitle ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-[#6b6762]">{subtitle}</p>
                  ) : (
                    <p className="mt-0.5 text-xs font-medium text-[#d6297f]/90">{brandName} Professional</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: ส่วนหัวเมื่อคลิกเข้าคอลเลกชัน (?category=[slug] -> CategoryHero) */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">
              2. ส่วนหัวหน้าคอลเลกชันเมื่อคลิกเข้ามา (?category={slug})
            </span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              CategoryHero
            </span>
          </div>

          <section
            className={clsx(
              "relative overflow-hidden bg-[linear-gradient(160deg,#fdf2f8_0%,#fdfcfb_60%,#fdfcfb_100%)]",
              isMobile ? "px-5 py-10" : "px-6 py-10 sm:px-10 sm:py-14 lg:py-20",
            )}
          >
            {bannerUrl && (
              <div aria-hidden className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bannerUrl} alt="" className="h-full w-full object-cover object-top opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdf2f8]/70 via-[#fdfcfb]/80 to-[#fdfcfb]" />
              </div>
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${accent}26, transparent 70%)` }}
            />

            <div className="relative min-w-0">
              <span className="inline-flex items-center gap-2 text-sm text-[#6b6762]">
                <ArrowLeft className="size-4" />
                {th ? `กลับไปหมวด ${mainCategoryName}` : `Back to ${mainCategoryName}`}
              </span>

              <div className="mt-8 max-w-3xl">
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#9a5b3f] uppercase">
                  <span aria-hidden className="h-px w-6 bg-[#d6297f]" />
                  {brandName}
                </p>
                <h1 className={clsx("mt-3 font-serif leading-[1.15] text-[#1c1917] wrap-break-word", isMobile ? "text-4xl" : "text-4xl sm:text-5xl lg:text-6xl")}>
                  <span style={{ color: accent }}>{name.slice(0, 2)}</span>
                  {name.slice(2)}
                </h1>
                {subtitle && (
                  <p className={clsx("mt-3 font-medium wrap-break-word", isMobile ? "text-base" : "text-base sm:text-lg")} style={{ color: accent }}>
                    {subtitle}
                  </p>
                )}
                {description && (
                  <p className={clsx("mt-5 max-w-2xl text-[#6b6762] whitespace-pre-line wrap-break-word", isMobile ? "text-base" : "text-base sm:text-lg")}>
                    {description}
                  </p>
                )}
                {highlights && (
                  <p
                    className="mt-6 max-w-2xl rounded-2xl border p-4 text-sm leading-relaxed text-[#1c1917] sm:p-5 whitespace-pre-line wrap-break-word"
                    style={{ borderColor: `${accent}40`, backgroundColor: `${accent}0c` }}
                  >
                    {highlights}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------
   * 4. PRODUCT PREVIEW (products)
   *    - 1. หน้ารายละเอียดสินค้า (/product/[slug] -> ProductPage + ProductImageGallery)
   *    - 2. การ์ดสินค้าในตารางรวมสินค้า (ProductGrid)
   * ----------------------------------------------------------------------- */
  const renderProductPreview = () => {
    const name = pick(values.name, locale) || (th ? "ชื่อสินค้า" : "Product Name");
    const description = pick(values.description, locale);
    const price = Number(values.price ?? 0);
    const salePrice =
      values.salePrice != null && values.salePrice !== "" && Number(values.salePrice) > 0
        ? Number(values.salePrice)
        : null;
    const effectivePrice = salePrice ?? price;
    const images = resolveImgs(values.images, values.imageUrl);
    const safeIdx = activeImgIdx < images.length ? activeImgIdx : 0;
    const currentImg = images[safeIdx] || "";
    const badges = Array.isArray(values.badges) ? values.badges.map(String).filter(Boolean) : [];
    const tags = Array.isArray(values.tags) ? values.tags.map(String).filter(Boolean) : [];
    const brandName = lookupRelation("brands", values.brandId, "Fanola");
    const mainCategoryName = lookupRelation("main-categories", values.mainCategoryId, "");
    const collectionName = lookupRelation("categories", values.categoryId, "");

    return (
      <div className="space-y-10 text-[#1c1917]">
        {/* Section 1: หน้ารายละเอียดสินค้า (/product/[slug]) */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">
              1. หน้ารายละเอียดสินค้า (/{locale}/product/{String(values.slug || "product-slug")})
            </span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              {mainCategoryName ? `${brandName} · ${mainCategoryName}${collectionName ? ` · ${collectionName}` : ""}` : brandName}
            </span>
          </div>

          <article className={clsx("bg-white", isMobile ? "p-5" : "p-6 sm:p-10 md:p-12")}>
            {/* Breadcrumb */}
            <nav className="mb-6 flex flex-wrap items-center gap-x-2 text-sm text-[#6b6762]">
              <span>{th ? "ผลิตภัณฑ์ผม" : "Hair Products"}</span>
              <span>/</span>
              <span>{brandName}</span>
              <span>/</span>
              <span className="text-[#1c1917] wrap-break-word">{name}</span>
            </nav>

            <div className={clsx("grid gap-8", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:gap-14")}>
              {/* Left: ProductImageGallery */}
              <div className="space-y-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f7f7f5]">
                  {currentImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentImg} alt={name} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 text-[#6b6762]">
                      <ImageOff className="size-8 opacity-40" />
                      <span className="text-xs">ยังไม่มีรูปสินค้า</span>
                    </div>
                  )}

                  {badges.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {badges.map((b, i) => (
                        <span key={i} className="rounded-full bg-[#1c1917] px-2.5 py-1 text-[11px] font-medium tracking-wide text-white">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="รูปก่อนหน้า"
                        onClick={() => setActiveImgIdx((i) => (i > 0 ? i - 1 : images.length - 1))}
                        className="absolute top-1/2 left-3 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-[#1c1917] shadow-md transition hover:bg-white"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="รูปถัดไป"
                        onClick={() => setActiveImgIdx((i) => (i < images.length - 1 ? i + 1 : 0))}
                        className="absolute top-1/2 right-3 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-[#1c1917] shadow-md transition hover:bg-white"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {images.map((src, idx) => (
                      <button
                        key={src + idx}
                        type="button"
                        onClick={() => setActiveImgIdx(idx)}
                        className={clsx(
                          "relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition",
                          idx === safeIdx ? "border-[#9a5b3f] ring-2 ring-[#9a5b3f]/25" : "border-[#e8e6e1] opacity-75 hover:opacity-100",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Info */}
              <div className="min-w-0">
                <p className="text-xs font-medium tracking-[0.18em] text-[#9a5b3f] uppercase">{brandName}</p>
                <h1 className={clsx("mt-3 font-serif leading-tight text-[#1c1917] wrap-break-word", isMobile ? "text-3xl" : "text-3xl sm:text-5xl")}>
                  {name}
                </h1>

                <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
                  <span className={clsx("font-serif text-3xl sm:text-4xl", salePrice ? "text-[#9a5b3f]" : "text-[#1c1917]")}>
                    ฿{effectivePrice.toLocaleString("th-TH")}
                  </span>
                  {salePrice && <span className="text-lg text-[#6b6762] line-through">฿{price.toLocaleString("th-TH")}</span>}
                </p>

                {description && (
                  <div className="mt-6 space-y-3 text-base leading-relaxed text-[#6b6762] whitespace-pre-line wrap-break-word">
                    {description}
                  </div>
                )}

                {/* Order CTA Box */}
                <div className="mt-8 rounded-3xl border border-[#e8e6e1] bg-[#f7f7f5] p-6">
                  <p className="font-medium text-[#1c1917]">{th ? "สนใจสั่งซื้อสินค้านี้" : "Order this product"}</p>
                  <p className="mt-1 text-sm text-[#6b6762]">
                    {th
                      ? "สนใจสั่งซื้อหรือสอบถามราคาส่งสำหรับร้านซาลอน ติดต่อทีมงานบิวตี้อัพได้เลย"
                      : "Contact BeautyUp team for salon wholesale or retail inquiries."}
                  </p>
                  <div className={clsx("mt-5 flex gap-2", isMobile ? "flex-col" : "flex-col sm:flex-row")}>
                    <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1c1917] px-6 text-[15px] font-medium text-white">
                      <MessageCircle className="size-4" />
                      {th ? "ติดต่อสั่งซื้อ" : "Contact to Order"}
                    </span>
                    <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#e8e6e1] bg-white px-6 text-[15px] font-medium text-[#1c1917]">
                      <Phone className="size-4" />
                      {th ? "โทรติดต่อฝ่ายขาย" : "Call Sales"}
                    </span>
                  </div>
                </div>

                {/* SEO / AI Tags */}
                {tags.length > 0 && (
                  <div className="mt-8 border-t border-[#e8e6e1] pt-6">
                    <p className="text-xs font-medium tracking-wide text-[#6b6762] uppercase">{th ? "แท็ก" : "Tags"}</p>
                    <ul className="mt-2 flex flex-wrap gap-2 text-sm text-[#6b6762]">
                      {tags.map((tag, i) => (
                        <li key={i} className="rounded-full bg-[#f0efec] px-3 py-1">
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>

        {/* Section 2: การ์ดสินค้าในหน้ารวมสินค้า (ProductGrid) */}
        <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white shadow-sm">
          <div className="border-b border-[#e8e6e1] bg-[#f7f7f5] px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-[#6b6762]">
            <span className="font-semibold text-[#1c1917]">2. การ์ดสินค้าในตารางรวมสินค้า (ProductGrid)</span>
            <span className="shrink-0 rounded-full bg-white border border-[#e8e6e1] px-2.5 py-0.5 text-[11px] font-medium text-[#1c1917]">
              การ์ดสินค้า (1 ใน 4 คอลัมน์)
            </span>
          </div>

          <div className={clsx("bg-white", isMobile ? "p-5" : "p-8 md:p-10")}>
            <div className="mx-auto max-w-[240px]">
              <div className="group relative">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#f7f7f5]">
                  {images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={images[0]} alt={name} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-[#6b6762]">ยังไม่มีรูปปก</div>
                  )}
                  {badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {badges.map((b, i) => (
                        <span key={i} className="rounded-full bg-[#1c1917] px-2.5 py-1 text-[11px] font-medium tracking-wide text-white">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs tracking-wide text-[#6b6762] uppercase">{brandName}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-[#1c1917] sm:text-base wrap-break-word">{name}</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  {salePrice ? (
                    <>
                      <span className="font-medium text-[#9a5b3f]">฿{salePrice.toLocaleString("th-TH")}</span>
                      <span className="text-sm text-[#6b6762] line-through">฿{price.toLocaleString("th-TH")}</span>
                    </>
                  ) : (
                    <span className="font-medium text-[#1c1917]">฿{price.toLocaleString("th-TH")}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------
   * 5. GENERIC PREVIEW (posts, media, courses, etc.)
   * ----------------------------------------------------------------------- */
  const renderGenericPreview = () => {
    const title =
      pick(values.title, locale) ||
      pick(values.name, locale) ||
      String(values.name ?? values.title ?? "ตัวอย่างข้อมูล");
    const subtitle = pick(values.subtitle, locale) || pick(values.excerpt, locale) || pick(values.role, locale);
    const body = pick(values.body, locale) || pick(values.description, locale) || pick(values.content, locale);
    const images = resolveImgs(values.images, values.imageUrl ?? values.coverUrl ?? values.logoUrl ?? values.photoUrl);

    return (
      <div className="overflow-hidden rounded-3xl border border-[#e8e6e1] bg-white p-6 md:p-12 shadow-sm space-y-6 text-[#1c1917]">
        <h1 className="font-serif text-3xl text-[#1c1917] sm:text-4xl wrap-break-word">{title}</h1>
        {subtitle && <p className="text-lg text-[#6b6762] whitespace-pre-line wrap-break-word">{subtitle}</p>}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-3xl bg-white max-h-[460px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0]} alt={title} className="max-h-[460px] w-full object-contain" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#e8e6e1] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {body && <div className="text-base leading-relaxed text-[#1c1917] whitespace-pre-line wrap-break-word">{body}</div>}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="ตัวอย่างการแสดงผลบนหน้าเว็บไซต์ (Realtime Preview)"
    >
      {/* Top Header Bar with Close Button on Top-Right */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <Eye className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
              ตัวอย่างการแสดงผลแบบ Realtime (Live Preview)
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                อัปเดตตามข้อมูลที่กรอกทันที
              </span>
            </h2>
            <p className="text-xs text-muted">ตรวจสอบหน้าตาข้อมูลก่อนกดบันทึกจริง</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="inline-flex rounded-lg bg-sand p-1" role="group" aria-label="เลือกภาษาตัวอย่าง">
            {(["th", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={clsx(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  locale === l ? "bg-white text-ink shadow-2xs" : "text-muted hover:text-ink",
                )}
              >
                {l === "th" ? "TH ภาษาไทย" : "EN English"}
              </button>
            ))}
          </div>

          {/* Device Width Switcher */}
          <div className="hidden sm:inline-flex rounded-lg bg-sand p-1" role="group" aria-label="ขนาดหน้าจอ">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={clsx(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                device === "desktop" ? "bg-white text-ink shadow-2xs" : "text-muted hover:text-ink",
              )}
            >
              <Laptop className="size-3.5" /> คอมพิวเตอร์
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={clsx(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                device === "mobile" ? "bg-white text-ink shadow-2xs" : "text-muted hover:text-ink",
              )}
            >
              <Smartphone className="size-3.5" /> มือถือ
            </button>
          </div>

          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink/85"
            aria-label="ปิดหน้าต่างตัวอย่าง"
          >
            <X className="size-4" />
            ปิดตัวอย่าง
          </button>
        </div>
      </div>

      {/* Scrollable Preview Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div
          className={clsx(
            "mx-auto transition-all duration-200",
            device === "mobile" ? "max-w-[400px]" : "max-w-5xl",
          )}
        >
          {resourceName === "brands"
            ? renderBrandPreview()
            : resourceName === "main-categories"
              ? renderMainCategoryPreview()
              : resourceName === "categories"
                ? renderCollectionPreview()
                : resourceName === "products"
                  ? renderProductPreview()
                  : renderGenericPreview()}
        </div>
      </div>
    </div>
  );
}
