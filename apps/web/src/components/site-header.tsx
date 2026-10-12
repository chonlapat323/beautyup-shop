"use client";

import clsx from "clsx";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/types";
import { Logo } from "./logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader({ menu }: { menu: MenuItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled || open
          ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl"
          : "bg-cream",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" aria-label="BeautyUp หน้าหลัก" className="shrink-0 transition-opacity hover:opacity-70">
          <Logo priority />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="เมนูหลัก" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {menu.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-1 rounded-full px-3 py-2 text-[0.9375rem] transition-colors hover:bg-sand hover:text-accent group-focus-within:text-accent group-hover:text-accent",
                    isActive(pathname, item.href) ? "text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                  )}
                </Link>
                {item.children && (
                  <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-60 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-ink/5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-xl px-4 py-2.5 text-sm text-ink transition-colors hover:bg-cream hover:text-accent"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="ค้นหา"
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-sand"
          >
            <Search className="size-5" />
          </Link>
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-cream sm:inline-flex"
          >
            <User className="size-4" />
            เข้าสู่ระบบ
          </Link>
          <button
            type="button"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-sand lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={clsx(
          "fixed inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain bg-cream transition-[opacity,visibility] duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav
          aria-label="เมนูมือถือ"
          className="container-page pt-2 pb-10"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          <ul className="divide-y divide-line border-b border-line">
            {menu.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={expanded === item.href}
                      onClick={() =>
                        setExpanded((v) => (v === item.href ? null : item.href))
                      }
                      className="flex min-h-14 w-full items-center justify-between text-left text-lg transition-colors hover:text-accent"
                    >
                      {item.label}
                      <ChevronDown
                        className={clsx(
                          "size-5 text-muted transition-transform",
                          expanded === item.href && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        "grid transition-[grid-template-rows] duration-300",
                        expanded === item.href ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <ul className="overflow-hidden">
                        <li>
                          <Link href={item.href} className="flex min-h-11 items-center pl-4 text-muted transition-colors hover:text-accent">
                            ทั้งหมด
                          </Link>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="flex min-h-11 items-center pl-4 text-muted transition-colors hover:text-accent">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                        <li className="h-3" aria-hidden />
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex min-h-14 items-center text-lg transition-colors hover:text-accent",
                      isActive(pathname, item.href) && "text-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link href="/login" className="btn btn-primary mt-8 w-full">
            <User className="size-4" />
            เข้าสู่ระบบ / สมัครสมาชิก
          </Link>
        </nav>
      </div>
    </header>
  );
}
