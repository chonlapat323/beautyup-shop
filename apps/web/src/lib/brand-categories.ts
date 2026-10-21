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
}
