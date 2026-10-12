import { SETTING_KEYS, type SettingKey } from "@beautyup/types";
import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { api } from "@/lib/api";
import { settingsUi } from "@/lib/fields";
import { saveSetting } from "./actions";

export const metadata: Metadata = { title: "ตั้งค่าเว็บไซต์" };

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const { tab } = await searchParams;
  const key: SettingKey = SETTING_KEYS.includes(tab as SettingKey) ? (tab as SettingKey) : "company";
  const all = await api<Record<string, unknown>>("/admin/settings");
  const ui = settingsUi[key];
  const value = all[key];
  const rootList = ui.fields[0]?.name === "";
  const initial = rootList ? { "": value ?? [] } : ((value as Record<string, unknown>) ?? {});

  return (
    <>
      <PageHeader title="ตั้งค่าเว็บไซต์" description="ข้อมูลที่แสดงหลายจุดบนเว็บ เช่น ท้ายเว็บ หน้าติดต่อ และหน้าการชำระเงิน" />
      <nav aria-label="หมวดการตั้งค่า" className="-mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {SETTING_KEYS.map((k) => (
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
      <ResourceForm key={key} fields={ui.fields} initial={initial} onSave={saveSetting.bind(null, key)} />
    </>
  );
}
