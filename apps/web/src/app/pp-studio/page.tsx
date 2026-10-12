import { Phone } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { Media, SectionHeading, SocialLinks } from "@/components/ui";
import { getPpStudioServices } from "@/lib/data";
import { ppStudioFields } from "@/lib/forms";

export const metadata: Metadata = {
  title: "PP STUDIO & EVENT",
  description: "รับถ่ายวีดิโอ ตัดต่อวีดิโอ ถ่ายภาพสินค้า และจัดอีเวนท์ ลำปาง",
};

export default async function PpStudioPage() {
  const services = await getPpStudioServices();

  return (
    <>
      <section className="bg-ink text-cream">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow !text-cream/60">PP STUDIO & EVENT</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] text-balance sm:text-6xl">
              Professional photographer & outsource retoucher
            </h1>
            <p className="mt-6 max-w-lg text-cream/70 sm:text-lg">
              รับถ่ายวีดิโอ ตัดต่อวีดิโอ ถ่ายภาพสินค้า และจัดอีเวนท์
              เพิ่มมูลค่าให้ธุรกิจและสินค้าของคุณ โดยทีมงานคุณภาพ ในลำปาง
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              <a href="tel:0637792433" className="btn btn-light">
                <Phone className="size-4" /> 063-779-2433
              </a>
              <a href="#contact" className="btn border border-cream/30 text-cream hover:bg-cream hover:text-ink">
                ส่งข้อความ
              </a>
            </div>
          </div>
          <Media label="PP STUDIO" tone={0} className="aspect-[4/3] w-full rounded-3xl" />
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Services" title="บริการของเรา" />
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.title} className="group bg-cream p-6 transition-colors hover:bg-white sm:p-8">
                <span className="inline-block font-display text-sm text-accent transition-transform group-hover:translate-x-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="section scroll-mt-20 border-t border-line bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Like what you see?</h2>
            <p className="mt-3 text-muted">Get in touch to learn more.</p>
            <SocialLinks className="mt-6" socials={{ facebook: "#", instagram: "#", line: "#" }} />
          </div>
          <div className="lg:col-span-7">
            <Suspense>
              <InquiryForm type="PP_STUDIO" fields={ppStudioFields} submitLabel="Send" />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
