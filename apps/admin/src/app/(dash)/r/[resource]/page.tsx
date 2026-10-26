import type { ResourceName } from "@beautyup/types";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionFlowBar, type BreadcrumbItem } from "@/components/section-flow-bar";
import { brandTypeLabels, departmentLabels, postTypeLabels, regionLabels, resourceUi } from "@/lib/fields";
import { listResource, resolveResource, type Row } from "@/lib/resources";

export async function generateMetadata({ params }: PageProps<"/r/[resource]">): Promise<Metadata> {
  return { title: resourceUi[resolveResource((await params).resource)].title };
}

type FilterOption = { value: string; label: string; count: number };

function localizedLabel(val: unknown): string {
  if (!val) return "";
  if (typeof val === "object") {
    const o = val as { th?: string; en?: string };
    return o.th || o.en || "";
  }
  return String(val);
}

function extractFilters(name: ResourceName, rows: Row[], activeFilter: string) {
  let primaryLabel = "";
  const primaryMap = new Map<string, FilterOption>();
  let subLabel = "";
  const subMap = new Map<string, FilterOption>();

  const bump = (map: Map<string, FilterOption>, value: string, label: string) => {
    if (!value || !label) return;
    const prev = map.get(value);
    if (prev) prev.count += 1;
    else map.set(value, { value, label, count: 1 });
  };

  for (const r of rows) {
    if (name === "menu-items") {
      primaryLabel = "กลุ่มเมนู";
      if (!r.parentId) {
        bump(primaryMap, "__root__", "เมนูหลัก (บนหัวเว็บ)");
      } else {
        const p = r.parent as { id?: string; label?: unknown } | undefined;
        bump(primaryMap, String(r.parentId), `ใต้เมนู: ${localizedLabel(p?.label) || r.parentId}`);
      }
    } else if (name === "brands") {
      primaryLabel = "ประเภทแบรนด์";
      const t = String(r.type ?? "");
      bump(primaryMap, t, brandTypeLabels[t] ?? t);
    } else if (name === "main-categories" || name === "categories" || name === "products") {
      primaryLabel = "แบรนด์";
      const b = r.brand as { slug?: string; name?: string } | undefined;
      if (b?.slug && b?.name) bump(primaryMap, b.slug, b.name);

      // Sub-filter (only count rows matching primary filter if set)
      const matchesPrimary = !activeFilter || b?.slug === activeFilter;
      if (matchesPrimary && name === "categories") {
        subLabel = "หมวดหมู่หลัก";
        const mc = r.mainCategory as { slug?: string; name?: unknown } | undefined;
        if (mc?.slug) bump(subMap, mc.slug, localizedLabel(mc.name) || mc.slug);
      } else if (matchesPrimary && name === "products") {
        subLabel = "คอลเลกชัน";
        const c = r.categoryRel as { slug?: string; name?: unknown } | undefined;
        if (c?.slug) bump(subMap, c.slug, localizedLabel(c.name) || c.slug);
      }
    } else if (name === "salons") {
      primaryLabel = "ภูมิภาค";
      const reg = String(r.region ?? "");
      bump(primaryMap, reg, regionLabels[reg] ?? reg);
    } else if (name === "team") {
      primaryLabel = "ฝ่าย";
      const dep = String(r.department ?? "");
      bump(primaryMap, dep, departmentLabels[dep] ?? dep);
    } else if (name === "posts") {
      primaryLabel = "ประเภท";
      const pt = String(r.type ?? "");
      bump(primaryMap, pt, postTypeLabels[pt] ?? pt);
    } else if (name === "media") {
      primaryLabel = "แบรนด์";
      const brands = (r.brands as { slug?: string; name?: string }[] | undefined) ?? [];
      for (const b of brands) {
        if (b?.slug && b?.name) bump(primaryMap, b.slug, b.name);
      }
      subLabel = "หมวดหมู่มีเดีย";
      const cat = r.category as { slug?: string; name?: unknown } | undefined;
      if (cat?.slug) bump(subMap, cat.slug, localizedLabel(cat.name) || cat.slug);
    } else if (name === "forum-topics") {
      primaryLabel = "หมวดหมู่ฟอรั่ม";
      const cat = r.category as { slug?: string; name?: unknown } | undefined;
      if (cat?.slug) bump(primaryMap, cat.slug, localizedLabel(cat.name) || cat.slug);
    }
  }

  return {
    primaryLabel,
    primaryOptions: [...primaryMap.values()],
    subLabel,
    subOptions: [...subMap.values()],
  };
}

