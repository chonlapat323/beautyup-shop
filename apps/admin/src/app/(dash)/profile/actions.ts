"use server";

import { ApiError, api } from "@/lib/api";

export async function changeMyPassword(prevState: unknown, formData: FormData) {
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword) {
    return { ok: false, message: "กรุณาระบุรหัสผ่านปัจจุบัน" };
  }
  if (!newPassword || newPassword.length < 8) {
    return { ok: false, message: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร" };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, message: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน" };
  }

  try {
    const res = await api<{ ok: boolean; message?: string }>("/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return { ok: true, message: res.message || "เปลี่ยนรหัสผ่านสำเร็จแล้ว" };
  } catch (e) {
    if (e instanceof ApiError) {
      return { ok: false, message: e.message };
    }
    return { ok: false, message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" };
  }
}
