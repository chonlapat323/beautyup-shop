import type { Metadata } from "next";
import QRCode from "qrcode";
import { DeleteButton } from "@/components/delete-button";
import { MediaShare } from "@/components/media-share";
import { MenuItemVisualEditor } from "@/components/menu-item-visual-editor";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { api } from "@/lib/api";
import { resourceUi } from "@/lib/fields";
import { getResource, loadRelations, resolveResource, rowTitle } from "@/lib/resources";
import { deleteResource, saveMenuItem, saveResource } from "../../actions";

export const metadata: Metadata = { title: "แก้ไขข้อมูล" };

export default async function EditResourcePage({ params }: PageProps<"/r/[resource]/[id]">) {
  const { resource, id } = await params;
  const name = resolveResource(resource);
  const ui = resourceUi[name];
  const [row, relations] = await Promise.all([getResource(name, id), loadRelations(ui.fields, id)]);
  const title = rowTitle(name, row);

  if (name === "menu-items") {
    let mergedRow = { ...row };
    if (row.href === "/products") {
      try {
        const all = await api<Record<string, unknown>>("/admin/settings");
        const productsPage = (all["productsPage"] as Record<string, unknown>) || {};
        const salonHairSlides = (all["salonHairSlides"] as Record<string, unknown>) || {};

        mergedRow = {
          ...row,
          heroHeadline: row.heroHeadline || productsPage.heroHeadline || salonHairSlides.heroHeadline || {
            th: "เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ",
            en: "Delivering the best for your clients",
          },
          heroEyebrow: row.heroEyebrow || productsPage.heroEyebrow || salonHairSlides.heroEyebrow || {
            th: "Professional Salon Products",
            en: "Professional Salon Products",
          },
          heroLead: row.heroLead || productsPage.heroLead || salonHairSlides.heroLead || {
            th: "ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ",
            en: "Professional salon-grade products imported from Italy and Brazil...",
          },
          slides: (row.slides && (row.slides as any[]).length > 0)
            ? row.slides
            : (productsPage.slides && (productsPage.slides as any[]).length > 0)
              ? productsPage.slides
              : salonHairSlides.slides,
          sections: (row.sections && (row.sections as any[]).length > 0)
            ? row.sections
            : productsPage.sections,
        };
      } catch {
        // ignore
      }
    }

    return (
      <MenuItemVisualEditor
        id={id}
        title={title}
        initial={mergedRow}
        relations={relations}
        onSave={saveMenuItem.bind(null, id)}
        onDelete={deleteResource.bind(null, name, id)}
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
      <ResourceForm key={id} fields={ui.fields} initial={row} relations={relations} onSave={saveResource.bind(null, name, id)} />
    </>
  );
}

async function MediaSharePanel({ slug, publishedAt }: { slug: string; publishedAt: string | null }) {
  // SITE_URL is the public website; WEB_URL may be an internal address used for revalidation
  const site = (process.env.SITE_URL || process.env.WEB_URL || "http://localhost:3000").replace(/\/$/, "");
  const url = `${site}/th/members/media/${slug}`;
  const qr = await QRCode.toDataURL(url, { width: 600, margin: 2 });
  const published = !!publishedAt && new Date(publishedAt) <= new Date();
  return <MediaShare url={url} qr={qr} fileName={`${slug}-qr.png`} published={published} />;
}
