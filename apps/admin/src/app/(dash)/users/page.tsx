import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { api, getMe } from "@/lib/api";
import { UsersManager, type AdminUser } from "./users-manager";

export const metadata: Metadata = { title: "ผู้ใช้หลังบ้าน" };

export default async function UsersPage() {
  const me = await getMe();
  if (me.role !== "ADMIN") redirect("/");
  const users = await api<AdminUser[]>("/admin/users");

  return (
    <>
      <PageHeader
        title="ผู้ใช้หลังบ้านและการกำหนดสิทธิ์"
        description="ADMIN ดูแลระบบสูงสุดและจัดการผู้ใช้ · MANAGER จัดการสินค้าและเนื้อหา · EDITOR จัดการบทความและมีเดีย · STAFF ดูและตอบข้อความ"
      />
      <UsersManager users={users} meId={me.id} />
    </>
  );
}
