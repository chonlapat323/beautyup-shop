"use client";

import clsx from "clsx";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Link from "@/components/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDict } from "@/i18n/client";
import { LoadingImage } from "./loading-image";
import { PinkBlackHoleEffect } from "./pink-black-hole";
import type { HeroSlide } from "@/lib/types";

const INTERVAL = 5500;

export function HomeHero({
  slides,
  salonCount = 0,
}: {
  slides: HeroSlide[];
  salonCount?: number;
}) {
  const dict = useDict();
  const h = dict.home;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(nextSlide, INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, slides.length, nextSlide]);

  if (!slides.length) return null;

  const current = slides[active];

  return (
    <section className="relative overflow-hidden bg-sand/30">
      <div className="container-page grid grid-cols-1 items-center gap-10 pt-8 pb-14 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-10 lg:pb-16">
        {/* Copy: Left column */}
        <div className="text-center lg:col-span-6 lg:text-left">
          <p className="eyebrow animate-fade-up !text-brand-pink">{h.eyebrow}</p>
          <h1 className="mt-4 font-display text-[2.75rem] leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            <span className="block animate-fade-up [animation-delay:80ms]">{h.headline1}</span>
            <span className="block animate-fade-up [animation-delay:160ms]">
              {h.headline2Before}
              <span className="text-brand-pink">{h.headline2Accent}</span>
              {h.headline2After}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md animate-fade-up text-lg text-pretty text-muted [animation-delay:240ms] lg:mx-0">
            {h.lead}
          </p>
          <div className="mt-8 flex animate-fade-up flex-col items-center gap-3 [animation-delay:320ms] sm:flex-row sm:justify-center lg:items-stretch lg:justify-start">
            <Link href="/products" className="btn btn-primary group/btn !px-7">
              {h.ctaProducts}
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
            <Link href="/contact/salon-partner" className="btn btn-outline !px-7">
              {h.ctaSalon}
            </Link>
          </div>

          <dl className="mx-auto mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4 border-t border-line pt-6 [animation-delay:400ms] lg:mx-0">
            {[
              { value: `${salonCount}+`, label: h.statSalons },
              { value: "3", label: h.statBrands },
              { value: h.founded, label: h.statFounded },
            ].map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl sm:text-3xl font-semibold text-ink">{s.value}</dd>
                <dd className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual: Right column (16:9 Carousel banner fitting comfortably without pixelation) */}
        <div
          className="relative lg:col-span-6 w-full"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current !== null) {
              const deltaX = e.changedTouches[0].clientX - touchStartX.current;
              if (deltaX > 40) prevSlide();
              else if (deltaX < -40) nextSlide();
              touchStartX.current = null;
            }
            setPaused(false);
          }}
        >
          {/* Ambient Brand-Pink Glow Backdrop (Aura ละอองแสงสีชมพู) */}
          <div aria-hidden className="pointer-events-none absolute -inset-16 sm:-inset-24 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 sm:size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.18),transparent_70%)] blur-3xl animate-drift motion-reduce:animate-none" />
            <div className="absolute -top-10 -right-10 size-56 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.15),transparent_65%)] blur-2xl" />
          </div>

          {/* Floating Dreamy Pink Dust (Spans freely without rectangular bounding box) */}
          <PinkBlackHoleEffect className="-inset-16 sm:-inset-24 w-[calc(100%+8rem)] sm:w-[calc(100%+12rem)] h-[calc(100%+8rem)] sm:h-[calc(100%+12rem)]" />

          {/* Seamless Banner Box: No harsh borders, smooth blended edges with soft shadow */}
          <div className="relative mx-auto aspect-[16/9] w-full max-w-[580px] overflow-hidden rounded-3xl shadow-xl shadow-brand-pink/5">
            {slides.map((s, i) => {
              const isCurrent = i === active;
              const href = s.href || "/products";

              return (
                <div
                  key={s.imageUrl || i}
                  aria-hidden={!isCurrent}
                  className={clsx(
                    "absolute inset-0 size-full transition-opacity duration-700 ease-in-out",
                    isCurrent ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0",
                  )}
                >
                  <Link
                    href={href}
                    tabIndex={isCurrent ? 0 : -1}
                    className="group relative block size-full cursor-pointer overflow-hidden"
                  >
                    {s.imageUrl ? (
                      <LoadingImage
                        src={s.imageUrl}
                        alt={s.product || "Banner Slide"}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: s.tint || "#1c1917" }}
                        className="flex size-full items-center justify-center text-white"
                      >
                        <span className="font-display text-2xl">{s.product}</span>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  aria-label="Previous slide"
                  className="absolute left-2.5 top-1/2 z-20 -translate-y-1/2 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95"
                >
                  <ChevronLeft className="size-5 sm:size-6 -translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  aria-label="Next slide"
                  className="absolute right-2.5 top-1/2 z-20 -translate-y-1/2 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95"
                >
                  <ChevronRight className="size-5 sm:size-6 translate-x-0.5" />
                </button>
              </>
            )}

            {/* Indicators & Play/Pause Controls */}
            {slides.length > 1 && (
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active ? "true" : undefined}
                    className={clsx(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active
                        ? "w-5 bg-brand-pink"
                        : "w-1.5 bg-white/60 hover:bg-white",
                    )}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => setPaused(!paused)}
                  aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                  className="ml-1 text-white/80 hover:text-white transition-colors"
                >
                  {paused ? <Play className="size-3 fill-current" /> : <Pause className="size-3 fill-current" />}
                </button>
              </div>
            )}
          </div>

          {/* Caption underneath the banner */}
          {current?.caption && (
            <p className="mt-2.5 text-center text-xs text-muted truncate">
              {current.caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