function rowMatchesFilters(name: ResourceName, r: Row, filter: string, sub: string, status: string): boolean {
  if (status === "active") {
    if ("isActive" in r && !r.isActive) return false;
    if ("publishedAt" in r && (!r.publishedAt || new Date(String(r.publishedAt)) > new Date())) return false;
  } else if (status === "inactive") {
    if ("isActive" in r && r.isActive) return false;
    if ("publishedAt" in r && r.publishedAt && new Date(String(r.publishedAt)) <= new Date()) return false;
  }

  if (filter) {
    if (name === "menu-items") {
      if (filter === "__root__" && r.parentId) return false;
      if (filter !== "__root__" && String(r.parentId ?? "") !== filter && String(r.id) !== filter) return false;
    } else if (name === "brands") {
      if (String(r.type ?? "") !== filter) return false;
    } else if (name === "main-categories" || name === "categories" || name === "products") {
      const b = r.brand as { id?: string; slug?: string } | undefined;
      if (b?.slug !== filter && b?.id !== filter && String(r.brandId ?? "") !== filter) return false;
    } else if (name === "salons") {
      if (String(r.region ?? "") !== filter) return false;
    } else if (name === "team") {
      if (String(r.department ?? "") !== filter) return false;
    } else if (name === "posts") {
      if (String(r.type ?? "") !== filter) return false;
    } else if (name === "media") {
      const brands = (r.brands as { id?: string; slug?: string }[] | undefined) ?? [];
      if (!brands.some((b) => b.slug === filter || b.id === filter)) return false;
    } else if (name === "forum-topics") {
      const cat = r.category as { id?: string; slug?: string } | undefined;
      if (cat?.slug !== filter && cat?.id !== filter && String(r.categoryId ?? "") !== filter) return false;
    }
  }

  if (sub) {
    if (name === "categories") {
      const mc = r.mainCategory as { id?: string; slug?: string } | undefined;
      if (mc?.slug !== sub && mc?.id !== sub && String(r.mainCategoryId ?? "") !== sub) return false;
    } else if (name === "products") {
      const c = r.categoryRel as { id?: string; slug?: string } | undefined;
      if (c?.slug !== sub && c?.id !== sub && String(r.categoryId ?? "") !== sub) return false;
    } else if (name === "media") {
      const cat = r.category as { id?: string; slug?: string } | undefined;
      if (cat?.slug !== sub && cat?.id !== sub && String(r.categoryId ?? "") !== sub) return false;
    }
  }

  return true;
}

