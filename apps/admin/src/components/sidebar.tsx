"use client";

import clsx from "clsx";
import {
  Building2,
  ChevronDown,
  Clapperboard,
  Crown,
  FileText,
  Film,
  FolderTree,
  GraduationCap,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MenuSquare,
  MessageCircle,
  MessagesSquare,
  Newspaper,
  Package,
  Settings,
  Sparkles,
  Store,
  Tags,
  UserCog,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/login/actions";

/** `also`: other pages that belong to this entry (tabs of the same page) */
type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  adminOnly?: boolean;
  also?: string[];
  children?: Item[];
};

const groups = (newInquiries: number): { title?: string; items: Item[] }[] => [
  {
    items: [
      { href: "/", label: "ภาพรวม", icon: LayoutDashboard },
      { href: "/inquiries", label: "กล่องข้อความ", icon: Inbox, badge: newInquiries },
    ],
  },
  {
    title: "จัดการเนื้อหาหลัก",
    items: [
      {
        href: "/r/menu-items",
        label: "เมนูและหน้าเว็บ",
        icon: MenuSquare,
        children: [
          { href: "/r/hero-slides", label: "สไลด์หน้าแรก", icon: Images },
          { href: "/r/videos", label: "วิดีโอหน้าแรก", icon: Clapperboard },
          { href: "/content/about", label: "หน้าเกี่ยวกับเรา", icon: Building2, also: ["/content/aboutSlides", "/content/timeline"] },
          { href: "/content/vipCustomer", label: "แบนเนอร์ลูกค้า VIP", icon: Crown },
          { href: "/r/ambassadors", label: "แบรนด์แอมบาสเดอร์", icon: Sparkles },
          { href: "/r/salons", label: "ซาลอนพันธมิตร", icon: Store },
          { href: "/r/courses", label: "คอร์สเรียน", icon: GraduationCap },
          { href: "/r/posts", label: "บทความ / กิจกรรม", icon: Newspaper },
          { href: "/r/pages", label: "หน้าข้อความ (นโยบาย)", icon: FileText },
          { href: "/r/team", label: "ทีมงาน (ฝ่ายขาย)", icon: Users },
        ],
      },
      {
        href: "/r/products",
        label: "สินค้าและแบรนด์",
        icon: Package,
        children: [
          { href: "/r/brands", label: "แบรนด์", icon: Tags },
          { href: "/r/main-categories", label: "หมวดหมู่หลัก", icon: FolderTree },
          { href: "/r/categories", label: "คอลเลกชัน", icon: Layers },
        ],
      },
      {
        href: "/r/media",
        label: "มีเดีย",
        icon: Film,
        children: [{ href: "/r/media-categories", label: "หมวดหมู่มีเดีย", icon: FolderTree }],
      },
      {
        href: "/r/forum-topics",
        label: "ฟอรั่ม",
        icon: MessagesSquare,
        children: [
          { href: "/r/forum-replies", label: "ความคิดเห็น", icon: MessageCircle },
          { href: "/r/forum-categories", label: "หมวดหมู่ฟอรั่ม", icon: FolderTree },
        ],
      },
    ],
  },
  {
    title: "ระบบและสมาชิก",
    items: [
      { href: "/members", label: "สมาชิกเว็บไซต์", icon: UserRound },
      { href: "/settings", label: "ตั้งค่าเว็บไซต์", icon: Settings },
      { href: "/users", label: "ผู้ใช้หลังบ้าน", icon: UserCog, adminOnly: true },
    ],
  },
];

export function Sidebar({ user, newInquiries }: { user: { name: string; email: string; role: string }; newInquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Whole-segment match, so /r/media does not also light up on /r/media-categories
  const isActive = (href: string, also: string[] = []) =>
    href === "/" ? pathname === "/" : [href, ...also].some((h) => pathname === h || pathname.startsWith(`${h}/`));

  const isGroupOpen = (item: Item) => {
    const childActive = item.children?.some((c) => isActive(c.href, c.also)) ?? false;
    if (expanded[item.href] !== undefined) return expanded[item.href];
    return childActive;
  };

  const toggleGroup = (href: string, current: boolean) => {
    setExpanded((prev) => ({ ...prev, [href]: !current }));
  };

  const nav = (
    <nav
      aria-label="เมนูหลังบ้าน"
      className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-color:var(--color-line)_transparent] [scrollbar-width:thin]"
      onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
    >
      {groups(newInquiries).map((g, i) => (
        <div key={i} className="mb-5">
          {g.title && <p className="mb-1.5 px-3 text-xs font-medium tracking-wide text-muted">{g.title}</p>}
          <ul className="space-y-1">
            {g.items
              .filter((it) => !it.adminOnly || user.role === "ADMIN")
              .map((item) => {
                const { href, label, icon: Icon, badge, also, children } = item;
                const active = isActive(href, also);
                const childActive = children?.some((c) => isActive(c.href, c.also)) ?? false;
                const groupOpen = isGroupOpen(item);

                return (
                  <li key={href}>
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={clsx(
                          "flex min-h-10 flex-1 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                          active
                            ? "bg-brand-soft font-medium text-brand"
                            : childActive
                              ? "bg-sand/70 font-medium text-ink"
                              : "text-ink/80 hover:bg-sand hover:text-ink",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1">{label}</span>
                        {!!badge && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-white">{badge}</span>}
                      </Link>
                      {children && children.length > 0 && (
                        <button
                          type="button"
                          aria-label={groupOpen ? `ซ่อนเมนูย่อยของ ${label}` : `แสดงเมนูย่อยของ ${label}`}
                          aria-expanded={groupOpen}
                          title={groupOpen ? "หุบเมนูย่อย" : `ดูเมนูย่อย (${children.length})`}
                          onClick={() => toggleGroup(href, groupOpen)}
                          className={clsx(
                            "grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-ink",
                            (groupOpen || childActive) && "text-ink",
                          )}
                        >
                          <ChevronDown className={clsx("size-4 transition-transform duration-200", groupOpen && "rotate-180")} />
                        </button>
                      )}
                    </div>

                    {children && children.length > 0 && groupOpen && (
                      <ul className="mt-1 ml-4 space-y-0.5 border-l border-line pl-2.5">
                        {children.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive = isActive(sub.href, sub.also);
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                aria-current={subActive ? "page" : undefined}
                                className={clsx(
                                  "flex min-h-8.5 items-center gap-2.5 rounded-lg px-2.5 text-xs transition-colors",
                                  subActive ? "bg-brand-soft font-medium text-brand" : "text-muted hover:bg-sand/70 hover:text-ink",
                                )}
                              >
                                <SubIcon className="size-3.5 shrink-0" />
                                <span className="flex-1 truncate">{sub.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-line p-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{user.name.slice(0, 1)}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{user.name}</span>
          <span className="block truncate text-xs text-muted">{user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ทีมงาน"}</span>
        </span>
        <form action={logout}>
          <button type="submit" aria-label="ออกจากระบบ" title="ออกจากระบบ" className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="BeautyUp" width={500} height={368} className="h-9 w-auto" />
          <span className="text-sm font-medium text-muted">Admin</span>
        </Link>
        <button type="button" aria-label={open ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-lg hover:bg-sand">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-line px-5">
          <Building2 className="sr-only" />
          <Image src="/logo.png" alt="BeautyUp" width={500} height={368} className="h-10 w-auto" />
          <span className="text-sm font-medium text-muted">Admin</span>
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
