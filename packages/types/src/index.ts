// Shared contracts between apps/api, apps/admin and apps/web.
// Zod schemas validate admin input in both the admin forms and the API.
import { z } from "zod";

// Validation messages in Thai (admin UI and API share them)
z.config(z.locales.th());

/* ----------------------------------------------------------------------------
 * i18n
 * ------------------------------------------------------------------------- */

export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "th";

/** Text stored in both languages. Thai is required; English falls back to Thai. */
export const localized = z.object({
  th: z.string().trim().min(1, "กรุณากรอกภาษาไทย"),
  en: z.string().trim().optional().default(""),
});
export const localizedOptional = z
  .object({
    th: z.string().trim().optional().default(""),
    en: z.string().trim().optional().default(""),
  })
  .default({ th: "", en: "" });
export type Localized = z.infer<typeof localized>;

export function t(value: Partial<Localized> | null | undefined, locale: Locale): string {
  if (!value) return "";
  return (locale === "en" && value.en) || value.th || value.en || "";
}

/* ----------------------------------------------------------------------------
 * Shared pieces
 * ------------------------------------------------------------------------- */

const slug = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ใช้ a-z, 0-9 และ - เท่านั้น");
const url = z.string().trim().optional().default("");
const sortOrder = z.coerce.number().int().default(0);
const isActive = z.boolean().default(true);

export const socials = z
  .object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
    line: z.string().optional(),
  })
  .partial()
  .default({});
export type Socials = z.infer<typeof socials>;

/* ----------------------------------------------------------------------------
 * Enums
 * ------------------------------------------------------------------------- */

export const ROLES = ["ADMIN", "STAFF"] as const;
export const BRAND_TYPES = ["SALON", "COUNTER"] as const;
export const REGIONS = ["BANGKOK_CENTRAL", "EAST", "WEST", "NORTH", "SOUTH", "NORTHEAST"] as const;
export const POST_TYPES = ["ARTICLE", "ACTIVITY", "MEDIA"] as const;
export const DEPARTMENTS = ["SALES", "TECHNICIAN", "FINANCE", "LEGAL"] as const;
export const MENU_LOCATIONS = ["header", "footer"] as const;
export const INQUIRY_TYPES = ["CONTACT", "ORDER", "SALON", "COURSE", "ISSUE", "PP_STUDIO"] as const;
export const INQUIRY_STATUSES = ["NEW", "IN_PROGRESS", "DONE"] as const;

export type Role = (typeof ROLES)[number];
export type BrandType = (typeof BRAND_TYPES)[number];
export type Region = (typeof REGIONS)[number];
export type PostType = (typeof POST_TYPES)[number];
export type Department = (typeof DEPARTMENTS)[number];
export type InquiryType = (typeof INQUIRY_TYPES)[number];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/* ----------------------------------------------------------------------------
 * Admin input schemas (one per resource)
 * ------------------------------------------------------------------------- */

export const menuSlideSchema = z.object({
  imageUrl: url.default(""),
  title: localizedOptional,
  caption: localizedOptional,
  href: z.string().trim().default(""),
});
export type MenuSlide = z.infer<typeof menuSlideSchema>;

export const menuSectionCardSchema = z.object({
  title: localized,
  description: localizedOptional,
  imageUrl: url.optional().default(""),
  href: z.string().trim().default(""),
});
export type MenuSectionCard = z.infer<typeof menuSectionCardSchema>;

export const menuSectionSchema = z.object({
  layout: z.enum(["columns", "left-image", "right-image", "text-only"]).default("left-image"),
  title: localizedOptional,
  description: localizedOptional,
  imageUrl: url.optional().default(""),
  buttonText: localizedOptional,
  buttonHref: z.string().trim().default(""),
  cards: z.array(menuSectionCardSchema).default([]),
});
export type MenuSection = z.infer<typeof menuSectionSchema>;

