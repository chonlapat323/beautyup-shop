"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, Download, Images, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDict } from "@/i18n/client";

/**
 * Media photos: a large cover (optional) plus a thumbnail grid. Any photo opens in an
 * on-page viewer with previous/next, keyboard arrows, swipe, and per-photo download.
 */
export function MediaGallery({ images, title, slug, cover = true }: { images: string[]; title: string; slug: string; cover?: boolean }) {
  const d = useDict().gallery;
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const count = images.length;

  const show = useCallback((i: number) => setOpen(((i % count) + count) % count), [count]);
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(open + 1);
      else if (e.key === "ArrowLeft") show(open - 1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, show, close]);

  if (!count) return null;
  const [first, ...rest] = images;
  const thumbs = cover ? rest : images;
  const offset = cover ? 1 : 0;
  // Remember what was clicked, so closing the viewer returns focus there
  const openFrom = (el: HTMLElement, i: number) => {
    opener.current = el;
    show(i);
  };

  return (
    <>
      {cover && (
        <button type="button" onClick={(e) => openFrom(e.currentTarget, 0)} aria-label={d.open(1, count)} className="group mt-8 block w-full overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element -- uploads served by the API */}
          <img src={first} alt={title} className="aspect-[16/9] w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        </button>
      )}

      {thumbs.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {thumbs.map((src, i) => (
            <li key={src + i}>
              <button type="button" onClick={(e) => openFrom(e.currentTarget, i + offset)} aria-label={d.open(i + offset + 1, count)} className="group block w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- uploads served by the API */}
                <img src={src} alt="" loading="lazy" className="aspect-square w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a href={`/api/media/${slug}/download`} download className="btn btn-outline">
          <Download className="size-4" /> {d.downloadAll(count)}
        </a>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Images className="size-4" /> {d.count(count)}
        </span>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 text-white backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) show(open + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <span className="text-sm tabular-nums text-white/80" aria-live="polite">
              {open + 1} / {count}
            </span>
            <div className="flex items-center gap-2">
              <a href={`/api/media/${slug}/download?i=${open}`} download className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm hover:bg-white/20">
                <Download className="size-4" /> <span className="hidden sm:inline">{d.download}</span>
              </a>
              <button ref={closeBtn} type="button" onClick={close} aria-label={d.close} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-16" onClick={(e) => e.target === e.currentTarget && close()}>
            {/* eslint-disable-next-line @next/next/no-img-element -- uploads served by the API */}
            <img key={open} src={images[open]} alt={`${title} ${open + 1}`} className="max-h-full max-w-full animate-fade-up rounded-lg object-contain shadow-2xl" />
            {count > 1 && (
              <>
                <button type="button" onClick={() => show(open - 1)} aria-label={d.prev} className={clsx(navBtn, "left-2 sm:left-4")}>
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => show(open + 1)} aria-label={d.next} className={clsx(navBtn, "right-2 sm:right-4")}>
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {count > 1 && (
            <ul className="flex justify-center gap-2 overflow-x-auto px-3 pb-4 [scrollbar-width:none]">
              {images.map((src, i) => (
                <li key={src + i} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => show(i)}
                    aria-label={d.open(i + 1, count)}
                    aria-current={i === open ? "true" : undefined}
                    className={clsx("block size-14 overflow-hidden rounded-lg border-2 transition-opacity", i === open ? "border-white" : "border-transparent opacity-50 hover:opacity-100")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- uploads served by the API */}
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

const navBtn = "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/25";
