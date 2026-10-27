import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getMe } from "@/lib/api";
import { roleLabels, type Role } from "@beautyup/types";
import { ChangePasswordForm } from "./change-password-form";
import clsx from "clsx";
import { Mail, Shield, User } from "lucide-react";

export const metadata: Metadata = { title: "ข้อมูลบัญชีและเปลี่ยนรหัสผ่าน" };

const roleBadgeColor: Record<Role, string> = {
  ADMIN: "bg-ink text-white",
  MANAGER: "bg-purple-100 text-purple-800 border border-purple-200",
  EDITOR: "bg-amber-100 text-amber-800 border border-amber-200",
  STAFF: "bg-sand text-ink",
};

export default async function ProfilePage() {
  const me = await getMe();
  const roleName = roleLabels[me.role as Role] || me.role;
  const badgeClass = roleBadgeColor[me.role as Role] || "bg-sand text-ink";

  return (
    <>
      <PageHeader
        title="บัญชีผู้ใช้และเปลี่ยนรหัสผ่าน"
        description="ดูข้อมูลบัญชีผู้ใช้งานปัจจุบัน และเปลี่ยนรหัสผ่านความปลอดภัย"
      />

      <div className="space-y-6">
        {/* Account Info Card */}
        <div className="card max-w-xl p-6 sm:p-8">
          <h2 className="text-base font-semibold border-b border-line pb-3 mb-4">ข้อมูลบัญชีของคุณ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-sand text-muted">
                <User className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted">ชื่อ-นามสกุล</p>
                <p className="font-medium text-sm truncate">{me.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-sand text-muted">
                <Mail className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted">อีเมลเข้าสู่ระบบ</p>
                <p className="font-medium text-sm truncate">{me.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="grid size-9 place-items-center rounded-xl bg-sand text-muted">
                <Shield className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted mb-1">ระดับสิทธิ์ (Role)</p>
                <span className={clsx("inline-block rounded-full px-3 py-1 text-xs font-medium", badgeClass)}>
                  {roleName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <ChangePasswordForm />
      </div>
    </>
  );
}
