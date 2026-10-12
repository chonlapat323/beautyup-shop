import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postTypeLabel, postTypePath } from "@/components/post-card";
import { Media, formatDate } from "@/components/ui";
import { getPost, getPosts } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ type: postTypePath[p.type], slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/members/[type]/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return { title: post?.title ?? "ไม่พบเนื้อหา", description: post?.excerpt };
}

export default async function PostPage({ params }: PageProps<"/members/[type]/[slug]">) {
  const { type, slug } = await params;
  const post = await getPost(slug);
  if (!post || postTypePath[post.type] !== type) notFound();

  return (
    <article className="container-page max-w-3xl py-8 md:py-14">
      <nav aria-label="breadcrumb" className="text-sm text-muted">
        <Link href="/members" className="hover:text-ink">มุมสมาชิก</Link>
        <span className="mx-2">/</span>
        <Link href={`/members/${type}`} className="hover:text-ink">{postTypeLabel[post.type]}</Link>
      </nav>
      <h1 className="mt-6 font-display text-3xl leading-tight text-balance sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-sm text-muted">{formatDate(post.publishedAt)}</p>
      <Media src={post.coverUrl} tone={2} className="mt-8 aspect-[16/9] w-full rounded-3xl" />
      <div className="mt-10 space-y-5 text-lg leading-relaxed">
        <p className="text-muted">{post.excerpt}</p>
        {post.body.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
    </article>
  );
}
