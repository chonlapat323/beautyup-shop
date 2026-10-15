import Image from "next/image";
import { Sparkles, Quote } from "lucide-react";
import { PinkBlackHoleEffect } from "./pink-black-hole";
import type { VipCustomerData } from "@/lib/data";

export function VipCustomerHero({ data }: { data: VipCustomerData }) {
  const lines = data.quote
    ? data.quote
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="relative overflow-hidden bg-[#0c0a0e] text-white py-20 sm:py-28 lg:py-36 border-b border-white/10">
      {/* Background image if provided */}
      {data.bgImageUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.bgImageUrl}
            alt={data.eyebrow || "VIP Customer"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.25] contrast-[1.08] transition-all duration-1000 scale-[1.02]"
          />
          {/* Subtle gradient overlays to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a0e] via-transparent to-[#0c0a0e]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a0e]/80 via-transparent to-[#0c0a0e]/80" />
        </div>
      ) : null}

      {/* Floating Pink Particle Effect (same as slide) */}
      <PinkBlackHoleEffect count={55} className="absolute inset-0 size-full pointer-events-none z-0" />

      {/* Ambient Lighting & Glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      >
        <div className="h-[380px] w-[620px] max-w-[90vw] rounded-full bg-gradient-to-tr from-brand-pink/20 via-fuchsia-600/15 to-purple-600/10 blur-[130px]" />
      </div>

      <div className="container-page relative z-10 text-center">
        {/* Eyebrow Badge */}
        <div data-reveal suppressHydrationWarning className="inline-flex items-center gap-2.5 rounded-full border border-brand-pink/35 bg-brand-pink/10 px-5 py-2 text-xs sm:text-sm font-semibold tracking-[0.28em] text-pink-200 uppercase backdrop-blur-md shadow-[0_0_25px_rgba(214,41,127,0.22)]">
          <Sparkles className="size-3.5 text-brand-pink" />
          <span>{data.eyebrow || "OUR VIP CUSTOMER"}</span>
          <Sparkles className="size-3.5 text-brand-pink" />
        </div>

        {/* Quote Block */}
        <div
          data-reveal
          suppressHydrationWarning
          className="relative mx-auto mt-10 max-w-4xl px-4 sm:px-8"
        >
          {/* Decorative Opening Quote Icon */}
          <div
            aria-hidden="true"
            className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border border-brand-pink/30 bg-brand-pink/10 text-pink-300 shadow-[0_0_20px_rgba(214,41,127,0.25)] backdrop-blur-sm"
          >
            <Quote className="size-5.5 rotate-180" />
          </div>

          {/* Typography */}
          <blockquote className="space-y-3 sm:space-y-4">
            {lines.length > 0 ? (
              lines.map((line, idx) => (
                <p
                  key={idx}
                  className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] font-light leading-[1.6] sm:leading-[1.7] text-neutral-100 tracking-wide text-balance hover:text-white transition-colors duration-300"
                >
                  {line}
                </p>
              ))
            ) : (
              <p className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-neutral-100 leading-relaxed">
                {data.quote}
              </p>
            )}
          </blockquote>

          {/* Decorative Closing Quote Icon */}
          <div
            aria-hidden="true"
            className="mx-auto mt-7 flex size-12 items-center justify-center rounded-full border border-brand-pink/30 bg-brand-pink/10 text-pink-300 shadow-[0_0_20px_rgba(214,41,127,0.25)] backdrop-blur-sm"
          >
            <Quote className="size-5.5" />
          </div>

          {/* Decorative Divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-brand-pink/60" />
            <span className="size-1.5 rounded-full bg-brand-pink shadow-[0_0_8px_rgba(214,41,127,0.8)]" />
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-brand-pink/60" />
          </div>

          {/* Subtext if provided */}
          {data.subtext ? (
            <p className="mt-5 text-sm sm:text-base text-neutral-400 font-light tracking-wide max-w-2xl mx-auto">
              {data.subtext}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
