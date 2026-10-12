import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard, postTypeLabel, postTypePath } from "@/components/post-card";
import { PageHero } from "@/components/ui";
import { getPosts } from "@/lib/data";
import type { PostType } from "@/lib/types";

const typeBySegment = Object.fromEntries(
  Object.entries(postTypePath).map(([type, path]) => [path, type as PostType]),
) as Record<string, PostType>;

export function generateStaticParams() {
  return Object.values(postTypePath).map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/members/[type]">): Promise<Metadata> {
  const type = typeBySegment[(await params).type];
  return { title: type ? postTypeLabel[type] : "ไม่พบหน้า" };
}

export default async function PostListPage({ params }: PageProps<"/members/[type]">) {
  const segment = (await params).type;
  const type = typeBySegment[segment];
  if (!type) notFound();
  const posts = await getPosts(type);

  return (
    <>
      <PageHero eyebrow="Members" title={postTypeLabel[type]}>
        <nav aria-label="หมวดมุมสมาชิก" className="flex flex-wrap gap-2">
          {Object.entries(postTypePath).map(([t, path]) => (
            <Link
              key={path}
              href={`/members/${path}`}
              aria-current={path === segment ? "page" : undefined}
              className={clsx(
                "inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors",
                path === segment ? "border-ink bg-ink text-cream" : "border-line bg-white hover:border-ink",
              )}
            >
              {postTypeLabel[t as PostType]}
            </Link>
          ))}
        </nav>
      </PageHero>
      <section className="container-page py-12 md:py-20">
        {posts.length ? (
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <PostCard post={p} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-line p-12 text-center text-muted">ยังไม่มีเนื้อหา</p>
        )}
      </section>
    </>
  );
}
