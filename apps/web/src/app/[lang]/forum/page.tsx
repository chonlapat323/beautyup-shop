import { Lock, MessageCircle, Pin, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "@/components/link";
import { PageHero, formatDate } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getForumCategories, getForumTopics } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/forum">): Promise<Metadata> {
  const { dict } = await resolveLang(params);
  return { title: dict.forum.title, description: dict.forum.lead };
}

export default async function ForumPage({ params, searchParams }: PageProps<"/[lang]/forum">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.forum;
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const [categories, topics] = await Promise.all([getForumCategories(lang), getForumTopics(lang, { category, page })]);
  const pageHref = (p: number) => `/forum?${new URLSearchParams({ ...(category && { category }), ...(p > 1 && { page: String(p) }) })}`;

  return (
    <>
      <PageHero eyebrow="Forum" title={d.title} description={d.lead}>
        <Link href={category ? `/forum/new?category=${category}` : "/forum/new"} className="btn btn-primary">
          <Plus className="size-4" /> {d.newTopic}
        </Link>
      </PageHero>

      <section className="container-page max-w-4xl py-10 md:py-14">
        <nav aria-label={d.categories} className="flex flex-wrap gap-2">
          <Link href="/forum" aria-current={!category ? "page" : undefined} className="btn-tab">
            {d.all}
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/forum?category=${c.slug}`} aria-current={c.slug === category ? "page" : undefined} className="btn-tab">
              {c.name} <span className="text-muted">({c.topicCount})</span>
            </Link>
          ))}
        </nav>

        {topics.items.length ? (
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {topics.items.map((t) => (
              <li key={t.id}>
                <Link href={`/forum/${t.id}`} className="group flex gap-4 py-5 transition-colors hover:bg-mist/60 sm:px-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                      {t.isPinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2 py-0.5 font-medium text-brand-pink">
                          <Pin className="size-3" /> {d.pinned}
                        </span>
                      )}
                      {t.isLocked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2 py-0.5">
                          <Lock className="size-3" /> {d.locked}
                        </span>
                      )}
                      <span className="text-accent">{t.category.name}</span>
                    </p>
                    <h2 className="mt-1.5 font-display text-lg leading-snug text-balance transition-colors group-hover:text-accent sm:text-xl">{t.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{t.excerpt}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span>
                        {d.by} {t.authorName} · {formatDate(t.createdAt, lang)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="size-3.5" /> {d.replies(t.replyCount)}
                      </span>
                    </p>
                  </div>
                  {t.image && (
                    // eslint-disable-next-line @next/next/no-img-element -- visitor upload served by the API
                    <img src={t.image} alt="" loading="lazy" className="size-20 shrink-0 rounded-xl object-cover sm:size-24" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-3xl border border-dashed border-line p-12 text-center text-muted">{d.noTopics}</p>
        )}

        {topics.pages > 1 && (
          <nav aria-label={d.pageOf(topics.page, topics.pages)} className="mt-8 flex items-center justify-between gap-4 text-sm">
            {topics.page > 1 ? (
              <Link href={pageHref(topics.page - 1)} className="btn btn-outline">
                ← {d.prev}
              </Link>
            ) : (
              <span />
            )}
            <span className="text-muted">{d.pageOf(topics.page, topics.pages)}</span>
            {topics.page < topics.pages ? (
              <Link href={pageHref(topics.page + 1)} className="btn btn-outline">
                {d.next} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </>
  );
}
