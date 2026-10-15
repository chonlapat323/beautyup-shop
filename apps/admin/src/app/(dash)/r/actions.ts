"use server";

import { resources, type ResourceName } from "@beautyup/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SaveResult } from "@/components/resource-form";
import { ApiError, api } from "@/lib/api";
import { revalidateWeb } from "@/lib/revalidate-web";

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
  await revalidateWeb();
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
  await revalidateWeb();
  redirect(`/r/${resource}`);
}

export async function saveMenuItem(id: string | null, payload: Record<string, unknown>): Promise<SaveResult> {
  const { heroEyebrow, heroHeadline, heroLead, ...menuItemPayload } = payload;
  const res = await saveResource("menu-items", id, menuItemPayload);
  if (!res.ok) return res;

  if (payload.href === "/products") {
    try {
      const slides = Array.isArray(payload.slides) ? payload.slides : [];
      const sections = Array.isArray(payload.sections) ? payload.sections : [];
      const ovalSec = sections.find((s: any) => s.layout === "oval-carousel");

      const ovalItems = ovalSec?.cards
        ? ovalSec.cards.map((c: any) => ({
            imageUrl: c.imageUrl || "",
            title: c.title || { th: "", en: "" },
            formula: (typeof c.description === "object" ? c.description?.th : c.description) || "",
            description: c.description || { th: "", en: "" },
            href: c.href || "",
          }))
        : [];

      await api("/admin/settings/productsPage", {
        method: "PUT",
        body: JSON.stringify({
          showHero: true,
          heroEyebrow: heroEyebrow || undefined,
          heroHeadline: heroHeadline || undefined,
          heroLead: heroLead || undefined,
          showBannerSlides: true,
          slides,
          showOvalCarousel: true,
          ovalTitle: ovalSec?.title || undefined,
          ovalDescription: ovalSec?.description || undefined,
          ovalItems,
          sections,
        }),
      });

      await api("/admin/settings/salonHairSlides", {
        method: "PUT",
        body: JSON.stringify({
          heroEyebrow: heroEyebrow || undefined,
          heroHeadline: heroHeadline || undefined,
          heroLead: heroLead || undefined,
          slides,
          title: ovalSec?.title || undefined,
          description: ovalSec?.description || undefined,
          items: ovalItems,
        }),
      });
    } catch (err) {
      console.error("Failed to sync /products settings:", err);
    }
  }

  revalidatePath("/r/menu-items");
  revalidatePath("/settings");
  await revalidateWeb();
  return { ok: true, message: "บันทึกเรียบร้อยแล้ว" };
}
