import type { MetadataRoute } from "next";
import { postTypePath } from "@/components/post-card";
import { getBrands, getCourses, getForumSitemap, getMenu, getPosts, getProducts } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
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
  "/forum",
  "/contact",
  "/contact/team",
  "/contact/salon-partner",
  "/contact/payment",
  "/contact/report",
  "/policy",
];

type PathEntry = { lastModified?: string; images?: string[] };

const validUrls = (urls: (string | null | undefined)[]): string[] =>
  urls.filter((u): u is string => typeof u === "string" && u.trim().length > 0);

/** One URL per language, each pointing at the other so search engines show the right language. */
function entries(path: string, meta?: PathEntry): MetadataRoute.Sitemap {
  const languages = { th: `${SITE_URL}/th${path}`, en: `${SITE_URL}/en${path}` };
  const validImages = meta?.images ? validUrls(meta.images).map((img) => absoluteUrl(img)) : undefined;
  return Object.values(languages).map((url) => ({
    url,
    ...(meta?.lastModified && { lastModified: meta.lastModified }),
    alternates: { languages },
    ...(validImages && validImages.length > 0 && { images: validImages }),
  }));
}

/** Built from live data, so anything published in the admin appears here after saving. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [menu, brands, products, courses, posts, topics] = await Promise.all([
    getMenu("th"),
    getBrands("th", "SALON"),
    getProducts("th"),
    getCourses("th"),
    getPosts("th"),
    getForumSitemap(),
  ]);

  const paths = new Map<string, PathEntry>(STATIC_PATHS.map((p) => [p, {}]));
  const add = (path: string, meta?: PathEntry) => paths.set(path, meta ?? {});

  for (const b of brands) {
    const bImages = validUrls([b.logoUrl]);
    add(`/products/${b.slug}`, {
      images: bImages.length > 0 ? bImages : undefined,
    });
  }

  for (const p of products) {
    const pImages = validUrls([p.imageUrl, ...(p.images ?? [])]);
    add(`/product/${p.slug}`, {
      images: pImages.length > 0 ? pImages : undefined,
    });
  }

  for (const c of courses) {
    const cImages = validUrls([c.coverUrl, ...(c.images ?? [])]);
    add(`/courses/${c.slug}`, {
      images: cImages.length > 0 ? cImages : undefined,
    });
  }

  for (const p of posts) {
    const postImages = validUrls([p.coverUrl, ...(p.images ?? [])]);
    add(`/members/${postTypePath[p.type]}/${p.slug}`, {
      lastModified: p.publishedAt || undefined,
      images: postImages.length > 0 ? postImages : undefined,
    });
  }

  for (const t of topics) {
    add(`/forum/${t.id}`, { lastModified: t.lastActivityAt });
  }

  // Custom pages created in the admin under "เมนูและหน้าเว็บ"
  const menuPaths = (items: MenuItem[]): string[] => items.flatMap((i) => [i.href, ...menuPaths(i.children ?? [])]);
  for (const href of menuPaths(menu)) {
    const path = href.split(/[?#]/)[0].replace(/\/$/, "");
    if (path.startsWith("/") && !paths.has(path)) add(path);
  }

  return [...paths].flatMap(([path, meta]) => entries(path, meta));
}
