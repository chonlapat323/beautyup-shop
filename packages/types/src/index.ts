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

export const ROLES = ["ADMIN", "MANAGER", "EDITOR", "STAFF"] as const;
export const BRAND_TYPES = ["SALON", "COUNTER"] as const;
export const REGIONS = ["BANGKOK_CENTRAL", "EAST", "WEST", "NORTH", "SOUTH", "NORTHEAST"] as const;
export const POST_TYPES = ["ARTICLE", "ACTIVITY"] as const;
export const DEPARTMENTS = ["SALES", "TECHNICIAN", "FINANCE", "LEGAL"] as const;
export const MENU_LOCATIONS = ["header", "footer"] as const;
export const INQUIRY_TYPES = ["CONTACT", "ORDER", "SALON", "COURSE", "ISSUE"] as const;
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
  layout: z.enum(["columns", "left-image", "right-image", "text-only", "oval-carousel"]).default("left-image"),
  title: localizedOptional,
  description: localizedOptional,
  imageUrl: url.optional().default(""),
  buttonText: localizedOptional,
  buttonHref: z.string().trim().default(""),
  cards: z.array(menuSectionCardSchema).default([]),
});
export type MenuSection = z.infer<typeof menuSectionSchema>;

export const menuHeroSchema = z
  .object({ eyebrow: localizedOptional, headline: localizedOptional, lead: localizedOptional })
  .default({ eyebrow: { th: "", en: "" }, headline: { th: "", en: "" }, lead: { th: "", en: "" } });
export type MenuHero = z.infer<typeof menuHeroSchema>;

export const menuItemInput = z.object({
  label: localized,
  href: z.string().trim().min(1),
  location: z.enum(MENU_LOCATIONS).default("header"),
  parentId: z.string().nullable().optional().default(null),
  brandId: z.string().nullable().optional().default(null),
  brandSlug: z.string().trim().optional().default(""),
  showProducts: z.boolean().default(true),
  /** Page header text; empty fields fall back to the menu label. Brand pages use the brand's own details. */
  hero: menuHeroSchema,
  slides: z.array(menuSlideSchema).default([]),
  sections: z.array(menuSectionSchema).default([]),
  sortOrder,
  isActive,
});

export const brandInput = z.object({
  slug,
  type: z.enum(BRAND_TYPES),
  name: z.string().trim().min(1),
  localName: localizedOptional,
  country: localizedOptional,
  tagline: localizedOptional,
  description: localizedOptional,
  highlights: z.array(localized).default([]),
  logoUrl: url,
  website: url,
  catalogUrl: url,
  socials,
  sortOrder,
  isActive,
});

/** A brand's main product group (ดูแลผม, ทำสีผม ...); holds several collections */
export const mainCategoryInput = z.object({
  brandId: z.string().min(1, "กรุณาเลือกแบรนด์"),
  slug,
  name: localized,
  description: localizedOptional,
  imageUrl: url,
  sortOrder,
  isActive,
});

export const categoryInput = z.object({
  brandId: z.string().min(1, "กรุณาเลือกแบรนด์"),
  mainCategoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่หลัก"),
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
  mainCategoryId: z.string().nullable().optional().default(null),
  /** The product's collection (optional — some brands/categories do not use collections) */
  categoryId: z.string().nullable().optional().default(null),
  price: z.coerce.number().nonnegative(),
  salePrice: z.coerce.number().nonnegative().nullable().optional().default(null),
  badges: z.array(z.string().trim().min(1)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),
  imageUrl: url,
  images: z.array(url).default([]),
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
  images: z.array(z.string().trim()).max(5).default([]),
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
  images: z.array(z.string().trim()).max(20).default([]),
  videoUrl: url,
  publishedAt: z.coerce.date().nullable().optional().default(null),
});

export const mediaCategoryInput = z.object({
  slug,
  name: localized,
  sortOrder,
  isActive,
});

export const mediaInput = z.object({
  slug,
  title: localized,
  excerpt: localizedOptional,
  /** One paragraph per line */
  body: localizedOptional,
  images: z.array(z.string().trim().min(1)).max(20).default([]),
  videoUrl: url,
  tags: z.array(z.string().trim().min(1)).default([]),
  categoryId: z.string().nullable().optional().default(null),
  brandIds: z.array(z.string()).default([]),
  publishedAt: z.coerce.date().nullable().optional().default(null),
});

/* ----------------------------------------------------------------------------
 * Forum: anyone may post with just a name
 * ------------------------------------------------------------------------- */

export const FORUM_LIMITS = { title: 150, body: 5000, name: 60, images: 4, imageBytes: 5 * 1024 * 1024 } as const;

