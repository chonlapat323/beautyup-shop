import clsx from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "@/components/link";
import type { CSSProperties, ReactNode } from "react";
import type { Socials } from "@/lib/types";
import { LoadingImage } from "./loading-image";
import { MockImagePlaceholder } from "./mock-image-placeholder";

export { MockImagePlaceholder };

/**
 * Image slot. Shows the image when `src` is set, otherwise a clean neutral-gray mock placeholder
 * so unhandled / pending photos are clearly identified.
 */
export function Media({
  src,
  alt = "",
  label,
  className,
  fit = "cover",
}: {
  src?: string;
  alt?: string;
  label?: string;
  tone?: number;
  className?: string;
  /** "cover" (default) fills the frame and crops; "contain" fits the whole image, for logos/wordmarks that must not be cropped. */
  fit?: "cover" | "contain";
}) {
  if (src) {
    return <LoadingImage src={src} alt={alt} className={clsx(fit === "contain" ? "object-contain" : "object-cover", className)} />;
  }
  return <MockImagePlaceholder label={label || alt} className={className} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      data-reveal suppressHydrationWarning
      className={clsx(
        "mb-10 flex flex-col gap-6 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={clsx("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 font-display text-3xl leading-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base text-pretty text-muted sm:text-lg">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-[linear-gradient(160deg,#fdf2f8_0%,#fdfcfb_60%,#fdfcfb_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.15),transparent_70%)] blur-3xl"
      />
      <div className="container-page relative animate-fade-up py-12 sm:py-16 lg:py-24">
        {eyebrow && (
          <p className="eyebrow flex items-center gap-2">
            <span aria-hidden className="h-px w-6 bg-brand-pink" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.15] text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base text-pretty text-muted sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2 font-medium text-ink transition-colors hover:text-accent"
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

const socialIcons: Record<keyof Socials, { label: string; icon: ReactNode; hoverClass: string }> = {
  facebook: {
    label: "Facebook",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    hoverClass: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:shadow-[0_4px_12px_rgba(24,119,242,0.35)]",
  },
  instagram: {
    label: "Instagram",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    hoverClass: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:text-white hover:shadow-[0_4px_12px_rgba(220,39,67,0.35)]",
  },
  tiktok: {
    label: "TikTok",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    hoverClass: "hover:bg-black hover:border-black hover:text-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
  },
  youtube: {
    label: "YouTube",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    hoverClass: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:shadow-[0_4px_12px_rgba(255,0,0,0.35)]",
  },
  line: {
    label: "LINE",
    icon: (
      <svg className="size-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.019 9.572.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.589-3.844 2.589-5.956zm-15.011 2.378h-2.136a.669.669 0 0 1-.669-.669V7.987a.669.669 0 0 1 .669-.669h2.136a.669.669 0 1 1 0 1.338H7.523v1.025h1.466a.669.669 0 1 1 0 1.338H7.523v1.025h1.466a.669.669 0 1 1 0 1.338zm3.328 0h-1.338a.669.669 0 0 1-.669-.669V7.987a.669.669 0 0 1 1.338 0v4.026a.669.669 0 0 1-.669.669zm4.675 0a.669.669 0 0 1-.502-.227l-2.007-2.615v2.173a.669.669 0 1 1-1.338 0V7.987a.669.669 0 0 1 .502-.227.669.669 0 0 1 .502.227l2.007 2.615V8.428a.669.669 0 1 1 1.338 0v4.253a.669.669 0 0 1-.669.669zm3.328 0h-2.136a.669.669 0 0 1-.669-.669V7.987a.669.669 0 0 1 1.338 0v3.357h1.467a.669.669 0 1 1 0 1.338z" />
      </svg>
    ),
    hoverClass: "hover:bg-[#06C755] hover:border-[#06C755] hover:text-white hover:shadow-[0_4px_12px_rgba(6,199,85,0.35)]",
  },
};

export function SocialLinks({ socials, className }: { socials?: Socials; className?: string }) {
  if (!socials) return null;
  const entries = (Object.entries(socials) as [keyof Socials, string][]).filter(([, href]) => Boolean(href));
  if (entries.length === 0) return null;

  return (
    <ul className={clsx("flex flex-wrap items-center gap-1.5", className)}>
      {entries.map(([key, href]) => {
        const item = socialIcons[key];
        if (!item) return null;
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title={item.label}
              aria-label={item.label}
              className={clsx(
                "group relative flex size-8 items-center justify-center rounded-full border border-line bg-white text-stone-700 shadow-xs transition-all duration-300 hover:-translate-y-0.5",
                item.hoverClass,
              )}
            >
              {item.icon}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-ink px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-cream">
      {children}
    </span>
  );
}

export function formatPrice(n: number) {
  return `฿${n.toLocaleString("th-TH")}`;
}

export function formatDate(iso: string, lang: "th" | "en" = "th") {
  return new Date(iso).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Stagger index for [data-reveal] items (see RevealObserver). */
export function stagger(i: number) {
  return { "--i": i } as CSSProperties;
}

export { VideoPlayer } from "./video-player";
