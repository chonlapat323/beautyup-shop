import { getMediaList } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/** Machine-readable list of all published media (both languages) for AI assistants and crawlers. */
export async function GET() {
  const [th, en] = await Promise.all([getMediaList("th"), getMediaList("en")]);
  const english = new Map(en.map((m) => [m.slug, m]));

  const items = th.map((m) => {
    const e = english.get(m.slug);
    return {
      url: { th: `${SITE_URL}/th/members/media/${m.slug}`, en: `${SITE_URL}/en/members/media/${m.slug}` },
      title: { th: m.title, en: e?.title ?? m.title },
      description: { th: m.excerpt, en: e?.excerpt ?? m.excerpt },
      category: m.category ? { th: m.category.name, en: e?.category?.name ?? m.category.name } : null,
      brands: m.brands.map((b) => b.name),
      tags: m.tags,
      images: m.images.map(absoluteUrl),
      video: m.videoUrl ?? null,
      publishedAt: m.publishedAt,
    };
  });

  return Response.json({
    name: "BeautyUp Enterprise — Media",
    description: "Photos and videos from BeautyUp Enterprise: salon products (Fanola, Nook, Sweet Professional), counter brands, events and campaigns.",
    url: `${SITE_URL}/media.json`,
    updated: items[0]?.publishedAt ?? null,
    items,
  });
}
