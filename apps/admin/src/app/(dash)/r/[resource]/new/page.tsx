import type { Metadata } from "next";
import { MenuItemVisualEditor } from "@/components/menu-item-visual-editor";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { SectionFlowBar } from "@/components/section-flow-bar";
import { resourceUi } from "@/lib/fields";
import { loadRelations, resolveResource } from "@/lib/resources";
import { siteUrl } from "@/lib/site";
import { saveMenuItem, saveResource } from "../../actions";

export const metadata: Metadata = { title: "เพิ่มข้อมูล" };

export default async function NewResourcePage({ params, searchParams }: PageProps<"/r/[resource]/new">) {
  const name = resolveResource((await params).resource);
  const sp = await searchParams;
  const presetPostType =
    name === "posts" && (sp.type === "ARTICLE" || sp.type === "ACTIVITY") ? sp.type : undefined;
  const ui = resourceUi[name];
  const relations = await loadRelations(ui.fields);

  if (name === "menu-items") {
    return (
      <>
        <SectionFlowBar currentKey="menu-items" trail={[{ label: "เพิ่มเมนูและหน้าเว็บใหม่" }]} />
        <MenuItemVisualEditor
          title="เพิ่มเมนูและหน้าเว็บใหม่"
          initial={{
            label: { th: "", en: "" },
            href: "/new-page",
            location: "header",
            isActive: true,
            sortOrder: 0,
            slides: [],
            sections: [],
          }}
          relations={relations}
          onSave={saveMenuItem.bind(null, null)}
          redirectTo="/r/menu-items"
          siteUrl={siteUrl()}
        />
      </>
    );
  }

  const flowKey = presetPostType ? `posts:${presetPostType}` : name;
  const noun =
    presetPostType === "ARTICLE" ? "บทความ" : presetPostType === "ACTIVITY" ? "กิจกรรม" : ui.noun;
  const backHref = presetPostType ? `/r/posts?filter=${presetPostType}` : `/r/${name}`;
  const backLabel =
    presetPostType === "ARTICLE"
      ? "บทความ (Articles)"
      : presetPostType === "ACTIVITY"
        ? "กิจกรรม (Activities)"
        : ui.title;

  return (
    <>
      <SectionFlowBar currentKey={flowKey} trail={[{ label: `เพิ่ม${noun}` }]} />
      <PageHeader title={`เพิ่ม${noun}`} back={{ href: backHref, label: backLabel }} />
      <ResourceForm
        fields={ui.fields}
        initial={presetPostType ? { type: presetPostType } : undefined}
        relations={relations}
        onSave={saveResource.bind(null, name, null)}
        redirectTo={backHref}
      />
    </>
  );
}