export default async function ResourceListPage({ params, searchParams }: PageProps<"/r/[resource]">) {
  const name = resolveResource((await params).resource);
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q : "";
  const filter = typeof sp.filter === "string" ? sp.filter : (typeof sp.brand === "string" ? sp.brand : "");
  const sub = typeof sp.sub === "string" ? sp.sub : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(5, Math.min(100, Number(sp.limit) || 20));

  const ui = resourceUi[name];
  const allRows = await listResource(name, query);
  const { primaryLabel, primaryOptions, subLabel, subOptions } = extractFilters(name, allRows, filter);
  const filteredRows = allRows.filter((r) => rowMatchesFilters(name, r, filter, sub, status));

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice((safePage - 1) * limit, safePage * limit);

  const startItem = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endItem = Math.min(safePage * limit, total);

  const buildHref = (overrides: { q?: string; filter?: string; sub?: string; status?: string; page?: number; limit?: number }) => {
    const pms = new URLSearchParams();
    const nextQ = overrides.q !== undefined ? overrides.q : query;
    const nextFilter = overrides.filter !== undefined ? overrides.filter : filter;
    const nextSub = overrides.sub !== undefined ? overrides.sub : sub;
    const nextStatus = overrides.status !== undefined ? overrides.status : status;
    const nextPage = overrides.page !== undefined ? overrides.page : 1;
    const nextLimit = overrides.limit !== undefined ? overrides.limit : limit;

    if (nextQ) pms.set("q", nextQ);
    if (nextFilter) pms.set("filter", nextFilter);
    if (nextSub) pms.set("sub", nextSub);
    if (nextStatus) pms.set("status", nextStatus);
    if (nextPage > 1) pms.set("page", String(nextPage));
    if (nextLimit !== 20) pms.set("limit", String(nextLimit));
    const qs = pms.toString();
    return qs ? `/r/${name}?${qs}` : `/r/${name}`;
  };

  // Breadcrumb trail for active filters
  const activePrimary = primaryOptions.find((o) => o.value === filter);
  const activeSub = subOptions.find((o) => o.value === sub);
  const trail: BreadcrumbItem[] = [];
  if (activePrimary) {
    trail.push({
      label: `${primaryLabel}: ${activePrimary.label}`,
      href: activeSub ? buildHref({ sub: "", page: 1 }) : undefined,
    });
  }
  if (activeSub) {
    trail.push({ label: `${subLabel}: ${activeSub.label}` });
  }
  if (query) {
    trail.push({ label: `ค้นหา "${query}"` });
  }

  // Generate page numbers
  const pageNumbers: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (safePage > 3) pageNumbers.push("...");
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (safePage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return (
    <>
      <SectionFlowBar currentKey={name} trail={trail} />

      <PageHeader
        title={ui.title}
        description={ui.description ?? `แสดง ${total} จากทั้งหมด ${allRows.length} รายการ`}
        actions={
          <Link href={`/r/${name}/new`} className="btn btn-primary">
            <Plus className="size-4" /> เพิ่ม{ui.noun}
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <div className="mb-4 rounded-2xl border border-line bg-white p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {ui.searchable ? (
            <form className="relative max-w-sm flex-1 min-w-[220px]" role="search">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <input name="q" defaultValue={query} placeholder={`ค้นหาใน${ui.title}...`} aria-label={`ค้นหา${ui.title}`} className="input !pl-9 !min-h-9 text-sm" type="search" />
              {filter && <input type="hidden" name="filter" value={filter} />}
              {sub && <input type="hidden" name="sub" value={sub} />}
              {status && <input type="hidden" name="status" value={status} />}
              {limit !== 20 && <input type="hidden" name="limit" value={limit} />}
            </form>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <Filter className="size-3.5 text-brand" /> ตัวกรองข้อมูล ({total}/{allRows.length} รายการ)
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="inline-flex items-center rounded-lg border border-line bg-mist/60 p-0.5 text-xs">
              {[
                { key: "", label: "ทุกสถานะ" },
                { key: "active", label: "แสดงบนเว็บ" },
                { key: "inactive", label: "ซ่อน / ร่าง" },
              ].map((st) => (
                <Link
                  key={st.key}
                  href={buildHref({ status: st.key, page: 1 })}
                  className={clsx(
                    "rounded-md px-2.5 py-1 font-medium transition-colors",
                    status === st.key ? "bg-white text-brand shadow-2xs font-semibold" : "text-muted hover:text-ink",
                  )}
                >
                  {st.label}
                </Link>
              ))}
            </div>

            {total > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span className="hidden sm:inline">แถว:</span>
                <div className="inline-flex rounded-lg border border-line bg-white p-0.5 text-xs">
                  {[10, 20, 50].map((size) => (
                    <Link
                      key={size}
                      href={buildHref({ limit: size, page: 1 })}
                      className={clsx(
                        "rounded-md px-2 py-1 font-medium transition-colors",
                        limit === size ? "bg-brand text-white" : "text-muted hover:text-ink",
                      )}
                    >
                      {size}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary Filter Pills (e.g. Brand, Region, Menu Parent, Department, Type) */}
        {primaryOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-2.5 text-xs">
            <span className="mr-1 inline-flex items-center gap-1 font-semibold text-muted">
              <Filter className="size-3 text-brand" /> {primaryLabel}:
            </span>
            <Link
              href={buildHref({ filter: "", sub: "", page: 1 })}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium transition-colors",
                !filter ? "border-brand bg-brand text-white" : "border-line bg-mist/50 text-ink/80 hover:border-brand/50 hover:text-brand",
              )}
            >
              ทั้งหมด ({allRows.length})
            </Link>
            {primaryOptions.map((opt) => {
              const active = filter === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={buildHref({ filter: active ? "" : opt.value, sub: "", page: 1 })}
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium transition-colors",
                    active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink/80 hover:border-brand/50 hover:text-brand",
                  )}
                >
                  <span>{opt.label}</span>
                  <span className={clsx("rounded-full px-1.5 text-[10px]", active ? "bg-white/20 text-white" : "bg-sand text-muted")}>
                    {opt.count}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Secondary Sub-Filter Pills (e.g. Main Category or Collection) */}
        {subOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-2.5 text-xs">
            <span className="mr-1 font-semibold text-muted">{subLabel}:</span>
            <Link
              href={buildHref({ sub: "", page: 1 })}
              className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium transition-colors",
                !sub ? "border-ink bg-ink text-white" : "border-line bg-mist/50 text-ink/80 hover:border-ink/40",
              )}
            >
              ทั้งหมด
            </Link>
            {subOptions.map((opt) => {
              const active = sub === opt.value;
              return (
                <Link
                  key={opt.value}
                  href={buildHref({ sub: active ? "" : opt.value, page: 1 })}
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-medium transition-colors",
                    active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/80 hover:border-ink/40",
                  )}
                >
                  <span>{opt.label}</span>
                  <span className={clsx("rounded-full px-1.5 text-[10px]", active ? "bg-white/20 text-white" : "bg-sand text-muted")}>
                    {opt.count}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Active filter reset bar */}
        {(filter || sub || status || query) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-2 text-xs text-muted">
            <span>
              พบข้อมูลที่ตรงกับตัวกรอง <strong className="text-ink">{total}</strong> รายการ (จากทั้งหมด {allRows.length} รายการ)
            </span>
            <Link
              href={`/r/${name}`}
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <X className="size-3.5" /> ล้างตัวกรองทั้งหมด
            </Link>
          </div>
        )}
      </div>

      <DataTable columns={ui.columns} rows={paginatedRows} hrefFor={(r) => `/r/${name}/${r.id}`} />

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3 sm:px-4 text-xs text-muted shadow-xs">
          <div>
            แสดง <span className="font-semibold text-ink">{startItem}–{endItem}</span> จาก <span className="font-semibold text-ink">{total}</span> รายการ
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={buildHref({ page: safePage - 1 })}
              aria-disabled={safePage === 1}
              className={`inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 font-medium transition-colors hover:bg-mist ${
                safePage === 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <ChevronLeft className="size-3.5" />
              <span>ก่อนหน้า</span>
            </Link>

            <div className="flex items-center gap-1">
              {pageNumbers.map((p, idx) =>
                p === "..." ? (
                  <span key={`e-${idx}`} className="px-1 text-muted">...</span>
                ) : (
                  <Link
                    key={`p-${p}`}
                    href={buildHref({ page: Number(p) })}
                    className={`grid size-7 place-items-center rounded-lg font-medium transition-colors ${
                      p === safePage ? "bg-brand text-white font-semibold" : "border border-line hover:bg-mist text-ink"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}
            </div>

            <Link
              href={buildHref({ page: safePage + 1 })}
              aria-disabled={safePage === totalPages}
              className={`inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 font-medium transition-colors hover:bg-mist ${
                safePage === totalPages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              <span>ถัดไป</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
