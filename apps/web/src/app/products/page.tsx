import type { Metadata } from "next";
import Link from "next/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { Media, PageHero, SocialLinks } from "@/components/ui";
import { getBrands } from "@/lib/data";

export const metadata: Metadata = { title: "ผลิตภัณฑ์ผม" };

export default async function ProductsPage() {
  const brands = await getBrands("SALON");

  return (
    <>
      <PageHero
        eyebrow="Professional Salon Products"
        title="เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ"
        description="ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ"
      />

      <div className="container-page">
        {brands.map((b, i) => (
          <section
            key={b.slug}
            aria-labelledby={`brand-${b.slug}`}
            className="grid items-center gap-8 border-b border-line py-14 last:border-b-0 md:grid-cols-2 md:gap-12 md:py-20 lg:gap-20"
          >
            <Media
              src={b.logoUrl}
              label={b.name}
              tone={i}
              className={`aspect-[4/3] w-full rounded-3xl ${i % 2 ? "md:order-2" : ""}`}
            />
            <div>
              <p className="eyebrow">นำเข้าจาก{b.country}</p>
              <h2 id={`brand-${b.slug}`} className="mt-3 font-display text-4xl sm:text-5xl">
                {b.nameTh}
                <span className="mt-1 block text-2xl text-muted sm:text-3xl">{b.name}</span>
              </h2>
              <p className="mt-5 text-lg text-muted">{b.description}</p>
              {b.highlights && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {b.highlights.map((h) => (
                    <li key={h} className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent-dark">
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 font-display text-xl italic">“{b.tagline}”</p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <Link href={`/products/${b.slug}`} className="btn btn-primary">
                  ชมสินค้า
                </Link>
                {b.catalogUrl && (
                  <a href={b.catalogUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                    แคตตาล็อก
                  </a>
                )}
              </div>
              <SocialLinks socials={b.socials} className="mt-6" />
            </div>
          </section>
        ))}
      </div>

      <GrowYourVision />
    </>
  );
}
