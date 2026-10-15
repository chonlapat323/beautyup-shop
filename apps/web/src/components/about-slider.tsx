"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingImage } from "./loading-image";

interface SlideItem {
  imageUrl: string;
  caption?: string;
}

export function AboutSlider({
  slides,
  title = "ภาพกิจกรรม & บรรยากาศบิวตี้อัพ",
}: {
  slides: SlideItem[];
  title?: string;
}) {
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
    const timer = window.setInterval(nextSlide, 5000);
    return () => window.clearInterval(timer);
  }, [paused, slides.length, nextSlide]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="container-page py-6 md:py-10">
      {/* Centered Heading */}
      <div className="mx-auto mb-4 max-w-2xl text-center">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-ink">
          {title}
        </h2>
      </div>

      {/* Centered & Compact 16:9 Slider Box (max-w-2xl) */}
      <div
        className="group relative mx-auto aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-900/95 shadow-xl shadow-brand-pink/5"
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
        {slides.map((s, idx) => {
          const isCurrent = idx === active;
          return (
            <div
              key={s.imageUrl || idx}
              aria-hidden={!isCurrent}
              className={clsx(
                "absolute inset-0 size-full transition-opacity duration-700 ease-in-out",
                isCurrent ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0",
              )}
            >
              {/* Ambient blurred backdrop: Softly fills empty margins with matching color ambiance */}
              <div className="pointer-events-none absolute inset-0 size-full overflow-hidden" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl}
                  alt=""
                  className="size-full object-cover blur-2xl scale-125 opacity-30"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>

              {/* Main Image: 100% natural aspect ratio, NEVER cropped, NEVER stretched */}
              <div className="relative z-10 flex size-full items-center justify-center p-2 sm:p-3">
                <LoadingImage
                  src={s.imageUrl}
                  alt={s.caption || `Slide ${idx + 1}`}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="max-h-full max-w-full object-contain object-center drop-shadow-md"
                />
              </div>

              {s.caption && (
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-5 text-white backdrop-blur-[2px]">
                  <p className="font-display text-sm sm:text-base font-medium drop-shadow-sm text-center">
                    {s.caption}
                  </p>
                </div>
              )}
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
              className="absolute left-2.5 top-1/2 z-20 -translate-y-1/2 flex size-8 sm:size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2.5 top-1/2 z-20 -translate-y-1/2 flex size-8 sm:size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/70 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          </>
        )}

        {/* Indicators Centered at Bottom */}
        {slides.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 backdrop-blur-md">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-4 bg-brand-pink" : "w-1.5 bg-white/60 hover:bg-white",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
