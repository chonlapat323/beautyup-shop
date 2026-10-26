import clsx from "clsx";
import { ArrowLeft, ChevronRight, FolderKanban } from "lucide-react";
import Link from "next/link";

type FlowStep = {
  key: string;
  label: string;
  href: string;
};

type MenuFlow = {
  menuLabel: string;
  menuPath: string;
  steps: FlowStep[];
};

const FLOWS: MenuFlow[] = [
  {
    menuLabel: "หน้าหลัก (Home)",
    menuPath: "/",
    steps: [
      { key: "hero-slides", label: "1. สไลด์หน้าแรก", href: "/r/hero-slides" },
      { key: "videos", label: "2. วิดีโอหน้าแรก", href: "/r/videos" },
    ],
  },
  {
    menuLabel: "เกี่ยวกับเรา (About)",
    menuPath: "/about",
    steps: [
      { key: "about", label: "1. เนื้อหาหน้าเกี่ยวกับเรา", href: "/content/about" },
      { key: "aboutSlides", label: "2. สไลด์หน้าเกี่ยวกับเรา", href: "/content/aboutSlides" },
      { key: "timeline", label: "3. เส้นทางของบิวตี้อัพ", href: "/content/timeline" },
    ],
  },
  {
    menuLabel: "ลูกค้า (Customers)",
    menuPath: "/customers",
    steps: [
      { key: "vipCustomer", label: "1. แบนเนอร์ลูกค้า VIP", href: "/content/vipCustomer" },
      { key: "ambassadors", label: "2. แบรนด์แอมบาสเดอร์", href: "/r/ambassadors" },
      { key: "salons", label: "3. ซาลอนพันธมิตร", href: "/r/salons" },
      { key: "regionCounts", label: "4. จำนวนซาลอนแต่ละภาค", href: "/settings?tab=regionCounts" },
      { key: "growVision", label: "5. แถบ Grow Your Vision", href: "/settings?tab=growVision" },
    ],
  },
  {
    menuLabel: "ผลิตภัณฑ์ผม / สินค้า (Products)",
    menuPath: "/products",
    steps: [
      { key: "brands", label: "1. แบรนด์", href: "/r/brands" },
      { key: "main-categories", label: "2. หมวดหมู่หลัก", href: "/r/main-categories" },
      { key: "categories", label: "3. คอลเลกชัน", href: "/r/categories" },
      { key: "products", label: "4. สินค้า", href: "/r/products" },
    ],
  },
  {
    menuLabel: "คอร์สเรียน (Courses)",
    menuPath: "/courses",
    steps: [{ key: "courses", label: "1. รายการคอร์สเรียน", href: "/r/courses" }],
  },
  {
    menuLabel: "ติดต่อเรา / นโยบาย (Contact & Policy)",
    menuPath: "/contact",
    steps: [
      { key: "company", label: "1. ข้อมูลบริษัท / ช่องทางติดต่อ", href: "/settings?tab=company" },
      { key: "team", label: "2. ทีมงาน (ฝ่ายขาย / เทคนิคเชี่ยน)", href: "/r/team" },
      { key: "pages", label: "3. หน้าข้อความ / นโยบาย (/policy)", href: "/r/pages" },
    ],
  },
  {
    menuLabel: "มุมสมาชิก / มีเดีย (Members & Media)",
    menuPath: "/members",
    steps: [
      { key: "media", label: "1. คลังมีเดีย", href: "/r/media" },
      { key: "media-categories", label: "2. หมวดหมู่มีเดีย", href: "/r/media-categories" },
      { key: "posts", label: "3. บทความ / กิจกรรม", href: "/r/posts" },
    ],
  },
  {
    menuLabel: "ฟอรั่ม (Forum)",
    menuPath: "/forum",
    steps: [
      { key: "forum-topics", label: "1. กระทู้ฟอรั่ม", href: "/r/forum-topics" },
      { key: "forum-replies", label: "2. ความคิดเห็น", href: "/r/forum-replies" },
      { key: "forum-categories", label: "3. หมวดหมู่ฟอรั่ม", href: "/r/forum-categories" },
    ],
  },
];

export function SectionFlowBar({ currentKey }: { currentKey: string }) {
  const flow = FLOWS.find((f) => f.steps.some((s) => s.key === currentKey));
  if (!flow) return null;

  return (
    <div className="mb-6 rounded-2xl border border-line bg-white p-3.5 sm:px-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-muted">
          <Link
            href="/r/menu-items"
            className="inline-flex items-center gap-1 rounded-lg bg-sand/70 px-2.5 py-1 font-medium text-ink transition-colors hover:bg-brand-soft hover:text-brand"
          >
            <ArrowLeft className="size-3.5" /> เมนูและหน้าเว็บ
          </Link>
          <ChevronRight className="size-3.5 text-muted/60" />
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <FolderKanban className="size-3.5 text-brand" />
            มาจากเมนู: <span className="text-brand">{flow.menuLabel}</span>
            <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-[11px] text-muted">{flow.menuPath}</code>
          </span>
        </div>
        <span className="text-[11px] text-muted">คลิกเลือกส่วนที่ต้องการแก้ไขตามลำดับ</span>
      </div>

      {flow.steps.length > 1 && (
        <nav
          aria-label="ลำดับการจัดการในเมนูนี้"
          className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line/70 pt-3"
        >
          {flow.steps.map((step, idx) => {
            const active = step.key === currentKey;
            return (
              <div key={step.key} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="size-3.5 text-muted/50 hidden sm:block" />}
                <Link
                  href={step.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "inline-flex min-h-8.5 items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-brand bg-brand text-white shadow-2xs"
                      : "border-line bg-mist/50 text-ink/80 hover:border-brand/50 hover:bg-brand-soft/40 hover:text-brand",
                  )}
                >
                  {step.label}
                </Link>
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
