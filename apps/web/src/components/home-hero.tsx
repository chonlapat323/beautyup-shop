"use client";

import clsx from "clsx";
import { ArrowRight, Award, Store } from "lucide-react";
import Link from "@/components/link";
import { useEffect, useRef, useState } from "react";
import { useDict } from "@/i18n/client";
import { LoadingImage } from "./loading-image";
import type { HeroSlide } from "@/lib/types";

const INTERVAL = 5000;

export function HomeHero({
  slides,
  salonCount,
}: {
  slides: HeroSlide[];
  salonCount: number;
}) {
  const dict = useDict();
  const h = dict.home;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const slide = slides[active];
  const parallaxRef = usePointerParallax<HTMLElement>();

  return (
    <section ref={parallaxRef} className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 pt-8 pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-10 lg:pb-20">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="eyebrow animate-fade-up !text-brand-pink">{h.eyebrow}</p>
          <h1 className="mt-4 font-display text-[2.75rem] leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            <span className="block animate-fade-up [animation-delay:80ms]">{h.headline1}</span>
            <span className="block animate-fade-up [animation-delay:160ms]">
              {h.headline2Before}
              <span className="text-brand-pink">{h.headline2Accent}</span>
              {h.headline2After}
            </span>
          </h1>
          <p className="mt-6 max-w-md animate-fade-up text-lg text-pretty text-muted [animation-delay:240ms]">
            {h.lead}
          </p>
          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:320ms] sm:flex-row">
            <Link href="/products" className="btn btn-primary group/btn !px-7">
              {h.ctaProducts}
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
            <Link href="/contact/salon-partner" className="btn btn-outline !px-7">
              {h.ctaSalon}
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4 border-t border-line pt-6 [animation-delay:400ms]">
            {[
              { value: `${salonCount}+`, label: h.statSalons },
              { value: "3", label: h.statBrands },
              { value: h.founded, label: h.statFounded },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div
          className="relative lg:col-span-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative mx-auto aspect-square w-full max-w-[22rem] animate-fade-up sm:max-w-[30rem] lg:max-w-[34rem] [animation-delay:200ms]">
            {/* Soft mist backdrop: blurred colour layers instead of a solid disc.
                The tinted layer cross-fades to match the active product. */}
            <div aria-hidden className="pointer-events-none absolute -inset-[8%] [translate:calc(var(--px,0)*-14px)_calc(var(--py,0)*-10px)]">
              <div className="absolute top-[8%] left-[10%] size-[62%] animate-drift rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.16),transparent_68%)] blur-2xl motion-reduce:animate-none" />
              <div className="absolute right-[6%] bottom-[10%] size-[55%] animate-drift rounded-full bg-[radial-gradient(circle,rgb(196_181_253/0.22),transparent_68%)] blur-2xl [animation-delay:-6s] motion-reduce:animate-none" />
              {slides.map((s, i) => (
                <div
                  key={s.brandSlug}
                  style={{ background: `radial-gradient(circle, ${s.tint}2e, transparent 62%)` }}
                  className={clsx(
                    "absolute inset-[14%] rounded-full blur-3xl transition-opacity duration-1000",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.9),transparent_70%)] blur-xl" />
            </div>
            {/* Contact shadow under the product */}
            <div aria-hidden className="pointer-events-none absolute bottom-[11%] left-1/2 h-[5%] w-[34%] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-xl" />

            {/* Slides */}
            <div aria-roledescription="carousel" aria-label={h.featured} className="absolute inset-0 [translate:calc(var(--px,0)*22px)_calc(var(--py,0)*16px)]">
              {slides.map((s, i) => (
                <Link
                  key={s.brandSlug}
                  href={s.href}
                  aria-hidden={i !== active}
                  tabIndex={i === active ? 0 : -1}
                  className={clsx(
                    "group absolute inset-0 grid place-items-center transition-all duration-700 ease-out",
                    i === active ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
                  )}
                >
                  <span className="sr-only">
                    {s.brand} {s.product}
                  </span>
                  {/* Float and hover live on separate elements: both use `transform`,
                      and sharing one element makes them fight every frame (jitter). */}
                  <span
                    className={clsx(
                      "block h-[72%] will-change-transform motion-reduce:animate-none",
                      i === active && "animate-float",
                    )}
                  >
                    <span className="block h-full transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-[1.03]">
                      {s.imageUrl ? (
                        <LoadingImage src={s.imageUrl} alt="" loading="eager" className="h-full w-auto rounded-3xl drop-shadow-2xl" />
                      ) : (
                        <Bottle tint={s.tint} brand={s.brand} />
                      )}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Floating badges (move against the product for depth) */}
            <div className="pointer-events-none absolute inset-0 [translate:calc(var(--px,0)*-26px)_calc(var(--py,0)*-18px)] *:pointer-events-auto">
            <div className="absolute top-[8%] left-0 flex animate-fade-up items-center gap-3 rounded-2xl border border-line bg-white/90 px-4 py-3 shadow-xl shadow-ink/5 backdrop-blur [animation-delay:500ms] sm:left-[2%]">
              <span className="grid size-9 place-items-center rounded-full bg-blush text-brand-pink">
                <Store className="size-4" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-medium">{h.badgeSalons(salonCount)}</span>
                <span className="text-xs text-muted">{h.badgeSalonsSub}</span>
              </span>
            </div>
            <div className="absolute right-0 bottom-[10%] flex animate-fade-up items-center gap-3 rounded-2xl border border-line bg-white/90 px-4 py-3 shadow-xl shadow-ink/5 backdrop-blur [animation-delay:600ms] sm:right-[2%]">
              <span className="grid size-9 place-items-center rounded-full bg-blush text-brand-pink">
                <Award className="size-4" />
              </span>
              <span className="text-sm leading-tight" aria-live="polite">
                <span className="block font-medium">{slide.product}</span>
                <span className="text-xs text-muted">{slide.brand}</span>
              </span>
            </div>
            </div>
          </div>

          {/* Slide controls */}
          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label={h.chooseBrand}>
            {slides.map((s, i) => (
              <button
                key={s.brandSlug}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={clsx(
                  "min-h-10 rounded-full px-4 text-sm transition-colors",
                  i === active ? "bg-ink text-cream" : "text-muted hover:bg-sand hover:text-ink",
                )}
              >
                {s.brand || s.product}
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-muted">{slide.caption}</p>
        </div>
      </div>
    </section>
  );
}

/** Illustrated bottle used until real product cut-outs are uploaded. */
function Bottle({ tint, brand }: { tint: string; brand: string }) {
  const id = `bottle-${brand.replace(/\W/g, "")}`;
  return (
    <svg viewBox="0 0 160 320" className="h-full w-auto drop-shadow-2xl" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor={tint} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={tint} stopOpacity="0.75" />
          <stop offset="1" stopColor={tint} />
        </linearGradient>
      </defs>
      <rect x="58" y="4" width="44" height="46" rx="8" fill="#1c1917" />
      <rect x="66" y="50" width="28" height="18" fill="#2a2522" />
      <rect x="20" y="66" width="120" height="250" rx="26" fill={`url(#${id})`} />
      <rect x="32" y="80" width="10" height="200" rx="5" fill="white" opacity="0.25" />
      <rect x="36" y="150" width="88" height="96" rx="8" fill="white" opacity="0.92" />
      <text x="80" y="190" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fill="#1c1917">
        {brand.split(" ")[0]}
      </text>
      <line x1="52" y1="204" x2="108" y2="204" stroke={tint} strokeWidth="2" />
      <text x="80" y="226" textAnchor="middle" fontFamily="system-ui" fontSize="9" letterSpacing="2" fill="#6b6762">
        PROFESSIONAL
      </text>
    </svg>
  );
}

/**
 * Writes an eased pointer position (-0.5..0.5) to --px/--py on the element.
 * Mouse/trackpad only; disabled for touch and reduced motion.
 */
function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}
