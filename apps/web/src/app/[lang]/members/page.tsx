import type { Metadata } from "next";
import { PostCard, postTypePath } from "@/components/post-card";
import { resolveLang } from "@/i18n";
import { ArrowLink, PageHero, SectionHeading } from "@/components/ui";
import { getPosts } from "@/lib/data";
import type { PostType } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/[lang]/members">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.members.title };
}

const order: PostType[] = ["ACTIVITY", "MEDIA", "ARTICLE"];

export default async function MembersPage({ params }: PageProps<"/[lang]/members">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.members;
  const posts = await getPosts(lang);

  return (
    <>
      <PageHero
        eyebrow="Members"
        title={d.title}
        description={d.lead}
      />
      {order.map((type) => {
        const items = posts.filter((p) => p.type === type).slice(0, 3);
        if (!items.length) return null;
        return (
          <section key={type} className="section border-b border-line last:border-b-0">
            <div className="container-page">
              <SectionHeading
                title={d.types[type]}
                action={<ArrowLink href={`/members/${postTypePath[type]}`}>{dict.common.viewAll}</ArrowLink>}
              />
              <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <li key={p.slug}>
                    <PostCard post={p} lang={lang} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