export const menuItemInput = z.object({
  label: localized,
  href: z.string().trim().min(1),
  location: z.enum(MENU_LOCATIONS).default("header"),
  parentId: z.string().nullable().optional().default(null),
  brandId: z.string().nullable().optional().default(null),
  brandSlug: z.string().trim().optional().default(""),
  showProducts: z.boolean().default(true),
  slides: z.array(menuSlideSchema).default([]),
  sections: z.array(menuSectionSchema).default([]),
  sortOrder,
  isActive,
});

export const brandFeatureSchema = z.object({
  title: localized,
  description: localizedOptional,
  href: z.string().trim().default(""),
  imageUrl: url.optional().default(""),
});
export type BrandFeature = z.infer<typeof brandFeatureSchema>;

export const brandSeriesSchema = z.object({
  name: z.string().trim().min(1),
  href: z.string().trim().default(""),
});
export type BrandSeries = z.infer<typeof brandSeriesSchema>;

export const brandInput = z.object({
  slug,
  type: z.enum(BRAND_TYPES),
  name: z.string().trim().min(1),
  localName: localizedOptional,
  country: localizedOptional,
  tagline: localizedOptional,
  description: localizedOptional,
  highlights: z.array(localized).default([]),
  features: z.array(brandFeatureSchema).default([]),
  series: z.array(brandSeriesSchema).default([]),
  logoUrl: url,
  website: url,
  catalogUrl: url,
  socials,
  sortOrder,
  isActive,
});

export const categoryInput = z.object({
  brandId: z.string().min(1, "กรุณาเลือกแบรนด์"),
  slug,
  name: localized,
  subtitle: localizedOptional,
  description: localizedOptional,
  highlights: localizedOptional,
  imageUrl: url,
  bannerUrl: url,
  accentColor: z.string().default("#d6297f"),
  subCategories: z
    .array(z.object({ th: z.string().default(""), en: z.string().default("") }))
    .default([]),
  sortOrder,
  isActive,
});

export const productInput = z.object({
  slug,
  name: localized,
  description: localizedOptional,
  brandId: z.string().min(1, "กรุณาเลือกแบรนด์"),
  categoryId: z.string().nullable().optional().default(null),
  category: z.string().trim().optional().default(""),
  series: z.string().trim().optional().default(""),
  price: z.coerce.number().nonnegative(),
  salePrice: z.coerce.number().nonnegative().nullable().optional().default(null),
  badges: z.array(z.string().trim().min(1)).default([]),
  imageUrl: url,
  sortOrder,
  isActive,
});

export const heroSlideInput = z.object({
  brandId: z.string().nullable().optional().default(null),
  product: localized,
  caption: localizedOptional,
  href: z.string().trim().min(1),
  imageUrl: url,
  tint: z.string().regex(/^#[0-9a-fA-F]{6}$/, "สีต้องเป็นรูปแบบ #RRGGBB").default("#d6297f"),
  sortOrder,
  isActive,
});

export const videoInput = z.object({
  title: localized,
  youtubeUrl: z.string().trim().min(1),
  sortOrder,
  isActive,
});

export const ambassadorInput = z.object({
  name: z.string().trim().min(1),
  title: localizedOptional,
  photoUrl: url,
  socials,
  sortOrder,
  isActive,
});

export const salonInput = z.object({
  name: z.string().trim().min(1),
  region: z.enum(REGIONS),
  province: z.string().trim().min(1),
  address: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
  mapUrl: url,
  isActive,
});

export const courseInput = z.object({
  slug,
  title: localized,
  priceText: localizedOptional,
  duration: localizedOptional,
  summary: localizedOptional,
  /** One paragraph / bullet per line */
  content: localizedOptional,
  coverUrl: url,
  sortOrder,
  isActive,
});

export const postInput = z.object({
  slug,
  type: z.enum(POST_TYPES),
  title: localized,
  excerpt: localizedOptional,
  /** One paragraph per line */
  body: localizedOptional,
  coverUrl: url,
  videoUrl: url,
  publishedAt: z.coerce.date().nullable().optional().default(null),
});

export const pageInput = z.object({
  slug,
  title: localized,
  /** One paragraph per line; lines starting with "## " become headings */
  body: localizedOptional,
  isActive,
});

export const teamMemberInput = z.object({
  name: localized,
  position: localizedOptional,
  department: z.enum(DEPARTMENTS),
  phone: z.string().trim().optional().default(""),
  lineId: z.string().trim().optional().default(""),
  photoUrl: url,
  sortOrder,
  isActive,
});

export const inquiryUpdateInput = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  note: z.string().optional(),
});

