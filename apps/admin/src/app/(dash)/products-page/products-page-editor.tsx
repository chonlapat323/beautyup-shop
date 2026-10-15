"use client";

import clsx from "clsx";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Laptop,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Smartphone,
  Sparkles,
  Trash2,
  Sliders,
} from "lucide-react";
import React, { useState, useTransition, useRef } from "react";

type L = { th?: string; en?: string };

export interface BannerSlide {
  imageUrl: string;
  title?: L;
  caption?: L;
  href?: string;
}

export interface OvalCard {
  imageUrl: string;
  title?: L;
  formula?: string;
  description?: L;
  href?: string;
}

export interface DynamicSection {
  layout: string;
  title?: L;
  description?: L;
  imageUrl?: string;
  buttonText?: L;
  buttonHref?: string;
  cards?: { title?: L; description?: L; imageUrl?: string; href?: string }[];
}

export interface ProductsPageConfig {
  showHero: boolean;
  heroEyebrow: L;
  heroHeadline: L;
  heroLead: L;

  showBannerSlides: boolean;
  slides: BannerSlide[];

  showOvalCarousel: boolean;
  ovalTitle: L;
  ovalDescription: L;
  ovalItems: OvalCard[];

  sections: DynamicSection[];
}

const DEFAULT_CONFIG: ProductsPageConfig = {
  showHero: true,
  heroEyebrow: { th: "Professional Salon Products", en: "Professional Salon Products" },
  heroHeadline: { th: "เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ", en: "Delivering the best for your clients" },
  heroLead: {
    th: "ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ",
    en: "Professional salon-grade products imported from Italy and Brazil, tailored for discerning salons and master stylists.",
  },
  showBannerSlides: true,
  slides: [
    {
      imageUrl: "/slides/4.jpg",
      title: { th: "Sweet Professional Hair Treatment", en: "Sweet Professional Hair Treatment" },
      caption: { th: "นวัตกรรมยืดผมระดับสากลจากบราซิล", en: "Global Hair Transformation from Brazil" },
      href: "/products/sweet-professional",
    },
    {
      imageUrl: "/slides/1.jpg",
      title: { th: "BeautyUp Official Salon Partner", en: "BeautyUp Official Salon Partner" },
      caption: { th: "ศูนย์รวมผลิตภัณฑ์ซาลอนมืออาชีพ", en: "Professional Salon & Beauty Products" },
      href: "/products",
    },
    {
      imageUrl: "/slides/3.jpg",
      title: { th: "Nook Eco-Conscious Beauty", en: "Nook Eco-Conscious Beauty" },
      caption: { th: "ผลิตภัณฑ์ดูแลเส้นผมธรรมชาติจากอิตาลี", en: "Nature-inspired salon care from Italy" },
      href: "/products/nook",
    },
  ],
  showOvalCarousel: true,
  ovalTitle: { th: "ผลิตภัณฑ์ซาลอนมืออาชีพ", en: "Professional Salon Products" },
  ovalDescription: { th: "แรงบันดาลใจและสูตรสีผมระดับซาลอนชั้นนำจากอิตาลีและระดับสากล", en: "Inspiration and hair formula by leading master salons" },
  ovalItems: [
    {
      imageUrl: "/cards/fanola-1.jpg",
      title: { th: "Balayage Ash Blonde", en: "Balayage Ash Blonde" },
      formula: "BLEACH & 3% (ORO 20G/20G)",
      description: { th: "No Yellow Care Protection", en: "No Yellow Care Protection" },
      href: "/products/fanola?category=no-yellow-care",
    },
    {
      imageUrl: "/slides/1.jpg",
      title: { th: "Pure Ice Blonde", en: "Pure Ice Blonde" },
      formula: "VIOLET BLEACH 9 TONES",
      description: { th: "Anti-Yellow Neutralizing", en: "Anti-Yellow Neutralizing" },
      href: "/products/fanola?category=no-yellow-care",
    },
    {
      imageUrl: "/cards/fanola-2.jpg",
      title: { th: "Cool Smokey Brunette", en: "Cool Smokey Brunette" },
      formula: "BLACK 3% + NO RED MASK",
      description: { th: "Cool Neutralizing Tone", en: "Cool Neutralizing Tone" },
      href: "/products/fanola?category=no-red",
    },
    {
      imageUrl: "/slides/3.jpg",
      title: { th: "Platinum Silver Balayage", en: "Platinum Silver Balayage" },
      formula: "BLEACH & 6% + SHAMPOO",
      description: { th: "Extra Violet Pigments", en: "Extra Violet Pigments" },
      href: "/products/fanola?category=no-yellow-care",
    },
    {
      imageUrl: "/cards/fanola-3.jpg",
      title: { th: "Warm Honey Caramel", en: "Warm Honey Caramel" },
      formula: "CHESTNUT BLEACH + 3%",
      description: { th: "Deep Conditioning Care", en: "Deep Conditioning Care" },
      href: "/products/fanola?category=nutri-care",
    },
    {
      imageUrl: "/cards/fanola-4.jpg",
      title: { th: "Warm Brown Copper", en: "Warm Brown Copper" },
      formula: "WARM BROWN + 3%",
      description: { th: "Color Keratin Protection", en: "Color Keratin Protection" },
      href: "/products/fanola?category=no-orange",
    },
    {
      imageUrl: "/slides/4.jpg",
      title: { th: "Luxury Gloss Waves", en: "Luxury Gloss Waves" },
      formula: "ORO THERAPY 24K",
      description: { th: "Argan Oil & Keratin Infusion", en: "Argan Oil & Keratin Infusion" },
      href: "/products/fanola?category=oro-therapy",
    },
  ],
  sections: [],
};

