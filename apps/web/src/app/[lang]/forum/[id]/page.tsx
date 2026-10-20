import { Lock, Pin } from "lucide-react";
import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { ForumForm } from "@/components/forum-form";
import { formatDate } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getForumTopic } from "@/lib/data";
import { getMember } from "@/lib/member";
import { SITE_URL } from "@/lib/site";
import type { ForumTopic } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/[lang]/forum/[id]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const topic = await getForumTopic(lang, (await params).id);
  if (!topic) return { title: dict.forum.notFound };
  return {
    title: topic.title,
    description: topic.body.slice(0, 160),
    openGraph: { title: topic.title, description: topic.body.slice(0, 160), images: topic.images.slice(0, 1) },
  };
}

/** schema.org thread data, so search engines and AI can read the question and its answers. */
function jsonLd(t: ForumTopic, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: t.title,
    text: t.body,
    url: `${SITE_URL}/${lang}/forum/${t.id}`,
    datePublished: t.createdAt,
    author: { "@type": "Person", name: t.authorName },
    image: t.images.length ? t.images : undefined,
    articleSection: t.category.name,
    interactionStatistic: { "@type": "InteractionCounter", interactionType: "https://schema.org/CommentAction", userInteractionCount: t.replies.length },
    comment: t.replies.map((r) => ({
      "@type": "Comment",
      text: r.body,
      datePublished: r.createdAt,
      author: { "@type": "Person", name: r.authorName },
    })),
  };
}

function Photos({ images, alt }: { images: string[]; alt: string }) {
  if (!images.length) return null;
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {images.map((src, i) => (
        <li key={src}>
          <a href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- visitor upload served by the API */}
            <img src={src} alt={`${alt} ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function TopicPage({ params }: PageProps<"/[lang]/forum/[id]">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.forum;
  const [topic, member] = await Promise.all([getForumTopic(lang, (await params).id), getMember()]);
  if (!topic) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(topic, lang)).replace(/</g, "\\u003c") }} />
      <article className="container-page max-w-3xl py-8 md:py-14">
        <nav aria-label={dict.common.breadcrumb} className="text-sm text-muted">
          <Link href="/forum" className="hover:text-ink">{d.title}</Link>
          <span className="mx-2">/</span>
          <Link href={`/forum?category=${topic.category.slug}`} className="hover:text-ink">{topic.category.name}</Link>
        </nav>

        <p className="mt-6 flex flex-wrap gap-2 text-xs">
          {topic.isPinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blush px-2 py-0.5 font-medium text-brand-pink">
              <Pin className="size-3" /> {d.pinned}
            </span>
          )}
          {topic.isLocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2 py-0.5 text-muted">
              <Lock className="size-3" /> {d.locked}
            </span>
          )}
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-balance sm:text-4xl">{topic.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {d.by} {topic.authorName} · {formatDate(topic.createdAt, lang)}
        </p>
        <p className="mt-6 text-lg leading-relaxed whitespace-pre-line">{topic.body}</p>
        <Photos images={topic.images} alt={topic.title} />

        <section aria-labelledby="replies" className="mt-12 border-t border-line pt-8">
          <h2 id="replies" className="font-display text-2xl">
            {d.repliesTitle} <span className="text-muted">({topic.replies.length})</span>
          </h2>
          <ol className="mt-6 space-y-4">
            {topic.replies.map((r) => (
              <li key={r.id} id={`reply-${r.id}`} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-sm text-muted">
                  <span className="font-medium text-ink">{r.authorName}</span> · {formatDate(r.createdAt, lang)}
                </p>
                <p className="mt-2 leading-relaxed whitespace-pre-line">{r.body}</p>
                <Photos images={r.images} alt={topic.title} />
              </li>
            ))}
          </ol>

          <div className="mt-8">
            {topic.isLocked ? (
              <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">
                <Lock className="mr-1 inline size-4" /> {d.lockedNotice}
              </p>
            ) : (
              <>
                <h3 className="mb-4 font-display text-xl">{d.replyTitle}</h3>
                <ForumForm mode="reply" topicId={topic.id} defaultName={member?.name} />
              </>
            )}
          </div>
        </section>
      </article>
    </>
  );
}
