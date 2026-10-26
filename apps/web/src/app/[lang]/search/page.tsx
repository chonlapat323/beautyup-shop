import type { Metadata } from "next";
import { postTypePath } from "@/components/post-card";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getBrands, getCourses, getPosts, getProducts } from "@/lib/data";
import { SearchBox, type SearchItem } from "./search-box";

export async function generateMetadata({ params }: PageProps<"/[lang]/search">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.searchPage.title };
}

export default async function SearchPage({ params }: PageProps<"/[lang]/search">) {
  const { lang, dict } = await resolveLang(params);
  const k = dict.searchPage.kinds;
  const [brands, products, courses, posts] = await Promise.all([
    getBrands(lang),
    getProducts(lang),
    getCourses(lang),
    getPosts(lang),
  ]);
  const brandName = Object.fromEntries(brands.map((b) => [b.slug, b.name]));
  const brandHref = (slug: string) =>
    brands.find((b) => b.slug === slug)?.type === "SALON" ? `/products/${slug}` : "/shop";

  const items: SearchItem[] = [
    ...products.map((p) => ({
      kind: k.product,
      title: p.name,
      sub: [brandName[p.brandSlug], p.collection?.name, ...(p.tags ?? [])].filter(Boolean).join(" · "),
      href: `/product/${p.slug}`,
    })),
    ...brands.map((b) => ({ kind: k.brand, title: b.name, sub: b.nameTh, href: brandHref(b.slug) })),
    ...courses.map((c) => ({ kind: k.course, title: c.title, sub: c.priceText, href: `/courses/${c.slug}` })),
    ...posts.map((p) => ({ kind: k.post, title: p.title, sub: p.excerpt, href: `/members/${postTypePath[p.type]}/${p.slug}` })),
  ];

  return (
    <>
      <PageHero eyebrow="Search" title={dict.searchPage.title} />
      <section className="container-page max-w-3xl py-10 md:py-14">
        <SearchBox items={items} />
      </section>
    </>
  );
}
