import Link from "@/components/link";
import type { Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import type { Post } from "@/lib/types";
import { Media, formatDate, stagger } from "./ui";

export const postTypePath = { ARTICLE: "articles", ACTIVITY: "activities", MEDIA: "media" } as const;

export function PostCard({ post, lang, index = 0 }: { post: Post; lang: Locale; index?: number }) {
  const categoryLabel =
    post.type === "MEDIA" && post.category?.name
      ? post.category.name
      : getDictionary(lang).members.types[post.type];

  return (
    <Link href={`/members/${postTypePath[post.type]}/${post.slug}`} className="group block" data-reveal suppressHydrationWarning style={stagger(index % 3)}>
      <div className="card-lift overflow-hidden rounded-2xl border border-transparent">
        <Media
          src={post.coverUrl}
          tone={index}
          className="card-img aspect-[4/3] w-full"
        />
      </div>
      <p className="mt-4 text-xs text-muted">
        <span className="text-accent">{categoryLabel}</span> · {formatDate(post.publishedAt, lang)}
      </p>
      <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-accent">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
    </Link>
  );
}
