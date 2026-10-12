"use client";

import clsx from "clsx";
import { ArrowRight, Award, Store } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/types";

const INTERVAL = 5000;

export function HomeHero({
  slides,
  salonCount,
}: {
  slides: HeroSlide[];
  salonCount: number;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const slide = slides[active];

  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 pt-8 pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pt-10 lg:pb-20">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p className="eyebrow animate-fade-up !text-brand-pink">Professional Salon Products</p>
          <h1 className="mt-4 font-display text-[2.75rem] leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            <span className="block animate-fade-up [animation-delay:80ms]">เรามอบสิ่งที่ดีที่สุด</span>
            <span className="block animate-fade-up [animation-delay:160ms]">
              เพื่อ<span className="text-brand-pink">ลูกค้า</span>ของคุณ
            </span>
          </h1>
          <p className="mt-6 max-w-md animate-fade-up text-lg text-pretty text-muted [animation-delay:240ms]">
            ผลิตภัณฑ์ซาลอนมืออาชีพนำเข้าจากอิตาลีและบราซิล
            คัดสรรเพื่อร้านเสริมสวยและช่างผมมืออาชีพ
          </p>
          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:320ms] sm:flex-row">
            <Link href="/products" className="btn btn-primary group/btn !px-7">
              ชมสินค้า
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
            <Link href="/contact/salon-partner" className="btn btn-outline !px-7">
              สมัครซาลอน
            </Link>
          </div>

          <dl className="mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4 border-t border-line pt-6 [animation-delay:400ms]">
            {[
              { value: `${salonCount}+`, label: "ซาลอนพันธมิตร" },
              { value: "3", label: "แบรนด์นำเข้า" },
              { value: "2556", label: "ก่อตั้ง" },
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
            {/* Backdrop circle */}
            <div className="absolute inset-[6%] rounded-full bg-blush" />
            <div className="absolute inset-[18%] rounded-full border border-brand-pink/15" />

            {/* Slides */}
            <div aria-roledescription="carousel" aria-label="สินค้าแนะนำ" className="absolute inset-0">
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
                        // eslint-disable-next-line @next/next/no-img-element -- product cut-outs come from the CMS
                        <img src={s.imageUrl} alt="" className="h-full w-auto drop-shadow-2xl" />
                      ) : (
                        <Bottle tint={s.tint} brand={s.brand} />
                      )}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Floating badges */}
            <div className="absolute top-[8%] left-0 flex animate-fade-up items-center gap-3 rounded-2xl border border-line bg-white/90 px-4 py-3 shadow-xl shadow-ink/5 backdrop-blur [animation-delay:500ms] sm:left-[2%]">
              <span className="grid size-9 place-items-center rounded-full bg-blush text-brand-pink">
                <Store className="size-4" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-medium">{salonCount}+ ซาลอน</span>
                <span className="text-xs text-muted">ไว้วางใจทั่วประเทศ</span>
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

          {/* Slide controls */}
          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="เลือกแบรนด์">
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
                {s.brand}
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
