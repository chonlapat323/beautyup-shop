import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { api } from "@/lib/api";
import { PAGE_SETTINGS, settingsUi, type PageSettingKey } from "@/lib/fields";
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
  const value = (await api<Record<string, unknown>>("/admin/settings"))[key];
  // Bare-list settings are edited through a single unnamed field
  const initial = ui.fields[0]?.name === "" ? { "": value ?? [] } : ((value as Record<string, unknown>) ?? {});
  const webUrl = (process.env.WEB_URL || "http://localhost:3000").replace(/\/$/, "");

  return (
    <>
      <PageHeader
        title={ui.title}
        description={"description" in ui ? ui.description : undefined}
        actions={
          <a href={`${webUrl}${PAGE_SETTINGS[key].path}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline inline-flex items-center gap-1.5">
            <ExternalLink className="size-4" /> ดูหน้าเว็บ
          </a>
        }
      />
      <ResourceForm key={key} fields={ui.fields} initial={initial} onSave={saveSetting.bind(null, key)} />
    </>
  );
}
