import Link from "next/link";
import type { Post } from "@/lib/types";
import { Media, formatDate } from "./ui";

export const postTypePath = { ARTICLE: "articles", ACTIVITY: "activities", MEDIA: "media" } as const;
export const postTypeLabel = { ARTICLE: "บทความ", ACTIVITY: "กิจกรรม", MEDIA: "มีเดีย" } as const;

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <Link href={`/members/${postTypePath[post.type]}/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl">
        <Media
          src={post.coverUrl}
          tone={index}
          className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <p className="mt-4 text-xs text-muted">
        <span className="text-accent">{postTypeLabel[post.type]}</span> · {formatDate(post.publishedAt)}
      </p>
      <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-accent">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
    </Link>
  );
}
