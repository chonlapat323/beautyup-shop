"use server";

import { headers } from "next/headers";
import { getDictionary, isLocale } from "@/i18n";
import type { InquiryType } from "@/lib/types";

export interface InquiryState {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
}

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";
const types: InquiryType[] = ["CONTACT", "ORDER", "SALON", "COURSE", "ISSUE", "PP_STUDIO"];
/** Columns on the Inquiry table; anything else goes into `data`. */
const columns = ["name", "phone", "email", "shopName", "province", "message"];

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const lang = String(formData.get("lang"));
  const dict = getDictionary(isLocale(lang) ? lang : "th").form;
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const type = get("type") as InquiryType;
  const required = get("required").split(",").filter(Boolean);

  const errors: Record<string, string> = {};
  for (const field of required) if (!get(field)) errors[field] = dict.required;
  const email = get("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = dict.invalidEmail;
  if (!types.includes(type)) errors.type = dict.required;
  if (Object.keys(errors).length) return { ok: false, errors, message: dict.check };

  const body: Record<string, unknown> = { type, data: { lang } };
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("$") || ["type", "required", "lang"].includes(k) || typeof v !== "string") continue;
    if (columns.includes(k)) body[k] = v.trim();
    else (body.data as Record<string, string>)[k] = v.trim();
  }
  // Honeypot passes through so the API can drop bot submissions
  body.website = get("website");

  const h = await headers();
  const res = await fetch(`${API_URL}/public/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // So the API rate-limits per visitor, not per web server
      "X-Forwarded-For": h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "",
    },
    body: JSON.stringify(body),
  }).catch(() => null);

  if (!res?.ok) {
    const data = await res?.json().catch(() => null);
    return { ok: false, message: res?.status === 429 ? data?.message : dict.failed };
  }
  return { ok: true, message: dict.success };
}
