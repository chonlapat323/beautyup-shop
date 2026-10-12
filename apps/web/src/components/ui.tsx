import clsx from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "@/components/link";
import type { CSSProperties, ReactNode } from "react";
import type { Socials } from "@/lib/types";
import { LoadingImage } from "./loading-image";

const tones = [
  "from-[#e9d8cc] via-[#f3e6dd] to-[#d9c2b2]",
  "from-[#d8d4cc] via-[#ece8e1] to-[#c9c1b5]",
  "from-[#e6d3d6] via-[#f2e5e7] to-[#d4b9be]",
  "from-[#d6dccf] via-[#e9ede4] to-[#c3ccb9]",
];

/**
 * Image slot. Shows the image when `src` is set, otherwise a soft placeholder
 * so layouts can be reviewed before real photos are uploaded.
 */
export function Media({
  src,
  alt = "",
  label,
  tone = 0,
  className,
}: {
  src?: string;
  alt?: string;
  label?: string;
  tone?: number;
  className?: string;
}) {
  if (src) {
    return <LoadingImage src={src} alt={alt} className={clsx("object-cover", className)} />;
  }
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className={clsx(
        "relative grid place-items-center overflow-hidden bg-gradient-to-br",
        tones[tone % tones.length],
        className,
      )}
    >
      {label && (
        <span className="px-4 text-center font-display text-lg text-ink/40 sm:text-xl">
          {label}
        </span>
      )}
    </div>
  );
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
    <section className="border-b border-line">
      <div className="container-page animate-fade-up py-12 sm:py-16 lg:py-24">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
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

const socialLabels: Record<keyof Socials, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  line: "LINE",
};

export function SocialLinks({ socials, className }: { socials?: Socials; className?: string }) {
  if (!socials) return null;
  const entries = Object.entries(socials) as [keyof Socials, string][];
  return (
    <ul className={clsx("flex flex-wrap gap-2", className)}>
      {entries.map(([key, href]) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-9 items-center gap-1 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
          >
            {socialLabels[key]}
            <ArrowUpRight className="size-3" />
          </a>
        </li>
      ))}
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
