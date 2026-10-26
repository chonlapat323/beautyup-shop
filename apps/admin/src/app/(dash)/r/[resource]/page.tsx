import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionFlowBar } from "@/components/section-flow-bar";
import { resourceUi } from "@/lib/fields";
import { listResource, resolveResource } from "@/lib/resources";

export async function generateMetadata({ params }: PageProps<"/r/[resource]">): Promise<Metadata> {
  return { title: resourceUi[resolveResource((await params).resource)].title };
}

export default async function ResourceListPage({ params, searchParams }: PageProps<"/r/[resource]">) {
  const name = resolveResource((await params).resource);
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.max(5, Math.min(100, Number(sp.limit) || 20));

  const ui = resourceUi[name];
  const allRows = await listResource(name, query);
  const total = allRows.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = allRows.slice((safePage - 1) * limit, safePage * limit);

  const startItem = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endItem = Math.min(safePage * limit, total);

  // Helper to build page link
  const buildPageHref = (p: number, l: number = limit) => {
    const pms = new URLSearchParams();
    if (query) pms.set("q", query);
    if (p > 1) pms.set("page", String(p));
    if (l !== 20) pms.set("limit", String(l));
    const qs = pms.toString();
    return qs ? `/r/${name}?${qs}` : `/r/${name}`;
  };

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
      <SectionFlowBar currentKey={name} />
      <PageHeader
        title={ui.title}
        description={ui.description ?? `ทั้งหมด ${total} รายการ`}
        actions={
          <Link href={`/r/${name}/new`} className="btn btn-primary">
            <Plus className="size-4" /> เพิ่ม{ui.noun}
          </Link>
        }
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {ui.searchable ? (
          <form className="relative max-w-sm flex-1 min-w-[200px]" role="search">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input name="q" defaultValue={query} placeholder="ค้นหา..." aria-label={`ค้นหา${ui.title}`} className="input !pl-9" type="search" />
            {limit !== 20 && <input type="hidden" name="limit" value={limit} />}
          </form>
        ) : <div />}

        {total > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>แถวต่อหน้า:</span>
            <div className="inline-flex rounded-lg border border-line bg-white p-0.5 text-xs">
              {[10, 20, 50].map((size) => (
                <Link
                  key={size}
                  href={buildPageHref(1, size)}
                  className={`rounded-md px-2 py-1 font-medium transition-colors ${
                    limit === size ? "bg-brand text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {size}
                </Link>
              ))}
            </div>
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
              href={buildPageHref(safePage - 1)}
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
                    href={buildPageHref(Number(p))}
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
              href={buildPageHref(safePage + 1)}
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
