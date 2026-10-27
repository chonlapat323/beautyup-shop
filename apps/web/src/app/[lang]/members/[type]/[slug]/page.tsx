import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/media-gallery";
import { postTypePath } from "@/components/post-card";
import { RichText, renderInlineRichText } from "@/components/rich-text";
import { VideoPlayer } from "@/components/video-player";
import { resolveLang, type Locale } from "@/i18n";
import { Media, formatDate } from "@/components/ui";
import { getPost, getPosts } from "@/lib/data";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  // Media has its own route (members/media/[slug])
  const posts = (await getPosts(params.lang as Locale)).filter((p) => p.type !== "MEDIA");
  return posts.map((p) => ({ type: postTypePath[p.type], slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/members/[type]/[slug]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const post = await getPost(lang, (await params).slug);
  return { title: post?.title ?? dict.members.notFound, description: post?.excerpt };
}

export default async function PostPage({ params }: PageProps<"/[lang]/members/[type]/[slug]">) {
  const { lang, dict } = await resolveLang(params);
  const { type, slug } = await params;
  const post = await getPost(lang, slug);
  if (!post || postTypePath[post.type] !== type) notFound();
  const images = post.images?.length ? post.images : post.coverUrl ? [post.coverUrl] : [];
  const cover = images[0];

  return (
    <article className="container-page max-w-3xl py-8 md:py-14">
      <nav aria-label={dict.common.breadcrumb} className="text-sm text-muted">
        <Link href="/members" className="hover:text-ink">{dict.members.title}</Link>
        <span className="mx-2">/</span>
        <Link href={`/members/${type}`} className="hover:text-ink">{dict.members.types[post.type]}</Link>
      </nav>
      <h1 className="mt-6 font-display text-3xl leading-tight text-balance sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-muted">{formatDate(post.publishedAt, lang)}</p>

      {post.videoUrl && (
        <div className="mt-8 overflow-hidden rounded-3xl">
          <VideoPlayer src={post.videoUrl} poster={cover} title={post.title} rounded="rounded-none" />
        </div>
      )}
      {images.length > 0 ? (
        <MediaGallery images={images} title={post.title} slug={post.slug} cover={!post.videoUrl} />
      ) : (
        !post.videoUrl && <Media src={post.coverUrl} tone={2} className="mt-8 aspect-[16/9] w-full rounded-3xl" />
      )}

      <div className="mt-10 space-y-5 text-lg leading-relaxed">
        {post.excerpt && <p className="text-muted">{renderInlineRichText(post.excerpt)}</p>}
        <RichText text={post.body} className="space-y-5" />
      </div>
    </article>
  );
}
