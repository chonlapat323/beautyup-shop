"use server";

import { resources, type ResourceName } from "@beautyup/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SaveResult } from "@/components/resource-form";
import { ApiError, api } from "@/lib/api";

function assertResource(name: string): asserts name is ResourceName {
  if (!Object.hasOwn(resources, name)) throw new Error("Unknown resource");
}

export async function saveResource(resource: string, id: string | null, payload: Record<string, unknown>): Promise<SaveResult> {
  assertResource(resource);
  try {
    await api(`/admin/resources/${resource}${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message, errors: e.errors };
    throw e;
  }
  revalidatePath(`/r/${resource}`);
  return { ok: true, message: "บันทึกแล้ว" };
}

export async function deleteResource(resource: string, id: string): Promise<{ ok: boolean; message?: string }> {
  assertResource(resource);
  try {
    await api(`/admin/resources/${resource}/${id}`, { method: "DELETE" });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message };
    throw e;
  }
  revalidatePath(`/r/${resource}`);
  redirect(`/r/${resource}`);
}
