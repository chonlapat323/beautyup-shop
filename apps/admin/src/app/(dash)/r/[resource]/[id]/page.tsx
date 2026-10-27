import type { Metadata } from "next";
import QRCode from "qrcode";
import { DeleteButton } from "@/components/delete-button";
import { MediaShare } from "@/components/media-share";
import { MenuItemVisualEditor } from "@/components/menu-item-visual-editor";
import { PageHeader } from "@/components/page-header";
import { ResourceForm } from "@/components/resource-form";
import { SectionFlowBar, type BreadcrumbItem } from "@/components/section-flow-bar";
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
  if (name === "products") {
    const imgs = (row.images as string[] | undefined) ?? [];
    if (imgs.length === 0 && typeof row.imageUrl === "string" && row.imageUrl.trim()) {
      row.images = [row.imageUrl.trim()];
    }
  }
  if (name === "posts") {
    const imgs = (row.images as string[] | undefined) ?? [];
    if (imgs.length === 0 && typeof row.coverUrl === "string" && row.coverUrl.trim()) {
      row.images = [row.coverUrl.trim()];
    }
  }
  const title = rowTitle(name, row);

  if (name === "menu-items") {
    const parentOpt = row.parentId ? relations["menu-items"]?.find((o) => o.value === String(row.parentId)) : undefined;
    const menuTrail: BreadcrumbItem[] = [];
    if (parentOpt) {
      menuTrail.push({ label: `เมนูหลัก: ${parentOpt.label}`, href: `/r/menu-items?filter=${parentOpt.value}` });
    }
    menuTrail.push({ label: `${title} (${String(row.href ?? "")})` });
    return (
      <>
        <SectionFlowBar currentKey="menu-items" menuHref={String(row.href ?? "")} trail={menuTrail} />
        <MenuItemVisualEditor
          id={id}
          title={title}
          initial={row}
          relations={relations}
          onSave={saveMenuItem.bind(null, id)}
          onDelete={deleteResource.bind(null, name, id)}
          siteUrl={siteUrl()}
        />
      </>
    );
  }

  const trail: BreadcrumbItem[] = [];
  if (row.brandId && relations.brands) {
    const b = relations.brands.find((o) => o.value === String(row.brandId));
    if (b) trail.push({ label: `แบรนด์: ${b.label}`, href: `/r/${name}?filter=${b.value}` });
  }
  if (row.mainCategoryId && relations["main-categories"]) {
    const mc = relations["main-categories"].find((o) => o.value === String(row.mainCategoryId));
    if (mc) trail.push({ label: `หมวดหลัก: ${mc.label}`, href: `/r/${name}?sub=${mc.value}` });
  }
  if (row.categoryId) {
    const catList = relations.categories || relations["media-categories"] || relations["forum-categories"];
    const cat = catList?.find((o) => o.value === String(row.categoryId));
    if (cat) trail.push({ label: `หมวด/คอลเลกชัน: ${cat.label}`, href: `/r/${name}?sub=${cat.value}` });
  }
  trail.push({ label: `แก้ไข: ${title}` });

  const postType = name === "posts" && (row.type === "ARTICLE" || row.type === "ACTIVITY") ? row.type : undefined;
  const flowKey = postType ? `posts:${postType}` : name;
  const backHref = postType ? `/r/posts?filter=${postType}` : `/r/${name}`;
  const backLabel =
    postType === "ARTICLE"
      ? "บทความ (Articles)"
      : postType === "ACTIVITY"
        ? "กิจกรรม (Activities)"
        : ui.title;

  return (
    <>
      <SectionFlowBar currentKey={flowKey} trail={trail} />
      <PageHeader
        title={title}
        back={{ href: backHref, label: backLabel }}
        actions={<DeleteButton label={`ลบ${ui.noun}`} confirmText={`ลบ "${title}" ใช่หรือไม่? การลบย้อนกลับไม่ได้`} action={deleteResource.bind(null, name, id)} />}
      />
      {name === "media" && <MediaSharePanel slug={String(row.slug)} publishedAt={row.publishedAt as string | null} />}
      {name === "products" && <ProductSharePanel slug={String(row.slug)} isActive={Boolean(row.isActive)} />}
      <ResourceForm key={id} resourceName={name} fields={ui.fields} initial={row} relations={relations} onSave={saveResource.bind(null, name, id)} />
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
  return (
    <MediaShare
      url={url}
      qr={qr}
      fileName={`${slug}-qr.png`}
      published={isActive}
      unpublishedText="ยังปิดการแสดงบนเว็บไซต์ ลูกค้าจะเปิดลิงก์นี้ไม่ได้จนกว่าจะติ๊ก แสดงบนเว็บไซต์"
    />
  );
}
