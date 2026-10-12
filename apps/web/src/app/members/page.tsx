import type { Metadata } from "next";
import { PostCard, postTypeLabel, postTypePath } from "@/components/post-card";
import { ArrowLink, PageHero, SectionHeading } from "@/components/ui";
import { getPosts } from "@/lib/data";
import type { PostType } from "@/lib/types";

export const metadata: Metadata = { title: "มุมสมาชิก" };

const order: PostType[] = ["ACTIVITY", "MEDIA", "ARTICLE"];

export default async function MembersPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="Members"
        title="มุมสมาชิก"
        description="อัปเดตกิจกรรม มีเดีย และบทความความรู้สำหรับช่างผมและร้านซาลอน"
      />
      {order.map((type) => {
        const items = posts.filter((p) => p.type === type).slice(0, 3);
        if (!items.length) return null;
        return (
          <section key={type} className="section border-b border-line last:border-b-0">
            <div className="container-page">
              <SectionHeading
                title={postTypeLabel[type]}
                action={<ArrowLink href={`/members/${postTypePath[type]}`}>ดูทั้งหมด</ArrowLink>}
              />
              <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <li key={p.slug}>
                    <PostCard post={p} index={i} />
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
