"use client";

import clsx from "clsx";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Laptop,
  Layers,
  Loader2,
  Plus,
  Save,
  Smartphone,
  Sparkles,
  Trash2,
  Package,
  MenuSquare,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import type { Option } from "@/lib/fields";

type L = { th?: string; en?: string };

export interface MenuVisualSlide {
  imageUrl: string;
  title?: L;
  caption?: L;
  href?: string;
}

export interface MenuVisualCard {
  title?: L;
  description?: L;
  imageUrl?: string;
  href?: string;
}

export interface MenuVisualSection {
  layout: "columns" | "left-image" | "right-image" | "text-only" | "oval-carousel";
  title?: L;
  description?: L;
  imageUrl?: string;
  buttonText?: L;
  buttonHref?: string;
  cards?: MenuVisualCard[];
}

export interface MenuItemData {
  id?: string;
  label?: L;
  href?: string;
  location?: string;
  parentId?: string | null;
  brandId?: string | null;
  brandSlug?: string;
  showProducts?: boolean;
  slides?: MenuVisualSlide[];
  sections?: MenuVisualSection[];
  heroHeadline?: L;
  heroEyebrow?: L;
  heroLead?: L;
  isActive?: boolean;
  sortOrder?: number;
}

export function MenuItemVisualEditor({
  id,
  title = "แก้ไขหน้าเว็บและเมนู",
  initial = {},
  relations = {},
  onSave,
  onDelete,
  redirectTo = "/r/menu-items",
}: {
  id?: string;
  title?: string;
  initial?: Record<string, unknown>;
  relations?: Record<string, Option[]>;
  onSave: (payload: Record<string, unknown>) => Promise<{ ok: boolean; message?: string; errors?: any }>;
  onDelete?: () => Promise<any>;
  redirectTo?: string;
}) {
  const router = useRouter();

  const [data, setData] = useState<MenuItemData>(() => ({
    label: (initial.label as L) || { th: "", en: "" },
    href: (initial.href as string) || "/new-page",
    location: (initial.location as string) || "header",
    parentId: (initial.parentId as string) || null,
    brandId: (initial.brandId as string) || null,
    showProducts: (initial.showProducts as boolean) ?? true,
    slides: (initial.slides as MenuVisualSlide[]) || [],
    sections: (initial.sections as MenuVisualSection[]) || [],
    heroHeadline: (initial.heroHeadline as L) || undefined,
    heroEyebrow: (initial.heroEyebrow as L) || undefined,
    heroLead: (initial.heroLead as L) || undefined,
    isActive: (initial.isActive as boolean) ?? true,
    sortOrder: (initial.sortOrder as number) ?? 0,
  }));

  const [activeTab, setActiveTab] = useState<"general" | "slides" | "sections">("general");
  const [inputLang, setInputLang] = useState<"th" | "en">("th");
  const [previewLang, setPreviewLang] = useState<"th" | "en">("th");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [pending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Active slide index for preview
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const brandOptions = relations.brandId || [];
  const parentOptions = relations.parentId || [];
  const selectedBrand = brandOptions.find((b) => b.value === data.brandId);

  const uploadFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const json = await res.json();
    return json.url || "";
  };

  const handleSave = () => {
    setSaveStatus(null);
    startTransition(async () => {
      const res = await onSave(data as Record<string, unknown>);
      if (res.ok) {
        setSaveStatus("บันทึกข้อมูลเรียบร้อยแล้ว!");
        setTimeout(() => setSaveStatus(null), 3000);
        router.refresh();
      } else {
        setSaveStatus(res.message || "เกิดข้อผิดพลาดในการบันทึก");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/r/menu-items"
            className="grid size-9 place-items-center rounded-xl border border-line bg-sand/40 text-muted transition-colors hover:bg-sand hover:text-ink"
            title="กลับไปรายการเมนู"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-ink">
                {data.label?.[inputLang] ? `${data.label[inputLang]} (${data.href})` : title}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <Sparkles className="size-3" /> Visual Builder
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              สร้างหรือแก้ไขเนื้อหาหน้าเว็บด้วย Component สวยๆ พร้อมจอ Realtime Preview ด้านขวา
            </p>
          </div>
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

          {data.href && (
            <a
              href={`https://new.beautyup-enterprise.com${data.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary inline-flex items-center gap-1.5 !min-h-9 text-xs"
              title="เปิดหน้าเว็บจริง"
            >
              <ExternalLink className="size-3.5" /> เว็บจริง
            </a>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="btn btn-primary inline-flex items-center gap-2 !min-h-9 !px-4 text-xs font-semibold shadow-xs"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            บันทึกเมนูนี้
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Editor (50%) & Right Realtime Preview (50%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Visual Builder Form (6 cols)                 */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-line bg-white rounded-t-xl px-2 pt-2 shadow-2xs">
            <nav className="flex space-x-1" aria-label="Tabs">
              {[
                { id: "general", label: "ข้อมูลเมนู & แบรนด์", count: undefined },
                { id: "slides", label: "ภาพสไลด์แบนเนอร์", count: data.slides?.length },
                { id: "sections", label: "บล็อกเนื้อหา (Component)", count: data.sections?.length },
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
            {/* ---------------- 1. GENERAL TAB ---------------- */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3">
                  <h2 className="text-sm font-bold text-ink">ข้อมูลเมนูและเส้นทาง (Routing)</h2>
                  <p className="text-xs text-muted">กำหนดชื่อเมนู ลิงก์ปลายทาง และการผูกสินค้าของแบรนด์</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      ชื่อเมนู [{inputLang.toUpperCase()}] <span className="text-brand">*</span>
                    </label>
                    <input
                      type="text"
                      className="input w-full text-sm font-medium"
                      placeholder="เช่น ผลิตภัณฑ์ผม หรือ Fanola"
                      value={data.label?.[inputLang] ?? ""}
                      onChange={(e) =>
                        setData({
                          ...data,
                          label: { ...data.label, [inputLang]: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      ลิงก์ (URL Path) <span className="text-brand">*</span>
                    </label>
                    <input
                      type="text"
                      className="input w-full text-sm font-mono text-muted"
                      placeholder="เช่น /products หรือ /fanola"
                      value={data.href ?? ""}
                      onChange={(e) => setData({ ...data, href: e.target.value })}
                    />
                    <p className="mt-1 text-[11px] text-muted">เช่น /products หรือ /products/fanola</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">ตำแหน่งในเว็บไซต์</label>
                      <select
                        className="input w-full text-xs"
                        value={data.location ?? "header"}
                        onChange={(e) => setData({ ...data, location: e.target.value })}
                      >
                        <option value="header">ส่วนหัว (Header Menu)</option>
                        <option value="footer">ท้ายเว็บ (Footer Menu)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">อยู่ใต้เมนูหลัก (Submenu)</label>
                      <select
                        className="input w-full text-xs"
                        value={data.parentId ?? ""}
                        onChange={(e) => setData({ ...data, parentId: e.target.value || null })}
                      >
                        <option value="">— เป็นเมนูหลัก (Main Menu) —</option>
                        {parentOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Brand Attachment Component */}
                  <div className="rounded-xl border border-line bg-mist/30 p-3.5 space-y-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Package className="size-4 text-brand" />
                      <h3 className="text-xs font-bold text-ink">ดึงสินค้าของแบรนด์มาแสดงในหน้านี้อัตโนมัติ</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">เลือกแบรนด์ที่ต้องการแสดง</label>
                      <select
                        className="input w-full text-xs font-medium"
                        value={data.brandId ?? ""}
                        onChange={(e) => setData({ ...data, brandId: e.target.value || null })}
                      >
                        <option value="">— ไม่ระบุ (ไม่ดึงสินค้าแบรนด์) —</option>
                        {brandOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {data.brandId && (
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink pt-1">
                        <input
                          type="checkbox"
                          checked={data.showProducts}
                          onChange={(e) => setData({ ...data, showProducts: e.target.checked })}
                          className="size-4 accent-brand rounded"
                        />
                        เปิดแสดงกล่องสินค้า (Product Grid Showcase) ที่ด้านล่างของหน้า
                      </label>
                    )}
                  </div>

                  {/* Page Hero Header Inputs */}
                  <div className="rounded-xl border border-line bg-mist/30 p-3.5 space-y-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-brand" />
                      <div>
                        <h3 className="text-xs font-bold text-ink">หัวเรื่องบนหน้าเว็บ (Page Hero & Header)</h3>
                        <p className="text-[11px] text-muted">กำหนดคำโปรย หัวเรื่องใหญ่ และคำบรรยายด้านบนสุดของหน้า</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1">
                        คำโปรยด้านบน (Eyebrow) [{inputLang.toUpperCase()}]
                      </label>
                      <input
                        type="text"
                        className="input w-full text-xs font-medium"
                        placeholder="เช่น Professional Salon Products หรือ Beauty Up"
                        value={data.heroEyebrow?.[inputLang] ?? ""}
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
                        หัวเรื่องใหญ่ (Hero Headline) [{inputLang.toUpperCase()}]
                      </label>
                      <input
                        type="text"
                        className="input w-full text-xs font-bold"
                        placeholder="เช่น เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ"
                        value={data.heroHeadline?.[inputLang] ?? ""}
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
                        คำบรรยายใต้หัวเรื่อง (Hero Description) [{inputLang.toUpperCase()}]
                      </label>
                      <textarea
                        rows={2}
                        className="input w-full text-xs"
                        placeholder="เช่น ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ"
                        value={data.heroLead?.[inputLang] ?? ""}
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
              </div>
            )}

            {/* ---------------- 2. SLIDES TAB ---------------- */}
            {activeTab === "slides" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-ink">ภาพสไลด์แบนเนอร์ใหญ่ประจำเมนู (16:9)</h2>
                    <p className="text-xs text-muted">แบนเนอร์สไลด์เลื่อนอัตโนมัติ พร้อมเอฟเฟกต์ละอองแสงสีชมพู</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(!data.slides || data.slides.length === 0) ? (
                    <div className="rounded-xl border border-dashed border-line p-8 text-center bg-mist/30">
                      <ImagePlus className="size-8 mx-auto text-muted/60 mb-2" />
                      <p className="text-xs text-muted">ยังไม่ได้ใส่ภาพสไลด์แบนเนอร์ในเมนูนี้</p>
                      <p className="text-[11px] text-muted/80 mt-1">กดปุ่มด้านล่างเพื่อเพิ่มภาพสไลด์แบนเนอร์ 16:9 สวยๆ ได้เลย</p>
                    </div>
                  ) : (
                    data.slides.map((s, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-line bg-mist/40 p-3 space-y-2.5 transition-colors hover:border-brand/40"
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
                                const arr = [...(data.slides || [])];
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
                              disabled={idx === (data.slides?.length || 0) - 1}
                              onClick={() => {
                                const arr = [...(data.slides || [])];
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
                                  slides: (data.slides || []).filter((_, i) => i !== idx),
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
                                    const arr = [...(data.slides || [])];
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
                                const arr = [...(data.slides || [])];
                                arr[idx].imageUrl = e.target.value;
                                setData({ ...data, slides: arr });
                              }}
                              className="input w-full text-[10px] mt-1 py-0.5"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <input
                              type="text"
                              placeholder={`หัวข้อสไลด์ [${inputLang.toUpperCase()}]`}
                              value={s.title?.[inputLang] ?? ""}
                              onChange={(e) => {
                                const arr = [...(data.slides || [])];
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
                                const arr = [...(data.slides || [])];
                                arr[idx].caption = { ...arr[idx].caption, [inputLang]: e.target.value };
                                setData({ ...data, slides: arr });
                              }}
                              className="input w-full text-xs"
                            />
                            <input
                              type="text"
                              placeholder="ลิงก์ปลายทางเมื่อคลิก (เช่น /products หรือ https://...)"
                              value={s.href ?? ""}
                              onChange={(e) => {
                                const arr = [...(data.slides || [])];
                                arr[idx].href = e.target.value;
                                setData({ ...data, slides: arr });
                              }}
                              className="input w-full text-xs font-mono text-muted"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        slides: [
                          ...(data.slides || []),
                          {
                            imageUrl: "/slides/1.jpg",
                            title: { th: "หัวข้อสไลด์ใหม่", en: "New Slide" },
                            caption: { th: "คำบรรยายสไลด์", en: "Description" },
                            href: "/products",
                          },
                        ],
                      })
                    }
                    className="btn btn-secondary w-full !min-h-9 text-xs font-medium flex items-center justify-center gap-1.5 border-dashed"
                  >
                    <Plus className="size-4" /> เพิ่มภาพสไลด์แบนเนอร์ประจำเมนู
                  </button>
                </div>
              </div>
            )}

            {/* ---------------- 3. SECTIONS TAB ---------------- */}
            {activeTab === "sections" && (
              <div className="space-y-4">
                <div className="border-b border-line pb-3">
                  <h2 className="text-sm font-bold text-ink">บล็อกเนื้อหาประจำหน้า (Dynamic Content Blocks)</h2>
                  <p className="text-xs text-muted">
                    เลือกใส่ Component สวยๆ เช่น สไลด์ผมวงรีแคปซูล, การ์ด 4 คอลัมน์แบบ Wix, รูปซ้ายข้อความขวา
                  </p>
                </div>

                {(!data.sections || data.sections.length === 0) ? (
                  <div className="rounded-xl border border-dashed border-line p-8 text-center bg-mist/30">
                    <Layers className="size-8 mx-auto text-muted/60 mb-2" />
                    <p className="text-xs text-muted">ยังไม่มีบล็อกเนื้อหาในหน้านี้</p>
                    <p className="text-[11px] text-muted/80 mt-1">กดเลือก Component ด้านล่างเพื่อเริ่มสร้างหน้าเว็บได้เลย</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-line bg-mist/40 p-4 space-y-3 transition-colors hover:border-brand/40"
                      >
                        <div className="flex items-center justify-between border-b border-line/60 pb-2">
                          <span className="flex items-center gap-2 text-xs font-bold text-ink">
                            <span className="grid size-5 place-items-center rounded-full bg-sand text-[10px] text-ink">
                              {idx + 1}
                            </span>
                            {sec.title?.[inputLang] || `บล็อกที่ ${idx + 1}`}
                            <span className="rounded bg-sand px-2 py-0.5 text-[10px] text-muted">
                              {sec.layout === "oval-carousel"
                                ? "สไลด์วงรีแคปซูล"
                                : sec.layout === "columns"
                                  ? "การ์ด 4 คอลัมน์ Wix"
                                  : sec.layout}
                            </span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const arr = [...(data.sections || [])];
                                [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                setData({ ...data, sections: arr });
                              }}
                              className="p-1 rounded text-muted hover:text-ink disabled:opacity-30"
                            >
                              <ArrowUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (data.sections?.length || 0) - 1}
                              onClick={() => {
                                const arr = [...(data.sections || [])];
                                [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                setData({ ...data, sections: arr });
                              }}
                              className="p-1 rounded text-muted hover:text-ink disabled:opacity-30"
                            >
                              <ArrowDown className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  sections: (data.sections || []).filter((_, i) => i !== idx),
                                })
                              }
                              className="p-1 rounded text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Layout Selector */}
                        <div>
                          <label className="block text-[11px] font-semibold text-ink mb-1">
                            รูปแบบ Component (Layout)
                          </label>
                          <select
                            className="input w-full text-xs font-medium"
                            value={sec.layout}
                            onChange={(e) => {
                              const arr = [...(data.sections || [])];
                              arr[idx].layout = e.target.value as any;
                              setData({ ...data, sections: arr });
                            }}
                          >
                            <option value="oval-carousel">
                              🌟 สไลเดอร์ทรงรีแคปซูล (Oval Carousel - แกลเลอรีผมซาลอน พื้นหลังดำทอง)
                            </option>
                            <option value="columns">
                              🎴 การ์ดภาพ 4 คอลัมน์ (แบบ Wix: ภาพสูง + กล่องข้อความลอย + ละอองสีชมพู)
                            </option>
                            <option value="left-image">🖼️ ภาพด้านซ้าย - ข้อความด้านขวา</option>
                            <option value="right-image">🖼️ ข้อความด้านซ้าย - ภาพด้านขวา</option>
                            <option value="text-only">📝 ข้อความและหัวข้อกึ่งกลาง</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder={`หัวข้อหลัก [${inputLang.toUpperCase()}]`}
                            value={sec.title?.[inputLang] ?? ""}
                            onChange={(e) => {
                              const arr = [...(data.sections || [])];
                              arr[idx].title = { ...arr[idx].title, [inputLang]: e.target.value };
                              setData({ ...data, sections: arr });
                            }}
                            className="input w-full text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder={`คำบรรยาย [${inputLang.toUpperCase()}]`}
                            value={sec.description?.[inputLang] ?? ""}
                            onChange={(e) => {
                              const arr = [...(data.sections || [])];
                              arr[idx].description = { ...arr[idx].description, [inputLang]: e.target.value };
                              setData({ ...data, sections: arr });
                            }}
                            className="input w-full text-xs"
                          />
                        </div>

                        {/* If layout has an image (left-image or right-image) */}
                        {(sec.layout === "left-image" || sec.layout === "right-image") && (
                          <div className="rounded-lg border border-line bg-white p-3 space-y-2 mt-2">
                            <span className="text-[11px] font-bold text-muted">รูปภาพและปุ่มกด</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                              <div>
                                <div className="relative aspect-[4/3] rounded-lg border border-dashed border-line bg-sand/30 overflow-hidden grid place-items-center">
                                  {sec.imageUrl ? (
                                    <img src={sec.imageUrl} alt="" className="size-full object-cover" />
                                  ) : (
                                    <div className="text-center p-2 text-muted">
                                      <ImagePlus className="size-5 mx-auto mb-1 opacity-60" />
                                      <span className="text-[10px]">เลือกรูปภาพ</span>
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
                                        const arr = [...(data.sections || [])];
                                        arr[idx].imageUrl = url;
                                        setData({ ...data, sections: arr });
                                      }
                                    }}
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="หรือวาง URL รูป..."
                                  value={sec.imageUrl ?? ""}
                                  onChange={(e) => {
                                    const arr = [...(data.sections || [])];
                                    arr[idx].imageUrl = e.target.value;
                                    setData({ ...data, sections: arr });
                                  }}
                                  className="input w-full text-[10px] mt-1 py-0.5"
                                />
                              </div>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder={`ข้อความปุ่มกด [${inputLang.toUpperCase()}]`}
                                  value={sec.buttonText?.[inputLang] ?? ""}
                                  onChange={(e) => {
                                    const arr = [...(data.sections || [])];
                                    arr[idx].buttonText = { ...arr[idx].buttonText, [inputLang]: e.target.value };
                                    setData({ ...data, sections: arr });
                                  }}
                                  className="input w-full text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="ลิงก์ปุ่มกด (เช่น /products หรือ https://...)"
                                  value={sec.buttonHref ?? ""}
                                  onChange={(e) => {
                                    const arr = [...(data.sections || [])];
                                    arr[idx].buttonHref = e.target.value;
                                    setData({ ...data, sections: arr });
                                  }}
                                  className="input w-full text-xs font-mono text-muted"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Cards inside columns or oval-carousel */}
                        {(sec.layout === "columns" || sec.layout === "oval-carousel") && (
                          <div className="rounded-lg border border-line bg-white p-3 space-y-3 mt-2">
                            <div className="flex items-center justify-between border-b border-line/40 pb-2">
                              <span className="text-[11px] font-bold text-ink">
                                {sec.layout === "oval-carousel" ? "รายการทรงผมวงรีแคปซูล" : "รายการการ์ด 4 คอลัมน์"} ({sec.cards?.length || 0} รายการ)
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = [...(data.sections || [])];
                                  arr[idx].cards = [
                                    ...(arr[idx].cards || []),
                                    {
                                      title: { th: "ชื่อสไตล์ใหม่", en: "New Style" },
                                      description: { th: "สูตรสีหรือคำบรรยาย", en: "Hair Formula" },
                                      imageUrl: "/cards/fanola-1.jpg",
                                      href: "/products",
                                    },
                                  ];
                                  setData({ ...data, sections: arr });
                                }}
                                className="text-[11px] font-semibold text-brand hover:underline flex items-center gap-1"
                              >
                                <Plus className="size-3" /> เพิ่มการ์ด
                              </button>
                            </div>

                            {sec.cards?.map((card, cIdx) => (
                              <div key={cIdx} className="rounded-lg border border-line/70 bg-mist/20 p-2.5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-muted">
                                    การ์ด #{cIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const arr = [...(data.sections || [])];
                                      arr[idx].cards = arr[idx].cards?.filter((_, i) => i !== cIdx);
                                      setData({ ...data, sections: arr });
                                    }}
                                    className="text-red-500 hover:bg-red-50 p-1 rounded text-xs inline-flex items-center gap-1"
                                  >
                                    <Trash2 className="size-3" /> ลบ
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                  <div className="sm:col-span-1">
                                    <div className="relative aspect-[3/4] rounded-lg border border-dashed border-line bg-sand/30 overflow-hidden grid place-items-center">
                                      {card.imageUrl ? (
                                        <img src={card.imageUrl} alt="" className="size-full object-cover" />
                                      ) : (
                                        <div className="text-center p-1 text-muted">
                                          <ImagePlus className="size-4 mx-auto mb-0.5 opacity-60" />
                                          <span className="text-[9px]">รูปการ์ด</span>
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
                                            const arr = [...(data.sections || [])];
                                            if (arr[idx].cards) {
                                              arr[idx].cards[cIdx].imageUrl = url;
                                              setData({ ...data, sections: arr });
                                            }
                                          }
                                        }}
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="URL รูป..."
                                      value={card.imageUrl ?? ""}
                                      onChange={(e) => {
                                        const arr = [...(data.sections || [])];
                                        if (arr[idx].cards) {
                                          arr[idx].cards[cIdx].imageUrl = e.target.value;
                                          setData({ ...data, sections: arr });
                                        }
                                      }}
                                      className="input w-full text-[9px] mt-1 py-0.5"
                                    />
                                  </div>

                                  <div className="sm:col-span-3 space-y-1.5">
                                    <input
                                      type="text"
                                      placeholder={`ชื่อหัวข้อ / สไตล์ผม [${inputLang.toUpperCase()}]`}
                                      value={card.title?.[inputLang] ?? ""}
                                      onChange={(e) => {
                                        const arr = [...(data.sections || [])];
                                        if (arr[idx].cards) {
                                          arr[idx].cards[cIdx].title = {
                                            ...arr[idx].cards[cIdx].title,
                                            [inputLang]: e.target.value,
                                          };
                                          setData({ ...data, sections: arr });
                                        }
                                      }}
                                      className="input w-full text-xs font-semibold"
                                    />
                                    <input
                                      type="text"
                                      placeholder={
                                        sec.layout === "oval-carousel"
                                          ? `สูตรทำสี / ป้ายกำกับ (Formula) [${inputLang.toUpperCase()}]`
                                          : `คำบรรยายการ์ด [${inputLang.toUpperCase()}]`
                                      }
                                      value={card.description?.[inputLang] ?? ""}
                                      onChange={(e) => {
                                        const arr = [...(data.sections || [])];
                                        if (arr[idx].cards) {
                                          arr[idx].cards[cIdx].description = {
                                            ...arr[idx].cards[cIdx].description,
                                            [inputLang]: e.target.value,
                                          };
                                          setData({ ...data, sections: arr });
                                        }
                                      }}
                                      className="input w-full text-xs font-mono text-muted"
                                    />
                                    <input
                                      type="text"
                                      placeholder="ลิงก์ปลายทางเมื่อคลิก (เช่น /products/fanola)"
                                      value={card.href ?? ""}
                                      onChange={(e) => {
                                        const arr = [...(data.sections || [])];
                                        if (arr[idx].cards) {
                                          arr[idx].cards[cIdx].href = e.target.value;
                                          setData({ ...data, sections: arr });
                                        }
                                      }}
                                      className="input w-full text-[11px] font-mono text-muted"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Section Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        sections: [
                          ...(data.sections || []),
                          {
                            layout: "oval-carousel",
                            title: { th: "ผลงานผมซาลอนมืออาชีพ", en: "Master Salon Showcase" },
                            description: { th: "แรงบันดาลใจและสูตรสีผมระดับชั้นนำ", en: "Hair Formulas" },
                            cards: [
                              { title: { th: "Ash Blonde", en: "Ash Blonde" }, description: { th: "BLEACH & 3%", en: "BLEACH & 3%" }, imageUrl: "/cards/fanola-1.jpg", href: "/products" },
                              { title: { th: "Pure Ice Blonde", en: "Pure Ice Blonde" }, description: { th: "VIOLET BLEACH", en: "VIOLET BLEACH" }, imageUrl: "/slides/1.jpg", href: "/products" },
                              { title: { th: "Cool Smokey", en: "Cool Smokey" }, description: { th: "BLACK 3%", en: "BLACK 3%" }, imageUrl: "/cards/fanola-2.jpg", href: "/products" },
                            ],
                          },
                        ],
                      })
                    }
                    className="btn btn-secondary !min-h-9 text-xs font-semibold flex items-center justify-center gap-1.5 border-dashed bg-amber-50/50 text-amber-800 border-amber-300"
                  >
                    <Sparkles className="size-3.5 text-amber-600" /> + สไลด์ทรงผมวงรีแคปซูล
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        sections: [
                          ...(data.sections || []),
                          {
                            layout: "columns",
                            title: { th: "จุดเด่นและบริการ", en: "Highlights & Services" },
                            description: { th: "มาตรฐานระดับสากล", en: "World-class Quality" },
                            cards: [
                              { title: { th: "บริการที่ 1", en: "Service 1" }, description: { th: "คำบรรยาย", en: "Detail" }, imageUrl: "/slides/1.jpg", href: "/products" },
                              { title: { th: "บริการที่ 2", en: "Service 2" }, description: { th: "คำบรรยาย", en: "Detail" }, imageUrl: "/slides/2.jpg", href: "/products" },
                              { title: { th: "บริการที่ 3", en: "Service 3" }, description: { th: "คำบรรยาย", en: "Detail" }, imageUrl: "/slides/3.jpg", href: "/products" },
                              { title: { th: "บริการที่ 4", en: "Service 4" }, description: { th: "คำบรรยาย", en: "Detail" }, imageUrl: "/slides/4.jpg", href: "/products" },
                            ],
                          },
                        ],
                      })
                    }
                    className="btn btn-secondary !min-h-9 text-xs font-semibold flex items-center justify-center gap-1.5 border-dashed bg-pink-50/50 text-pink-800 border-pink-300"
                  >
                    <Plus className="size-3.5 text-pink-600" /> + การ์ด 4 คอลัมน์ (แบบ Wix)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Sticky Realtime Preview (6 cols)            */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="rounded-2xl border border-line bg-white shadow-md overflow-hidden">
            {/* Browser Header Mock */}
            <div className="flex items-center justify-between border-b border-line bg-sand/60 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="rounded-md bg-white border border-line px-2.5 py-0.5 text-[11px] font-mono text-muted flex items-center gap-1.5">
                  <span>🔒 new.beautyup-enterprise.com/{previewLang}{data.href}</span>
                </div>
              </div>

              {/* Preview Controls */}
              <div className="flex items-center gap-2">
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

                <div className="flex rounded-md bg-white border border-line p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDevice("desktop")}
                    className={clsx(
                      "p-1 rounded text-[11px] transition-colors",
                      device === "desktop" ? "bg-ink text-white" : "text-muted hover:text-ink",
                    )}
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
              {/* Page Hero Header */}
              <div className="px-6 py-8 border-b border-line/60 bg-gradient-to-b from-mist/40 via-white to-sand/20">
                <p className="text-[10px] font-semibold tracking-wider text-brand uppercase">
                  {data.heroEyebrow?.[previewLang] || (previewLang === "en" ? "Professional Salon Products" : "BEAUTYUP")}
                </p>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl text-ink font-bold tracking-tight">
                  {data.heroHeadline?.[previewLang] || data.label?.[previewLang] || "ชื่อเมนู / หน้าเว็บ"}
                </h1>
                {data.heroLead?.[previewLang] && (
                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed max-w-xl">
                    {data.heroLead[previewLang]}
                  </p>
                )}
              </div>

              {/* Banner Slide Carousel */}
              {data.slides && data.slides.length > 0 && (
                <div className="relative border-b border-line/60 bg-gradient-to-b from-sand/20 via-white to-sand/10 py-5 px-4 overflow-hidden">
                  <div className="relative mx-auto aspect-[16/9] max-w-xl rounded-xl overflow-hidden shadow-md border border-line bg-black">
                    {data.slides.map((slide, sIdx) => (
                      <div
                        key={sIdx}
                        className={clsx(
                          "absolute inset-0 size-full transition-opacity duration-500",
                          sIdx === activeSlideIdx ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0",
                        )}
                      >
                        <img src={slide.imageUrl} alt="" className="size-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                          <h3 className="font-display text-base sm:text-lg font-bold">
                            {slide.title?.[previewLang] || "Slide Headline"}
                          </h3>
                          <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
                            {slide.caption?.[previewLang] || "Slide description"}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Nav buttons */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIdx((prev) => (prev > 0 ? prev - 1 : (data.slides?.length || 1) - 1))
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 grid size-6 place-items-center rounded-full bg-black/60 text-white"
                    >
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIdx((prev) => (prev < (data.slides?.length || 1) - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 grid size-6 place-items-center rounded-full bg-black/60 text-white"
                    >
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Sections Rendered Live */}
              {data.sections && data.sections.length > 0 && (
                <div className="space-y-6 py-6">
                  {data.sections.map((sec, secIdx) => {
                    // Oval Carousel Layout
                    if (sec.layout === "oval-carousel") {
                      return (
                        <div key={secIdx} className="bg-black text-white py-8 px-4 overflow-hidden">
                          <div className="text-center max-w-xl mx-auto mb-5">
                            <h2 className="font-serif text-xl sm:text-2xl text-amber-400 font-bold">
                              {sec.title?.[previewLang] || "ผลิตภัณฑ์ซาลอนมืออาชีพ"}
                            </h2>
                            {sec.description?.[previewLang] && (
                              <p className="mt-1 text-xs text-neutral-400">{sec.description[previewLang]}</p>
                            )}
                          </div>
                          <div className="flex gap-2.5 overflow-x-auto pb-2 px-1 [scrollbar-width:none]">
                            {(sec.cards || []).map((c, cIdx) => (
                              <div
                                key={cIdx}
                                className="group relative shrink-0 w-28 aspect-[1/1.55] rounded-[9999px] border border-neutral-800 bg-neutral-950 overflow-hidden shadow-md"
                              >
                                <img src={c.imageUrl || "/slides/1.jpg"} alt="" className="size-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end items-center text-center p-2">
                                  {c.description?.[previewLang] && (
                                    <span className="mb-1 rounded-full border border-amber-400/50 bg-black/85 px-1 py-0.2 font-mono text-[7px] text-amber-300">
                                      {c.description[previewLang]}
                                    </span>
                                  )}
                                  <h4 className="text-[10px] font-bold text-white line-clamp-1">
                                    {c.title?.[previewLang] || "Style"}
                                  </h4>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // Wix 4 Columns Layout
                    if (sec.layout === "columns") {
                      return (
                        <div key={secIdx} className="py-6 px-4 bg-mist/50 border-y border-line/60">
                          <div className="text-center mb-5">
                            <h3 className="font-sans text-lg font-bold text-ink">
                              {sec.title?.[previewLang] || "หัวข้อ 4 คอลัมน์"}
                            </h3>
                            {sec.description?.[previewLang] && (
                              <p className="text-xs text-muted mt-0.5">{sec.description[previewLang]}</p>
                            )}
                          </div>
                          <div
                            className="grid grid-cols-2 gap-2.5 sm:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
                            style={{ "--cols": Math.min((sec.cards || []).length || 1, 6) } as React.CSSProperties}
                          >
                            {(sec.cards || []).map((c, cIdx) => (
                              <div
                                key={cIdx}
                                className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-line bg-white flex flex-col justify-end p-2.5"
                              >
                                <img src={c.imageUrl || "/slides/1.jpg"} alt="" className="absolute inset-0 size-full object-cover" />
                                <div className="relative z-10 rounded-lg bg-white/95 p-2 backdrop-blur shadow-xs text-center">
                                  <h5 className="text-[11px] font-bold text-ink line-clamp-1">{c.title?.[previewLang] || "การ์ด"}</h5>
                                  <p className="text-[9px] text-muted line-clamp-1">{c.description?.[previewLang]}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // Default Left-Image / Right-Image Layout
                    return (
                      <div key={secIdx} className="px-5 py-4 border-b border-line/40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div className={clsx("aspect-[4/3] rounded-xl bg-sand/60 overflow-hidden", sec.layout === "right-image" && "sm:order-2")}>
                            {sec.imageUrl ? (
                              <img src={sec.imageUrl} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="size-full grid place-items-center text-muted text-xs">รูปภาพประกอบ</div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-ink">{sec.title?.[previewLang] || "หัวข้อเนื้อหา"}</h3>
                            <p className="text-xs text-muted mt-1 leading-relaxed">{sec.description?.[previewLang] || "คำบรรยายเนื้อหาในส่วนนี้"}</p>
                            {sec.buttonText?.[previewLang] && (
                              <span className="inline-block mt-3 rounded-lg bg-ink px-3 py-1 text-xs text-white">
                                {sec.buttonText[previewLang]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Product Grid Showcase if Brand is Selected */}
              {data.brandId && data.showProducts && (
                <div className="p-6 border-t border-line bg-mist/20">
                  <div className="text-center mb-4">
                    <p className="text-[10px] font-semibold text-brand uppercase tracking-wider">
                      {selectedBrand?.label || "BRAND PRODUCTS"}
                    </p>
                    <h3 className="text-base font-bold text-ink">
                      รายการสินค้า {selectedBrand?.label || ""}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[1, 2, 3].map((itemNum) => (
                      <div key={itemNum} className="rounded-xl border border-line bg-white p-2.5 text-center shadow-2xs">
                        <div className="aspect-square rounded-lg bg-sand/40 mb-2 grid place-items-center text-[10px] text-muted">
                          รูปสินค้า #{itemNum}
                        </div>
                        <h5 className="text-[11px] font-bold text-ink line-clamp-1">สินค้า {selectedBrand?.label} #{itemNum}</h5>
                        <p className="text-xs font-bold text-brand mt-1">฿850 - ฿1,200</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
