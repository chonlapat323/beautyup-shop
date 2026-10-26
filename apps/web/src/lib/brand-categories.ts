/** A brand's product collection (e.g. Fanola No Yellow Care), edited in Admin → คอลเลกชัน */
export interface BrandCategory {
  slug: string;
  brandSlug: string;
  name: string;
  subtitle?: string;
  description?: string;
  highlights?: string;
  imageUrl: string;
  bannerUrl?: string;
  accentColor: string;
  subCategories?: string[];
  /** The main category this collection belongs to, if any */
  mainCategorySlug?: string;
}

/** A brand's main product group (Admin → หมวดหมู่หลัก); holds several collections */
export interface BrandMainCategory {
  slug: string;
  name: string;
  description?: string;
  imageUrl: string;
}
