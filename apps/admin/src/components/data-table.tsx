import clsx from "clsx";
import { ChevronRight, ImageOff } from "lucide-react";
import Link from "next/link";
import type { Column } from "@/lib/fields";

type Row = Record<string, unknown> & { id: string };

function Cell({ col, row }: { col: Column; row: Row }) {
  const v = row[col.name];
  switch (col.kind) {
    case "image":
      return (
        <span className="relative block size-11">
          {v ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary upload host
            <img
              src={String(v)}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const ph = e.currentTarget.nextElementSibling as HTMLElement;
                if (ph) ph.style.display = "grid";
              }}
              className="size-11 rounded-lg border border-line bg-mist object-contain"
            />
          ) : null}
          <span
            style={{ display: v ? "none" : "grid" }}
            className="size-11 place-items-center rounded-lg border border-dashed border-line bg-mist/60 text-muted"
            title="ยังไม่มีรูปภาพ (รอจัดการรูป)"
          >
            <ImageOff className="size-4 text-muted/60" />
          </span>
        </span>
      );
    case "localized": {
      const l = (v ?? {}) as { th?: string; en?: string };
      return (
        <span className="block min-w-0">
          <span className="block truncate">{l.th || <em className="text-muted">ว่าง</em>}</span>
          <span className={clsx("block truncate text-xs", l.en ? "text-muted" : "text-amber-700")}>{l.en || "ยังไม่แปล EN"}</span>
        </span>
      );
    }
    case "boolean":
      return (
        <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs", v ? "bg-emerald-50 text-emerald-700" : "bg-sand text-muted")}>
          <span className={clsx("size-1.5 rounded-full", v ? "bg-emerald-500" : "bg-muted/50")} />
          {v ? "แสดง" : "ซ่อน"}
        </span>
      );
    case "price": {
      const sale = row.salePrice as number | null;
      return (
        <span className="whitespace-nowrap tabular-nums">
          {sale != null ? (
            <>
              <span className="text-brand">฿{sale.toLocaleString("th-TH")}</span>{" "}
              <span className="text-xs text-muted line-through">฿{Number(v).toLocaleString("th-TH")}</span>
            </>
          ) : (
            `฿${Number(v).toLocaleString("th-TH")}`
          )}
        </span>
      );
    }
    case "date":
      return v ? (
        <span className="whitespace-nowrap">{new Date(String(v)).toLocaleDateString("th-TH", { dateStyle: "medium" })}</span>
      ) : (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">ฉบับร่าง</span>
      );
    case "enum":
      return <span className="whitespace-nowrap">{col.enumLabels?.[String(v)] ?? String(v ?? "")}</span>;
    case "brand":
      return <span>{(v as { name?: string } | null)?.name ?? "—"}</span>;
    case "color":
      return <span className="inline-block size-6 rounded-full border border-line" style={{ background: String(v) }} />;
    default:
      return <span className="block truncate">{String(v ?? "")}</span>;
  }
}

export function DataTable({ columns, rows, hrefFor }: { columns: Column[]; rows: Row[]; hrefFor: (row: Row) => string }) {
  if (!rows.length) {
    return <p className="card p-10 text-center text-sm text-muted">ยังไม่มีข้อมูล</p>;
  }
  const [lead, ...rest] = columns;
  return (
    <>
      {/* Desktop table */}
      <div className="card hidden overflow-hidden md:block">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b border-line bg-mist text-left text-xs text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.name} scope="col" className={clsx("px-4 py-3 font-medium", c.kind === "image" && "w-20", (c.kind === "boolean" || c.kind === "color") && "w-24")}>
                  {c.label}
                </th>
              ))}
              <th className="w-10" aria-label="เปิด" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.id} className="group relative transition-colors hover:bg-mist">
                {columns.map((c, i) => (
                  <td key={c.name} className="px-4 py-3 align-middle">
                    {i === 0 || (columns[0].kind === "image" && i === 1) ? (
                      <Link href={hrefFor(row)} className="block min-w-0 after:absolute after:inset-0 focus-visible:outline-none">
                        <Cell col={c} row={row} />
                      </Link>
                    ) : (
                      <Cell col={c} row={row} />
                    )}
                  </td>
                ))}
                <td className="pr-4 text-muted transition-transform group-hover:translate-x-0.5">
                  <ChevronRight className="size-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-2 md:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <Link href={hrefFor(row)} className="card flex items-center gap-3 p-3 transition-colors hover:border-muted">
              {lead.kind === "image" && <Cell col={lead} row={row} />}
              <span className="min-w-0 flex-1 space-y-1 text-sm">
                {(lead.kind === "image" ? rest : columns).map((c) => (
                  <span key={c.name} className="block min-w-0">
                    <Cell col={c} row={row} />
                  </span>
                ))}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