export function ProductsPageLiveEditor({
  initial,
  onSave,
  webUrl,
}: {
  initial?: Partial<ProductsPageConfig>;
  onSave: (config: ProductsPageConfig) => Promise<{ ok: boolean; message?: string }>;
  webUrl: string;
}) {
  const [data, setData] = useState<ProductsPageConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...initial,
    heroEyebrow: { ...DEFAULT_CONFIG.heroEyebrow, ...initial?.heroEyebrow },
    heroHeadline: { ...DEFAULT_CONFIG.heroHeadline, ...initial?.heroHeadline },
    heroLead: { ...DEFAULT_CONFIG.heroLead, ...initial?.heroLead },
    ovalTitle: { ...DEFAULT_CONFIG.ovalTitle, ...initial?.ovalTitle },
    ovalDescription: { ...DEFAULT_CONFIG.ovalDescription, ...initial?.ovalDescription },
    slides: initial?.slides && initial.slides.length > 0 ? initial.slides : DEFAULT_CONFIG.slides,
    ovalItems: initial?.ovalItems && initial.ovalItems.length > 0 ? initial.ovalItems : DEFAULT_CONFIG.ovalItems,
  }));

  const [activeTab, setActiveTab] = useState<"hero" | "banner" | "oval" | "sections">("hero");
  const [inputLang, setInputLang] = useState<"th" | "en">("th");
  const [previewLang, setPreviewLang] = useState<"th" | "en">("th");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [pending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Live preview active slide index for banner
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const handleSave = () => {
    setSaveStatus(null);
    startTransition(async () => {
      const res = await onSave(data);
      if (res.ok) {
        setSaveStatus("บันทึกข้อมูลเรียบร้อยแล้ว!");
        setTimeout(() => setSaveStatus(null), 3500);
      } else {
        setSaveStatus(res.message || "เกิดข้อผิดพลาดในการบันทึก");
      }
    });
  };

  const uploadFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const json = await res.json();
    return json.url || "";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-ink">จัดการหน้าสินค้าซาลอน (/th/products)</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <Sparkles className="size-3" /> Realtime Preview
            </span>
          </div>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            แก้ไขและดูตัวอย่างผลลัพธ์แบบ Live ทันทีทุกตัวอักษรโดยไม่ต้องสลับหน้าจอ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveStatus && (
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium animate-fade-in",
                saveStatus.includes("เรียบร้อย") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
              )}
            >
              <Check className="size-4" /> {saveStatus}
            </span>
          )}

          <a
            href={`${webUrl}/products`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary inline-flex items-center gap-1.5 !min-h-9 text-xs"
            title="เปิดหน้าเว็บจริง"
          >
            <ExternalLink className="size-3.5" /> เว็บจริง
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="btn btn-primary inline-flex items-center gap-2 !min-h-9 !px-4 text-xs font-semibold shadow-xs"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Editor (50%) & Right Realtime Preview (50%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Controls & Input Forms (6 cols)              */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-line bg-white rounded-t-xl px-2 pt-2 shadow-2xs">
            <nav className="flex space-x-1" aria-label="Tabs">
              {[
                { id: "hero", label: "1. ข้อความหัวเรื่อง (Hero)", count: undefined },
                { id: "banner", label: "2. สไลด์แบนเนอร์ (16:9)", count: data.slides.length },
                { id: "oval", label: "3. สไลด์ผมวงรี (Oval)", count: data.ovalItems.length },
                { id: "sections", label: "4. บล็อกเสริม (Sections)", count: data.sections.length },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={clsx(
                    "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors",
                    activeTab === t.id
                      ? "border-brand text-brand font-semibold"
                      : "border-transparent text-muted hover:border-line hover:text-ink",
                  )}
                >
                  <span>{t.label}</span>
                  {typeof t.count === "number" && (
                    <span
                      className={clsx(
                        "rounded-full px-1.5 py-0.2 text-[10px]",
                        activeTab === t.id ? "bg-brand text-white" : "bg-sand text-muted",
                      )}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Language Selector for Inputs */}
            <div className="flex items-center gap-1 rounded-lg bg-sand/70 p-1 mb-1.5">
              <button
                type="button"
                onClick={() => setInputLang("th")}
                className={clsx(
                  "rounded px-2 py-0.5 text-xs font-medium transition-all",
                  inputLang === "th" ? "bg-white text-brand shadow-2xs font-bold" : "text-muted hover:text-ink",
                )}
              >
                TH ไทย
              </button>
              <button
                type="button"
                onClick={() => setInputLang("en")}
                className={clsx(
                  "rounded px-2 py-0.5 text-xs font-medium transition-all",
                  inputLang === "en" ? "bg-white text-brand shadow-2xs font-bold" : "text-muted hover:text-ink",
                )}
              >
                EN English
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="rounded-b-xl border-x border-b border-line bg-white p-5 shadow-xs">
            {/* ---------------- 1. PAGE HERO TAB ---------------- */}
            {activeTab === "hero" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-ink">ข้อความหัวเรื่องบนสุด (Page Hero)</h2>
                    <p className="text-xs text-muted">ข้อความเปิดตัวบนสุดของหน้าสินค้าซาลอน</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={data.showHero}
                      onChange={(e) => setData({ ...data, showHero: e.target.checked })}
                      className="size-4 accent-brand rounded"
                    />
                    แสดงส่วนนี้บนหน้าเว็บ
                  </label>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      ข้อความหัวเรื่องเล็ก (Eyebrow) [{inputLang.toUpperCase()}]
                    </label>
                    <input
                      type="text"
                      className="input w-full text-sm"
                      placeholder="เช่น Professional Salon Products"
                      value={data.heroEyebrow[inputLang] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          heroEyebrow: { ...data.heroEyebrow, [inputLang]: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      ชื่อหัวเรื่องหลัก (Headline) [{inputLang.toUpperCase()}] <span className="text-brand">*</span>
                    </label>
                    <input
                      type="text"
                      className="input w-full text-sm font-medium"
                      placeholder="เช่น เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ"
                      value={data.heroHeadline[inputLang] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          heroHeadline: { ...data.heroHeadline, [inputLang]: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      คำบรรยายขยายความ (Lead / Description) [{inputLang.toUpperCase()}]
                    </label>
                    <textarea
                      rows={3}
                      className="input w-full text-sm leading-relaxed"
                      placeholder="เช่น ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ"
                      value={data.heroLead[inputLang] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          heroLead: { ...data.heroLead, [inputLang]: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 2. BANNER SLIDES TAB ---------------- */}
            {activeTab === "banner" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-ink">ภาพสไลด์แบนเนอร์ใหญ่ 16:9 (Banner Carousel)</h2>
                    <p className="text-xs text-muted">ภาพสไลด์แนวนอน 16:9 พร้อมเอฟเฟกต์แสงละอองสีชมพู</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={data.showBannerSlides}
                      onChange={(e) => setData({ ...data, showBannerSlides: e.target.checked })}
                      className="size-4 accent-brand rounded"
                    />
                    แสดงสไลด์บนหน้าเว็บ
                  </label>
                </div>

                <div className="space-y-3">
                  {data.slides.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-line bg-mist/40 p-3.5 space-y-3 transition-colors hover:border-brand/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-bold text-ink">
                          <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-[10px] text-brand">
                            {idx + 1}
                          </span>
                          {s.title?.[inputLang] || `ภาพสไลด์ที่ ${idx + 1}`}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const arr = [...data.slides];
                              [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                              setData({ ...data, slides: arr });
                            }}
                            className="p-1 rounded text-muted hover:text-ink disabled:opacity-30"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === data.slides.length - 1}
                            onClick={() => {
                              const arr = [...data.slides];
                              [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                              setData({ ...data, slides: arr });
                            }}
                            className="p-1 rounded text-muted hover:text-ink disabled:opacity-30"
                            title="เลื่อนลง"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setData({
                                ...data,
                                slides: data.slides.filter((_, i) => i !== idx),
                              })
                            }
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                            title="ลบสไลด์นี้"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Image Preview & Upload */}
                        <div className="sm:col-span-1">
                          <div className="relative aspect-[16/9] w-full rounded-lg border border-dashed border-line bg-white overflow-hidden grid place-items-center group">
                            {s.imageUrl ? (
                              <img src={s.imageUrl} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="text-center p-2 text-muted">
                                <ImagePlus className="size-5 mx-auto mb-1 opacity-60" />
                                <span className="text-[10px]">เลือกรูป 16:9</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  const url = await uploadFile(f);
                                  const arr = [...data.slides];
                                  arr[idx].imageUrl = url;
                                  setData({ ...data, slides: arr });
                                }
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="หรือวางลิงก์รูป..."
                            value={s.imageUrl}
                            onChange={(e) => {
                              const arr = [...data.slides];
                              arr[idx].imageUrl = e.target.value;
                              setData({ ...data, slides: arr });
                            }}
                            className="input w-full text-[11px] mt-1.5 py-1"
                          />
                        </div>

                        {/* Details */}
                        <div className="sm:col-span-2 space-y-2">
                          <input
                            type="text"
                            placeholder={`หัวข้อสไลด์ [${inputLang.toUpperCase()}]`}
                            value={s.title?.[inputLang] ?? ""}
                            onChange={(e) => {
                              const arr = [...data.slides];
                              arr[idx].title = { ...arr[idx].title, [inputLang]: e.target.value };
                              setData({ ...data, slides: arr });
                            }}
                            className="input w-full text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder={`คำบรรยายสไลด์ [${inputLang.toUpperCase()}]`}
                            value={s.caption?.[inputLang] ?? ""}
                            onChange={(e) => {
                              const arr = [...data.slides];
                              arr[idx].caption = { ...arr[idx].caption, [inputLang]: e.target.value };
                              setData({ ...data, slides: arr });
                            }}
                            className="input w-full text-xs"
                          />
                          <input
                            type="text"
                            placeholder="ลิงก์ปลายทาง (เช่น /products/sweet-professional)"
                            value={s.href ?? ""}
                            onChange={(e) => {
                              const arr = [...data.slides];
                              arr[idx].href = e.target.value;
                              setData({ ...data, slides: arr });
                            }}
                            className="input w-full text-xs font-mono text-muted"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        slides: [
                          ...data.slides,
                          {
                            imageUrl: "/slides/1.jpg",
                            title: { th: "สไลด์โปรโมชันใหม่", en: "New Promotion" },
                            caption: { th: "คำบรรยายสไลด์", en: "Slide description" },
                            href: "/products",
                          },
                        ],
                      })
                    }
                    className="btn btn-secondary w-full !min-h-9 text-xs font-medium flex items-center justify-center gap-1.5 border-dashed"
                  >
                    <Plus className="size-4" /> เพิ่มภาพสไลด์แบนเนอร์ใหม่
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- 3. OVAL CAROUSEL TAB ---------------- */}
            {activeTab === "oval" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-ink">สไลด์ทรงผมซาลอนวงรี (Oval Hair Carousel)</h2>
                    <p className="text-xs text-muted">การ์ดแคปซูลวงรีสไตล์ช่างผมซาลอน พื้นหลังสีดำหรูหรา</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={data.showOvalCarousel}
                      onChange={(e) => setData({ ...data, showOvalCarousel: e.target.checked })}
                      className="size-4 accent-brand rounded"
                    />
                    แสดงบนหน้าเว็บ
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-line">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      หัวข้อสไลด์ (สีทอง) [{inputLang.toUpperCase()}]
                    </label>
                    <input
                      type="text"
                      value={data.ovalTitle[inputLang] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          ovalTitle: { ...data.ovalTitle, [inputLang]: e.target.value },
                        })
                      }
                      placeholder="เช่น ผลิตภัณฑ์ซาลอนมืออาชีพ"
                      className="input w-full text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      คำอธิบายใต้หัวข้อ [{inputLang.toUpperCase()}]
                    </label>
                    <input
                      type="text"
                      value={data.ovalDescription[inputLang] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          ovalDescription: { ...data.ovalDescription, [inputLang]: e.target.value },
                        })
                      }
                      placeholder="เช่น แรงบันดาลใจและสูตรสีผมระดับซาลอนชั้นนำ..."
                      className="input w-full text-xs"
                    />
                  </div>
                </div>

                {/* Oval Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted">
                      รายการแคปซูลทรงผม ({data.ovalItems.length} รายการ)
                    </span>
                  </div>

                  {data.ovalItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-line bg-mist/40 p-3 space-y-2.5 transition-colors hover:border-brand/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-bold text-ink">
                          <span className="grid size-5 place-items-center rounded-full bg-amber-100 text-[10px] text-amber-800">
                            {idx + 1}
                          </span>
                          {item.title?.[inputLang] || `แคปซูลทรงผมที่ ${idx + 1}`}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const arr = [...data.ovalItems];
                              [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                              setData({ ...data, ovalItems: arr });
                            }}
                            className="p-1 rounded text-muted hover:text-ink disabled:opacity-30"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === data.ovalItems.length - 1}
                            onClick={() => {
                              const arr = [...data.ovalItems];
                              [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                              setData({ ...data, ovalItems: arr });
                            }}
                            className="p-1 rounded text-muted hover:text-ink disabled:opacity-30"
                            title="เลื่อนลง"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setData({
                                ...data,
                                ovalItems: data.ovalItems.filter((_, i) => i !== idx),
                              })
                            }
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                            title="ลบแคปซูลนี้"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-start">
                        {/* Vertical Image */}
                        <div className="sm:col-span-1">
                          <div className="relative aspect-[1/1.5] w-20 sm:w-full mx-auto rounded-[9999px] border border-dashed border-amber-400/60 bg-black/90 overflow-hidden grid place-items-center group">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="text-center p-1 text-amber-200/80">
                                <ImagePlus className="size-4 mx-auto mb-0.5" />
                                <span className="text-[9px] block">รูปแนวตั้ง</span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  const url = await uploadFile(f);
                                  const arr = [...data.ovalItems];
                                  arr[idx].imageUrl = url;
                                  setData({ ...data, ovalItems: arr });
                                }
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="ลิงก์รูปภาพ..."
                            value={item.imageUrl}
                            onChange={(e) => {
                              const arr = [...data.ovalItems];
                              arr[idx].imageUrl = e.target.value;
                              setData({ ...data, ovalItems: arr });
                            }}
                            className="input w-full text-[10px] mt-1 py-0.5 text-center"
                          />
                        </div>

                        {/* Details */}
                        <div className="sm:col-span-3 space-y-2">
                          <input
                            type="text"
                            placeholder={`ชื่อทรงผม / ผลงาน [${inputLang.toUpperCase()}] (เช่น Balayage Blonde)`}
                            value={item.title?.[inputLang] ?? ""}
                            onChange={(e) => {
                              const arr = [...data.ovalItems];
                              arr[idx].title = { ...arr[idx].title, [inputLang]: e.target.value };
                              setData({ ...data, ovalItems: arr });
                            }}
                            className="input w-full text-xs font-semibold"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="สูตรสี / Formula Badge (เช่น BLEACH & 3% (ORO 20G/20G))"
                              value={item.formula ?? ""}
                              onChange={(e) => {
                                const arr = [...data.ovalItems];
                                arr[idx].formula = e.target.value;
                                setData({ ...data, ovalItems: arr });
                              }}
                              className="input flex-1 text-xs font-mono text-amber-700 bg-amber-50/50 border-amber-200"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder={`คำบรรยายสั้น [${inputLang.toUpperCase()}]`}
                            value={item.description?.[inputLang] ?? ""}
                            onChange={(e) => {
                              const arr = [...data.ovalItems];
                              arr[idx].description = { ...arr[idx].description, [inputLang]: e.target.value };
                              setData({ ...data, ovalItems: arr });
                            }}
                            className="input w-full text-xs"
                          />
                          <input
                            type="text"
                            placeholder="ลิงก์ปลายทาง (เช่น /products/fanola?category=no-yellow)"
                            value={item.href ?? ""}
                            onChange={(e) => {
                              const arr = [...data.ovalItems];
                              arr[idx].href = e.target.value;
                              setData({ ...data, ovalItems: arr });
                            }}
                            className="input w-full text-xs font-mono text-muted"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        ovalItems: [
                          ...data.ovalItems,
                          {
                            imageUrl: "/cards/fanola-1.jpg",
                            title: { th: "ทรงผมใหม่", en: "New Style" },
                            formula: "NEW FORMULA + 3%",
                            description: { th: "คำบรรยายผลงาน", en: "Hair formula care" },
                            href: "/products",
                          },
                        ],
                      })
                    }
                    className="btn btn-secondary w-full !min-h-9 text-xs font-medium flex items-center justify-center gap-1.5 border-dashed"
                  >
                    <Plus className="size-4" /> เพิ่มแคปซูลทรงผมใหม่
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- 4. DYNAMIC SECTIONS TAB ---------------- */}
            {activeTab === "sections" && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3">
                  <h2 className="text-sm font-bold text-ink">บล็อกเนื้อหา Dynamic (Content Blocks)</h2>
                  <p className="text-xs text-muted">
                    เพิ่มบล็อกเนื้อหาหรือคอมโพเนนต์พิเศษอื่นๆ ลงในหน้า /th/products ได้ตามต้องการ
                  </p>
                </div>

                {data.sections.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line p-8 text-center bg-mist/30">
                    <Layers className="size-8 mx-auto text-muted/60 mb-2" />
                    <p className="text-xs text-muted">ยังไม่มีบล็อกเนื้อหาเสริมในหน้านี้</p>
                    <p className="text-[11px] text-muted/80 mt-1">
                      สามารถกดปุ่มด้านล่างเพื่อเพิ่มการ์ด 4 คอลัมน์, กล่องข้อความซ้ายขวา ฯลฯ ได้ทันที
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.sections.map((sec, idx) => (
                      <div key={idx} className="rounded-xl border border-line bg-mist/40 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">
                            บล็อกที่ {idx + 1}: {sec.title?.[inputLang] || sec.layout}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setData({
                                ...data,
                                sections: data.sections.filter((_, i) => i !== idx),
                              })
                            }
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="หัวข้อบล็อก..."
                          value={sec.title?.[inputLang] ?? ""}
                          onChange={(e) => {
                            const arr = [...data.sections];
                            arr[idx].title = { ...arr[idx].title, [inputLang]: e.target.value };
                            setData({ ...data, sections: arr });
                          }}
                          className="input w-full text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      sections: [
                        ...data.sections,
                        {
                          layout: "columns",
                          title: { th: "จุดเด่นผลิตภัณฑ์", en: "Product Highlights" },
                          description: { th: "มาตรฐานระดับสากล", en: "World-class Standard" },
                        },
                      ],
                    })
                  }
                  className="btn btn-secondary w-full !min-h-9 text-xs font-medium flex items-center justify-center gap-1.5 border-dashed"
                >
                  <Plus className="size-4" /> เพิ่มบล็อกเนื้อหาใหม่
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Realtime Live Preview (6 cols)              */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="rounded-2xl border border-line bg-white shadow-md overflow-hidden">
            {/* Browser Window Header Mock */}
            <div className="flex items-center justify-between border-b border-line bg-sand/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="rounded-md bg-white border border-line px-2.5 py-0.5 text-[11px] font-mono text-muted flex items-center gap-1.5">
                  <span>🔒 new.beautyup-enterprise.com/{previewLang}/products</span>
                </div>
              </div>

              {/* Preview Controls */}
              <div className="flex items-center gap-2">
                {/* Language Toggle for Preview */}
                <div className="flex rounded-md bg-white border border-line p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewLang("th")}
                    className={clsx(
                      "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                      previewLang === "th" ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
                  >
                    🇹🇭 TH
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang("en")}
                    className={clsx(
                      "px-2 py-0.5 rounded text-[11px] font-medium transition-colors",
                      previewLang === "en" ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
                  >
                    🇬🇧 EN
                  </button>
                </div>

                {/* Device Viewport Toggle */}
                <div className="flex rounded-md bg-white border border-line p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDevice("desktop")}
                    className={clsx(
                      "p-1 rounded text-[11px] transition-colors",
                      device === "desktop" ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
                    title="Desktop View"
                  >
                    <Laptop className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevice("mobile")}
                    className={clsx(
                      "p-1 rounded text-[11px] transition-colors",
                      device === "mobile" ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
                    title="Mobile View"
                  >
                    <Smartphone className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Render Area */}
            <div
              className={clsx(
                "max-h-[750px] overflow-y-auto bg-white transition-all duration-300 mx-auto [scrollbar-width:thin]",
                device === "mobile" ? "max-w-[390px] border-x border-line shadow-inner" : "w-full",
              )}
            >
              {/* 1. Realtime PageHero */}
              {data.showHero ? (
                <div className="px-6 py-10 border-b border-line/60 bg-gradient-to-b from-mist/40 via-white to-sand/20">
                  <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">
                      {data.heroEyebrow[previewLang] || "PROFESSIONAL SALON PRODUCTS"}
                    </p>
                    <h1 className="mt-2 font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                      {data.heroHeadline[previewLang] || "เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ"}
                    </h1>
                    <p className="mt-3 text-sm text-muted leading-relaxed">
                      {data.heroLead[previewLang] ||
                        "ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-mist/60 text-center text-xs text-muted border-b border-line italic">
                  [ซ่อนส่วนข้อความหัวเรื่อง PageHero]
                </div>
              )}

              {/* 2. Realtime Banner Slide Carousel */}
              {data.showBannerSlides && data.slides.length > 0 && (
                <div className="relative border-b border-line/60 bg-gradient-to-b from-sand/20 via-white to-sand/10 py-6 px-4 overflow-hidden">
                  {/* Slide Container */}
                  <div className="relative mx-auto aspect-[16/9] max-w-xl rounded-2xl overflow-hidden shadow-lg border border-line bg-black">
                    {data.slides.map((slide, sIdx) => (
                      <div
                        key={sIdx}
                        className={clsx(
                          "absolute inset-0 size-full transition-opacity duration-500",
                          sIdx === activeBannerIdx ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0",
                        )}
                      >
                        <img src={slide.imageUrl} alt="" className="size-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                          <h3 className="font-display text-lg sm:text-xl font-bold">
                            {slide.title?.[previewLang] || "Sweet Professional Hair Treatment"}
                          </h3>
                          <p className="text-xs text-white/80 mt-1 line-clamp-1">
                            {slide.caption?.[previewLang] || "นวัตกรรมยืดผมระดับสากลจากบราซิล"}
                          </p>
                          <div className="mt-2.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium backdrop-blur">
                              ดูเพิ่มเติม →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBannerIdx((prev) => (prev > 0 ? prev - 1 : data.slides.length - 1))
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBannerIdx((prev) => (prev < data.slides.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <ChevronRight className="size-4" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                      {data.slides.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setActiveBannerIdx(dotIdx)}
                          className={clsx(
                            "h-1.5 rounded-full transition-all",
                            dotIdx === activeBannerIdx ? "w-5 bg-brand" : "w-1.5 bg-white/60",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Realtime Oval Hair Showcase Carousel */}
              {data.showOvalCarousel && (
                <div className="bg-black text-white py-10 px-4 overflow-hidden border-b border-neutral-900">
                  <div className="text-center max-w-xl mx-auto mb-7">
                    <h2 className="font-serif text-2xl sm:text-3xl text-amber-400 font-bold tracking-tight">
                      {data.ovalTitle[previewLang] || "ผลิตภัณฑ์ซาลอนมืออาชีพ"}
                    </h2>
                    {data.ovalDescription[previewLang] && (
                      <p className="mt-1 text-xs text-neutral-400">
                        {data.ovalDescription[previewLang]}
                      </p>
                    )}
                  </div>

                  {/* Horizontal Oval Carousel Row */}
                  <div className="flex gap-3 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar [scrollbar-width:none]">
                    {data.ovalItems.map((item, oIdx) => (
                      <div
                        key={oIdx}
                        className="group relative shrink-0 w-32 sm:w-36 aspect-[1/1.55] rounded-[9999px] border border-neutral-800 bg-neutral-950 overflow-hidden shadow-md transition-all hover:scale-102 hover:border-amber-400/80"
                      >
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end items-center text-center p-3">
                          {item.formula && (
                            <span className="mb-1 rounded-full border border-amber-400/50 bg-black/85 px-1.5 py-0.5 font-mono text-[8px] font-bold text-amber-300 tracking-tight">
                              {item.formula}
                            </span>
                          )}
                          <h4 className="font-display text-xs font-bold text-white line-clamp-1">
                            {item.title?.[previewLang] || "Hair Style"}
                          </h4>
                          {item.description?.[previewLang] && (
                            <p className="text-[9px] text-neutral-400 line-clamp-1 mt-0.5">
                              {item.description[previewLang]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Brands Showcase Mockup */}
              <div className="p-6 space-y-6">
                <div className="text-center mb-4">
                  <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">SALON BRANDS</p>
                  <h3 className="text-lg font-bold text-ink">แบรนด์ระดับมืออาชีพนำเข้า</h3>
                </div>

                {/* Fanola Mock Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 rounded-xl border border-line bg-mist/20">
                  <div className="aspect-[4/3] rounded-lg bg-sand/60 grid place-items-center text-muted text-xs">
                    โลโก้ Fanola
                  </div>
                  <div>
                    <span className="text-[10px] text-muted">นำเข้าจากอิตาลี</span>
                    <h4 className="text-base font-bold text-ink">ฟาโนลา (Fanola)</h4>
                    <p className="text-xs text-muted mt-1">ผลิตภัณฑ์นำเข้าจากอิตาลีสำหรับร้านเสริมสวยและช่างผมมืออาชีพ</p>
                    <div className="mt-2 flex gap-1">
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[9px] text-brand">Vegan</span>
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[9px] text-brand">No Yellow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
