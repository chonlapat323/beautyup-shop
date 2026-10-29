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

  // Resolve pre-filled relations from query params (e.g. from row quick actions or filtered list)
  const rawBrand = typeof sp.brandId === "string" ? sp.brandId : typeof sp.brand === "string" ? sp.brand : typeof sp.filter === "string" ? sp.filter : "";
  const rawMainCategory = typeof sp.mainCategoryId === "string" ? sp.mainCategoryId : typeof sp.mainCategory === "string" ? sp.mainCategory : "";
  const rawCategory = typeof sp.categoryId === "string" ? sp.categoryId : typeof sp.category === "string" ? sp.category : "";
  const rawSub = typeof sp.sub === "string" ? sp.sub : "";

  let resolvedBrandId = "";
  let resolvedMainCategoryId = "";
  let resolvedCategoryId = "";

  const brandOptions = relations.brands ?? [];
  const mainCatOptions = relations["main-categories"] ?? [];
  const catOptions = relations.categories ?? [];

  // 1. Resolve category / collection
  if (rawCategory) {
    const c = catOptions.find((x) => x.value === rawCategory || x.slug === rawCategory);
    if (c) resolvedCategoryId = c.value;
  } else if (rawSub) {
    const c = catOptions.find((x) => x.value === rawSub || x.slug === rawSub);
    if (c) resolvedCategoryId = c.value;
  }

  // If collection resolved, infer its mainCategory or brand
  if (resolvedCategoryId) {
    const c = catOptions.find((x) => x.value === resolvedCategoryId);
    if (c?.parent) {
      const parentIsMainCat = mainCatOptions.find((m) => m.value === c.parent);
      if (parentIsMainCat) {
        resolvedMainCategoryId = parentIsMainCat.value;
        if (parentIsMainCat.parent) resolvedBrandId = parentIsMainCat.parent;
      } else {
        const parentIsBrand = brandOptions.find((b) => b.value === c.parent);
        if (parentIsBrand) resolvedBrandId = parentIsBrand.value;
      }
    }
  }

  // 2. Resolve main-category
  if (!resolvedMainCategoryId) {
    if (rawMainCategory) {
      const m = mainCatOptions.find((x) => x.value === rawMainCategory || x.slug === rawMainCategory);
      if (m) resolvedMainCategoryId = m.value;
    } else if (rawSub && !resolvedCategoryId) {
      const m = mainCatOptions.find((x) => x.value === rawSub || x.slug === rawSub);
      if (m) resolvedMainCategoryId = m.value;
    }
    if (resolvedMainCategoryId) {
      const m = mainCatOptions.find((x) => x.value === resolvedMainCategoryId);
      if (m?.parent && !resolvedBrandId) resolvedBrandId = m.parent;
    }
  }

  // 3. Resolve brand
  if (!resolvedBrandId) {
    if (rawBrand) {
      const b = brandOptions.find((x) => x.value === rawBrand || x.slug === rawBrand);
      if (b) resolvedBrandId = b.value;
    }
  }

  const bLabel = brandOptions.find((x) => x.value === resolvedBrandId)?.label;
  const mLabel = mainCatOptions.find((x) => x.value === resolvedMainCategoryId)?.label;
  const cLabel = catOptions.find((x) => x.value === resolvedCategoryId)?.label;
  const prefillHierarchy = [bLabel, mLabel, cLabel].filter(Boolean);
  const prefillSummary = prefillHierarchy.length > 0 ? prefillHierarchy.join(" › ") : "";

  const backHref = presetPostType
    ? `/r/posts?filter=${presetPostType}`
    : name === "products" && (rawBrand || rawSub)
      ? `/r/products?type=${brandScope || "SALON"}${rawBrand ? `&filter=${rawBrand}` : ""}${rawSub ? `&sub=${rawSub}` : ""}`
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
      : name === "products"
        ? {
            ...(resolvedBrandId ? { brandId: resolvedBrandId } : {}),
            ...(resolvedMainCategoryId ? { mainCategoryId: resolvedMainCategoryId } : {}),
            ...(resolvedCategoryId ? { categoryId: resolvedCategoryId } : {}),
          }
        : name === "categories"
          ? {
              ...(resolvedBrandId ? { brandId: resolvedBrandId } : {}),
              ...(resolvedMainCategoryId ? { mainCategoryId: resolvedMainCategoryId } : {}),
            }
          : name === "main-categories"
            ? {
                ...(resolvedBrandId ? { brandId: resolvedBrandId } : {}),
              }
            : undefined;

  const trail = [
    ...(prefillSummary ? [{ label: prefillSummary }] : []),
    { label: `เพิ่ม${noun}` },
  ];

  return (
    <>
      <SectionFlowBar currentKey={flowKey} trail={trail} />
      <PageHeader
        title={`เพิ่ม${noun}`}
        description={
          prefillSummary
            ? `กำหนดหมวดหมู่ให้อัตโนมัติ: ${prefillSummary} (ไม่ต้องเลือกเอง)`
            : undefined
        }
        back={{ href: backHref, label: backLabel }}
      />
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
