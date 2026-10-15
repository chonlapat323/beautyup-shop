import { redirect } from "next/navigation";
import { api } from "@/lib/api";

export default async function ProductsPageAdmin() {
  try {
    const items = await api<Array<{ id: string; href: string }>>("/admin/resources/menu-items");
    const found = items.find((it) => it.href === "/products");
    if (found) {
      redirect(`/r/menu-items/${found.id}`);
    }
  } catch {
    // fallback
  }
  redirect("/r/menu-items/cmv50zm1w001ppg9icrnd2vsi");
}

