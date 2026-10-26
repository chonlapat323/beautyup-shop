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

export default async function NewResourcePage({ params }: PageProps<"/r/[resource]/new">) {
  const name = resolveResource((await params).resource);
  const ui = resourceUi[name];
  const relations = await loadRelations(ui.fields);

  if (name === "menu-items") {
    return (
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
    );
  }

  return (
    <>
      <SectionFlowBar currentKey={name} />
      <PageHeader title={`เพิ่ม${ui.noun}`} back={{ href: `/r/${name}`, label: ui.title }} />
      <ResourceForm fields={ui.fields} relations={relations} onSave={saveResource.bind(null, name, null)} redirectTo={`/r/${name}`} />
    </>
  );
}
