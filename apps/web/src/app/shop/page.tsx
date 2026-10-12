import type { Metadata } from "next";
import { GrowYourVision } from "@/components/grow-your-vision";
import { ProductGrid } from "@/components/product-grid";
import { Media, PageHero, SectionHeading } from "@/components/ui";
import { getBrands, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "ร้านบิวตี้อัพ" };

export default async function ShopPage() {
  const [brands, products] = await Promise.all([
    getBrands("COUNTER"),
    getProducts({ brandType: "COUNTER" }),
  ]);
  const brandNames = Object.fromEntries(brands.map((b) => [b.slug, b.name]));

  return (
    <>
      <PageHero
        eyebrow="Our Counter Brand"
        title="เคาน์เตอร์แบรนด์ชั้นนำ ในราคาที่คุ้มค่า"
        description="สกินแคร์ น้ำหอม และเครื่องสำอางจากแบรนด์ระดับโลก คัดสรรโดยบิวตี้อัพ"
      />

      <section className="container-page py-12 md:py-16">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-7">
          {brands.map((b) => (
            <li key={b.slug} className="grid min-h-24 place-items-center bg-white p-4 text-center font-display text-base text-ink/80 transition-colors hover:bg-mist hover:text-accent sm:min-h-28 sm:text-lg">
              {b.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="container-page grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <Media label="I'm Amy" tone={1} className="aspect-[4/5] w-full rounded-3xl" />
          <div>
            <p className="eyebrow">From the CEO</p>
            <p className="mt-4 font-display text-3xl leading-snug sm:text-4xl">
              “I&apos;m Amy … CEO of Beauty Up Enterprise”
            </p>
            <p className="mt-5 text-muted">
              คัดสรรผลิตภัณฑ์ของแท้จากเคาน์เตอร์แบรนด์ชั้นนำ เพื่อให้ทุกคนเข้าถึงความงามระดับพรีเมียม
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="container-page">
          <SectionHeading eyebrow="Shop" title="สินค้าเคาน์เตอร์แบรนด์" description="สนใจสินค้า กด “ติดต่อสั่งซื้อ” ทีมงานจะติดต่อกลับ" />
          <ProductGrid products={products} brandNames={brandNames} />
        </div>
      </section>

      <GrowYourVision />
    </>
  );
}
