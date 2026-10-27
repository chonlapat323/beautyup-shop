"use client";

import clsx from "clsx";
import {
  Building2,
  CalendarHeart,
  Film,
  Gem,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MenuSquare,
  MessagesSquare,
  Newspaper,
  Package,
  Settings,
  UserCog,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { logout } from "@/app/login/actions";
import { roleLabels, type Role } from "@beautyup/types";

/** `also`: other pages that belong to this top-level entry */
type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  allowedRoles?: Role[];
  also?: string[];
  matchBrandType?: "SALON" | "COUNTER";
};

const groups = (newInquiries: number): { title?: string; items: Item[] }[] => [
  {
    items: [
      { href: "/", label: "ภาพรวม", icon: LayoutDashboard },
      { href: "/inquiries", label: "กล่องข้อความ", icon: Inbox, badge: newInquiries, allowedRoles: ["ADMIN", "MANAGER", "STAFF"] },
    ],
  },
  {
    title: "จัดการเนื้อหาหลัก",
    items: [
      {
        href: "/r/menu-items",
        label: "เมนูและหน้าเว็บ",
        icon: MenuSquare,
        allowedRoles: ["ADMIN", "MANAGER", "EDITOR"],
        also: [
          "/r/hero-slides",
          "/r/videos",
          "/content/about",
          "/content/aboutSlides",
          "/content/timeline",
          "/content/vipCustomer",
          "/r/ambassadors",
          "/r/salons",
          "/r/courses",
          "/r/pages",
          "/r/team",
        ],
      },
      {
        href: "/r/products?type=SALON",
        label: "ผลิตภัณฑ์ซาลอน (/products)",
        icon: Package,
        allowedRoles: ["ADMIN", "MANAGER", "STAFF"],
        also: ["/r/brands", "/r/main-categories", "/r/categories", "/r/products"],
        matchBrandType: "SALON",
      },
      {
        href: "/r/products?type=COUNTER",
        label: "เคาน์เตอร์แบรนด์ (/shop)",
        icon: Gem,
        allowedRoles: ["ADMIN", "MANAGER", "STAFF"],
        also: ["/content/shopPage", "/r/brands", "/r/main-categories", "/r/products"],
        matchBrandType: "COUNTER",
      },
      {
        href: "/r/media",
        label: "มีเดีย",
        icon: Film,
        allowedRoles: ["ADMIN", "MANAGER", "EDITOR"],
        also: ["/r/media-categories"],
      },
      {
        href: "/r/posts",
        label: "บทความและกิจกรรม",
        icon: Newspaper,
        allowedRoles: ["ADMIN", "MANAGER", "EDITOR"],
      },
      {
        href: "/r/forum-topics",
        label: "ฟอรั่ม",
        icon: MessagesSquare,
        allowedRoles: ["ADMIN", "MANAGER", "EDITOR", "STAFF"],
        also: ["/r/forum-replies", "/r/forum-categories"],
      },
    ],
  },
  {
    title: "ระบบและสมาชิก",
    items: [
      { href: "/members", label: "สมาชิกเว็บไซต์", icon: UserRound, allowedRoles: ["ADMIN", "MANAGER"] },
      { href: "/settings", label: "ตั้งค่าเว็บไซต์", icon: Settings, allowedRoles: ["ADMIN", "MANAGER"] },
      { href: "/users", label: "ผู้ใช้หลังบ้าน", icon: UserCog, allowedRoles: ["ADMIN"] },
      { href: "/profile", label: "เปลี่ยนรหัสผ่าน / บัญชี", icon: KeyRound },
    ],
  },
];

function SidebarInner({ user, newInquiries }: { user: { name: string; email: string; role: string }; newInquiries: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentType = searchParams.get("type");

  // Whole-segment match, so /r/media does not also light up on /r/media-categories unless in `also`
  const isActive = (it: Item) => {
    const baseHref = it.href.split("?")[0];
    if (baseHref === "/") return pathname === "/";
    const pathMatches = [baseHref, ...(it.also ?? [])].some((h) => pathname === h || pathname.startsWith(`${h}/`));
    if (!pathMatches) return false;
    if (it.matchBrandType === "COUNTER") {
      return pathname === "/content/shopPage" || currentType === "COUNTER";
    }
    if (it.matchBrandType === "SALON") {
      return pathname !== "/content/shopPage" && currentType !== "COUNTER";
    }
    return true;
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
              .filter((it) => !it.allowedRoles || it.allowedRoles.includes(user.role as Role))
              .map((it) => {
                const { href, label, icon: Icon, badge } = it;
                const active = isActive(it);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                        active ? "bg-brand-soft font-medium text-brand" : "text-ink/80 hover:bg-sand hover:text-ink",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1">{label}</span>
                      {!!badge && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-white">{badge}</span>}
                    </Link>
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
      <div className="flex items-center gap-2 px-1 py-1">
        <Link
          href="/profile"
          title="ดูบัญชีผู้ใช้และเปลี่ยนรหัสผ่าน"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand hover:opacity-80 transition-opacity"
        >
          {user.name.slice(0, 1)}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href="/profile"
            title="ดูบัญชีผู้ใช้และเปลี่ยนรหัสผ่าน"
            className="block truncate text-sm font-medium hover:text-brand transition-colors"
          >
            {user.name}
          </Link>
          <span className="block truncate text-xs text-muted">
            {roleLabels[user.role as Role] ? roleLabels[user.role as Role].split(" ")[0] : user.role}
          </span>
        </div>
        <Link
          href="/profile"
          aria-label="เปลี่ยนรหัสผ่าน"
          title="เปลี่ยนรหัสผ่าน"
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-ink"
        >
          <KeyRound className="size-4" />
        </Link>
        <form action={logout}>
          <button
            type="submit"
            aria-label="ออกจากระบบ"
            title="ออกจากระบบ"
            className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          >
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

export function Sidebar(props: { user: { name: string; email: string; role: string }; newInquiries: number }) {
  return (
    <Suspense fallback={null}>
      <SidebarInner {...props} />
    </Suspense>
  );
}