const forumTitle = z.string().trim().min(3, "หัวข้อสั้นเกินไป").max(FORUM_LIMITS.title, `หัวข้อยาวได้ไม่เกิน ${FORUM_LIMITS.title} ตัวอักษร`);
const forumBody = z.string().trim().min(2, "กรุณาพิมพ์ข้อความ").max(FORUM_LIMITS.body, `ข้อความยาวได้ไม่เกิน ${FORUM_LIMITS.body} ตัวอักษร`);
const forumName = z.string().trim().min(1, "กรุณาใส่ชื่อ").max(FORUM_LIMITS.name, `ชื่อยาวได้ไม่เกิน ${FORUM_LIMITS.name} ตัวอักษร`);
const forumImages = z.array(z.string().trim().min(1)).max(FORUM_LIMITS.images).default([]);

export const forumCategoryInput = z.object({
  slug,
  name: localized,
  description: localizedOptional,
  sortOrder,
  isActive,
});

/** Admin edits (moderation) */
export const forumTopicInput = z.object({
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  title: forumTitle,
  body: forumBody,
  authorName: forumName,
  images: forumImages,
  isPinned: z.boolean().default(false),
  isLocked: z.boolean().default(false),
  isActive,
});

export const forumReplyInput = z.object({
  topicId: z.string().min(1, "กรุณาเลือกกระทู้"),
  body: forumBody,
  authorName: forumName,
  images: forumImages,
  isActive,
});

/** Visitors posting on the website (images arrive as files) */
export const forumNewTopic = z.object({ category: slug, title: forumTitle, body: forumBody, authorName: forumName });
export const forumNewReply = z.object({ body: forumBody, authorName: forumName });

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

