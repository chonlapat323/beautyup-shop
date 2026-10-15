"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export function TableImage({
  src,
  alt = "",
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <span
        className="grid size-11 place-items-center rounded-lg border border-dashed border-line bg-mist/60 text-muted"
        title="ยังไม่มีรูปภาพ (รอจัดการรูป)"
      >
        <ImageOff className="size-4 text-muted/60" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- user uploaded images from any host
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className || "size-11 rounded-lg border border-line bg-mist object-contain"}
    />
  );
}
