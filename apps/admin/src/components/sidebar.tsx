"use client";

import clsx from "clsx";
import {
  Building2,
  Clapperboard,
  GraduationCap,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MenuSquare,
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
  FileText,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/login/actions";

type Item = { href: string; label: string; icon: LucideIcon; badge?: number; adminOnly?: boolean };

const groups = (newInquiries: number): { title?: string; items: Item[] }[] => [
  {
    items: [
      { href: "/", label: "ภาพรวม", icon: LayoutDashboard },
      { href: "/inquiries", label: "กล่องข้อความ", icon: Inbox, badge: newInquiries },
    ],
  },
  {
    title: "สินค้า",
    items: [
      { href: "/r/products", label: "สินค้า", icon: Package },
      { href: "/r/brands", label: "แบรนด์", icon: Tags },
    ],
  },
  {
    title: "หน้าเว็บ",
    items: [
      { href: "/r/hero-slides", label: "สไลด์หน้าแรก", icon: Images },
      { href: "/r/menu-items", label: "เมนูเว็บไซต์", icon: MenuSquare },
      { href: "/r/posts", label: "บทความ / กิจกรรม", icon: Newspaper },
      { href: "/r/pages", label: "หน้าเนื้อหา", icon: FileText },
      { href: "/r/videos", label: "วิดีโอ", icon: Clapperboard },
      { href: "/r/courses", label: "คอร์สเรียน", icon: GraduationCap },
    ],
  },
  {
    title: "ลูกค้าและทีม",
    items: [
      { href: "/r/salons", label: "ซาลอนพันธมิตร", icon: Store },
      { href: "/r/ambassadors", label: "แบรนด์แอมบาสเดอร์", icon: Sparkles },
      { href: "/r/team", label: "ทีมงาน", icon: Users },
      { href: "/members", label: "สมาชิกเว็บไซต์", icon: UserRound },
    ],
  },
  {
    title: "ระบบ",
    items: [
      { href: "/settings", label: "ตั้งค่าเว็บไซต์", icon: Settings },
      { href: "/users", label: "ผู้ใช้หลังบ้าน", icon: UserCog, adminOnly: true },
    ],
  },
];

export function Sidebar({ user, newInquiries }: { user: { name: string; email: string; role: string }; newInquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="เมนูหลังบ้าน" className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-color:var(--color-line)_transparent] [scrollbar-width:thin]" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
      {groups(newInquiries).map((g, i) => (
        <div key={i} className="mb-5">
          {g.title && <p className="mb-1 px-3 text-xs font-medium tracking-wide text-muted">{g.title}</p>}
          <ul className="space-y-0.5">
            {g.items
              .filter((it) => !it.adminOnly || user.role === "ADMIN")
              .map(({ href, label, icon: Icon, badge }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={clsx(
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                      isActive(href) ? "bg-brand-soft font-medium text-brand" : "text-ink/80 hover:bg-sand hover:text-ink",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {!!badge && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-white">{badge}</span>}
                  </Link>
                </li>
              ))}
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
