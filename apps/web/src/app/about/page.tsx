import type { Metadata } from "next";
import Link from "next/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { Media, PageHero, SocialLinks } from "@/components/ui";
import { getTimeline } from "@/lib/data";

export const metadata: Metadata = { title: "เกี่ยวกับเรา" };

const links = [
  { label: "สินค้าบิวตี้", href: "/shop" },
  { label: "สินค้าซาลอน", href: "/products" },
  { label: "ลูกค้า", href: "/customers" },
  { label: "ทีมงาน", href: "/contact/team" },
];

export default async function AboutPage() {
  const timeline = await getTimeline();

  return (
    <>
      <PageHero
        eyebrow="About BeautyUp"
        title="ศูนย์ค้าส่งผลิตภัณฑ์ความงาม ลำปางและภาคเหนือ"
        description="ก่อตั้งเมื่อปี 2556 จำหน่ายผลิตภัณฑ์สำหรับร้านเสริมสวย เคาน์เตอร์แบรนด์ น้ำหอม เครื่องสำอาง และสกินแคร์ คุณภาพดีในราคาที่คุ้มค่า"
      >
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="btn btn-outline">
              {l.label}
            </Link>
          ))}
        </div>
      </PageHero>

      {/* Gallery */}
      <section className="container-page py-12 md:py-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Media
              key={i}
              tone={i}
              className={
                i === 0
                  ? "col-span-2 row-span-2 aspect-square rounded-3xl"
                  : "aspect-square rounded-3xl"
              }
            />
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="section">
        <div className="container-page grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Media label="Amy Phorlaphat" tone={2} className="aspect-[4/5] w-full rounded-3xl lg:sticky lg:top-28" />
          <div>
            <p className="eyebrow">CEO & Founder</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
              เอมี่ พลภัทร โสธนาภิศาล
            </h2>
            <dl className="mt-8 space-y-4 text-muted">
              <div>
                <dt className="text-sm font-medium text-ink">การศึกษา</dt>
                <dd className="mt-1">
                  โรงเรียนบุญวาทย์วิทยาลัย · บริหารธุรกิจบัณฑิต มหาวิทยาลัยเชียงใหม่ ·
                  บริหารธุรกิจมหาบัณฑิต มหาวิทยาลัยโยนก
                </dd>
              </div>
            </dl>
            <SocialLinks
              className="mt-6"
              socials={{
                facebook: "https://www.facebook.com/pholaphat.sothanarphisarn",
                instagram: "https://www.instagram.com/pholraphatamy/",
                tiktok: "https://www.tiktok.com/@pholraphatamysoth",
                youtube: "https://www.youtube.com/@FanolaOfficial",
              }}
            />

            <h3 className="mt-14 font-display text-2xl">เส้นทางของบิวตี้อัพ</h3>
            <ol className="mt-6 border-l border-line">
              {timeline.map((t) => (
                <li key={t.year} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent" />
                  <p className="font-display text-2xl text-accent">{t.year}</p>
                  <p className="mt-1">{t.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap gap-2">
              <Link href="/courses" className="btn btn-primary">
                คอร์สเรียน & ดูงาน
              </Link>
              <Link href="/members/media" className="btn btn-outline">
                มีเดีย
              </Link>
              <Link href="/members/articles" className="btn btn-outline">
                บทความ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GrowYourVision />
    </>
  );
}
