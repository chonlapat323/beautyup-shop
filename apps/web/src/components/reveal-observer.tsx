"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements up as they scroll into view.
 * Content stays visible without JS: hiding only starts once this runs.
 * Stagger with `style={{ "--i": n }}`. Elements need `suppressHydrationWarning`:
 * this script may mark them before React has hydrated them.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.setAttribute("data-reveal-on", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.shown = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const observe = () =>
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")
        .forEach((el) => io.observe(el));
    observe();

    // Pick up content rendered later (filters, "load more", streamed sections)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
