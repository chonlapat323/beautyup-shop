"use client";

import clsx from "clsx";
import { ChevronDown, Globe, LogOut, Menu, Search, User, X } from "lucide-react";
import NextLink from "next/link";
import Link from "@/components/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutMember } from "@/app/member-actions";
import { useDict, useLang } from "@/i18n/client";
import { LoadingImage } from "./loading-image";
import { Skeleton } from "./skeleton";
import type { MenuItem } from "@/lib/types";
import { Logo } from "./logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Same page in the other language. */
const LANG_PREFIX = /^\/(th|en)(?=\/|$)/;

type HeaderMember = { name: string; avatarUrl: string };

/**
 * Signed-in member for the header. Fetched in the browser so pages stay static;
 * re-checked on navigation (login / logout redirect to another page).
 */
function useMember(pathname: string) {
  // undefined = still checking (renders a skeleton instead of flashing "Log in")
  const [member, setMember] = useState<HeaderMember | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/member", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => !cancelled && setMember(m))
      .catch(() => !cancelled && setMember(null));
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  return [member, setMember] as const;
}

function MemberAvatar({ member }: { member: HeaderMember }) {
  return member.avatarUrl ? (
    <LoadingImage src={member.avatarUrl} alt="" referrerPolicy="no-referrer" loading="eager" className="size-7 rounded-full object-cover" />
  ) : (
    <span className="grid size-7 place-items-center rounded-full bg-blush text-xs font-semibold text-brand-pink">{member.name.slice(0, 1)}</span>
  );
}

function useAlternate() {
  const lang = useLang();
  const pathname = usePathname();
  const other = lang === "th" ? "en" : "th";
  return { other, href: pathname.replace(LANG_PREFIX, `/${other}`) };
}

