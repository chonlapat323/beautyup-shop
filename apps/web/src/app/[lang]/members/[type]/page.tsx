import clsx from "clsx";
import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { PostCard, postTypePath } from "@/components/post-card";
import { resolveLang } from "@/i18n";
import { PageHero } from "@/components/ui";
import { getPosts } from "@/lib/data";
import type { PostType } from "@/lib/types";

const typeBySegment = Object.fromEntries(
  Object.entries(postTypePath).map(([type, path]) => [path, type as PostType]),
) as Record<string, PostType>;

export function generateStaticParams() {
  return Object.values(postTypePath).map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/members/[type]">): Promise<Metadata> {
  const { dict } = await resolveLang(params);
  const type = typeBySegment[(await params).type];
  return { title: type ? dict.members.types[type] : dict.notFound.title };
}

export default async function PostListPage({ params }: PageProps<"/[lang]/members/[type]">) {
  const { lang, dict } = await resolveLang(params);
  const segment = (await params).type;
  const type = typeBySegment[segment];
  if (!type) notFound();
  const posts = await getPosts(lang, type);

  return (
    <>
      <PageHero eyebrow="Members" title={dict.members.types[type]}>
        <nav aria-label={dict.members.nav} className="flex flex-wrap gap-2">
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
              {dict.members.types[t as PostType]}
            </Link>
          ))}
        </nav>
      </PageHero>
      <section className="container-page py-12 md:py-20">
        {posts.length ? (
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <PostCard post={p} lang={lang} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-line p-12 text-center text-muted">{dict.common.noContent}</p>
        )}
      </section>
    </>
  );
}
