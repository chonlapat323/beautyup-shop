import type { Metadata } from "next";
import { api } from "@/lib/api";
import { saveSetting } from "../settings/actions";
import { ProductsPageLiveEditor, type ProductsPageConfig } from "./products-page-editor";

export const metadata: Metadata = {
  title: "จัดการหน้าสินค้าซาลอน (/th/products) - Realtime Editor",
};

export default async function ProductsPageAdmin() {
  const all = await api<Record<string, unknown>>("/admin/settings");
  const productsPage = (all["productsPage"] as Record<string, unknown>) || {};
  const salonHairSlides = (all["salonHairSlides"] as Record<string, unknown>) || {};

  // Merge values so existing settings or slides are preserved
  const initial: Partial<ProductsPageConfig> = {
    showHero: (productsPage.showHero as boolean) ?? true,
    heroEyebrow: (productsPage.heroEyebrow as any) || (salonHairSlides.heroEyebrow as any),
    heroHeadline: (productsPage.heroHeadline as any) || (salonHairSlides.heroHeadline as any),
    heroLead: (productsPage.heroLead as any) || (salonHairSlides.heroLead as any),

    showBannerSlides: (productsPage.showBannerSlides as boolean) ?? true,
    slides: (productsPage.slides as any) || (salonHairSlides.slides as any),

    showOvalCarousel: (productsPage.showOvalCarousel as boolean) ?? true,
    ovalTitle: (productsPage.ovalTitle as any) || (salonHairSlides.title as any),
    ovalDescription: (productsPage.ovalDescription as any) || (salonHairSlides.description as any),
    ovalItems: (productsPage.ovalItems as any) || (salonHairSlides.items as any),

    sections: (productsPage.sections as any) || [],
  };

  const webUrl = process.env.WEB_URL || "https://new.beautyup-enterprise.com";

  async function handleSave(config: ProductsPageConfig) {
    "use server";
    try {
      // Save to both keys so any legacy consumer also stays in sync
      await saveSetting("productsPage", config as any);
      await saveSetting("salonHairSlides", {
        heroEyebrow: config.heroEyebrow,
        heroHeadline: config.heroHeadline,
        heroLead: config.heroLead,
        slides: config.slides,
        title: config.ovalTitle,
        description: config.ovalDescription,
        items: config.ovalItems,
      } as any);
      return { ok: true, message: "บันทึกและอัปเดตหน้าเว็บจริงเรียบร้อยแล้ว!" };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "บันทึกไม่สำเร็จ" };
    }
  }

  return (
    <div className="space-y-6">
      <ProductsPageLiveEditor initial={initial} onSave={handleSave} webUrl={webUrl} />
    </div>
  );
}
