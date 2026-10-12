"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, api } from "@/lib/api";

export async function updateInquiry(id: string, data: { status: string; note: string }) {
  try {
    await api(`/admin/inquiries/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteInquiry(id: string) {
  try {
    await api(`/admin/inquiries/${id}`, { method: "DELETE" });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
  revalidatePath("/", "layout");
  redirect("/inquiries");
}
