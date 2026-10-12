import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { PageHero, SocialLinks } from "@/components/ui";
import { getBrand, getBrands, getProducts } from "@/lib/data";

export async function generateStaticParams() {
  const brands = await getBrands("SALON");
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[brand]">): Promise<Metadata> {
  const brand = await getBrand((await params).brand);
  return { title: brand ? `${brand.name} (${brand.nameTh})` : "ไม่พบแบรนด์" };
}

export default async function BrandPage({ params }: PageProps<"/products/[brand]">) {
  const { brand: slug } = await params;
  const brand = await getBrand(slug);
  if (!brand || brand.type !== "SALON") notFound();
  const products = await getProducts({ brandSlug: slug });

  return (
    <>
      <PageHero
        eyebrow={`นำเข้าจาก${brand.country}`}
        title={
          <>
            {brand.nameTh} <span className="text-muted">{brand.name}</span>
          </>
        }
        description={brand.description}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {brand.website && (
            <a href={brand.website} target="_blank" rel="noreferrer" className="btn btn-outline">
              เว็บไซต์แบรนด์
            </a>
          )}
          <SocialLinks socials={brand.socials} />
        </div>
      </PageHero>

      <section className="container-page py-12 md:py-20">
        {products.length ? (
          <ProductGrid products={products} brandNames={{ [brand.slug]: brand.name }} showFilter={false} />
        ) : (
          <div className="rounded-3xl border border-dashed border-line p-10 text-center sm:p-16">
            <p className="font-display text-2xl">กำลังเพิ่มสินค้าเร็ว ๆ นี้</p>
            <p className="mt-2 text-muted">สอบถามรายการสินค้าและราคาได้ที่ทีมงาน</p>
            <Link href="/contact/salon-partner" className="btn btn-primary mt-6">
              ติดต่อสั่งซื้อ
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
