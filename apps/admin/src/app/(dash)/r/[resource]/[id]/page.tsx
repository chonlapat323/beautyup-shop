import type { Metadata } from "next";
import QRCode from "qrcode";
import { DeleteButton } from "@/components/delete-button";
import { MediaShare } from "@/components/media-share";
import { MenuItemVisualEditor } from "@/components/menu-item-visual-editor";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { resourceUi } from "@/lib/fields";
import { getResource, loadRelations, resolveResource, rowTitle } from "@/lib/resources";
import { siteUrl } from "@/lib/site";
import { deleteResource, saveMenuItem, saveResource } from "../../actions";

export const metadata: Metadata = { title: "แก้ไขข้อมูล" };

export default async function EditResourcePage({ params }: PageProps<"/r/[resource]/[id]">) {
  const { resource, id } = await params;
  const name = resolveResource(resource);
  const ui = resourceUi[name];
  const [row, relations] = await Promise.all([getResource(name, id), loadRelations(ui.fields, id)]);
  const title = rowTitle(name, row);

  if (name === "menu-items") {
    return (
      <MenuItemVisualEditor
        id={id}
        title={title}
        initial={row}
        relations={relations}
        onSave={saveMenuItem.bind(null, id)}
        onDelete={deleteResource.bind(null, name, id)}
        siteUrl={siteUrl()}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={title}
        back={{ href: `/r/${name}`, label: ui.title }}
        actions={<DeleteButton label={`ลบ${ui.noun}`} confirmText={`ลบ "${title}" ใช่หรือไม่? การลบย้อนกลับไม่ได้`} action={deleteResource.bind(null, name, id)} />}
      />
      {name === "media" && <MediaSharePanel slug={String(row.slug)} publishedAt={row.publishedAt as string | null} />}
      {name === "products" && <ProductSharePanel slug={String(row.slug)} isActive={Boolean(row.isActive)} />}
      <ResourceForm key={id} fields={ui.fields} initial={row} relations={relations} onSave={saveResource.bind(null, name, id)} />
    </>
  );
}

async function MediaSharePanel({ slug, publishedAt }: { slug: string; publishedAt: string | null }) {
  const url = `${siteUrl()}/th/members/media/${slug}`;
  const qr = await QRCode.toDataURL(url, { width: 600, margin: 2 });
  const published = !!publishedAt && new Date(publishedAt) <= new Date();
  return <MediaShare url={url} qr={qr} fileName={`${slug}-qr.png`} published={published} />;
}

async function ProductSharePanel({ slug, isActive }: { slug: string; isActive: boolean }) {
  const url = `${siteUrl()}/th/product/${slug}`;
  const qr = await QRCode.toDataURL(url, { width: 600, margin: 2 });
  return <MediaShare url={url} qr={qr} fileName={`${slug}-qr.png`} published={isActive} />;
}
