import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { resourceUi } from "@/lib/fields";
import { listResource, resolveResource } from "@/lib/resources";

export async function generateMetadata({ params }: PageProps<"/r/[resource]">): Promise<Metadata> {
  return { title: resourceUi[resolveResource((await params).resource)].title };
}

export default async function ResourceListPage({ params, searchParams }: PageProps<"/r/[resource]">) {
  const name = resolveResource((await params).resource);
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const ui = resourceUi[name];
  const rows = await listResource(name, query);

  return (
    <>
      <PageHeader
        title={ui.title}
        description={ui.description ?? `ทั้งหมด ${rows.length} รายการ`}
        actions={
          <Link href={`/r/${name}/new`} className="btn btn-primary">
            <Plus className="size-4" /> เพิ่ม{ui.noun}
          </Link>
        }
      />
      {ui.searchable && (
        <form className="relative mb-4 max-w-sm" role="search">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={query} placeholder="ค้นหา..." aria-label={`ค้นหา${ui.title}`} className="input !pl-9" type="search" />
        </form>
      )}
      <DataTable columns={ui.columns} rows={rows} hrefFor={(r) => `/r/${name}/${r.id}`} />
    </>
  );
}
