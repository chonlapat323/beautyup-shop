"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n";
import { FORUM_TAG } from "@/lib/data";

export interface ForumFormState {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
  /** What the visitor typed, so a failed post does not wipe the form */
  values?: Partial<Record<string, string>>;
}

const TEXT_FIELDS = ["category", "title", "body", "authorName"];

const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

/** Forwards the visitor's form (including photos) to the API. */
async function send(path: string, form: FormData, fields: string[]) {
  const body = new FormData();
  for (const key of [...fields, "website"]) {
    const v = form.get(key);
    if (typeof v === "string") body.append(key, v);
  }
  for (const file of form.getAll("images")) {
    if (file instanceof File && file.size > 0) body.append("images", file, file.name);
  }
  const h = await headers();
  return fetch(`${API_URL}/public/forum${path}`, {
    method: "POST",
    // So the API rate-limits per visitor, not per web server
    headers: { "X-Forwarded-For": h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "" },
    body,
  }).catch(() => null);
}

async function failure(res: Response | null, lang: Locale, form: FormData): Promise<ForumFormState> {
  const d = getDictionary(lang).forum;
  const values = Object.fromEntries(TEXT_FIELDS.map((k) => [k, String(form.get(k) ?? "")]));
  if (!res) return { ok: false, message: d.failed, values };
  if (res.status === 413) return { ok: false, message: d.tooLarge, values };
  const data = await res.json().catch(() => null);
  // API messages are Thai; English pages get the generic wording instead
  const errors = data?.errors
    ? Object.fromEntries(Object.entries(data.errors as Record<string, string[]>).map(([k, v]) => [k, lang === "th" ? v[0] : d.invalidField]))
    : undefined;
  const message = errors ? d.check : lang === "th" && typeof data?.message === "string" ? data.message : d.failed;
  return { ok: false, message, errors, values };
}

const langOf = (form: FormData): Locale => {
  const lang = String(form.get("lang"));
  return isLocale(lang) ? lang : "th";
};

export async function createTopic(_prev: ForumFormState, form: FormData): Promise<ForumFormState> {
  const lang = langOf(form);
  const res = await send("/topics", form, TEXT_FIELDS);
  if (!res?.ok) return failure(res, lang, form);
  const { id } = (await res.json()) as { id: string | null };
  updateTag(FORUM_TAG);
  redirect(id ? `/${lang}/forum/${id}` : `/${lang}/forum`);
}

export async function createReply(_prev: ForumFormState, form: FormData): Promise<ForumFormState> {
  const lang = langOf(form);
  const topicId = String(form.get("topicId") ?? "");
  const res = await send(`/topics/${encodeURIComponent(topicId)}/replies`, form, ["body", "authorName"]);
  if (!res?.ok) return failure(res, lang, form);
  updateTag(FORUM_TAG);
  return { ok: true, message: getDictionary(lang).forum.replied };
}
