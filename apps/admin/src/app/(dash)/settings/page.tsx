import type { SettingKey } from "@beautyup/types";
import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { api } from "@/lib/api";
import { PAGE_SETTINGS, SITE_SETTING_KEYS, settingsUi } from "@/lib/fields";
import { saveSetting } from "./actions";

export const metadata: Metadata = { title: "ตั้งค่าเว็บไซต์" };

type SiteKey = (typeof SITE_SETTING_KEYS)[number];

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const { tab } = await searchParams;
  // Page content has its own menu entries now; keep old links working
  if (typeof tab === "string" && Object.hasOwn(PAGE_SETTINGS, tab)) redirect(`/content/${tab}`);
  const key: SiteKey = (SITE_SETTING_KEYS as readonly string[]).includes(tab as string) ? (tab as SiteKey) : "company";
  const all = await api<Record<string, unknown>>("/admin/settings");
  const ui = settingsUi[key];
  const initial = (all[key] as Record<string, unknown>) ?? {};

  return (
    <>
      <PageHeader title="ตั้งค่าเว็บไซต์" description="ข้อมูลที่ใช้หลายหน้าบนเว็บ เนื้อหาของแต่ละหน้าแก้ได้ที่เมนูของหน้านั้น" />
      <nav aria-label="หมวดการตั้งค่า" className="-mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {SITE_SETTING_KEYS.map((k) => (
          <Link
            key={k}
            href={`/settings?tab=${k}`}
            aria-current={k === key ? "page" : undefined}
            className={clsx(
              "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 text-sm transition-colors",
              k === key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-muted",
            )}
          >
            {settingsUi[k].title}
          </Link>
        ))}
      </nav>
      {"description" in ui && <p className="mb-4 text-sm text-muted">{ui.description}</p>}
      <ResourceForm key={key} fields={ui.fields} initial={initial} onSave={saveSetting.bind(null, key satisfies SettingKey)} />
    </>
  );
}
