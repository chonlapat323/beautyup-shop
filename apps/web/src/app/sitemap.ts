import type { MetadataRoute } from "next";
import { postTypePath } from "@/components/post-card";
import { getBrands, getCourses, getMenu, getPosts, getProducts } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import type { MenuItem } from "@/lib/types";

/** Pages that always exist, independent of content. */
const STATIC_PATHS = [
  "",
  "/about",
  "/products",
  "/shop",
  "/courses",
  "/customers",
  "/customers/salons",
  "/members",
  "/members/activities",
  "/members/articles",
  "/members/media",
  "/contact",
  "/contact/team",
  "/contact/salon-partner",
  "/contact/payment",
  "/contact/report",
  "/policy",
];

/** One URL per language, each pointing at the other so search engines show the right language. */
function entries(path: string, lastModified?: string): MetadataRoute.Sitemap {
  const languages = { th: `${SITE_URL}/th${path}`, en: `${SITE_URL}/en${path}` };
  return Object.values(languages).map((url) => ({
    url,
    ...(lastModified && { lastModified }),
    alternates: { languages },
  }));
}

/** Built from live data, so anything published in the admin appears here after saving. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [menu, brands, products, courses, posts] = await Promise.all([
    getMenu("th"),
    getBrands("th", "SALON"),
    getProducts("th"),
    getCourses("th"),
    getPosts("th"),
  ]);

  const paths = new Map<string, string | undefined>(STATIC_PATHS.map((p) => [p, undefined]));
  const add = (path: string, lastModified?: string) => paths.set(path, lastModified);

  for (const b of brands) add(`/products/${b.slug}`);
  for (const p of products) add(`/product/${p.slug}`);
  for (const c of courses) add(`/courses/${c.slug}`);
  for (const p of posts) add(`/members/${postTypePath[p.type]}/${p.slug}`, p.publishedAt || undefined);

  // Custom pages created in the admin under "เมนูและหน้าเว็บ"
  const menuPaths = (items: MenuItem[]): string[] => items.flatMap((i) => [i.href, ...menuPaths(i.children ?? [])]);
  for (const href of menuPaths(menu)) {
    const path = href.split(/[?#]/)[0].replace(/\/$/, "");
    if (path.startsWith("/") && !paths.has(path)) add(path);
  }

  return [...paths].flatMap(([path, lastModified]) => entries(path, lastModified));
}
