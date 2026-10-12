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
      <PageHeader title="ผู้ใช้หลังบ้าน" description="ผู้ดูแลระบบ (ADMIN) จัดการผู้ใช้และการตั้งค่าได้ ทีมงาน (STAFF) แก้ไขเนื้อหาและตอบข้อความได้" />
      <UsersManager users={users} meId={me.id} />
    </>
  );
}
