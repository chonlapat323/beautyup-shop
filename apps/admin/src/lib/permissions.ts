import "server-only";

import { api, getMe } from "@/lib/api";
import {
  hasPermission,
  type AdminModuleKey,
  type Role,
  type RolePermissions,
} from "@beautyup/types";

export function getResourceModuleKey(
  resource: string,
  brandScope?: "SALON" | "COUNTER" | string,
): AdminModuleKey {
  if (resource === "inquiries") return "inquiries";
  if (resource === "media" || resource === "media-categories") return "media";
  if (resource === "posts") return "posts";
  if (resource.startsWith("forum")) return "forum";
  if (resource === "members") return "members";
  if (resource === "users") return "users";
  if (resource === "settings") return "settings";
  if (resource === "shopPage" || brandScope === "COUNTER") return "counter-products";
  if (brandScope === "SALON") return "salon-products";
  if (["brands", "main-categories", "categories", "products"].includes(resource)) {
    return "salon-products";
  }
  return "menu-items";
}

export async function getUserPermissions() {
  const me = await getMe();
  const settings = await api<Record<string, unknown>>("/admin/settings").catch(() => ({} as Record<string, unknown>));
  const rolePermissions = settings.rolePermissions as RolePermissions | undefined;
  return {
    me,
    rolePermissions,
    can: (module: AdminModuleKey, action: "view" | "create" | "update" | "delete") =>
      hasPermission(rolePermissions, me.role as Role, module, action),
  };
}
