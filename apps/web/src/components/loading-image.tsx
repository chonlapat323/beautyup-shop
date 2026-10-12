"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/**
 * <img> that shows a pulsing skeleton behind itself until the file has loaded,
 * then fades in. Same element, so layout classes (aspect ratio, hover zoom) still apply.
 */
export function LoadingImage({ className, onLoad, alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Images served from the browser cache can finish before hydration
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- images come from the API's uploads (any host)
    <img
      ref={ref}
      loading="lazy"
      decoding="async"
      {...props}
      alt={alt}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={() => setLoaded(true)}
      className={clsx(
        "transition-opacity duration-500",
        loaded ? "opacity-100" : "animate-pulse bg-sand opacity-90 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
