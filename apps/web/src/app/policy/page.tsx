import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "นโยบายการจำหน่ายและชำระเงิน" };

// MOCK: replace with the real policy text (will come from the CMS `Page` table)
const sections = [
  { title: "การจัดจำหน่าย", body: "เนื้อหานโยบายการจัดจำหน่าย (รอข้อมูลจริงจากเว็บเดิม)" },
  { title: "การชำระเงิน", body: "เนื้อหานโยบายการชำระเงิน (รอข้อมูลจริงจากเว็บเดิม)" },
  { title: "การจัดเก็บข้อมูลส่วนบุคคล", body: "เนื้อหานโยบายการจัดเก็บข้อมูล (รอข้อมูลจริงจากเว็บเดิม)" },
];

export default function PolicyPage() {
  return (
    <>
      <PageHero eyebrow="Policy" title="นโยบายทางธุรกิจสำหรับการจัดจำหน่ายและการจัดเก็บข้อมูล" />
      <article className="container-page max-w-3xl py-10 md:py-16">
        {sections.map((s, i) => (
          <section key={s.title} className="border-b border-line py-8 first:pt-0 last:border-b-0">
            <h2 className="font-display text-2xl">
              <span className="mr-3 text-accent">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <p className="mt-4 text-muted">{s.body}</p>
          </section>
        ))}
      </article>
    </>
  );
}
