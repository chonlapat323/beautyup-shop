// Data access layer: reads the public API (apps/api) and resolves localized
// fields to the requested language. Pages only import from here.
//
// Results are cached ('use cache') and tagged "content"; the admin panel calls
// /api/revalidate after every save, so edits show up without a redeploy.
import "server-only";
import { t, type Localized } from "@beautyup/types";
import { cacheLife, cacheTag } from "next/cache";
import { getDictionary, type Locale } from "@/i18n";
import type { BrandCategory } from "./brand-categories";
import { provinces } from "./provinces";
import {
  PROVINCE_EN,
  REGION_SALON_COUNTS,
  THAILAND_SALON_DIRECTORY,
  getThailandSalons,
} from "./thailand-salons";
import type {
  Ambassador,
  Brand,
  CompanyInfo,
  Course,
  ForumCategory,
  ForumTopic,
  ForumTopicSummary,
  HeroSlide,
  MediaItem,
  MenuItem,
  MenuSectionItem,
  MenuSlideItem,
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

async function fetchApi(url: string): Promise<Response> {
  try {
    return await fetch(url);
  } catch (e) {
    throw new Error(`API not reachable at ${API_URL}. Is it running? (pnpm dev / pm2 start beautyup-shop-api)`, { cause: e });
  }
}

async function get<T>(path: string): Promise<T> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const res = await fetchApi(`${API_URL}/public${path}`);
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

interface MenuRow {
  id: string;
  label: L;
  href: string;
  parentId: string | null;
  location: string;
  brandId?: string | null;
  brandSlug?: string | null;
  brand?: { id: string; slug: string; name: string } | null;
  showProducts?: boolean;
  slides?: { imageUrl: string; title?: L; caption?: L; href?: string }[];
  sections?: {
    layout: "columns" | "left-image" | "right-image" | "text-only";
    title?: L;
    description?: L;
    imageUrl?: string;
    buttonText?: L;
    buttonHref?: string;
    cards?: { title: L; description?: L; imageUrl?: string; href?: string }[];
  }[];
}

export const toFullMenuItem = (r: MenuRow, lang: Locale): MenuItem => ({
  id: r.id,
  label: t(r.label, lang),
  href: r.href,
  location: r.location,
  parentId: r.parentId,
  brandId: r.brandId,
  brandSlug: r.brand?.slug || r.brandSlug || undefined,
  brandName: r.brand?.name || undefined,
  showProducts: r.showProducts ?? true,
  slides: (r.slides ?? []).map((sl) => ({
    imageUrl: s(sl.imageUrl) || "",
    title: s(t(sl.title, lang)),
    caption: s(t(sl.caption, lang)),
    href: sl.href || "",
  })),
  sections: (r.sections ?? []).map((sec) => ({
    layout: sec.layout || "left-image",
    title: s(t(sec.title, lang)),
    description: s(t(sec.description, lang)),
    imageUrl: s(sec.imageUrl),
    buttonText: s(t(sec.buttonText, lang)),
    buttonHref: sec.buttonHref || "",
    cards: (sec.cards ?? []).map((cd) => ({
      title: t(cd.title, lang),
      description: s(t(cd.description, lang)),
      imageUrl: s(cd.imageUrl),
      href: cd.href || "",
    })),
  })),
});

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

export async function getMenuItemByHref(lang: Locale, href: string): Promise<MenuItem | undefined> {
  try {
    const rows = await get<MenuRow[]>("/resources/menu-items");
    const cleanHref = href.replace(/\/$/, "");
    const found = rows.find((r) => {
      const rClean = r.href.replace(/\/$/, "");
      return rClean === cleanHref || rClean === `/products/${cleanHref}` || `/products/${rClean}` === cleanHref;
    });
    return found ? toFullMenuItem(found, lang) : undefined;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------- settings */

interface CompanyRow {
  name: L; address: L; phones: string[]; email: string; taxId: string; mapUrl: string; facebookGroup: string;
  departments: { name: L; phone: string }[];
  bankAccounts: { bank: L; accountName: L; accountNo: string }[];
}
interface AboutSlideRow {
  imageUrl: string;
  title?: L;
  caption?: L;
}

interface AboutRow {
  eyebrow?: L;
  headline?: L;
  lead?: L;
  welcomeText?: L;
  founderName?: L;
  founderRole?: L;
  founderPhoto?: string;
  education?: L;
  socials?: Record<string, string>;
  links?: { label: L; href: string }[];
}

interface GrowVisionRow {
  imageUrl?: string;
  badge?: L;
  items?: { title: L; text?: L; href: string }[];
}

interface VipCustomerRow {
  eyebrow?: L;
  quote?: L;
  subtext?: L;
  bgImageUrl?: string;
}

interface MenuSlideRow {
  imageUrl?: string;
  title?: L;
  caption?: L;
  href?: string;
}

interface MenuSectionCardRow {
  title?: L;
  description?: L;
  imageUrl?: string;
  href?: string;
}

interface MenuSectionRow {
  layout?: "columns" | "left-image" | "right-image" | "text-only" | "oval-carousel";
  title?: L;
  description?: L;
  imageUrl?: string;
  buttonText?: L;
  buttonHref?: string;
  cards?: MenuSectionCardRow[];
}

interface SalonHairSlideRow {
  imageUrl?: string;
  title?: L;
  formula?: string;
  description?: L;
  href?: string;
}

interface SalonHairSlidesRow {
  heroEyebrow?: L;
  heroHeadline?: L;
  heroLead?: L;
  slides?: MenuSlideRow[];
  eyebrow?: L;
  title?: L;
  description?: L;
  items?: SalonHairSlideRow[];
}

interface ProductsPageRow {
  showHero?: boolean;
  heroEyebrow?: L;
  heroHeadline?: L;
  heroLead?: L;

  showBannerSlides?: boolean;
  slides?: MenuSlideRow[];

  showOvalCarousel?: boolean;
  ovalTitle?: L;
  ovalDescription?: L;
  ovalItems?: SalonHairSlideRow[];

  sections?: MenuSectionRow[];
}

interface SettingsRow {
  company?: CompanyRow;
  about?: AboutRow;
  aboutSlides?: AboutSlideRow[];
  productsPage?: ProductsPageRow;
  salonHairSlides?: SalonHairSlidesRow;
  vipCustomer?: VipCustomerRow;
  growVision?: GrowVisionRow;
  timeline?: { year: string; text: L }[];
}

export interface VipCustomerData {
  eyebrow: string;
  quote: string;
  subtext?: string;
  bgImageUrl?: string;
}

export interface AboutData {
  eyebrow: string;
  headline: string;
  lead: string;
  welcomeText: string;
  founderName: string;
  founderRole: string;
  founderPhoto: string;
  education: string[];
  slides: { imageUrl: string; caption: string }[];
  socials: Record<string, string>;
  links: { label: string; href: string }[];
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

export async function getAboutData(lang: Locale): Promise<AboutData> {
  const dict = getDictionary(lang).about;
  let settings: SettingsRow | undefined;
  try {
    settings = await get<SettingsRow>("/settings");
  } catch {
    // fallback to defaults if settings not available
  }
  const a = settings?.about;

  const headline = (a?.headline && t(a.headline, lang)) || dict.headline;
  const eyebrow = (a?.eyebrow && t(a.eyebrow, lang)) || dict.eyebrow;
  const lead = (a?.lead && t(a.lead, lang)) || dict.lead;
  const welcomeText = (a?.welcomeText && t(a.welcomeText, lang)) || dict.welcomeText || "";
  const founderName = (a?.founderName && t(a.founderName, lang)) || dict.founderName;
  const founderRole = (a?.founderRole && t(a.founderRole, lang)) || dict.founderRole;
  const founderPhoto = s(a?.founderPhoto) || "/founder.png";
  const educationRaw = (a?.education && t(a.education, lang)) || dict.educationText;
  const education = educationRaw
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  // About slides are managed strictly separate from the home hero slides
  const rawSlides = settings?.aboutSlides ?? [];
  const slides = rawSlides
    .filter((sl) => sl.imageUrl && sl.imageUrl.trim())
    .map((sl) => ({
      imageUrl: sl.imageUrl,
      caption: t(sl.caption, lang) || t(sl.title, lang),
    }));

  const socials = a?.socials && Object.keys(a.socials).length > 0
    ? a.socials
    : {
        facebook: "https://www.facebook.com/pholaphat.sothanarphisarn",
        instagram: "https://www.instagram.com/pholraphatamy/",
        tiktok: "https://www.tiktok.com/@pholraphatamysoth",
        youtube: "https://www.youtube.com/@FanolaOfficial",
      };

  const links = (a?.links && a.links.length > 0)
    ? a.links.map((l) => ({ label: t(l.label, lang), href: l.href }))
    : dict.links.map((l) => ({ label: l.label, href: l.href }));

  return {
    eyebrow,
    headline,
    lead,
    welcomeText,
    founderName,
    founderRole,
    founderPhoto,
    education,
    slides,
    socials,
    links,
  };
}

export interface GrowVisionData {
  imageUrl: string;
  badge: string;
  items: { title: string; text: string; href: string }[];
}

export async function getGrowVision(lang: Locale): Promise<GrowVisionData> {
  const dict = getDictionary(lang).grow;
  let settings: SettingsRow | undefined;
  try {
    settings = await get<SettingsRow>("/settings");
  } catch {
    // fallback
  }
  const g = settings?.growVision;

  const imageUrl = s(g?.imageUrl) || "/slides/14.jpg";
  const badge = (g?.badge && t(g.badge, lang)) || "Heona · No Yellow · Sweet";
  const items = (g?.items && g.items.length > 0)
    ? g.items.map((it) => ({
        title: t(it.title, lang),
        text: (it.text && t(it.text, lang)) || "",
        href: it.href,
      }))
    : dict.items;

  return { imageUrl, badge, items };
}

export async function getVipCustomerData(lang: Locale): Promise<VipCustomerData> {
  const dict = getDictionary(lang).customers;
  let settings: SettingsRow | undefined;
  try {
    settings = await get<SettingsRow>("/settings");
  } catch {
    // fallback
  }
  const v = settings?.vipCustomer;

  const defaultQuoteTh = `ช่างผมประสบการณ์สูง
ความสามารถโดดเด่น
วางใจผลิตภัณฑ์ของบิวตี้อัพ
มาอย่างยาวนาน
สร้างสรรค์เอกลักษณ์ผลงานเลอค่า
ให้กับลูกค้าทุกระดับ`;

  const defaultQuoteEn = `Experienced Master Stylists
Distinctive Artistry & Vision
Trusted Partners of Beauty Up Across the Years
Crafting Exceptional & Timeless Hair Perfection
For Clients of Every Distinction`;

  const eyebrow = (v?.eyebrow && t(v.eyebrow, lang)) || dict.eyebrow || "Our VIP Customer";
  const quote = (v?.quote && t(v.quote, lang)) || (lang === "en" ? defaultQuoteEn : defaultQuoteTh);
  const subtext = (v?.subtext && t(v.subtext, lang)) || "";
  const bgImageUrl = s(v?.bgImageUrl) || "";

  return { eyebrow, quote, subtext, bgImageUrl };
}

export interface SalonHairSlideItem {
  imageUrl: string;
  title: string;
  formula?: string;
  description?: string;
  href?: string;
}

export interface SalonHairSlidesData {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroLead?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items: SalonHairSlideItem[];
}

export async function getSalonHairSlides(lang: Locale): Promise<SalonHairSlidesData> {
  let settings: SettingsRow | undefined;
  try {
    settings = await get<SettingsRow>("/settings");
  } catch {
    // fallback
  }
  const s = settings?.salonHairSlides;
  const items = (s?.items ?? [])
    .filter((it) => it.imageUrl && it.imageUrl.trim())
    .map((it) => ({
      imageUrl: it.imageUrl || "",
      title: t(it.title, lang) || "",
      formula: it.formula || "",
      description: t(it.description, lang) || "",
      href: it.href || "",
    }));

  return {
    heroEyebrow: (s?.heroEyebrow && t(s.heroEyebrow, lang)) || undefined,
    heroHeadline: (s?.heroHeadline && t(s.heroHeadline, lang)) || undefined,
    heroLead: (s?.heroLead && t(s.heroLead, lang)) || undefined,
    eyebrow: (s?.eyebrow && t(s.eyebrow, lang)) || undefined,
    title: (s?.title && t(s.title, lang)) || undefined,
    description: (s?.description && t(s.description, lang)) || undefined,
    items,
  };
}

export interface ProductsPageData {
  showHero: boolean;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroLead?: string;

  showBannerSlides: boolean;
  slides: MenuSlideItem[];

  showOvalCarousel: boolean;
  ovalTitle?: string;
  ovalDescription?: string;
  ovalItems: SalonHairSlideItem[];

  sections: MenuSectionItem[];
}

export async function getProductsPageData(lang: Locale): Promise<ProductsPageData> {
  let settings: SettingsRow | undefined;
  try {
    settings = await get<SettingsRow>("/settings");
  } catch {
    // fallback
  }

  const p = settings?.productsPage;
  const s = settings?.salonHairSlides;

  // Hero
  const showHero = p?.showHero !== false;
  const heroEyebrow = (p?.heroEyebrow && t(p.heroEyebrow, lang)) || (s?.heroEyebrow && t(s.heroEyebrow, lang)) || undefined;
  const heroHeadline = (p?.heroHeadline && t(p.heroHeadline, lang)) || (s?.heroHeadline && t(s.heroHeadline, lang)) || undefined;
  const heroLead = (p?.heroLead && t(p.heroLead, lang)) || (s?.heroLead && t(s.heroLead, lang)) || undefined;

  // Banner Slides
  const showBannerSlides = p?.showBannerSlides !== false;
  const rawSlides = (p?.slides && p.slides.length > 0) ? p.slides : (s?.slides ?? []);
  const slides: MenuSlideItem[] = rawSlides
    .filter((sl) => sl.imageUrl && sl.imageUrl.trim())
    .map((sl) => ({
      imageUrl: sl.imageUrl || "",
      title: t(sl.title, lang) || "",
      caption: t(sl.caption, lang) || "",
      href: sl.href || "",
    }));

  // Oval Carousel
  const showOvalCarousel = p?.showOvalCarousel !== false;
  const ovalTitle = (p?.ovalTitle && t(p.ovalTitle, lang)) || (s?.title && t(s.title, lang)) || undefined;
  const ovalDescription = (p?.ovalDescription && t(p.ovalDescription, lang)) || (s?.description && t(s.description, lang)) || undefined;
  const rawOval = (p?.ovalItems && p.ovalItems.length > 0) ? p.ovalItems : (s?.items ?? []);
  const ovalItems: SalonHairSlideItem[] = rawOval
    .filter((it) => it.imageUrl && it.imageUrl.trim())
    .map((it) => ({
      imageUrl: it.imageUrl || "",
      title: t(it.title, lang) || "",
      formula: it.formula || "",
      description: t(it.description, lang) || "",
      href: it.href || "",
    }));

  // Dynamic Sections
  const rawSections = p?.sections ?? [];
  const sections: MenuSectionItem[] = rawSections.map((sec) => ({
    layout: sec.layout || "left-image",
    title: t(sec.title, lang) || "",
    description: t(sec.description, lang) || "",
    imageUrl: sec.imageUrl || "",
    buttonText: t(sec.buttonText, lang) || "",
    buttonHref: sec.buttonHref || "",
    cards: (sec.cards ?? []).map((c: MenuSectionCardRow) => ({
      title: t(c.title, lang) || "",
      description: t(c.description, lang) || "",
      imageUrl: c.imageUrl || "",
      href: c.href || "",
    })),
  }));

  return {
    showHero,
    heroEyebrow,
    heroHeadline,
    heroLead,
    showBannerSlides,
    slides,
    showOvalCarousel,
    ovalTitle,
    ovalDescription,
    ovalItems,
    sections,
  };
}

export async function getTimeline(lang: Locale) {
  return ((await get<SettingsRow>("/settings")).timeline ?? []).map((x) => ({ year: x.year, text: t(x.text, lang) }));
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
  highlights: L[]; features?: { title: L; description?: L; href?: string; imageUrl?: string }[];
  logoUrl: string; website: string; catalogUrl: string; socials: Brand["socials"];
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
  features: (b.features ?? []).map((f) => ({
    title: t(f.title, lang),
    description: s(t(f.description, lang)),
    href: f.href || "",
    imageUrl: s(f.imageUrl),
  })),
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
  categoryRel?: { slug: string; name: L } | null;
  brand: { slug: string; name: string; type: "SALON" | "COUNTER" };
}

const productFallbacks: Record<string, string> = {
  "shield-protective-mist-100ml": "/products/fanola/shield-protective-mist-100ml.jpg",
  "2-phase-potion-leave-in-150ml": "/products/fanola/2-phase-potion-leave-in-150ml.jpg",
  "thermo-protective-cream-150ml": "/products/fanola/thermo-protective-cream-150ml.jpg",
  "incredible-foam-250ml": "/categories/fanola/no-yellow-care.jpg",
  "no-yellow-mask-1000ml": "/categories/fanola/no-yellow-care.jpg",
  "no-yellow-shampoo-1000ml": "/categories/fanola/no-yellow-care.jpg",
  "no-orange-mask-1000ml": "/categories/fanola/no-orange.jpg",
  "no-orange-shampoo-1000ml": "/categories/fanola/no-orange.jpg",
  "blue-foam-no-orange-250ml": "/categories/fanola/no-orange.jpg",
  "no-orange-mask-350ml": "/categories/fanola/no-orange.jpg",
  "no-orange-shampoo-350ml": "/categories/fanola/no-orange.jpg",
  "no-red-mask-1000ml": "/categories/fanola/no-red.jpg",
  "no-red-shampoo-1000ml": "/categories/fanola/no-red.jpg",
  "no-red-set-100ml": "/categories/fanola/no-red.jpg",
  "no-red-mask-350ml": "/categories/fanola/no-red.jpg",
  "no-red-shampoo-350ml": "/categories/fanola/no-red.jpg",
  "nutri-care-shampoo-1000ml": "/categories/fanola/nutri-care.jpg",
};

const toProduct = (p: ProductRow, lang: Locale): Product => ({
  slug: p.slug,
  name: t(p.name, lang),
  brandSlug: p.brand.slug,
  brandName: p.brand.name,
  brandType: p.brand.type,
  collection: p.categoryRel ? { slug: p.categoryRel.slug, name: t(p.categoryRel.name, lang) } : undefined,
  price: p.price,
  salePrice: p.salePrice ?? undefined,
  badges: p.badges,
  imageUrl: s(p.imageUrl) || productFallbacks[p.slug] || "",
  description: s(t(p.description, lang)),
});

export async function getProduct(lang: Locale, slug: string) {
  const row = await get<ProductRow | null>(`/resources/products/${encodeURIComponent(slug)}`);
  return row ? toProduct(row, lang) : undefined;
}

export async function getProducts(lang: Locale, opts?: { brandSlug?: string; brandType?: "SALON" | "COUNTER" }): Promise<Product[]> {
  const qs = new URLSearchParams({
    ...(opts?.brandSlug && { brand: opts.brandSlug }),
    ...(opts?.brandType && { brandType: opts.brandType }),
  });
  const rows = await get<ProductRow[]>(`/resources/products${qs.size ? `?${qs}` : ""}`);
  return rows.map((p) => toProduct(p, lang));
}

interface CategoryRow extends Row {
  slug: string;
  name: L;
  subtitle?: L;
  description?: L;
  highlights?: L;
  imageUrl?: string;
  bannerUrl?: string;
  accentColor?: string;
  subCategories?: { th: string; en: string }[];
  brand: { id: string; slug: string; name: string };
}

export async function getBrandCategories(lang: Locale, brandSlug: string): Promise<BrandCategory[]> {
  const rows = await get<CategoryRow[]>(`/resources/categories?brand=${encodeURIComponent(brandSlug)}`);
  return rows.map((c) => ({
    slug: c.slug,
    brandSlug: c.brand?.slug || brandSlug,
    name: t(c.name, lang),
    subtitle: c.subtitle ? t(c.subtitle, lang) : undefined,
    description: c.description ? t(c.description, lang) : undefined,
    highlights: c.highlights ? t(c.highlights, lang) : undefined,
    imageUrl: s(c.imageUrl) || "",
    bannerUrl: s(c.bannerUrl) || "",
    accentColor: c.accentColor || "#d6297f",
    subCategories: c.subCategories
      ? c.subCategories.map((sc) => (lang === "en" ? sc.en || sc.th : sc.th || sc.en))
      : undefined,
  }));
}

/* ----------------------------------------------------------------- home */

interface SlideRow extends Row { product: L; caption: L; href: string; imageUrl: string; tint: string; brand: { slug: string; name: string } | null }

const defaultSlides: HeroSlide[] = [
  { brandSlug: "slide-1", brand: "BeautyUp", product: "BeautyUp Official Salon Partner", caption: "ศูนย์รวมผลิตภัณฑ์ซาลอนมืออาชีพ", href: "/products", imageUrl: "/slides/1.jpg", tint: "#1c1917" },
  { brandSlug: "slide-2", brand: "BeautyUp", product: "Beauty Promotion 2", caption: "โปรโมชันสุดคุ้มเพื่อช่างผมมืออาชีพ", href: "/products", imageUrl: "/slides/2.jpg", tint: "#1c1917" },
  { brandSlug: "slide-3", brand: "BeautyUp", product: "Nook Eco-Conscious Beauty", caption: "ผลิตภัณฑ์ดูแลเส้นผมธรรมชาติจากอิตาลี", href: "/products/nook", imageUrl: "/slides/3.jpg", tint: "#1c1917" },
  { brandSlug: "slide-4", brand: "BeautyUp", product: "Sweet Professional Hair Treatment", caption: "นวัตกรรมยืดผมระดับสากลจากบราซิล", href: "/products/sweet-professional", imageUrl: "/slides/4.jpg", tint: "#1c1917" },
  { brandSlug: "slide-5", brand: "BeautyUp", product: "BeautyUp Hair Product 5", caption: "ผลิตภัณฑ์บำรุงและฟื้นฟูเส้นผมล้ำลึก", href: "/products", imageUrl: "/slides/5.jpg", tint: "#1c1917" },
  { brandSlug: "slide-6", brand: "BeautyUp", product: "BeautyUp Professional Care 6", caption: "มาตรฐานการดูแลเส้นผมระดับซาลอนชั้นนำ", href: "/products", imageUrl: "/slides/6.jpg", tint: "#1c1917" },
  { brandSlug: "slide-7", brand: "BeautyUp", product: "Salon Inspiration 7", caption: "สร้างสรรค์ผลงานช่างผมมืออาชีพ", href: "/products", imageUrl: "/slides/7.jpg", tint: "#1c1917" },
  { brandSlug: "slide-8", brand: "BeautyUp", product: "BeautyUp Essential 8", caption: "ผลิตภัณฑ์จำเป็นสำหรับร้านซาลอน", href: "/products", imageUrl: "/slides/8.jpg", tint: "#1c1917" },
  { brandSlug: "slide-9", brand: "La Prairie", product: "La Prairie Caviar Collection", caption: "ศาสตร์แห่งการชะลอวัยชั้นเลิศจากสวิตเซอร์แลนด์", href: "/shop", imageUrl: "/slides/10 La Prairie.jpg", tint: "#1c1917" },
  { brandSlug: "slide-10", brand: "BeautyUp", product: "BeautyUp Showcase 10", caption: "คอลเลกชันสินค้าคุณภาพยอดนิยม", href: "/shop", imageUrl: "/slides/10.png", tint: "#1c1917" },
  { brandSlug: "slide-11", brand: "BeautyUp", product: "BeautyUp Premium 11", caption: "ผลิตภัณฑ์ระดับพรีเมียม", href: "/products", imageUrl: "/slides/11.png", tint: "#1c1917" },
  { brandSlug: "slide-12", brand: "BeautyUp", product: "BeautyUp Trend 12", caption: "อัปเดตเทรนด์ความงามใหม่ล่าสุด", href: "/products", imageUrl: "/slides/12.jpg", tint: "#1c1917" },
  { brandSlug: "slide-13", brand: "BeautyUp", product: "BeautyUp Special 13", caption: "สิทธิประโยชน์สำหรับสมาชิกและซาลอน", href: "/contact/salon-partner", imageUrl: "/slides/13.jpg", tint: "#1c1917" },
  { brandSlug: "slide-14", brand: "BeautyUp", product: "Salon Partner Community 14", caption: "ร่วมเป็นพันธมิตรซาลอนกับบิวตี้อัพทั่วประเทศ", href: "/contact/salon-partner", imageUrl: "/slides/14.jpg", tint: "#1c1917" },
  { brandSlug: "slide-15", brand: "BeautyUp", product: "BeautyUp Academy 15", caption: "คอร์สเรียนและพัฒนาทักษะช่างผม", href: "/courses", imageUrl: "/slides/15.jpg", tint: "#1c1917" },
];

export async function getHeroSlides(lang: Locale): Promise<HeroSlide[]> {
  try {
    const rows = await get<SlideRow[]>("/resources/hero-slides");
    if (!rows || rows.length === 0) return defaultSlides;
    return rows.map((r, i) => {
      const img = s(r.imageUrl);
      return {
        brandSlug: r.brand?.slug ?? `slide-${i}`,
        brand: r.brand?.name ?? "",
        product: t(r.product, lang),
        caption: t(r.caption, lang),
        href: r.href || "/products",
        imageUrl: img || defaultSlides[i % defaultSlides.length].imageUrl,
        tint: r.tint || "#1c1917",
      };
    });
  } catch {
    return defaultSlides;
  }
}

export async function getVideos(lang: Locale): Promise<Video[]> {
  const rows = await get<{ title: L; youtubeUrl: string }[]>("/resources/videos");
  return rows.map((v) => ({ title: t(v.title, lang), url: v.youtubeUrl }));
}

/* ------------------------------------------------------------ customers */

export async function getAmbassadors(lang: Locale): Promise<Ambassador[]> {
  const rows = await get<{ name: string; title: L; photoUrl: string; socials: Ambassador["socials"] }[]>("/resources/ambassadors");
  const fallbackPhotos: Record<string, string> = {
    CHERRY: "/ambassadors/1.jpg",
    TEMEE: "/ambassadors/2.jpg",
    NOK: "/ambassadors/3.jpg",
    AUM: "/ambassadors/4.jpg",
  };
  return rows.map((a, i) => ({
    name: a.name,
    title: t(a.title, lang),
    photoUrl: s(a.photoUrl) || fallbackPhotos[a.name.toUpperCase()] || `/ambassadors/${(i % 4) + 1}.jpg`,
    socials: Object.fromEntries(Object.entries(a.socials ?? {}).filter(([, v]) => v)),
  }));
}

export async function getSalons(lang: Locale = "th"): Promise<Salon[]> {
  try {
    const rows = await get<(Salon & { address: string; phone: string; mapUrl: string })[]>("/resources/salons");
    const realSalons = (rows ?? []).filter(
      (r) =>
        !r.name.includes("ตัวอย่าง") &&
        !r.name.includes("sample") &&
        !r.name.includes("Sample") &&
        !r.name.includes("Mock") &&
        !r.name.includes("เดอะแฮร์") &&
        !r.name.includes("The Hair"),
    );

    if (realSalons.length >= 70) {
      return realSalons.map((r) => {
        const rawProv = r.province.replace(/^จังหวัด\s*/, "").trim();
        const enProv = PROVINCE_EN[rawProv] || rawProv;
        return {
          name:
            lang === "en"
              ? `Hair Salon in ${enProv}`
              : r.name.startsWith("ร้านทำผม")
                ? r.name
                : `ร้านทำผม ${r.name}`,
          region: r.region,
          province: lang === "en" ? enProv : r.province,
          address: lang === "en" ? `${enProv}, Thailand` : s(r.address) || `ร้านทำผม จังหวัด${rawProv}`,
          phone: s(r.phone),
          mapUrl: s(r.mapUrl),
        };
      });
    }
  } catch {
    // fallback to static directory
  }
  return getThailandSalons(lang);
}

export async function getRegions(lang: Locale) {
  const labels = getDictionary(lang).regions;
  try {
    const rows = await get<{ key: Region; count: number }[]>("/regions");
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        ...r,
        count: r.count > 0 ? r.count : (REGION_SALON_COUNTS[r.key] ?? 0),
        label: labels[r.key],
      }));
    }
  } catch {
    // fallback
  }
  return (Object.keys(REGION_SALON_COUNTS) as Region[]).map((key) => ({
    key,
    count: REGION_SALON_COUNTS[key],
    label: labels[key],
  }));
}

