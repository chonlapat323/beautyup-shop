import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { api, getMe } from "@/lib/api";
import { DEFAULT_ROLE_PERMISSIONS, type RolePermissions } from "@beautyup/types";
import { PermissionsMatrix } from "./permissions-matrix";
import { UsersManager, type AdminUser } from "./users-manager";

export const metadata: Metadata = { title: "ผู้ใช้หลังบ้านและการกำหนดสิทธิ์" };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const me = await getMe();
  if (me.role !== "ADMIN") redirect("/");

  const { tab = "users" } = await searchParams;
  const [users, allSettings] = await Promise.all([
    api<AdminUser[]>("/admin/users"),
    api<Record<string, unknown>>("/admin/settings").catch(() => ({} as Record<string, unknown>)),
  ]);

  const rawPermissions = allSettings.rolePermissions as RolePermissions | undefined;
  const permissions: RolePermissions = {
    ...DEFAULT_ROLE_PERMISSIONS,
    ...(rawPermissions ?? {}),
  };

  return (
    <>
      <PageHeader
        title="ผู้ใช้หลังบ้านและการกำหนดสิทธิ์"
        description="ADMIN ดูแลระบบสูงสุดและจัดการผู้ใช้ · MANAGER จัดการสินค้าและเนื้อหา · EDITOR จัดการบทความและมีเดีย · STAFF ดูและตอบข้อความ"
      />

      {/* Navigation Tabs */}
      <nav aria-label="แท็บผู้ใช้และสิทธิ์" className="mb-6 flex gap-2 border-b border-line pb-3">
        <Link
          href="/users"
          className={clsx(
            "inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors",
            tab === "users" ? "bg-ink text-white shadow-sm" : "text-muted hover:bg-sand hover:text-ink",
          )}
        >
          รายชื่อผู้ใช้ ({users.length})
        </Link>
        <Link
          href="/users?tab=permissions"
          className={clsx(
            "inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors",
            tab === "permissions" ? "bg-ink text-white shadow-sm" : "text-muted hover:bg-sand hover:text-ink",
          )}
        >
          กำหนดสิทธิ์ตามบทบาท (Matrix)
        </Link>
      </nav>

      {tab === "permissions" ? (
        <PermissionsMatrix initialPermissions={permissions} />
      ) : (
        <UsersManager users={users} meId={me.id} />
      )}
    </>
  );
}
