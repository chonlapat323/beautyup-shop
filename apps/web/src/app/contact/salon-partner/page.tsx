import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui";
import { salonPartnerFields } from "@/lib/forms";

export const metadata: Metadata = { title: "สั่งสินค้า & สมัครร้านซาลอน & ลงทะเบียนเรียน" };

export default function SalonPartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Order · Salon Partner · Course"
        title="สั่งสินค้า & สมัครร้านซาลอน & ลงทะเบียนเรียน"
        description="กรุณากรอกรายละเอียดและกดปุ่มส่ง เราจะติดต่อกลับท่านโดยเร็วที่สุด"
      />
      <section className="container-page max-w-3xl py-10 md:py-16">
        <Suspense>
          <InquiryForm
            type="SALON"
            fields={salonPartnerFields}
            typeOptions={[
              { value: "ORDER", label: "สั่งสินค้า" },
              { value: "SALON", label: "สมัครร้านซาลอน" },
              { value: "COURSE", label: "ลงทะเบียนเรียน" },
            ]}
          />
        </Suspense>
      </section>
    </>
  );
}
