import type { Metadata } from "next";
import Link from "next/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { Media, PageHero, SectionHeading, SocialLinks, stagger } from "@/components/ui";
import { getAmbassadors, getRegions } from "@/lib/data";

export const metadata: Metadata = { title: "ลูกค้า" };

export default async function CustomersPage() {
  const [ambassadors, regions] = await Promise.all([getAmbassadors(), getRegions()]);
  const total = regions.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <PageHero
        eyebrow="Our VIP Customer"
        title="ช่างผมมืออาชีพที่ไว้วางใจบิวตี้อัพ"
        description="ช่างผมประสบการณ์สูง ความสามารถโดดเด่น วางใจผลิตภัณฑ์ของบิวตี้อัพในการดูแลลูกค้าคนสำคัญ"
      />

      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Brand Ambassador" title="แบรนด์แอมบาสเดอร์" />
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-5">
            {ambassadors.map((a, i) => (
              <li key={a.name} data-reveal style={stagger(i)}>
                <div className="overflow-hidden rounded-2xl">
                  <Media src={a.photoUrl} alt={a.name} label={a.name} tone={i} className="aspect-[3/4] w-full transition-transform duration-700 hover:scale-[1.03]" />
                </div>
                <p className="mt-4 font-display text-xl">{a.name}</p>
                <p className="text-sm text-muted">{a.title}</p>
                <SocialLinks socials={a.socials} className="mt-3 hidden sm:flex" />
              </li>
            ))}
            <li>
              <Link
                href="/contact/salon-partner"
                className="group grid aspect-[3/4] w-full place-items-center rounded-2xl border-2 border-dashed border-line p-4 text-center transition-colors hover:border-accent hover:bg-accent-soft/50"
              >
                <span>
                  <span className="block font-display text-3xl text-accent">YOU</span>
                  <span className="mt-2 block text-sm text-muted group-hover:text-ink">
                    ร่วมเป็นส่วนหนึ่งกับเรา →
                  </span>
                </span>
              </Link>
              <p className="mt-4 font-display text-xl">YOU</p>
              <p className="text-sm text-muted">Your Salon</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section border-t border-line bg-mist">
        <div className="container-page">
          <SectionHeading
            eyebrow="Salon Directory"
            title="รายชื่อร้านซาลอน"
            description={`ร้านซาลอนพันธมิตรกว่า ${total.toLocaleString("th-TH")} ร้านทั่วประเทศ`}
          />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {regions.map((r) => (
              <li key={r.key}>
                <Link
                  href={`/customers/salons?region=${r.key}`}
                  className="group flex h-full flex-col justify-between gap-6 card-lift rounded-2xl border border-line bg-white p-5 sm:p-6"
                >
                  <span className="text-sm sm:text-base">{r.label}</span>
                  <span className="flex items-end justify-between">
                    <span className="font-display text-4xl sm:text-5xl">{r.count}</span>
                    <span className="text-sm text-muted transition-transform group-hover:translate-x-1">ร้าน →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-2">
            <Link href="/customers/salons" className="btn btn-primary">ค้นหาซาลอน</Link>
            <Link href="/contact/salon-partner" className="btn btn-outline">สมัครซาลอน</Link>
          </div>
        </div>
      </section>

      <GrowYourVision />
    </>
  );
}
