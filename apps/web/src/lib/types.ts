// Website view models: API rows with localized fields already resolved to one language (see lib/data.ts).

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface Socials {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  line?: string;
}

export type BrandType = "SALON" | "COUNTER";

export interface Brand {
  slug: string;
  type: BrandType;
  name: string;
  nameTh?: string;
  country?: string;
  tagline?: string;
  description?: string;
  highlights?: string[];
  logoUrl?: string;
  website?: string;
  catalogUrl?: string;
  socials?: Socials;
}

export interface Product {
  slug: string;
  name: string;
  brandSlug: string;
  price: number;
  salePrice?: number;
  badges?: string[];
  imageUrl?: string;
  description?: string;
}

export interface HeroSlide {
  brandSlug: string;
  brand: string;
  product: string;
  caption: string;
  href: string;
  /** Transparent product cut-out (PNG/WebP). Falls back to an illustrated bottle. */
  imageUrl?: string;
  /** Bottle colour for the illustrated fallback */
  tint: string;
}

export interface Ambassador {
  name: string;
  title: string;
  photoUrl?: string;
  socials?: Socials;
}

export type Region =
  | "BANGKOK_CENTRAL"
  | "EAST"
  | "WEST"
  | "NORTH"
  | "SOUTH"
  | "NORTHEAST";

export interface Salon {
  name: string;
  region: Region;
  province: string;
  address?: string;
  phone?: string;
  mapUrl?: string;
}

export interface PageContent {
  slug: string;
  title: string;
  /** Paragraphs; lines starting with "## " are headings */
  body: string[];
}

export interface Course {
  slug: string;
  title: string;
  priceText: string;
  duration: string;
  summary: string;
  content: string[];
  coverUrl?: string;
}

export type PostType = "ARTICLE" | "ACTIVITY" | "MEDIA";

export interface Post {
  slug: string;
  type: PostType;
  title: string;
  excerpt: string;
  body: string[];
  coverUrl?: string;
  videoUrl?: string;
  publishedAt: string;
}

export interface TeamMember {
  name: string;
  position: string;
  department: "SALES" | "TECHNICIAN" | "FINANCE" | "LEGAL";
  phone?: string;
  lineId?: string;
  photoUrl?: string;
}

export interface Video {
  title: string;
  url: string;
}

export interface CompanyInfo {
  name: string;
  nameEn: string;
  address: string;
  phones: string[];
  email: string;
  taxId: string;
  mapUrl: string;
  facebookGroup: string;
  departments: { name: string; phone: string }[];
  bankAccounts: { bank: string; accountName: string; accountNo: string }[];
}

export type InquiryType =
  | "CONTACT"
  | "ORDER"
  | "SALON"
  | "COURSE"
  | "ISSUE"
  | "PP_STUDIO";