export const userCreateInput = z.object({
  email: z.email(),
  name: z.string().trim().min(1),
  role: z.enum(ROLES).default("STAFF"),
  password: z.string().min(8, "รหัสผ่านอย่างน้อย 8 ตัวอักษร"),
  isActive,
});
export const userUpdateInput = userCreateInput.partial().extend({
  password: z.string().min(8, "รหัสผ่านอย่างน้อย 8 ตัวอักษร").optional().or(z.literal("")),
});

export const loginInput = z.object({
  email: z.email(),
  password: z.string().min(1),
});

/* ----------------------------------------------------------------------------
 * Public input (website forms)
 * ------------------------------------------------------------------------- */

export const inquiryInput = z.object({
  type: z.enum(INQUIRY_TYPES),
  name: z.string().trim().min(1),
  phone: z.string().trim().optional().default(""),
  email: z.union([z.email(), z.literal("")]).optional().default(""),
  shopName: z.string().trim().optional().default(""),
  province: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
  data: z.record(z.string(), z.unknown()).optional().default({}),
});

/* ----------------------------------------------------------------------------
 * Website members
 * ------------------------------------------------------------------------- */

export const memberRegisterInput = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
  locale: z.enum(LOCALES).default("th"),
});

export const memberLoginInput = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const memberGoogleInput = z.object({
  /** ID token (JWT) from Google Identity Services */
  credential: z.string().min(10),
  locale: z.enum(LOCALES).default("th"),
});

export const memberProfileInput = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().max(30).default(""),
  shopName: z.string().trim().max(120).default(""),
  province: z.string().trim().max(60).default(""),
});

export interface MemberProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  shopName: string;
  province: string;
  avatarUrl: string;
  hasPassword: boolean;
  hasGoogle: boolean;
  createdAt: string;
}

/* ----------------------------------------------------------------------------
 * Settings (key/value)
 * ------------------------------------------------------------------------- */

export const companySetting = z.object({
  name: localized,
  address: localized,
  phones: z.array(z.string()).default([]),
  email: z.string().default(""),
  taxId: z.string().default(""),
  mapUrl: z.string().default(""),
  facebookGroup: z.string().default(""),
  departments: z.array(z.object({ name: localized, phone: z.string() })).default([]),
  bankAccounts: z
    .array(z.object({ bank: localized, accountName: localized, accountNo: z.string() }))
    .default([]),
});

export const aboutSlideItem = z.object({
  imageUrl: z.string().default(""),
  title: localizedOptional,
  caption: localizedOptional,
});

export const aboutSlidesSetting = z.array(aboutSlideItem).default([]);
export type AboutSlidesSetting = z.infer<typeof aboutSlidesSetting>;

export const aboutSetting = z.object({
  eyebrow: localizedOptional,
  headline: localizedOptional,
  lead: localizedOptional,
  welcomeText: localizedOptional,
  founderName: localizedOptional,
  founderRole: localizedOptional,
  founderPhoto: z.string().default(""),
  education: localizedOptional,
  socials: socials.default({}),
  links: z.array(z.object({ label: localized, href: z.string().default("") })).default([]),
});
export type AboutSetting = z.infer<typeof aboutSetting>;

export const growVisionItem = z.object({
  title: localized,
  text: localizedOptional,
  href: z.string().default(""),
});

