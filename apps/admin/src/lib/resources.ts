import "server-only";
import { resources, type ResourceName } from "@beautyup/types";
import { notFound } from "next/navigation";
import { api } from "./api";
import { resourceUi, type Field, type Option } from "./fields";

export type Row = Record<string, unknown> & { id: string };

export function resolveResource(name: string): ResourceName {
  if (!Object.hasOwn(resources, name)) notFound();
  return name as ResourceName;
}

export const listResource = (name: ResourceName, q?: string) =>
  api<Row[]>(`/admin/resources/${name}${q ? `?q=${encodeURIComponent(q)}` : ""}`);

export const getResource = (name: ResourceName, id: string) => api<Row>(`/admin/resources/${name}/${id}`);

/** Options for every relation field used by these fields. */
export async function loadRelations(fields: readonly Field[], excludeId?: string): Promise<Record<string, Option[]>> {
  const targets = [...new Set(fields.flatMap((f) => (f.type === "relation" || f.type === "relations" ? [f.resource] : [])))];
  const entries = await Promise.all(
    targets.map(async (r) => {
      let rows = await listResource(r);
      // Menus only nest one level: offer top-level items as parents, never itself
      if (r === "menu-items") rows = rows.filter((x) => !x.parentId && x.id !== excludeId);
      return [r, rows.map((x) => ({ value: x.id, label: rowTitle(r, x) }))] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export function rowTitle(name: ResourceName, row: Row): string {
  const v = row[resourceUi[name].titleField];
  if (v && typeof v === "object") {
    const l = v as { th?: string; en?: string };
    return l.th || l.en || "(ไม่มีชื่อ)";
  }
  return String(v ?? "(ไม่มีชื่อ)");
}
