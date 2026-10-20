import type { Metadata } from "next";
import Link from "@/components/link";
import { ForumForm } from "@/components/forum-form";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getForumCategories } from "@/lib/data";
import { getMember } from "@/lib/member";

export async function generateMetadata({ params }: PageProps<"/[lang]/forum/new">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.forum.newTopic, robots: { index: false } };
}

export default async function NewTopicPage({ params, searchParams }: PageProps<"/[lang]/forum/new">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.forum;
  const sp = await searchParams;
  const [categories, member] = await Promise.all([getForumCategories(lang), getMember()]);
  const preset = typeof sp.category === "string" && categories.some((c) => c.slug === sp.category) ? sp.category : undefined;

  return (
    <>
      <PageHero eyebrow="Forum" title={d.newTopic}>
        <Link href="/forum" className="text-sm text-muted hover:text-ink">
          ← {d.backToForum}
        </Link>
      </PageHero>
      <section className="container-page max-w-3xl py-10 md:py-14">
        <ForumForm mode="topic" categories={categories} defaultCategory={preset} defaultName={member?.name} />
      </section>
    </>
  );
}
