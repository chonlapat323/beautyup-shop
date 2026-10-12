import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { resourceUi } from "@/lib/fields";
import { loadRelations, resolveResource } from "@/lib/resources";
import { saveResource } from "../../actions";

export const metadata: Metadata = { title: "เพิ่มข้อมูล" };

export default async function NewResourcePage({ params }: PageProps<"/r/[resource]/new">) {
  const name = resolveResource((await params).resource);
  const ui = resourceUi[name];
  const relations = await loadRelations(ui.fields);

  return (
    <>
      <PageHeader title={`เพิ่ม${ui.noun}`} back={{ href: `/r/${name}`, label: ui.title }} />
      <ResourceForm fields={ui.fields} relations={relations} onSave={saveResource.bind(null, name, null)} redirectTo={`/r/${name}`} />
    </>
  );
}
