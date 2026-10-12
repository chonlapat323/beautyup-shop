import { Play } from "lucide-react";
import Link from "next/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { ProductGrid } from "@/components/product-grid";
import { ArrowLink, Media, SectionHeading } from "@/components/ui";
import { getBrands, getHeroBanners, getProducts, getVideos } from "@/lib/data";

const quickLinks = [
  { label: "ทีมงาน", href: "/contact/team" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  { label: "สมัครซาลอน", href: "/contact/salon-partner" },
  { label: "แบรนด์แอมบาสเดอร์", href: "/customers" },
  { label: "คลาสเรียน & ดูงานต่างประเทศ", href: "/courses" },
];

export default async function HomePage() {
  const [banners, videos, brands, products] = await Promise.all([
    getHeroBanners(),
    getVideos(),
    getBrands(),
    getProducts(),
  ]);
  const salonBrands = brands.filter((b) => b.type === "SALON");
  const brandNames = Object.fromEntries(brands.map((b) => [b.slug, b.name]));
  const [main, ...sideBanners] = banners;

  return (
    <>
      {/* Hero */}
      <section className="container-page pt-4 pb-16 sm:pt-6 md:pb-24">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Link
            href={main.href ?? "#"}
            className="group relative overflow-hidden rounded-3xl lg:col-span-2 lg:row-span-2"
          >
            <Media
              src={main.imageUrl}
              tone={0}
              className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.02] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 animate-fade-up p-6 text-cream sm:p-10">
              <p className="eyebrow !text-cream/80">Professional Salon Products</p>
              <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.1] text-balance sm:text-6xl">
                เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ
              </h1>
              <p className="mt-4 max-w-md text-cream/80 sm:text-lg">{main.subtitle}</p>
              <span className="btn btn-light mt-6 group-hover:bg-white group-hover:gap-3">
                ชมสินค้า <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
          {sideBanners.map((b, i) => (
            <Link
              key={b.title}
              href={b.href ?? "#"}
              className="group relative overflow-hidden rounded-3xl"
            >
              <Media
                src={b.imageUrl}
                tone={i + 1}
                className="aspect-[16/9] w-full transition-transform duration-700 group-hover:scale-[1.03] lg:aspect-auto lg:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-cream sm:p-6">
                <p className="font-display text-2xl">{b.title}</p>
                <p className="text-sm text-cream/80">{b.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Welcome */}
      <section className="section border-y border-line bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">บิวตี้อัพ ยินดีต้อนรับ</p>
            <blockquote className="mt-4 font-display text-2xl leading-snug text-balance sm:text-4xl">
              “แรงบันดาลใจ ไม่หยุดเรียนรู้ ไม่หยุดพัฒนา
              ไม่หยุดค้นหาสิ่งที่ดีที่สุด”
            </blockquote>
            <p className="mt-6 text-muted">— เอมี่ พลภัทร โสธนาภิศาล, CEO & Founder</p>
          </div>
          <nav aria-label="ลิงก์ด่วน" className="lg:col-span-5">
            <ul className="divide-y divide-line border-y border-line">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex min-h-14 items-center justify-between gap-4 text-lg transition-colors hover:text-accent"
                  >
                    {l.label}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Brands */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Imported Brands"
            title="ผลิตภัณฑ์นำเข้าของเรา"
            action={<ArrowLink href="/products">ผลิตภัณฑ์ทั้งหมด</ArrowLink>}
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {salonBrands.map((b, i) => (
              <li key={b.slug}>
                <Link
                  href={`/products/${b.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-ink/5"
                >
                  <div className="overflow-hidden">
                    <Media
                      src={b.logoUrl}
                      label={b.name}
                      tone={i}
                      className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs tracking-wide text-muted uppercase">
                      นำเข้าจาก{b.country}
                    </p>
                    <p className="mt-2 font-display text-2xl">
                      {b.nameTh} <span className="text-muted">({b.name})</span>
                    </p>
                    <p className="mt-3 flex-1 text-muted">{b.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-medium group-hover:text-accent">
                      ดูผลิตภัณฑ์ <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Videos */}
      <section className="section bg-ink text-cream">
        <div className="container-page">
          <div className="mb-10 md:mb-14">
            <p className="eyebrow !text-cream/60">Videos</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">เล่นวิดีโอ</h2>
          </div>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {videos.map((v, i) => (
              <li key={v.title} className="w-[78%] shrink-0 snap-start sm:w-auto">
                <a
                  href={v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : "https://www.youtube.com/@FanolaOfficial"}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <Media tone={i} className="aspect-video w-full opacity-80" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-cream/90 text-ink transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 size-5 fill-current" />
                      </span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-cream/80 transition-colors group-hover:text-cream">{v.title}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Products */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="BeautyUp Essential Product"
            title="ผลิตภัณฑ์ความงาม สำหรับบุคคลพิเศษเช่นคุณ"
          />
          <ProductGrid products={products} brandNames={brandNames} />
        </div>
      </section>

      <GrowYourVision />
    </>
  );
}
