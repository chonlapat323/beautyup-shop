"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingImage } from "./loading-image";

interface SlideItem {
  imageUrl: string;
  caption?: string;
}

export function AboutSlider({
  slides,
  title = "ภาพกิจกรรมและบรรยากาศบิวตี้อัพ",
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

  const current = slides[active];

  return (
    <section className="container-page py-8 md:py-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink">
          {title}
        </h2>
        {slides.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="flex size-8 items-center justify-center rounded-full border border-line bg-white text-muted hover:border-ink hover:text-ink transition-colors"
              aria-label={paused ? "เล่นสไลด์อัตโนมัติ" : "หยุดสไลด์ชั่วคราว"}
            >
              {paused ? <Play className="size-3.5 fill-current" /> : <Pause className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={prevSlide}
              className="flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-sand/60 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-sand/60 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div
        className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl bg-sand/30 shadow-lg shadow-brand-pink/5"
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
              <LoadingImage
                src={s.imageUrl}
                alt={s.caption || `Slide ${idx + 1}`}
                loading={idx === 0 ? "eager" : "lazy"}
                className="size-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
              />
              {s.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 sm:p-6 text-white backdrop-blur-[2px]">
                  <p className="font-display text-base sm:text-xl font-medium drop-shadow-sm">
                    {s.caption}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`ไปที่สไลด์ ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-5 bg-brand-pink" : "w-1.5 bg-white/60 hover:bg-white",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
