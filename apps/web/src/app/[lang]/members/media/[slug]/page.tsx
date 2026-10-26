import type { Metadata } from "next";
import QRCode from "qrcode";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/media-gallery";
import { RichText, renderInlineRichText } from "@/components/rich-text";
import { SharePanel } from "@/components/share-panel";
import { Media, VideoPlayer, formatDate } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getMedia, getMediaList } from "@/lib/data";
import { SITE_URL, absoluteUrl, youtubeThumbnail } from "@/lib/site";
import type { MediaItem } from "@/lib/types";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  return (await getMediaList(params.lang as Locale)).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/members/media/[slug]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const media = await getMedia(lang, (await params).slug);
  if (!media) return { title: dict.members.notFound };
  // LINE and Facebook build the link preview card from these tags
  return {
    title: media.title,
    description: media.excerpt,
    keywords: media.tags,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/${lang}/members/media/${media.slug}`,
      title: media.title,
      description: media.excerpt,
      images: media.images.slice(0, 1).map(absoluteUrl),
    },
  };
}

/** schema.org data so Google and AI assistants know what this media shows and which brands it is about. */
function jsonLd(m: MediaItem, lang: Locale) {
  const url = `${SITE_URL}/${lang}/members/media/${m.slug}`;
  const images = m.images.map(absoluteUrl);
  const shared = {
    "@context": "https://schema.org",
    name: m.title,
    description: m.excerpt || undefined,
    url,
    inLanguage: lang === "th" ? "th-TH" : "en-US",
    datePublished: m.publishedAt || undefined,
    keywords: m.tags.length ? m.tags.join(", ") : undefined,
    genre: m.category?.name,
    about: m.brands.length ? m.brands.map((b) => ({ "@type": "Brand", name: b.name })) : undefined,
    publisher: { "@type": "Organization", name: "BeautyUp Enterprise", url: SITE_URL },
  };
  if (m.videoUrl) {
    const thumbnail = images.length ? images : [youtubeThumbnail(m.videoUrl)].filter(Boolean);
    return { ...shared, "@type": "VideoObject", embedUrl: m.videoUrl, uploadDate: m.publishedAt || undefined, thumbnailUrl: thumbnail };
  }
  return {
    ...shared,
    "@type": "ImageGallery",
    image: images,
    associatedMedia: images.map((contentUrl) => ({ "@type": "ImageObject", contentUrl, name: m.title })),
  };
}

export default async function MediaPage({ params }: PageProps<"/[lang]/members/media/[slug]">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.members;
  const media = await getMedia(lang, (await params).slug);
  if (!media) notFound();
  const cover = media.images[0];
  const pageUrl = `${SITE_URL}/${lang}/members/media/${media.slug}`;
  const qr = await QRCode.toDataURL(pageUrl, { width: 480, margin: 1 });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(media, lang)).replace(/</g, "\\u003c") }} />
      <article className="container-page max-w-4xl py-8 md:py-14">
        <nav aria-label={dict.common.breadcrumb} className="text-sm text-muted">
          <Link href="/members" className="hover:text-ink">{d.title}</Link>
          <span className="mx-2">/</span>
          <Link href="/members/media" className="hover:text-ink">{d.types.MEDIA}</Link>
        </nav>
        <h1 className="mt-6 font-display text-3xl leading-tight text-balance sm:text-5xl">{media.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {media.category && <span className="text-accent">{media.category.name} · </span>}
          {formatDate(media.publishedAt, lang)}
        </p>

        {media.videoUrl && (
          <div className="mt-8 overflow-hidden rounded-3xl">
            <VideoPlayer src={media.videoUrl} poster={cover} title={media.title} rounded="rounded-none" />
          </div>
        )}
        {media.images.length > 0 ? (
          // With a video, the photos are all thumbnails; without one, the first is the large cover
          <MediaGallery images={media.images} title={media.title} slug={media.slug} cover={!media.videoUrl} />
        ) : (
          !media.videoUrl && <Media alt={media.title} tone={2} className="mt-8 aspect-[16/9] w-full rounded-3xl" />
        )}

        <div className="mt-10 space-y-5 text-lg leading-relaxed">
          {media.excerpt && <p className="text-muted">{renderInlineRichText(media.excerpt)}</p>}
          <RichText text={media.body} className="space-y-5" />
        </div>

        {(media.brands.length > 0 || media.tags.length > 0) && (
          <footer className="mt-12 space-y-4 border-t border-line pt-8">
            {media.brands.length > 0 && (
              <div>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">{d.brands}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {media.brands.map((b) => (
                    <li key={b.slug}>
                      <Link href={b.type === "SALON" ? `/products/${b.slug}` : "/shop"} className="btn-pill">
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {media.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium tracking-wide text-muted uppercase">{d.tags}</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                  {media.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-sand px-3 py-1">#{tag}</li>
                  ))}
                </ul>
              </div>
            )}
          </footer>
        )}

        <SharePanel url={pageUrl} qr={qr} fileName={`${media.slug}-qr.png`} />
      </article>
    </>
  );
}
