import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui";
import { issueFields } from "@/lib/forms";

export const metadata: Metadata = { title: "แจ้งปัญหา" };

export default function ReportPage() {
  return (
    <>
      <PageHero
        eyebrow="Report an issue"
        title="แจ้งปัญหา"
        description="พบปัญหาเกี่ยวกับสินค้า การจัดส่ง หรือการชำระเงิน แจ้งเราได้ที่นี่ ทีมงานจะติดต่อกลับโดยเร็วที่สุด"
      />
      <section className="container-page max-w-3xl py-10 md:py-16">
        <Suspense>
          <InquiryForm type="ISSUE" fields={issueFields} submitLabel="ส่งเรื่อง" />
        </Suspense>
      </section>
    </>
  );
}