export function SiteHeader({ menu }: { menu: MenuItem[] }) {
  const dict = useDict();
  const alt = useAlternate();
  // Menu hrefs have no language prefix, so compare against the unprefixed path
  const pathname = usePathname().replace(LANG_PREFIX, "") || "/";
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [dismissedMenu, setDismissedMenu] = useState<string | null>(null);
  const [memberHovered, setMemberHovered] = useState(false);
  const [memberDismissed, setMemberDismissed] = useState(false);
  const lang = useLang();
  const [member, setMember] = useMember(pathname);
  const logout = () => {
    setMember(null);
    setOpen(false);
    setMemberDismissed(true);
    void logoutMember(lang);
  };

  useEffect(() => {
    setOpen(false);
    setHoveredMenu(null);
    setDismissedMenu(null);
    setMemberHovered(false);
    setMemberDismissed(false);
  }, [pathname]);

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
    <>
    <header
      className={clsx(
        "sticky top-0 z-40 transition-[background-color,box-shadow] duration-300",
        scrolled || open
          ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl"
          : "bg-cream",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-2 lg:h-20 xl:gap-4">
        <Link href="/" aria-label={`BeautyUp ${dict.common.home}`} className="shrink-0 transition-opacity hover:opacity-70">
          <Logo priority />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0 xl:gap-2">
            {menu.map((item) => {
              const isDropdownOpen = item.children && hoveredMenu === item.href && dismissedMenu !== item.href;
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredMenu(item.href);
                    setDismissedMenu(null);
                  }}
                  onMouseLeave={() => {
                    setHoveredMenu(null);
                    setDismissedMenu(null);
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setDismissedMenu(item.href);
                      setHoveredMenu(null);
                      setOpen(false);
                      (document.activeElement as HTMLElement)?.blur();
                    }}
                    className={clsx(
                      "flex items-center gap-1 rounded-full px-1.5 py-2 text-sm whitespace-nowrap transition-colors xl:px-3 xl:text-[0.9375rem] hover:bg-sand hover:text-accent",
                      isActive(pathname, item.href) ? "text-accent" : "text-ink",
                      isDropdownOpen && "text-accent bg-sand/50",
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={clsx(
                          "size-3.5 transition-transform duration-200",
                          isDropdownOpen && "rotate-180 text-accent",
                        )}
                      />
                    )}
                  </Link>
                  {item.children && (
                    <div
                      className={clsx(
                        "absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200",
                        isDropdownOpen
                          ? "visible opacity-100 translate-y-0"
                          : "invisible opacity-0 translate-y-1 pointer-events-none",
                      )}
                    >
                      <ul className="min-w-60 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-ink/5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => {
                                setDismissedMenu(item.href);
                                setHoveredMenu(null);
                                setOpen(false);
                                (document.activeElement as HTMLElement)?.blur();
                              }}
                              className="block rounded-xl px-4 py-2.5 text-sm text-ink transition-colors hover:bg-mist hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label={dict.common.search}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-sand"
          >
            <Search className="size-5" />
          </Link>
          <NextLink
            href={alt.href}
            hrefLang={alt.other}
            aria-label={dict.common.switchLanguageLabel}
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm transition-colors hover:bg-sand hover:text-accent"
          >
            <Globe className="size-4" />
            <span className="hidden xl:inline">{dict.common.switchLanguage}</span>
            <span className="xl:hidden">{alt.other.toUpperCase()}</span>
          </NextLink>
          {member === undefined ? (
            <Skeleton className="hidden h-9 w-11 rounded-full sm:block xl:w-36" />
          ) : member ? (
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => {
                setMemberHovered(true);
                setMemberDismissed(false);
              }}
              onMouseLeave={() => {
                setMemberHovered(false);
                setMemberDismissed(false);
              }}
            >
              <Link
                href="/account"
                title={member.name}
                aria-label={dict.member.myAccount}
                onClick={() => {
                  setMemberDismissed(true);
                  (document.activeElement as HTMLElement)?.blur();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-line py-1 pr-2.5 pl-1 text-sm transition-colors hover:border-ink xl:gap-2 xl:pr-3"
              >
                <MemberAvatar member={member} />
                <span className="hidden max-w-28 truncate xl:inline">{dict.member.myAccount}</span>
                <ChevronDown
                  className={clsx(
                    "size-3.5 transition-transform duration-200",
                    memberHovered && !memberDismissed && "rotate-180",
                  )}
                />
              </Link>
              <div
                className={clsx(
                  "absolute top-full right-0 pt-2 transition-all duration-200",
                  memberHovered && !memberDismissed
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 translate-y-1 pointer-events-none",
                )}
              >
                <div className="w-56 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-ink/5">
                  <p className="truncate px-3 pt-1 pb-2 text-xs text-muted">{member.name}</p>
                  <Link
                    href="/account"
                    onClick={() => {
                      setMemberDismissed(true);
                      (document.activeElement as HTMLElement)?.blur();
                    }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-mist hover:text-accent"
                  >
                    <User className="size-4" />
                    {dict.member.myAccount}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="size-4" />
                    {dict.member.logout}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"

              className="hidden items-center gap-2 rounded-full border border-ink px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-cream sm:inline-flex"
            >
              <User className="size-4" />
              {dict.common.login}
            </Link>
          )}
          <button
            type="button"
            aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-sand lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer. Kept outside <header>: the header's backdrop-filter would
          become the containing block for this fixed element and collapse it to 0px. */}
      <div
        id="mobile-menu"
        className={clsx(
          "fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto overscroll-contain border-t border-line bg-cream transition-[opacity,visibility] duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav
          aria-label="Mobile"
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
                            {dict.common.all}
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
          {member === undefined ? (
            <Skeleton className="mt-8 h-11 rounded-full" />
          ) : member ? (
            <div className="mt-8 grid gap-2">
              <Link href="/account" className="btn btn-primary w-full">
                <MemberAvatar member={member} />
                {dict.member.myAccount} · {member.name}
              </Link>
              <button type="button" onClick={logout} className="btn btn-outline w-full">
                <LogOut className="size-4" />
                {dict.member.logout}
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary mt-8 w-full">
              <User className="size-4" />
              {dict.common.loginOrRegister}
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
