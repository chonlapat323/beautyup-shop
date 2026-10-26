import Image from "next/image";
import { Quote } from "lucide-react";
import { renderInlineRichText } from "@/components/rich-text";
import type { VipCustomerData } from "@/lib/data";

/** Same look as the home hero: soft pink-to-white background, pink-line eyebrow, dark text. */
export function VipCustomerHero({ data }: { data: VipCustomerData }) {
  const lines = data.quote
    ? data.quote
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="relative overflow-hidden border-b border-line/60 bg-[linear-gradient(160deg,#fdf2f8_0%,#fdfcfb_60%,#fdfcfb_100%)] py-16 sm:py-24 lg:py-28">
      {data.bgImageUrl && (
        <div aria-hidden className="absolute inset-0">
          <Image src={data.bgImageUrl} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdf2f8]/70 via-[#fdfcfb]/80 to-[#fdfcfb]" />
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(214_41_127/0.15),transparent_70%)] blur-3xl"
      />

      <div className="container-page relative animate-fade-up text-center">
        <p className="eyebrow flex items-center justify-center gap-2">
          <span aria-hidden className="h-px w-6 bg-brand-pink" />
          {data.eyebrow || "Our VIP Customer"}
          <span aria-hidden className="h-px w-6 bg-brand-pink" />
        </p>

        <div className="mx-auto mt-8 max-w-4xl">
          <Quote aria-hidden className="mx-auto size-8 rotate-180 text-brand-pink/60" />
          <blockquote className="mt-4 space-y-3">
            {(lines.length ? lines : [data.quote]).map((line, idx) => (
              <p key={idx} className="font-display text-2xl leading-snug text-balance text-ink sm:text-3xl lg:text-4xl">
                {renderInlineRichText(line.replace(/^##\s+/, ""))}
              </p>
            ))}
          </blockquote>
          {data.subtext && <p className="mx-auto mt-6 max-w-2xl text-base text-pretty text-muted sm:text-lg">{renderInlineRichText(data.subtext)}</p>}
        </div>
      </div>
    </section>
  );
}
