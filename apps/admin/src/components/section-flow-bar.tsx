import clsx from "clsx";
import { ChevronRight, FolderKanban, Home } from "lucide-react";
import Link from "next/link";

type FlowStep = {
  key: string;
  label: string;
  href: string;
};

type FlowTab = {
  key: string;
  label: string;
  href: string;
  steps?: FlowStep[];
};

type MenuFlow = {
  menuLabel: string;
  menuPath: string;
  sidebarSection?: { label: string; href: string };
  tabs?: FlowTab[];
  steps: FlowStep[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
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
    menuLabel: "ผลิตภัณฑ์ซาลอน (Salon Products)",
    menuPath: "/products",
    sidebarSection: { label: "ผลิตภัณฑ์ซาลอน (/products)", href: "/r/products?type=SALON" },
    steps: [
      { key: "brands", label: "1. แบรนด์ซาลอน", href: "/r/brands?type=SALON" },
      { key: "main-categories", label: "2. หมวดหมู่หลัก", href: "/r/main-categories?type=SALON" },
      { key: "categories", label: "3. คอลเลกชัน (ไม่บังคับ)", href: "/r/categories?type=SALON" },
      { key: "products", label: "4. สินค้าซาลอน", href: "/r/products?type=SALON" },
    ],
  },
  {
    menuLabel: "เคาน์เตอร์แบรนด์ (Counter Brand)",
    menuPath: "/shop",
    sidebarSection: { label: "เคาน์เตอร์แบรนด์ (/shop)", href: "/r/products?type=COUNTER" },
    steps: [
      { key: "shopPage", label: "1. เนื้อหาหน้า & รูป CEO (/shop)", href: "/content/shopPage" },
      { key: "brands:COUNTER", label: "2. แบรนด์เคาน์เตอร์", href: "/r/brands?type=COUNTER" },
      { key: "main-categories:COUNTER", label: "3. หมวดหมู่หลัก", href: "/r/main-categories?type=COUNTER" },
      { key: "products:COUNTER", label: "4. สินค้าเคาน์เตอร์แบรนด์", href: "/r/products?type=COUNTER" },
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
    menuLabel: "มีเดีย (Media)",
    menuPath: "/members/media",
    sidebarSection: { label: "มีเดีย", href: "/r/media" },
    steps: [
      { key: "media-categories", label: "1. หมวดหมู่มีเดีย", href: "/r/media-categories" },
      { key: "media", label: "2. คลังมีเดีย", href: "/r/media" },
    ],
  },
  {
    menuLabel: "บทความและกิจกรรม (Articles & Activities)",
    menuPath: "/members",
    sidebarSection: { label: "บทความและกิจกรรม", href: "/r/posts" },
    tabs: [
      {
        key: "posts:ARTICLE",
        label: "บทความ (Articles)",
        href: "/r/posts?filter=ARTICLE",
      },
      {
        key: "posts:ACTIVITY",
        label: "กิจกรรม (Activities)",
        href: "/r/posts?filter=ACTIVITY",
      },
    ],
    steps: [
      { key: "posts:ARTICLE", label: "บทความ (Articles)", href: "/r/posts?filter=ARTICLE" },
      { key: "posts:ACTIVITY", label: "กิจกรรม (Activities)", href: "/r/posts?filter=ACTIVITY" },
    ],
  },
  {
    menuLabel: "ฟอรั่ม (Forum)",
    menuPath: "/forum",
    sidebarSection: { label: "ฟอรั่ม", href: "/r/forum-topics" },
    steps: [
      { key: "forum-categories", label: "1. หมวดหมู่ฟอรั่ม", href: "/r/forum-categories" },
      { key: "forum-topics", label: "2. กระทู้ฟอรั่ม", href: "/r/forum-topics" },
      { key: "forum-replies", label: "3. ความคิดเห็น", href: "/r/forum-replies" },
    ],
  },
];

export function SectionFlowBar({
  currentKey,
  menuHref,
  trail = [],
}: {
  currentKey: string;
  menuHref?: string;
  trail?: BreadcrumbItem[];
}) {
  const cleanHref = menuHref?.trim().replace(/\/+$/, "") || "/";
  const normalizedKey = currentKey === "posts" ? "posts:ARTICLE" : currentKey;
  const flow =
    FLOWS.find((f) => f.steps.some((s) => s.key === normalizedKey)) ??
    (normalizedKey === "menu-items" && menuHref
      ? FLOWS.find(
          (f) =>
            f.menuPath === cleanHref ||
            (f.menuPath === "/products" && cleanHref.startsWith("/products/")) ||
            (f.menuPath === "/contact" && cleanHref === "/policy"),
        )
      : undefined);
  const activeTab = flow?.tabs?.find(
    (t) => t.key === normalizedKey || t.steps?.some((s) => s.key === normalizedKey),
  );
  const currentStep = flow?.steps.find((s) => s.key === normalizedKey);

  // Also render a clean breadcrumb for /r/menu-items itself
  if (!flow && normalizedKey !== "menu-items") return null;

  const crumbs: BreadcrumbItem[] = [{ label: "ภาพรวม", href: "/" }];

  if (flow?.sidebarSection && normalizedKey !== "menu-items") {
    crumbs.push({ label: flow.sidebarSection.label, href: flow.sidebarSection.href });
  } else {
    crumbs.push({ label: "เมนูและหน้าเว็บ", href: "/r/menu-items" });
    if (flow) {
      crumbs.push({ label: `เมนู: ${flow.menuLabel} (${flow.menuPath})`, href: "/r/menu-items" });
    }
  }
  if (activeTab && activeTab.steps?.length) {
    crumbs.push({ label: activeTab.label, href: activeTab.href });
  }
  if (currentStep) {
    crumbs.push({
      label: currentStep.label.replace(/^\d+\.\s*/, ""),
      href: trail.length > 0 ? currentStep.href : undefined,
    });
  }
  crumbs.push(...trail);

  return (
    <div className="mb-6 rounded-2xl border border-line bg-white p-3.5 sm:px-5 shadow-2xs">
      {/* Breadcrumb Trail */}
      <nav aria-label="ตำแหน่งปัจจุบัน (Breadcrumb)" className="flex flex-wrap items-center gap-1.5 text-xs">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <span key={idx} className="inline-flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="size-3.5 text-muted/50 shrink-0" />}
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-muted transition-colors hover:bg-sand/70 hover:text-brand"
                >
                  {idx === 0 && <Home className="size-3.5" />}
                  {c.label}
                </Link>
              ) : (
                <span
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5",
                    isLast ? "bg-brand-soft/70 font-semibold text-brand" : "font-medium text-ink",
                  )}
                >
                  {idx === 2 && <FolderKanban className="size-3.5 text-brand" />}
                  {c.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      {/* Multi-Tab Layout (e.g. Members: Media Tab [Category -> Media] | Articles Tab | Activities Tab) */}
      {flow?.tabs ? (
        <div className="mt-3 space-y-2.5 border-t border-line/70 pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex flex-wrap items-center gap-1.5 rounded-xl bg-mist p-1" role="tablist" aria-label="หมวดหลักในเมนูนี้">
              {flow.tabs.map((tab) => {
                const isTabActive = activeTab?.key === tab.key;
                return (
                  <Link
                    key={tab.key}
                    href={tab.href}
                    role="tab"
                    aria-selected={isTabActive}
                    className={clsx(
                      "inline-flex min-h-8 items-center rounded-lg px-3.5 py-1 text-xs font-semibold transition-all",
                      isTabActive
                        ? "bg-brand text-white shadow-2xs"
                        : "text-ink/75 hover:bg-white/80 hover:text-brand",
                    )}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
            <span className="text-[11px] text-muted hidden md:inline">แท็บจัดการในเมนู {flow.menuLabel}</span>
          </div>

          {activeTab?.steps && activeTab.steps.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pl-1" role="navigation" aria-label="ลำดับขั้นตอนในแท็บนี้">
              <span className="mr-1 text-[11px] font-medium text-muted">ลำดับในแท็บ {activeTab.label}:</span>
              {activeTab.steps.map((step, idx) => {
                const active = step.key === normalizedKey;
                return (
                  <div key={step.key} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="size-3.5 text-muted/60" />}
                    <Link
                      href={step.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "inline-flex min-h-7 items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium transition-colors",
                        active
                          ? "border-brand bg-brand-soft/80 font-semibold text-brand"
                          : "border-line bg-white text-ink/80 hover:border-brand/50 hover:text-brand",
                      )}
                    >
                      {step.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Ordered Step-by-Step Bar */
        flow &&
        flow.steps.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3">
            <div className="flex flex-wrap items-center gap-1.5" role="navigation" aria-label="ลำดับการจัดการในเมนูนี้">
              {flow.steps.map((step, idx) => {
                const active = step.key === normalizedKey;
                return (
                  <div key={step.key} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="size-3.5 text-muted/50 hidden sm:block" />}
                    <Link
                      href={step.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "inline-flex min-h-8 items-center rounded-lg border px-3 py-1 text-xs font-medium transition-colors",
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
            </div>
            <span className="text-[11px] text-muted hidden md:inline">เรียงตามลำดับส่วนในเมนู {flow.menuLabel}</span>
          </div>
        )
      )}
    </div>
  );
}
