import type { Metadata } from "next";
import { postTypePath } from "@/components/post-card";
import { PageHero } from "@/components/ui";
import { getBrands, getCourses, getPosts, getProducts } from "@/lib/data";
import { SearchBox, type SearchItem } from "./search-box";

export const metadata: Metadata = { title: "ค้นหา" };

export default async function SearchPage() {
  const [brands, products, courses, posts] = await Promise.all([
    getBrands(),
    getProducts(),
    getCourses(),
    getPosts(),
  ]);
  const brandName = Object.fromEntries(brands.map((b) => [b.slug, b.name]));
  const brandHref = (slug: string) =>
    brands.find((b) => b.slug === slug)?.type === "SALON" ? `/products/${slug}` : "/shop";

  const items: SearchItem[] = [
    ...products.map((p) => ({ kind: "สินค้า", title: p.name, sub: brandName[p.brandSlug], href: brandHref(p.brandSlug) })),
    ...brands.map((b) => ({ kind: "แบรนด์", title: b.name, sub: b.nameTh, href: brandHref(b.slug) })),
    ...courses.map((c) => ({ kind: "คอร์ส", title: c.title, sub: c.priceText, href: `/courses/${c.slug}` })),
    ...posts.map((p) => ({ kind: "บทความ", title: p.title, sub: p.excerpt, href: `/members/${postTypePath[p.type]}/${p.slug}` })),
  ];

  return (
    <>
      <PageHero eyebrow="Search" title="ค้นหา" />
      <section className="container-page max-w-3xl py-10 md:py-14">
        <SearchBox items={items} />
      </section>
    </>
  );
}
