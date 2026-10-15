"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Link from "@/components/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDict } from "@/i18n/client";
import { LoadingImage } from "./loading-image";
import { PinkBlackHoleEffect } from "./pink-black-hole";
import type { MenuSlideItem } from "@/lib/types";

const INTERVAL = 7000;

export function MenuSlideCarousel({ slides }: { slides: MenuSlideItem[] }) {
  const dict = useDict();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || isHovered || slides.length < 2) return;
    const id = window.setInterval(nextSlide, INTERVAL);
    return () => window.clearInterval(id);
  }, [isPaused, isHovered, slides.length, nextSlide]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-4 sm:py-8">
      <div className="container-page relative">
        <div
          className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            setIsHovered(true);
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current !== null) {
              const deltaX = e.changedTouches[0].clientX - touchStartX.current;
              if (deltaX > 40) prevSlide();
              else if (deltaX < -40) nextSlide();
              touchStartX.current = null;
            }
            setIsHovered(false);
          }}
        >
          {/* Ambient Brand-Pink Glow Backdrop (Aura ละอองแสงสีชมพู เหมือนหน้า Home) */}
          <div aria-hidden className="pointer-events-none absolute -inset-16 sm:-inset-24 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 sm:size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.18),transparent_70%)] blur-3xl animate-drift motion-reduce:animate-none" />
            <div className="absolute -top-10 -right-10 size-56 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.15),transparent_65%)] blur-2xl" />
          </div>

          {/* Floating Dreamy Pink Dust Effect (เหมือนหน้า Home) */}
          <PinkBlackHoleEffect className="-inset-16 sm:-inset-24 w-[calc(100%+8rem)] sm:w-[calc(100%+12rem)] h-[calc(100%+8rem)] sm:h-[calc(100%+12rem)]" />

          {/* Banner Box with Smooth Rounded Edges and Soft Shadow */}
          <div className="relative mx-auto aspect-[16/8] sm:aspect-[21/9] min-h-[280px] sm:min-h-[380px] w-full overflow-hidden rounded-3xl shadow-xl shadow-brand-pink/5 border border-line/60 bg-black">
            {slides.map((s, i) => {
              const isCurrent = i === active;
              const href = s.href || "#";

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
                        alt=""
                        loading={i === 0 ? "eager" : "lazy"}
                        className="size-full object-cover object-center opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-zinc-900 text-white">
                        <span className="font-sans text-2xl font-bold">{s.title}</span>
                      </div>
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                    {/* Slide Captions */}
                    {(s.title || s.caption) && (
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14 text-white">
                        {s.title && (
                          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-2xl text-balance">
                            {s.title}
                          </h2>
                        )}
                        {s.caption && (
                          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-white/80 max-w-xl text-pretty line-clamp-3">
                            {s.caption}
                          </p>
                        )}
                        {s.href && s.href !== "#" && (
                          <div className="mt-4 sm:mt-6">
                            <span className="btn btn-primary !px-5 !min-h-9 sm:!min-h-11 text-xs sm:text-sm font-semibold inline-flex items-center gap-2">
                              {dict.common.learnMore || "ดูเพิ่มเติม"} →
                            </span>
                          </div>
                        )}
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
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95"
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
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex size-9 sm:size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95"
                >
                  <ChevronRight className="size-5 sm:size-6 translate-x-0.5" />
                </button>
              </>
            )}

            {/* Indicators & Play/Pause Controls */}
            {slides.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3.5 py-1.5 backdrop-blur-md border border-white/10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === active ? "true" : undefined}
                    className={clsx(
                      "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                      i === active
                        ? "w-5 sm:w-6 bg-brand-pink shadow-sm shadow-brand-pink/50"
                        : "w-1.5 sm:w-2 bg-white/50 hover:bg-white",
                    )}
                  />
                ))}
                <span className="mx-1 h-3 w-px bg-white/20" aria-hidden />
                <button
                  type="button"
                  onClick={() => {
                    if (isPaused) {
                      setIsPaused(false);
                      setIsHovered(false);
                      nextSlide();
                    } else {
                      setIsPaused(true);
                    }
                  }}
                  aria-label={isPaused ? "Play slide" : "Pause slide"}
                  className="rounded-full p-0.5 text-white/80 transition-colors hover:text-white"
                >
                  {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
