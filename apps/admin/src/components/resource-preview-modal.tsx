"use client";

import clsx from "clsx";
import { ExternalLink, Eye, FileText, Globe, Laptop, Smartphone, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
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

export function ResourcePreviewModal({
  open,
  onClose,
  resourceName,
  values,
  initialLocale = "th",
}: {
  open: boolean;
  onClose: () => void;
  resourceName?: string;
  values: Record<string, unknown>;
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

  const renderBrandPreview = () => {
    const name = String(values.name ?? "").trim() || "Brand Name";
    const localName = pick(values.localName, locale) || name;
    const country = pick(values.country, locale);
    const importedLabel = country ? (th ? `นำเข้าจาก${country}` : `Imported from ${country}`) : "";
    const tagline = pick(values.tagline, locale);
    const description = pick(values.description, locale) || (th ? "ยังไม่ได้กรอกคำอธิบายแบรนด์..." : "No brand description yet...");
    const logoUrl = resolveImg(values.logoUrl);
    const website = String(values.website ?? "").trim();
    const catalogUrl = String(values.catalogUrl ?? "").trim();
    const brandType = String(values.type ?? "SALON");
    const highlightsRaw = Array.isArray(values.highlights) ? values.highlights : [];
    const highlights = highlightsRaw.map((h) => pick(h, locale)).filter(Boolean);
    const socials = (values.socials as Record<string, string> | undefined) ?? {};
    const activeSocials = Object.entries(socials).filter(([, v]) => v && v.trim());

    return (
      <div className="space-y-10">
        {/* Section 1: หน้าแบรนด์เต็ม (/products/[brand]) */}
        {brandType === "SALON" && (
          <div className="overflow-hidden rounded-3xl border border-line bg-[#FAF7F5] shadow-sm">
            <div className="border-b border-line bg-white/80 px-5 py-2.5 flex items-center justify-between text-xs text-muted">
              <span className="font-semibold text-ink">1. ตัวอย่างส่วนหัวหน้าแบรนด์ (/products/{String(values.slug || "brand-slug")})</span>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-brand">หน้าแบรนด์ (Brand Hero)</span>
            </div>
            <div className="px-6 py-12 md:px-14 md:py-16">
              {importedLabel ? (
                <p className="text-xs font-semibold tracking-widest text-brand uppercase">{importedLabel}</p>
              ) : (
                <p className="text-xs italic text-muted/60">(ไม่ได้ระบุประเทศ — ไม่แสดงข้อความนำเข้าจาก...)</p>
              )}
              <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                {localName} <span className="font-normal text-muted">{name}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg whitespace-pre-line">{description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {website && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-medium text-ink">
                    <Globe className="size-4" />
                    {th ? "เว็บไซต์แบรนด์" : "Brand Website"}
                  </span>
                )}
                {catalogUrl && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-2.5 text-sm font-medium text-ink">
                    <FileText className="size-4" />
                    {th ? "ดาวน์โหลดแคตตาล็อก" : "Catalog PDF"}
                  </span>
                )}
                {activeSocials.map(([k]) => (
                  <span key={k} className="inline-flex items-center rounded-full bg-white border border-line px-3 py-1.5 text-xs font-medium uppercase text-muted">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: หน้ารวมแบรนด์ (/products) */}
        {brandType === "SALON" && (
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <div className="border-b border-line bg-mist/60 px-5 py-2.5 flex items-center justify-between text-xs text-muted">
              <span className="font-semibold text-ink">2. ตัวอย่างในหน้ารวมแบรนด์ (/products)</span>
              <span className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-medium text-ink">แถวแสดงรายละเอียดแบรนด์</span>
            </div>
            <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-12">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-line/60 bg-[#FAF7F5] p-8">
                {logoUrl ? (
                  <img src={logoUrl} alt={name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-sm text-muted">ยังไม่ได้อัปโหลดโลโก้แบรนด์</span>
                )}
              </div>
              <div>
                {importedLabel && <p className="text-xs font-semibold tracking-widest text-brand uppercase">{importedLabel}</p>}
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
                  {localName}
                  <span className="mt-1 block text-xl font-normal text-muted sm:text-2xl">{name}</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted whitespace-pre-line">{description}</p>
                {highlights.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {highlights.map((h, i) => (
                      <li key={i} className="rounded-full bg-brand-soft px-3.5 py-1 text-xs font-medium text-brand">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {tagline && <p className="mt-5 font-serif text-lg italic text-ink">“{tagline}”</p>}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">
                    {th ? "ดูผลิตภัณฑ์" : "View Products"}
                  </span>
                  {catalogUrl && (
                    <span className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink">
                      {th ? "แคตตาล็อก" : "Catalog"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: การ์ดแบรนด์บนหน้าแรก (/) */}
        <div className="overflow-hidden rounded-3xl border border-line bg-[#FAF7F5] shadow-sm">
          <div className="border-b border-line bg-white/80 px-5 py-2.5 flex items-center justify-between text-xs text-muted">
            <span className="font-semibold text-ink">
              3. ตัวอย่างการ์ดแบรนด์บนหน้าแรก (/) — {brandType === "SALON" ? "แบรนด์ซาลอน" : "เคาน์เตอร์แบรนด์"}
            </span>
            <span className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-medium text-ink">Brand Card (1 ใน 3 คอลัมน์)</span>
          </div>
          <div className="p-6 md:p-10">
            <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-line bg-white shadow-xs">
              <div className="flex aspect-[16/10] items-center justify-center bg-white p-6 border-b border-line/40">
                {logoUrl ? (
                  <img src={logoUrl} alt={name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-muted">ยังไม่มีโลโก้</span>
                )}
              </div>
              <div className="p-6">
                {importedLabel && <p className="text-xs tracking-wide text-muted uppercase">{importedLabel}</p>}
                <p className="mt-1.5 font-serif text-2xl font-semibold text-ink">
                  {localName} <span className="font-normal text-muted">({name})</span>
                </p>
                <p className="mt-2.5 line-clamp-3 text-sm text-muted">{description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                  {brandType === "COUNTER" && website
                    ? th
                      ? "เยี่ยมชมเว็บไซต์ →"
                      : "Visit Website →"
                    : th
                      ? "ดูผลิตภัณฑ์ →"
                      : "View Products →"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductPreview = () => {
    const name = pick(values.name, locale) || (th ? "ชื่อสินค้า" : "Product Name");
    const size = String(values.size ?? "").trim();
    const description = pick(values.description, locale);
    const howToUse = pick(values.howToUse, locale);
    const price = Number(values.price ?? 0);
    const salePrice = values.salePrice != null && values.salePrice !== "" ? Number(values.salePrice) : null;
    const images = resolveImgs(values.images, values.imageUrl);
    const currentImg = images[activeImgIdx] || images[0] || "";
    const badges = Array.isArray(values.badges) ? values.badges.map(String).filter(Boolean) : [];
    const tags = Array.isArray(values.tags) ? values.tags.map(String).filter(Boolean) : [];

    return (
      <div className="overflow-hidden rounded-3xl border border-line bg-white p-6 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-[#FAF7F5] flex items-center justify-center">
              {currentImg ? (
                <img src={currentImg} alt={name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-muted">ยังไม่มีรูปสินค้า</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={clsx(
                      "size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                      idx === activeImgIdx ? "border-brand shadow-xs" : "border-line opacity-70 hover:opacity-100",
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            {badges.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {badges.map((b, i) => (
                  <span key={i} className="rounded-full bg-brand-soft px-3 py-0.5 text-xs font-semibold text-brand">
                    {b}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{name}</h1>
            {size && <p className="mt-2 text-sm text-muted">{size}</p>}
            <div className="mt-5 flex items-baseline gap-3">
              {salePrice != null ? (
                <>
                  <span className="text-3xl font-semibold text-brand">฿{salePrice.toLocaleString("th-TH")}</span>
                  <span className="text-lg text-muted line-through">฿{price.toLocaleString("th-TH")}</span>
                </>
              ) : (
                <span className="text-3xl font-semibold text-ink">฿{price.toLocaleString("th-TH")}</span>
              )}
            </div>
            {description && <p className="mt-6 text-base leading-relaxed text-ink/85 whitespace-pre-line">{description}</p>}
            {howToUse && (
              <div className="mt-6 rounded-2xl bg-[#FAF7F5] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{th ? "วิธีใช้" : "How to use"}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80 whitespace-pre-line">{howToUse}</p>
              </div>
            )}
            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {tags.map((t, i) => (
                  <span key={i} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGenericPreview = () => {
    const title =
      pick(values.title, locale) ||
      pick(values.name, locale) ||
      String(values.name ?? values.title ?? "ตัวอย่างข้อมูล");
    const subtitle = pick(values.subtitle, locale) || pick(values.excerpt, locale) || pick(values.role, locale);
    const body = pick(values.body, locale) || pick(values.description, locale) || pick(values.content, locale);
    const images = resolveImgs(values.images, values.imageUrl ?? values.coverUrl ?? values.logoUrl ?? values.photoUrl);

    return (
      <div className="overflow-hidden rounded-3xl border border-line bg-white p-6 md:p-12 shadow-sm space-y-6">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="text-lg text-muted whitespace-pre-line">{subtitle}</p>}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-3xl border border-line bg-[#FAF7F5] max-h-[460px] flex items-center justify-center">
              <img src={images[0]} alt={title} className="max-h-[460px] w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-[#FAF7F5]">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {body && <div className="text-base leading-relaxed text-ink/85 whitespace-pre-line">{body}</div>}
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
            : resourceName === "products"
              ? renderProductPreview()
              : renderGenericPreview()}
        </div>
      </div>
    </div>
  );
}
