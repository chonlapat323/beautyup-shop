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
  const isBrandScoped = name === "brands" || name === "main-categories" || name === "categories" || name === "products";
  const brandScope: "SALON" | "COUNTER" | undefined = isBrandScoped
    ? sp.type === "COUNTER"
      ? "COUNTER"
      : "SALON"
    : undefined;
  const ui = resourceUi[name];
  const rawRelations = await loadRelations(ui.fields);
  const relations =
    brandScope && rawRelations.brands
      ? { ...rawRelations, brands: rawRelations.brands.filter((b) => (b.brandType || "SALON") === brandScope) }
      : rawRelations;

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

  const flowKey = presetPostType
    ? `posts:${presetPostType}`
    : brandScope === "COUNTER"
      ? `${name}:COUNTER`
      : name;
  const noun =
    presetPostType === "ARTICLE"
      ? "บทความ"
      : presetPostType === "ACTIVITY"
        ? "กิจกรรม"
        : brandScope === "COUNTER" && name === "brands"
          ? "เคาน์เตอร์แบรนด์"
          : brandScope === "COUNTER" && name === "products"
            ? "สินค้าเคาน์เตอร์แบรนด์"
            : brandScope === "SALON" && name === "brands"
              ? "แบรนด์ซาลอน"
              : brandScope === "SALON" && name === "products"
                ? "สินค้าซาลอน"
                : ui.noun;
  const backHref = presetPostType
    ? `/r/posts?filter=${presetPostType}`
    : brandScope
      ? `/r/${name}?type=${brandScope}`
      : `/r/${name}`;
  const backLabel =
    presetPostType === "ARTICLE"
      ? "บทความ (Articles)"
      : presetPostType === "ACTIVITY"
        ? "กิจกรรม (Activities)"
        : brandScope === "COUNTER" && name === "brands"
          ? "เคาน์เตอร์แบรนด์"
          : brandScope === "COUNTER" && name === "products"
            ? "สินค้าเคาน์เตอร์แบรนด์"
            : ui.title;

  const initial = presetPostType
    ? { type: presetPostType }
    : name === "brands" && brandScope
      ? { type: brandScope }
      : undefined;

  return (
    <>
      <SectionFlowBar currentKey={flowKey} trail={[{ label: `เพิ่ม${noun}` }]} />
      <PageHeader title={`เพิ่ม${noun}`} back={{ href: backHref, label: backLabel }} />
      <ResourceForm
        resourceName={name}
        fields={ui.fields}
        initial={initial}
        relations={relations}
        onSave={saveResource.bind(null, name, null)}
        redirectTo={backHref}
      />
    </>
  );
}