export const changePasswordInput = z.object({
  currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
  newPassword: z.string().min(8, "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordInput>;

export const roleLabels: Record<Role, string> = {
  ADMIN: "ผู้ดูแลระบบสูงสุด (ADMIN)",
  MANAGER: "ผู้จัดการระบบ (MANAGER)",
  EDITOR: "ผู้ดูแลเนื้อหา (EDITOR)",
  STAFF: "ทีมงานทั่วไป (STAFF)",
};

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

export const shopPageSetting = z.object({
  eyebrow: localizedOptional,
  headline: localizedOptional,
  lead: localizedOptional,
  ceoEyebrow: localizedOptional,
  ceoQuote: localizedOptional,
  ceoText: localizedOptional,
  ceoImageUrl: z.string().default(""),
  productsEyebrow: localizedOptional,
  productsTitle: localizedOptional,
  productsLead: localizedOptional,
});
export type ShopPageSetting = z.infer<typeof shopPageSetting>;

/* ----------------------------------------------------------------------------
 * Role & Permissions Matrix
 * ------------------------------------------------------------------------- */

export const ADMIN_MODULES = [
  { key: "inquiries", label: "กล่องข้อความ", desc: "ข้อความติดต่อและแบบฟอร์มสั่งซื้อ" },
  { key: "menu-items", label: "เมนูและหน้าเว็บ", desc: "เมนู สไลด์ แบนเนอร์ เนื้อหาหน้าเกี่ยวกับเราและซาลอน" },
  { key: "salon-products", label: "ผลิตภัณฑ์ซาลอน (/products)", desc: "แบรนด์ หมวดหมู่ และสินค้าซาลอน" },
  { key: "counter-products", label: "เคาน์เตอร์แบรนด์ (/shop)", desc: "เนื้อหาหน้าร้าน แบรนด์ และสินค้าเคาน์เตอร์" },
  { key: "media", label: "มีเดีย", desc: "คลังภาพและวิดีโอ หมวดหมู่มีเดีย" },
  { key: "posts", label: "บทความและกิจกรรม", desc: "บทความ ข่าวสาร และกิจกรรม" },
  { key: "forum", label: "ฟอรั่ม", desc: "กระทู้ฟอรั่ม และความคิดเห็น" },
  { key: "members", label: "สมาชิกเว็บไซต์", desc: "รายชื่อสมาชิกและการจัดการบัญชีสมาชิก" },
  { key: "settings", label: "ตั้งค่าเว็บไซต์", desc: "ข้อมูลบริษัท ช่องทางติดต่อ และการตั้งค่าระบบ" },
  { key: "users", label: "ผู้ใช้หลังบ้านและการกำหนดสิทธิ์", desc: "จัดการบัญชีทีมงานและสิทธิ์การเข้าถึง" },
] as const;
export type AdminModuleKey = (typeof ADMIN_MODULES)[number]["key"];

export const permissionActionSchema = z.object({
  view: z.boolean().default(true),
  create: z.boolean().default(false),
  update: z.boolean().default(false),
  delete: z.boolean().default(false),
});
export type PermissionAction = z.infer<typeof permissionActionSchema>;

export const rolePermissionsSchema = z.record(
  z.string(),
  z.record(z.string(), permissionActionSchema),
);
export type RolePermissions = z.infer<typeof rolePermissionsSchema>;

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  ADMIN: Object.fromEntries(
    ADMIN_MODULES.map((m) => [m.key, { view: true, create: true, update: true, delete: true }]),
  ),
  MANAGER: {
    inquiries: { view: true, create: true, update: true, delete: true },
    "menu-items": { view: true, create: true, update: true, delete: true },
    "salon-products": { view: true, create: true, update: true, delete: true },
    "counter-products": { view: true, create: true, update: true, delete: true },
    media: { view: true, create: true, update: true, delete: true },
    posts: { view: true, create: true, update: true, delete: true },
    forum: { view: true, create: true, update: true, delete: true },
    members: { view: true, create: false, update: true, delete: false },
    settings: { view: true, create: false, update: true, delete: false },
    users: { view: false, create: false, update: false, delete: false },
  },
  EDITOR: {
    inquiries: { view: false, create: false, update: false, delete: false },
    "menu-items": { view: true, create: true, update: true, delete: false },
    "salon-products": { view: false, create: false, update: false, delete: false },
    "counter-products": { view: false, create: false, update: false, delete: false },
    media: { view: true, create: true, update: true, delete: true },
    posts: { view: true, create: true, update: true, delete: true },
    forum: { view: true, create: true, update: true, delete: false },
    members: { view: false, create: false, update: false, delete: false },
    settings: { view: false, create: false, update: false, delete: false },
    users: { view: false, create: false, update: false, delete: false },
  },
  STAFF: {
    inquiries: { view: true, create: true, update: true, delete: false },
    "menu-items": { view: false, create: false, update: false, delete: false },
    "salon-products": { view: true, create: false, update: false, delete: false },
    "counter-products": { view: true, create: false, update: false, delete: false },
    media: { view: false, create: false, update: false, delete: false },
    posts: { view: false, create: false, update: false, delete: false },
    forum: { view: true, create: false, update: false, delete: false },
    members: { view: false, create: false, update: false, delete: false },
    settings: { view: false, create: false, update: false, delete: false },
    users: { view: false, create: false, update: false, delete: false },
  },
};

export function hasPermission(
  permissions: RolePermissions | undefined,
  role: Role,
  module: AdminModuleKey,
  action: "view" | "create" | "update" | "delete",
): boolean {
  if (role === "ADMIN") return true;
  const current = permissions?.[role]?.[module] ?? DEFAULT_ROLE_PERMISSIONS[role]?.[module];
  return Boolean(current?.[action]);
}

export const SETTING_KEYS = [
  "company",
  "about",
  "aboutSlides",
  "vipCustomer",
  "shopPage",
  "growVision",
  "timeline",
  "regionCounts",
  "rolePermissions",
] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

export const settingSchemas = {
  company: companySetting,
  about: aboutSetting,
  aboutSlides: aboutSlidesSetting,
  vipCustomer: vipCustomerSetting,
  shopPage: shopPageSetting,
  growVision: growVisionSetting,
  timeline: z.array(z.object({ year: z.string(), text: localized })),
  /** Optional override for the salon directory counts until all salons are imported */
  regionCounts: z.record(z.enum(REGIONS), z.coerce.number().int().nonnegative()),
  rolePermissions: rolePermissionsSchema,
} satisfies Record<SettingKey, z.ZodType>;

/* ----------------------------------------------------------------------------
 * Resource registry (drives generic admin CRUD in API and admin UI)
 * ------------------------------------------------------------------------- */

export const resources = {
  "menu-items": { schema: menuItemInput, label: "เมนูและหน้าเว็บ" },
  "hero-slides": { schema: heroSlideInput, label: "สไลด์หน้าแรก" },
  brands: { schema: brandInput, label: "แบรนด์" },
  "main-categories": { schema: mainCategoryInput, label: "หมวดหมู่หลัก" },
  categories: { schema: categoryInput, label: "คอลเลกชัน" },
  products: { schema: productInput, label: "สินค้า" },
  videos: { schema: videoInput, label: "วิดีโอหน้าแรก" },
  ambassadors: { schema: ambassadorInput, label: "แบรนด์แอมบาสเดอร์" },
  salons: { schema: salonInput, label: "ซาลอนพันธมิตร" },
  courses: { schema: courseInput, label: "คอร์สเรียน" },
  posts: { schema: postInput, label: "บทความ / กิจกรรม" },
  media: { schema: mediaInput, label: "มีเดีย" },
  "media-categories": { schema: mediaCategoryInput, label: "หมวดหมู่มีเดีย" },
  "forum-categories": { schema: forumCategoryInput, label: "หมวดหมู่ฟอรั่ม" },
  "forum-topics": { schema: forumTopicInput, label: "กระทู้" },
  "forum-replies": { schema: forumReplyInput, label: "ความคิดเห็น" },
  pages: { schema: pageInput, label: "หน้าข้อความ" },
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
