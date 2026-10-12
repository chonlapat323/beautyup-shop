import { Building2, CreditCard, Mail, MapPin, MessageSquareWarning, Phone, Store, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GrowYourVision } from "@/components/grow-your-vision";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui";
import { getCompany } from "@/lib/data";
import { contactFields } from "@/lib/forms";

export const metadata: Metadata = { title: "ติดต่อเรา" };

const actions = [
  { label: "สมัครซาลอน", href: "/contact/salon-partner", icon: Store },
  { label: "เลขบัญชีโอนเงิน", href: "/contact/payment", icon: CreditCard },
  { label: "ติดต่อทีมงาน", href: "/contact/team", icon: Users },
  { label: "แจ้งปัญหา", href: "/contact/report", icon: MessageSquareWarning },
];

const topics = [
  "ข้อมูลผลิตภัณฑ์",
  "สินค้าซาลอน",
  "แชมพูม่วง",
  "โปรโมชั่น",
  "ตารางคอร์สเรียน",
  "ดูงานต่างประเทศ",
  "ร่วมงานกับเรา",
];

export default async function ContactPage() {
  const company = await getCompany();

  return (
    <>
      <PageHero eyebrow="Contact" title="บิวตี้อัพยินดีให้บริการ ต้องการให้เราช่วยอะไร?" />

      <section className="container-page py-10 md:py-14">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {actions.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-6 rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-lg hover:shadow-ink/5 sm:p-6"
              >
                <Icon className="size-6 text-accent" />
                <span className="flex items-center justify-between gap-2 font-medium">
                  {label}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section pt-4 md:pt-8">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl sm:text-3xl">{company.name} (สนญ.)</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-accent" />
                <span>
                  {company.address}
                  <a href={company.mapUrl} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-accent hover:underline">
                    เปิดใน Google Maps →
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 size-5 shrink-0 text-accent" />
                <span className="flex flex-wrap gap-x-4">
                  {company.phones.map((p) => (
                    <a key={p} href={`tel:${p.replaceAll("-", "")}`} className="min-h-9 hover:text-accent">{p}</a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 size-5 shrink-0 text-accent" />
                <a href={`mailto:${company.email}`} className="break-all hover:text-accent">{company.email}</a>
              </li>
              <li className="flex gap-3">
                <Building2 className="mt-1 size-5 shrink-0 text-accent" />
                <span>เลขประจำตัวผู้เสียภาษี {company.taxId}</span>
              </li>
            </ul>

            <h3 className="mt-10 font-medium">ติดต่อฝ่ายต่าง ๆ</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {company.departments.map((d) => (
                <li key={d.name} className="flex min-h-12 items-center justify-between gap-4">
                  <span>{d.name}</span>
                  <a href={`tel:${d.phone.replaceAll("-", "")}`} className="text-muted hover:text-accent">{d.phone}</a>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-medium">สอบถามข้อมูลได้ เช่น</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t} className="rounded-full bg-sand px-3 py-1 text-sm">{t}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="mb-6 font-display text-2xl sm:text-3xl">ส่งข้อความถึงเรา</h2>
            <Suspense>
              <InquiryForm type="CONTACT" fields={contactFields} />
            </Suspense>
          </div>
        </div>
      </section>

      <GrowYourVision />
    </>
  );
}
