"use server";

import { revalidatePath } from "next/cache";
import { ApiError, api } from "@/lib/api";

type Draft = { id?: string; email: string; name: string; role: string; password: string; isActive: boolean };

export async function saveUser(draft: Draft) {
  const { id, password, ...rest } = draft;
  try {
    await api(`/admin/users${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({ ...rest, ...(password || !id ? { password } : {}) }),
    });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message, errors: e.errors };
    throw e;
  }
  revalidatePath("/users");
  return { ok: true };
}

export async function removeUser(id: string) {
  try {
    await api(`/admin/users/${id}`, { method: "DELETE" });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
  revalidatePath("/users");
  return { ok: true };
}
