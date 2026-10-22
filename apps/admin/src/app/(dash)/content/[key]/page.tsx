import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
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
  const initial = ui.fields[0]?.name === "" ? { "": value ?? [] } : ((value as Record<string, unknown>) ?? {});

  return (
    <>
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
      <ResourceForm key={key} fields={ui.fields} initial={initial} onSave={saveSetting.bind(null, key)} />
    </>
  );
}
