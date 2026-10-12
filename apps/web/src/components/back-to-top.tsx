"use client";

import clsx from "clsx";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_AFTER = 600;
const R = 22;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Floating "back to top" button with a scroll-progress ring. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > SHOW_AFTER);
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="กลับขึ้นด้านบน"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={clsx(
        "group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-13 place-items-center rounded-full border border-line bg-white/90 text-ink shadow-lg shadow-ink/10 backdrop-blur transition-all duration-300 sm:right-6 sm:bottom-6",
        "hover:-translate-y-1 hover:border-brand-pink/40 hover:text-brand-pink hover:shadow-[0_16px_36px_-14px_rgb(214_41_127/0.45)]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg viewBox="0 0 52 52" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="26" cy="26" r={R} fill="none" stroke="var(--color-line)" strokeWidth="2" />
        <circle
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke="var(--color-brand-pink)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <ArrowUp className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
