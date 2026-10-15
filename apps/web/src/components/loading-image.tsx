"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { MockImagePlaceholder } from "./mock-image-placeholder";

/**
 * <img> that shows a pulsing skeleton behind itself until the file has loaded,
 * then fades in. Automatically falls back to a neutral gray mock placeholder if src is missing
 * or fails to load, ensuring no broken or random images are displayed.
 */
export function LoadingImage({
  className,
  onLoad,
  onError,
  alt = "",
  src,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Images served from the browser cache can finish before hydration
  useEffect(() => {
    if (ref.current?.complete) {
      if (ref.current.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setHasError(true);
      }
    }
  }, [src]);

  // If no src is set or loading failed, show the gray mock placeholder
  if (!src || src === "" || hasError) {
    return <MockImagePlaceholder label={alt || undefined} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- images come from the API's uploads (any host)
    <img
      ref={ref}
      loading="lazy"
      decoding="async"
      src={src}
      {...props}
      alt={alt}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      className={clsx(
        "transition-opacity duration-500",
        loaded ? "opacity-100" : "animate-pulse bg-neutral-200 opacity-90 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
