import clsx from "clsx";
import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { PostCard, postTypePath } from "@/components/post-card";
import { resolveLang } from "@/i18n";
import { PageHero } from "@/components/ui";
import { getMediaCategories, getPosts } from "@/lib/data";
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

export default async function PostListPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; type: string }>;
  searchParams?: Promise<{ cat?: string; category?: string }>;
}) {
  const { lang, dict } = await resolveLang(params);
  const segment = (await params).type;
  const type = typeBySegment[segment];
  if (!type) notFound();

  const sp = searchParams ? await searchParams : {};
  const selectedCat = sp.cat || sp.category;

  const [posts, mediaCategories] = await Promise.all([
    getPosts(lang, type, selectedCat),
    type === "MEDIA" ? getMediaCategories(lang) : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHero eyebrow="Members" title={dict.members.types[type]}>
        <nav aria-label={dict.members.nav} className="flex flex-wrap gap-2">
          {Object.entries(postTypePath).map(([t, path]) => (
            <Link
              key={path}
              href={`/members/${path}`}
              aria-current={path === segment ? "page" : undefined}
              className="btn-tab"
            >
              {dict.members.types[t as PostType]}
            </Link>
          ))}
        </nav>

        {type === "MEDIA" && mediaCategories.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line/60 pt-4">
            <span className="mr-1 text-xs font-medium text-muted">
              {lang === "th" ? "หมวดหมู่:" : "Category:"}
            </span>
            <Link
              href="/members/media"
              className={clsx(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                !selectedCat
                  ? "bg-ink text-white shadow-2xs"
                  : "border border-line bg-white/80 text-muted hover:bg-white hover:text-ink",
              )}
            >
              {lang === "th" ? "ทั้งหมด" : "All"}
            </Link>
            {mediaCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/members/media?cat=${encodeURIComponent(c.slug)}`}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                  selectedCat === c.slug
                    ? "bg-brand text-white shadow-2xs"
                    : "border border-line bg-white/80 text-muted hover:border-brand/40 hover:bg-white hover:text-ink",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
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
