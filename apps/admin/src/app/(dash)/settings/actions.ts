"use server";

import { SETTING_KEYS, type SettingKey } from "@beautyup/types";
import { revalidatePath } from "next/cache";
import type { SaveResult } from "@/components/resource-form";
import { ApiError, api } from "@/lib/api";

export async function saveSetting(key: string, payload: Record<string, unknown>): Promise<SaveResult> {
  if (!SETTING_KEYS.includes(key as SettingKey)) return { ok: false, message: "Unknown setting" };

  // Bare-list settings are edited through a single unnamed field
  let body: unknown = "" in payload ? payload[""] : payload;
  // Blank region counts mean "count automatically", so leave them out
  if (key === "regionCounts") body = Object.fromEntries(Object.entries(payload).filter(([, v]) => v != null));

  try {
    await api(`/admin/settings/${key}`, { method: "PUT", body: JSON.stringify(body) });
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message, errors: e.errors };
    throw e;
  }
  revalidatePath("/settings");
  return { ok: true, message: "บันทึกการตั้งค่าแล้ว" };
}
