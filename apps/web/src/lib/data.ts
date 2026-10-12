// Data access layer: reads the public API (apps/api) and resolves localized
// fields to the requested language. Pages only import from here.
//
// Results are cached ('use cache') and tagged "content"; the admin panel calls
// /api/revalidate after every save, so edits show up without a redeploy.
import "server-only";
import { t, type Localized } from "@beautyup/types";
import { cacheLife, cacheTag } from "next/cache";
import { getDictionary, type Locale } from "@/i18n";
import { provinces } from "./provinces";
import type {
  Ambassador,
  Brand,
  CompanyInfo,
  Course,
  HeroSlide,
  MenuItem,
  PageContent,
  Post,
  PostType,
  Product,
  Region,
  Salon,
  TeamMember,
  Video,
} from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";
export const CONTENT_TAG = "content";

type L = Partial<Localized>;
type Row = Record<string, unknown>;

async function get<T>(path: string): Promise<T> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const res = await fetch(`${API_URL}/public${path}`);
  if (res.status === 404) return null as T;
  if (!res.ok) throw new Error(`API ${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}

const lines = (v: L | undefined, lang: Locale) =>
  t(v, lang)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const s = (v: unknown) => (typeof v === "string" && v ? v : undefined);

/* ----------------------------------------------------------------- menu */

interface MenuRow { id: string; label: L; href: string; parentId: string | null; location: string }

export async function getMenu(lang: Locale): Promise<MenuItem[]> {
  const rows = (await get<MenuRow[]>("/resources/menu-items")).filter((r) => r.location === "header");
  const toItem = (r: MenuRow): MenuItem => ({ label: t(r.label, lang), href: r.href });
  return rows
    .filter((r) => !r.parentId)
    .map((r) => {
      const children = rows.filter((c) => c.parentId === r.id).map(toItem);
      return { ...toItem(r), ...(children.length && { children }) };
    });
}

/* ------------------------------------------------------------- settings */

interface CompanyRow {
  name: L; address: L; phones: string[]; email: string; taxId: string; mapUrl: string; facebookGroup: string;
  departments: { name: L; phone: string }[];
  bankAccounts: { bank: L; accountName: L; accountNo: string }[];
}
interface SettingsRow {
  company?: CompanyRow;
  timeline?: { year: string; text: L }[];
  ppStudio?: { title: string; text: L }[];
}

export async function getCompany(lang: Locale): Promise<CompanyInfo> {
  const c = (await get<SettingsRow>("/settings")).company;
  return {
    name: t(c?.name, lang),
    nameEn: t(c?.name, "en"),
    address: t(c?.address, lang),
    phones: c?.phones ?? [],
    email: c?.email ?? "",
    taxId: c?.taxId ?? "",
    mapUrl: c?.mapUrl ?? "",
    facebookGroup: c?.facebookGroup ?? "",
    departments: (c?.departments ?? []).map((d) => ({ name: t(d.name, lang), phone: d.phone })),
    bankAccounts: (c?.bankAccounts ?? []).map((b) => ({ bank: t(b.bank, lang), accountName: t(b.accountName, lang), accountNo: b.accountNo })),
  };
}

export async function getTimeline(lang: Locale) {
  return ((await get<SettingsRow>("/settings")).timeline ?? []).map((x) => ({ year: x.year, text: t(x.text, lang) }));
}

export async function getPpStudioServices(lang: Locale) {
  return ((await get<SettingsRow>("/settings")).ppStudio ?? []).map((x) => ({ title: x.title, text: t(x.text, lang) }));
}

export const getProvinces = async () => provinces;

export async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/* --------------------------------------------------------------- brands */

interface BrandRow extends Row {
  slug: string; type: "SALON" | "COUNTER"; name: string; localName: L; country: L; tagline: L; description: L;
  highlights: L[]; logoUrl: string; website: string; catalogUrl: string; socials: Brand["socials"];
}

const toBrand = (b: BrandRow, lang: Locale): Brand => ({
  slug: b.slug,
  type: b.type,
  name: b.name,
  nameTh: s(t(b.localName, lang)),
  country: s(t(b.country, lang)),
  tagline: s(t(b.tagline, lang)),
  description: s(t(b.description, lang)),
  highlights: (b.highlights ?? []).map((h) => t(h, lang)).filter(Boolean),
  logoUrl: s(b.logoUrl),
  website: s(b.website),
  catalogUrl: s(b.catalogUrl),
  socials: Object.fromEntries(Object.entries(b.socials ?? {}).filter(([, v]) => v)),
});

export async function getBrands(lang: Locale, type?: "SALON" | "COUNTER") {
  const rows = await get<BrandRow[]>(`/resources/brands${type ? `?type=${type}` : ""}`);
  return rows.map((b) => toBrand(b, lang));
}

export async function getBrand(lang: Locale, slug: string) {
  const row = await get<BrandRow | null>(`/resources/brands/${encodeURIComponent(slug)}`);
  return row ? toBrand(row, lang) : undefined;
}

/* ------------------------------------------------------------- products */

interface ProductRow extends Row {
  slug: string; name: L; description: L; price: number; salePrice: number | null; badges: string[]; imageUrl: string;
  brand: { slug: string; type: "SALON" | "COUNTER" };
}

export async function getProducts(lang: Locale, opts?: { brandSlug?: string; brandType?: "SALON" | "COUNTER" }): Promise<Product[]> {
  const qs = new URLSearchParams({
    ...(opts?.brandSlug && { brand: opts.brandSlug }),
    ...(opts?.brandType && { brandType: opts.brandType }),
  });
  const rows = await get<ProductRow[]>(`/resources/products${qs.size ? `?${qs}` : ""}`);
  return rows.map((p) => ({
    slug: p.slug,
    name: t(p.name, lang),
    brandSlug: p.brand.slug,
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    badges: p.badges,
    imageUrl: s(p.imageUrl),
    description: s(t(p.description, lang)),
  }));
}

/* ----------------------------------------------------------------- home */

interface SlideRow extends Row { product: L; caption: L; href: string; imageUrl: string; tint: string; brand: { slug: string; name: string } | null }

export async function getHeroSlides(lang: Locale): Promise<HeroSlide[]> {
  const rows = await get<SlideRow[]>("/resources/hero-slides");
  return rows.map((r, i) => ({
    brandSlug: r.brand?.slug ?? `slide-${i}`,
    brand: r.brand?.name ?? "",
    product: t(r.product, lang),
    caption: t(r.caption, lang),
    href: r.href,
    imageUrl: s(r.imageUrl),
    tint: r.tint,
  }));
}

export async function getVideos(lang: Locale): Promise<Video[]> {
  const rows = await get<{ title: L; youtubeUrl: string }[]>("/resources/videos");
  return rows.map((v) => ({ title: t(v.title, lang), url: v.youtubeUrl }));
}

/* ------------------------------------------------------------ customers */

export async function getAmbassadors(lang: Locale): Promise<Ambassador[]> {
  const rows = await get<{ name: string; title: L; photoUrl: string; socials: Ambassador["socials"] }[]>("/resources/ambassadors");
  return rows.map((a) => ({
    name: a.name,
    title: t(a.title, lang),
    photoUrl: s(a.photoUrl),
    socials: Object.fromEntries(Object.entries(a.socials ?? {}).filter(([, v]) => v)),
  }));
}

export async function getSalons(): Promise<Salon[]> {
  const rows = await get<(Salon & { address: string; phone: string; mapUrl: string })[]>("/resources/salons");
  return rows.map((r) => ({ name: r.name, region: r.region, province: r.province, address: s(r.address), phone: s(r.phone), mapUrl: s(r.mapUrl) }));
}

export async function getRegions(lang: Locale) {
  const rows = await get<{ key: Region; count: number }[]>("/regions");
  const labels = getDictionary(lang).regions;
  return rows.map((r) => ({ ...r, label: labels[r.key] }));
}

/* -------------------------------------------------------------- courses */

interface CourseRow { slug: string; title: L; priceText: L; duration: L; summary: L; content: L; coverUrl: string }

const toCourse = (c: CourseRow, lang: Locale): Course => ({
  slug: c.slug,
  title: t(c.title, lang),
  priceText: t(c.priceText, lang),
  duration: t(c.duration, lang),
  summary: t(c.summary, lang),
  content: lines(c.content, lang),
  coverUrl: s(c.coverUrl),
});

export async function getCourses(lang: Locale) {
  return (await get<CourseRow[]>("/resources/courses")).map((c) => toCourse(c, lang));
}

export async function getCourse(lang: Locale, slug: string) {
  const row = await get<CourseRow | null>(`/resources/courses/${encodeURIComponent(slug)}`);
  return row ? toCourse(row, lang) : undefined;
}

/* ---------------------------------------------------------------- posts */

interface PostRow { slug: string; type: PostType; title: L; excerpt: L; body: L; coverUrl: string; videoUrl: string; publishedAt: string | null }

const toPost = (p: PostRow, lang: Locale): Post => ({
  slug: p.slug,
  type: p.type,
  title: t(p.title, lang),
  excerpt: t(p.excerpt, lang),
  body: lines(p.body, lang),
  coverUrl: s(p.coverUrl),
  videoUrl: s(p.videoUrl),
  publishedAt: p.publishedAt ?? "",
});

export async function getPosts(lang: Locale, type?: PostType) {
  return (await get<PostRow[]>(`/resources/posts${type ? `?type=${type}` : ""}`)).map((p) => toPost(p, lang));
}

export async function getPost(lang: Locale, slug: string) {
  // The API only returns published posts
  const row = await get<PostRow | null>(`/resources/posts/${encodeURIComponent(slug)}`);
  return row ? toPost(row, lang) : undefined;
}

/* ---------------------------------------------------------------- pages */

export async function getPage(lang: Locale, slug: string): Promise<PageContent | undefined> {
  const row = await get<{ slug: string; title: L; body: L } | null>(`/resources/pages/${encodeURIComponent(slug)}`);
  return row ? { slug: row.slug, title: t(row.title, lang), body: lines(row.body, lang) } : undefined;
}

/* ----------------------------------------------------------------- team */

export async function getTeam(lang: Locale): Promise<TeamMember[]> {
  const rows = await get<{ name: L; position: L; department: TeamMember["department"]; phone: string; lineId: string; photoUrl: string }[]>("/resources/team");
  return rows.map((m) => ({
    name: t(m.name, lang),
    position: t(m.position, lang),
    department: m.department,
    phone: s(m.phone),
    lineId: s(m.lineId),
    photoUrl: s(m.photoUrl),
  }));
}
