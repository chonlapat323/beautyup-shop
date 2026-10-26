import { getProducts } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/** Machine-readable list of all active products (both languages) for AI assistants and search crawlers. */
export async function GET() {
  const [th, en] = await Promise.all([getProducts("th"), getProducts("en")]);
  const english = new Map(en.map((p) => [p.slug, p]));

  const items = th.map((p) => {
    const e = english.get(p.slug);
    return {
      url: { th: `${SITE_URL}/th/product/${p.slug}`, en: `${SITE_URL}/en/product/${p.slug}` },
      name: { th: p.name, en: e?.name ?? p.name },
      description: { th: p.description ?? "", en: e?.description ?? p.description ?? "" },
      brand: p.brandName ?? null,
      brandType: p.brandType ?? null,
      collection: p.collection
        ? {
            slug: p.collection.slug,
            name: { th: p.collection.name, en: e?.collection?.name ?? p.collection.name },
          }
        : null,
      price: p.price,
      salePrice: p.salePrice ?? null,
      currency: "THB",
      badges: p.badges ?? [],
      tags: p.tags ?? [],
      image: p.imageUrl ? absoluteUrl(p.imageUrl) : null,
    };
  });

  return Response.json({
    name: "BeautyUp Enterprise — Products",
    description:
      "Official product catalog from BeautyUp Enterprise: professional salon hair care products (Fanola, Nook, Sweet Professional) and luxury counter brands in Thailand.",
    url: `${SITE_URL}/products.json`,
    count: items.length,
    items,
  });
}