/* -------------------------------------------------------------- courses */

interface CourseRow { slug: string; title: L; priceText: L; duration: L; summary: L; content: L; coverUrl: string; images?: string[] }

const toCourse = (c: CourseRow, lang: Locale): Course => ({
  slug: c.slug,
  title: t(c.title, lang),
  priceText: t(c.priceText, lang),
  duration: t(c.duration, lang),
  summary: t(c.summary, lang),
  content: lines(c.content, lang),
  coverUrl: s(c.coverUrl),
  images: c.images ?? [],
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

/** Articles and activities, plus media (as post-shaped cards) so lists and search cover everything. */
export async function getPosts(lang: Locale, type?: PostType): Promise<Post[]> {
  const mediaPosts = async () => (await getMediaList(lang)).map(mediaAsPost);
  if (type === "MEDIA") return mediaPosts();
  const posts = (await get<PostRow[]>(`/resources/posts${type ? `?type=${type}` : ""}`)).map((p) => toPost(p, lang));
  if (type) return posts;
  return [...posts, ...(await mediaPosts())].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(lang: Locale, slug: string) {
  // The API only returns published posts
  const row = await get<PostRow | null>(`/resources/posts/${encodeURIComponent(slug)}`);
  return row ? toPost(row, lang) : undefined;
}

/* ---------------------------------------------------------------- media */

interface MediaRow {
  slug: string; title: L; excerpt: L; body: L; images: string[] | null; videoUrl: string; tags: string[];
  brands: { slug: string; name: string; type: Brand["type"] }[];
  category: { slug: string; name: L } | null;
  publishedAt: string | null;
}

const toMedia = (m: MediaRow, lang: Locale): MediaItem => ({
  slug: m.slug,
  title: t(m.title, lang),
  excerpt: t(m.excerpt, lang),
  body: lines(m.body, lang),
  images: m.images ?? [],
  videoUrl: s(m.videoUrl),
  tags: m.tags ?? [],
  brands: m.brands ?? [],
  category: m.category ? { slug: m.category.slug, name: t(m.category.name, lang) } : undefined,
  publishedAt: m.publishedAt ?? "",
});

const mediaAsPost = (m: MediaItem): Post => ({
  slug: m.slug,
  type: "MEDIA",
  title: m.title,
  excerpt: m.excerpt,
  body: m.body,
  coverUrl: m.images[0],
  videoUrl: m.videoUrl,
  publishedAt: m.publishedAt,
});

export async function getMediaList(lang: Locale, filter: { category?: string; brand?: string } = {}) {
  const q = new URLSearchParams(Object.entries(filter).filter((e): e is [string, string] => !!e[1])).toString();
  return (await get<MediaRow[]>(`/resources/media${q ? `?${q}` : ""}`)).map((m) => toMedia(m, lang));
}

export async function getMedia(lang: Locale, slug: string) {
  // The API only returns published media
  const row = await get<MediaRow | null>(`/resources/media/${encodeURIComponent(slug)}`);
  return row ? toMedia(row, lang) : undefined;
}

/* ---------------------------------------------------------------- forum */

/** Visitors post often, so forum data has its own tag (refreshed after each post) and a short life. */
export const FORUM_TAG = "forum";

async function getForum<T>(path: string): Promise<T> {
  "use cache";
  cacheTag(CONTENT_TAG, FORUM_TAG);
  cacheLife("minutes");
  const res = await fetchApi(`${API_URL}/public/forum${path}`);
  if (res.status === 404) return null as T;
  if (!res.ok) throw new Error(`API /forum${path} responded ${res.status}`);
  return res.json() as Promise<T>;
}

interface ForumCategoryRow { slug: string; name: L; description: L; _count: { topics: number } }
type ForumCategoryRef = { slug: string; name: L };
interface ForumTopicRow {
  id: string; title: string; excerpt: string; authorName: string; images: string[]; isPinned: boolean; isLocked: boolean;
  replyCount: number; createdAt: string; lastActivityAt: string; category: ForumCategoryRef;
}
interface ForumTopicDetailRow extends Omit<ForumTopicRow, "excerpt" | "replyCount"> {
  body: string;
  replies: { id: string; body: string; authorName: string; images: string[]; createdAt: string }[];
}

const forumCategoryRef = (c: ForumCategoryRef, lang: Locale) => ({ slug: c.slug, name: t(c.name, lang) });

export async function getForumCategories(lang: Locale): Promise<ForumCategory[]> {
  return (await getForum<ForumCategoryRow[]>("/categories")).map((c) => ({
    slug: c.slug,
    name: t(c.name, lang),
    description: t(c.description, lang),
    topicCount: c._count.topics,
  }));
}

export async function getForumTopics(lang: Locale, opts: { category?: string; page?: number } = {}) {
  const q = new URLSearchParams();
  if (opts.category) q.set("category", opts.category);
  if (opts.page && opts.page > 1) q.set("page", String(opts.page));
  const res = await getForum<{ items: ForumTopicRow[]; total: number; page: number; pageSize: number }>(`/topics${q.size ? `?${q}` : ""}`);
  const items: ForumTopicSummary[] = res.items.map(({ images, category, ...t }) => ({ ...t, image: images[0], category: forumCategoryRef(category, lang) }));
  return { items, total: res.total, page: res.page, pages: Math.max(1, Math.ceil(res.total / res.pageSize)) };
}

export async function getForumTopic(lang: Locale, id: string): Promise<ForumTopic | undefined> {
  const row = await getForum<ForumTopicDetailRow | null>(`/topics/${encodeURIComponent(id)}`);
  return row ? { ...row, category: forumCategoryRef(row.category, lang) } : undefined;
}

export const getForumSitemap = () => getForum<{ id: string; lastActivityAt: string }[]>("/sitemap");

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
