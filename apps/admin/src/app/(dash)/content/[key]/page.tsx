import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { SectionFlowBar } from "@/components/section-flow-bar";
import { api } from "@/lib/api";
import { PAGE_SETTINGS, settingsUi, type PageSettingKey } from "@/lib/fields";
import { siteUrl } from "@/lib/site";
import { saveSetting } from "../../settings/actions";

export async function generateMetadata({ params }: PageProps<"/content/[key]">): Promise<Metadata> {
  const { key } = await params;
  return { title: Object.hasOwn(PAGE_SETTINGS, key) ? settingsUi[key as PageSettingKey].title : "ไม่พบหน้า" };
}

/** Content that belongs to a single website page (About, VIP Customer banner, ...) */
export default async function PageContentPage({ params }: PageProps<"/content/[key]">) {
  const { key: raw } = await params;
  if (!Object.hasOwn(PAGE_SETTINGS, raw)) notFound();
  const key = raw as PageSettingKey;
  const ui = settingsUi[key];
  // Settings of the same website page are tabs of one admin page
  const tabs = (Object.keys(PAGE_SETTINGS) as PageSettingKey[]).filter((k) => PAGE_SETTINGS[k].path === PAGE_SETTINGS[key].path);
  const value = (await api<Record<string, unknown>>("/admin/settings"))[key];
  // Bare-list settings are edited through a single unnamed field
  const rawInitial = ui.fields[0]?.name === "" ? { "": value ?? [] } : ((value as Record<string, unknown>) ?? {});
  const initial =
    key === "vipCustomer"
      ? {
          eyebrow: { th: "Our VIP Customer", en: "Our VIP Customer" },
          quote: {
            th: `ช่างผมประสบการณ์สูง\nความสามารถโดดเด่น\nวางใจผลิตภัณฑ์ของบิวตี้อัพ\nมาอย่างยาวนาน\nสร้างสรรค์เอกลักษณ์ผลงานเลอค่า\nให้กับลูกค้าทุกระดับ`,
            en: `Experienced Master Stylists\nDistinctive Artistry & Vision\nTrusted Partners of Beauty Up Across the Years\nCrafting Exceptional & Timeless Hair Perfection\nFor Clients of Every Distinction`,
          },
          ...rawInitial,
        }
      : key === "about"
        ? {
            ...rawInitial,
            founderPhoto: (rawInitial.founderPhoto as string) || "/founder.png",
          }
        : key === "shopPage"
          ? {
              eyebrow: { th: "Our Counter Brand", en: "Our Counter Brand" },
              headline: { th: "เคาน์เตอร์แบรนด์ชั้นนำ ในราคาที่คุ้มค่า", en: "Leading Counter Brands at Exceptional Value" },
              lead: {
                th: "สกินแคร์ น้ำหอม และเครื่องสำอางจากแบรนด์ระดับโลก คัดสรรโดยบิวตี้อัพ",
                en: "World-class skincare, fragrance, and cosmetics curated by BeautyUp.",
              },
              ceoEyebrow: { th: "From the CEO", en: "From the CEO" },
              ceoQuote: { th: "“I'm Amy … CEO of Beauty Up Enterprise”", en: "“I'm Amy … CEO of Beauty Up Enterprise”" },
              ceoText: {
                th: "คัดสรรผลิตภัณฑ์ของแท้จากเคาน์เตอร์แบรนด์ชั้นนำ เพื่อให้ทุกคนเข้าถึงความงามระดับพรีเมียม",
                en: "Authentic products curated from leading counter brands, bringing premium beauty within reach.",
              },
              productsEyebrow: { th: "Shop", en: "Shop" },
              productsTitle: { th: "สินค้าเคาน์เตอร์แบรนด์", en: "Counter Brand Products" },
              productsLead: {
                th: "สนใจสินค้า กด “ติดต่อสั่งซื้อ” ทีมงานจะติดต่อกลับ",
                en: "Interested in an item? Click “Contact to Order” and our team will get in touch.",
              },
              ...rawInitial,
            }
          : rawInitial;

  return (
    <>
      <SectionFlowBar currentKey={key} />
      <PageHeader
        title={PAGE_SETTINGS[key].page}
        description={"description" in ui ? ui.description : undefined}
        actions={
          <a href={`${siteUrl()}${PAGE_SETTINGS[key].path}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-flex items-center gap-1.5">
            <ExternalLink className="size-4" /> ดูหน้าเว็บ
          </a>
        }
      />
      {tabs.length > 1 && (
        <nav aria-label="ส่วนของหน้า" className="-mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {tabs.map((k) => (
            <Link
              key={k}
              href={`/content/${k}`}
              aria-current={k === key ? "page" : undefined}
              className={clsx(
                "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 text-sm transition-colors",
                k === key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-muted",
              )}
            >
              {PAGE_SETTINGS[k].tab}
            </Link>
          ))}
        </nav>
      )}
      <ResourceForm key={key} resourceName={key} fields={ui.fields} initial={initial} onSave={saveSetting.bind(null, key)} />
    </>
  );
}
