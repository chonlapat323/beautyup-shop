import type { Metadata } from "next";
import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { resourceUi } from "@/lib/fields";
import { getResource, loadRelations, resolveResource, rowTitle } from "@/lib/resources";
import { deleteResource, saveResource } from "../../actions";

export const metadata: Metadata = { title: "แก้ไขข้อมูล" };

export default async function EditResourcePage({ params }: PageProps<"/r/[resource]/[id]">) {
  const { resource, id } = await params;
  const name = resolveResource(resource);
  const ui = resourceUi[name];
  const [row, relations] = await Promise.all([getResource(name, id), loadRelations(ui.fields, id)]);
  const title = rowTitle(name, row);

  return (
    <>
      <PageHeader
        title={title}
        back={{ href: `/r/${name}`, label: ui.title }}
        actions={<DeleteButton label={`ลบ${ui.noun}`} confirmText={`ลบ "${title}" ใช่หรือไม่? การลบย้อนกลับไม่ได้`} action={deleteResource.bind(null, name, id)} />}
      />
      <ResourceForm key={id} fields={ui.fields} initial={row} relations={relations} onSave={saveResource.bind(null, name, id)} />
    </>
  );
}