export const growVisionSetting = z.object({
  imageUrl: z.string().default(""),
  badge: localizedOptional,
  items: z.array(growVisionItem).default([]),
});
export const vipCustomerSetting = z.object({
  eyebrow: localizedOptional,
  quote: localizedOptional,
  subtext: localizedOptional,
  bgImageUrl: z.string().default(""),
});
export type VipCustomerSetting = z.infer<typeof vipCustomerSetting>;

export const salonHairSlideItem = z.object({
  imageUrl: z.string().default(""),
  title: localizedOptional,
  formula: z.string().trim().optional().default(""),
  description: localizedOptional,
  href: z.string().trim().optional().default(""),
});

export const productsPageSetting = z.object({
  showHero: z.boolean().default(true),
  heroEyebrow: localizedOptional,
  heroHeadline: localizedOptional,
  heroLead: localizedOptional,

  showBannerSlides: z.boolean().default(true),
  slides: z.array(menuSlideSchema).default([]),

  showOvalCarousel: z.boolean().default(true),
  ovalTitle: localizedOptional,
  ovalDescription: localizedOptional,
  ovalItems: z.array(salonHairSlideItem).default([]),

  sections: z.array(menuSectionSchema).default([]),
});
export type ProductsPageSetting = z.infer<typeof productsPageSetting>;

export const salonHairSlidesSetting = z.object({
  heroEyebrow: localizedOptional,
  heroHeadline: localizedOptional,
  heroLead: localizedOptional,
  slides: z.array(menuSlideSchema).default([]),
  eyebrow: localizedOptional,
  title: localizedOptional,
  description: localizedOptional,
  items: z.array(salonHairSlideItem).default([]),
});
export type SalonHairSlidesSetting = z.infer<typeof salonHairSlidesSetting>;

export const SETTING_KEYS = ["company", "about", "aboutSlides", "productsPage", "salonHairSlides", "vipCustomer", "growVision", "timeline", "ppStudio", "regionCounts"] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

export const settingSchemas = {
  company: companySetting,
  about: aboutSetting,
  aboutSlides: aboutSlidesSetting,
  productsPage: productsPageSetting,
  salonHairSlides: salonHairSlidesSetting,
  vipCustomer: vipCustomerSetting,
  growVision: growVisionSetting,
  timeline: z.array(z.object({ year: z.string(), text: localized })),
  ppStudio: z.array(z.object({ title: z.string(), text: localized })),
  /** Optional override for the salon directory counts until all salons are imported */
  regionCounts: z.record(z.enum(REGIONS), z.coerce.number().int().nonnegative()),
} satisfies Record<SettingKey, z.ZodType>;

/* ----------------------------------------------------------------------------
 * Resource registry (drives generic admin CRUD in API and admin UI)
 * ------------------------------------------------------------------------- */

export const resources = {
  "menu-items": { schema: menuItemInput, label: "เมนู" },
  "hero-slides": { schema: heroSlideInput, label: "สไลด์หน้าแรก" },
  brands: { schema: brandInput, label: "แบรนด์" },
  categories: { schema: categoryInput, label: "หมวดหมู่ (Categories)" },
  products: { schema: productInput, label: "สินค้า" },
  videos: { schema: videoInput, label: "วิดีโอ" },
  ambassadors: { schema: ambassadorInput, label: "แบรนด์แอมบาสเดอร์" },
  salons: { schema: salonInput, label: "ซาลอน" },
  courses: { schema: courseInput, label: "คอร์สเรียน" },
  posts: { schema: postInput, label: "บทความ / กิจกรรม / มีเดีย" },
  pages: { schema: pageInput, label: "หน้าเนื้อหา" },
  team: { schema: teamMemberInput, label: "ทีมงาน" },
} as const;
export type ResourceName = keyof typeof resources;

export interface ApiError {
  statusCode: number;
  message: string | string[];
  errors?: Record<string, string[]>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
