"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge, Media } from "@/components/ui";

export function ProductImageGallery({
  images,
  alt,
  label,
  badges,
}: {
  images: string[];
  alt: string;
  label?: string;
  badges?: string[];
}) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0];

  return (
    <div className="space-y-3 md:sticky md:top-28 md:self-start">
      <div className="relative overflow-hidden rounded-3xl">
        <Media src={current} alt={alt} label={label} className="aspect-square w-full" />
        {badges?.length ? (
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        ) : null}

        {list.length > 1 && (
          <>
            <button
              type="button"
              aria-label="รูปก่อนหน้า"
              onClick={() => setActive((i) => (i > 0 ? i - 1 : list.length - 1))}
              className="absolute top-1/2 left-3 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="รูปถัดไป"
              onClick={() => setActive((i) => (i < list.length - 1 ? i + 1 : 0))}
              className="absolute top-1/2 right-3 -translate-y-1/2 grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {list.map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`ดูรูปที่ ${idx + 1}`}
              className={clsx(
                "relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition",
                idx === active ? "border-accent ring-2 ring-accent/25" : "border-line opacity-75 hover:opacity-100",
              )}
            >
              <Media src={src} alt={`${alt} (${idx + 1})`} className="size-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
