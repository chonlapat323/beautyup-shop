import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { PageHero, SocialLinks } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getBrand, getBrands, getProducts } from "@/lib/data";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const brands = await getBrands(params.lang as Locale, "SALON");
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[brand]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const brand = await getBrand(lang, (await params).brand);
  if (!brand) return { title: dict.products.notFound };
  return { title: brand.nameTh && brand.nameTh !== brand.name ? `${brand.name} (${brand.nameTh})` : brand.name, description: brand.description };
}

export default async function BrandPage({ params }: PageProps<"/[lang]/products/[brand]">) {
  const { lang, dict } = await resolveLang(params);
  const { brand: slug } = await params;
  const brand = await getBrand(lang, slug);
  if (!brand || brand.type !== "SALON") notFound();
  const products = await getProducts(lang, { brandSlug: slug });

  return (
    <>
      <PageHero
        eyebrow={brand.country ? dict.common.importedFrom(brand.country) : undefined}
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
              {dict.products.website}
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
            <p className="font-display text-2xl">{dict.common.comingSoon}</p>
            <p className="mt-2 text-muted">{dict.common.askTeam}</p>
            <Link href="/contact/salon-partner" className="btn btn-primary mt-6">
              {dict.common.contactToOrder}
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
