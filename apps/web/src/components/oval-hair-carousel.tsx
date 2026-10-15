"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "@/components/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { LoadingImage } from "./loading-image";
import { MockImagePlaceholder } from "./mock-image-placeholder";

export interface OvalCardItem {
  imageUrl?: string;
  title: string;
  description?: string;
  formula?: string;
  href?: string;
}

export interface OvalHairCarouselProps {
  title?: string;
  eyebrow?: string;
  cards?: OvalCardItem[];
  lang?: string;
  className?: string;
}

const DEFAULT_CARDS: OvalCardItem[] = [
  {
    imageUrl: "/cards/fanola-1.jpg",
    title: "Balayage Ash Blonde",
    formula: "BLEACH & 3% (ORO 20G/20G)",
    description: "No Yellow Care Protection",
    href: "/products/fanola?category=no-yellow-care",
  },
  {
    imageUrl: "/slides/1.jpg",
    title: "Pure Ice Blonde",
    formula: "VIOLET BLEACH 9 TONES",
    description: "Anti-Yellow Neutralizing",
    href: "/products/fanola?category=no-yellow-care",
  },
  {
    imageUrl: "/cards/fanola-2.jpg",
    title: "Cool Smokey Brunette",
    formula: "BLACK 3% + NO RED MASK",
    description: "Cool Neutralizing Tone",
    href: "/products/fanola?category=no-red",
  },
  {
    imageUrl: "/slides/3.jpg",
    title: "Platinum Silver Balayage",
    formula: "BLEACH & 6% + SHAMPOO",
    description: "Extra Violet Pigments",
    href: "/products/fanola?category=no-yellow-care",
  },
  {
    imageUrl: "/cards/fanola-3.jpg",
    title: "Warm Honey Caramel",
    formula: "CHESTNUT BLEACH + 3%",
    description: "Deep Conditioning Care",
    href: "/products/fanola?category=nutri-care",
  },
  {
    imageUrl: "/cards/fanola-4.jpg",
    title: "Warm Brown Copper",
    formula: "WARM BROWN + 3%",
    description: "Color Keratin Protection",
    href: "/products/fanola?category=no-orange",
  },
  {
    imageUrl: "/slides/4.jpg",
    title: "Luxury Gloss Waves",
    formula: "ORO THERAPY 24K",
    description: "Argan Oil & Keratin Infusion",
    href: "/products/fanola?category=oro-therapy",
  },
];

export function OvalHairCarousel({
  title = "ผลิตภัณฑ์ซาลอนมืออาชีพ",
  eyebrow,
  cards = DEFAULT_CARDS,
  className,
}: OvalHairCarouselProps) {
  const displayCards = cards && cards.length > 0 ? cards : DEFAULT_CARDS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.65;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={clsx(
        "relative overflow-hidden py-14 sm:py-20 bg-black text-white select-none",
        className,
      )}
    >
      {/* Subtle top & bottom gold ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-0 h-40 w-[48rem] max-w-full rounded-full bg-[radial-gradient(circle,rgb(234_179_8/0.08),transparent_70%)] blur-3xl"
      />

      <div className="container-page relative z-10 mb-8 sm:mb-12 text-center">
        {eyebrow && (
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-amber-400/80 mb-2">
            {eyebrow}
          </p>
        )}
        {/* Golden / Amber Display Title matching the user's reference */}
        <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f59e0b] drop-shadow-sm">
          {title}
        </h2>
      </div>

      {/* Oval Carousel Viewport with side arrow controls */}
      <div className="relative group/carousel px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous slide"
          className={clsx(
            "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 grid size-10 sm:size-12 place-items-center rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl",
            "hover:bg-amber-400 hover:text-black hover:border-amber-400 hover:scale-110 active:scale-95",
            !canScrollLeft && "opacity-0 pointer-events-none",
          )}
        >
          <ChevronLeft className="size-6 stroke-[2.5]" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Next slide"
          className={clsx(
            "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 grid size-10 sm:size-12 place-items-center rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl",
            "hover:bg-amber-400 hover:text-black hover:border-amber-400 hover:scale-110 active:scale-95",
            !canScrollRight && "opacity-0 pointer-events-none",
          )}
        >
          <ChevronRight className="size-6 stroke-[2.5]" />
        </button>

        {/* Horizontal Track of Elliptical / Oval Cards */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto py-4 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory"
        >
          {displayCards.map((card, idx) => {
            const content = (
              <div
                className={clsx(
                  "group relative shrink-0 snap-center transition-all duration-500 cursor-pointer",
                  // Pure vertical oval capsule shape matching reference
                  "aspect-[1/1.55] w-36 sm:w-48 md:w-56 lg:w-60 overflow-hidden rounded-[9999px]",
                  "border-2 border-white/15 bg-neutral-900 shadow-2xl shadow-black/80",
                  "hover:scale-[1.05] hover:border-amber-400/80 hover:shadow-amber-400/20 hover:z-20",
                )}
              >
                {/* Photo */}
                {card.imageUrl ? (
                  <LoadingImage
                    src={card.imageUrl}
                    alt={card.title}
                    className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <MockImagePlaceholder label={card.title} subLabel="Salon Mock" className="size-full" />
                )}

                {/* Smooth Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Bottom Tag / Formula Badge */}
                <div className="absolute bottom-5 sm:bottom-7 inset-x-3 text-center px-2 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                  {card.formula && (
                    <span className="inline-block rounded-md bg-black/75 border border-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm shadow-md mb-1 max-w-full truncate">
                      {card.formula}
                    </span>
                  )}
                  <h4 className="font-display text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow-md">
                    {card.title}
                  </h4>
                  {card.description && (
                    <p className="text-[9px] sm:text-[10px] text-neutral-300 line-clamp-1 mt-0.5">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            );

            return card.href ? (
              <Link key={idx} href={card.href} className="outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-[9999px]">
                {content}
              </Link>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
