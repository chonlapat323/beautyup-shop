"use server";

import type { MemberProfile } from "@beautyup/types";
import { redirect } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/i18n";
import { clearMemberSession, memberApi, setMemberSession } from "@/lib/member";

export interface MemberFormState {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
}

type Session = { accessToken: string; member: MemberProfile };

const langOf = (fd: FormData): Locale => {
  const l = String(fd.get("lang"));
  return isLocale(l) ? l : "th";
};

function messageFor(lang: Locale, status: number, code?: string) {
  const d = getDictionary(lang).member;
  if (status === 429) return d.tooMany;
  if (code === "INVALID_LOGIN") return d.invalidLogin;
  if (code === "EMAIL_TAKEN") return d.emailTaken;
  if (code === "EMAIL_USES_GOOGLE") return d.emailUsesGoogle;
  if (code === "INVALID_GOOGLE") return d.googleFailed;
  if (status === 503) return d.googleNotConfigured;
  return d.failed;
}

/** First message per field, keyed by field name. */
const fieldErrors = (errors?: Record<string, string[]>) =>
  errors ? Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]])) : undefined;

export async function registerMember(_prev: MemberFormState, fd: FormData): Promise<MemberFormState> {
  const lang = langOf(fd);
  const d = getDictionary(lang);
  const values = { name: String(fd.get("name") ?? ""), email: String(fd.get("email") ?? "") };
  if (fd.get("consent") !== "on") return { message: d.member.consentRequired, values };

  const res = await memberApi<Session>(
    "/register",
    { method: "POST", body: JSON.stringify({ ...values, password: fd.get("password"), locale: lang }) },
    false,
  );
  if (!res.ok || !res.data) {
    const errors = fieldErrors(res.errors);
    if (errors?.password) errors.password = d.member.passwordHint;
    return { message: res.errors ? d.form.check : messageFor(lang, res.status, res.code), errors, values };
  }
  await setMemberSession(res.data.accessToken);
  redirect(`/${lang}/account`);
}

export async function loginMember(_prev: MemberFormState, fd: FormData): Promise<MemberFormState> {
  const lang = langOf(fd);
  const values = { email: String(fd.get("email") ?? "") };
  const res = await memberApi<Session>(
    "/login",
    { method: "POST", body: JSON.stringify({ ...values, password: fd.get("password") }) },
    false,
  );
  if (!res.ok || !res.data) {
    return { message: messageFor(lang, res.status, res.errors ? "INVALID_LOGIN" : res.code), values };
  }
  await setMemberSession(res.data.accessToken);
  redirect(`/${lang}/account`);
}

/** Called by the Google button with the ID token from Google Identity Services. */
export async function googleSignIn(credential: string, lang: string): Promise<{ ok: boolean; message?: string }> {
  const locale: Locale = isLocale(lang) ? lang : "th";
  const res = await memberApi<Session>("/google", { method: "POST", body: JSON.stringify({ credential, locale }) }, false);
  if (!res.ok || !res.data) return { ok: false, message: messageFor(locale, res.status, res.code) };
  await setMemberSession(res.data.accessToken);
  return { ok: true };
}

export async function updateProfile(_prev: MemberFormState, fd: FormData): Promise<MemberFormState> {
  const lang = langOf(fd);
  const d = getDictionary(lang);
  const body = Object.fromEntries(["name", "phone", "shopName", "province"].map((k) => [k, String(fd.get(k) ?? "")]));
  const res = await memberApi<MemberProfile>("/me", { method: "PUT", body: JSON.stringify(body) });
  if (res.status === 401) redirect(`/${lang}/login`);
  if (!res.ok) return { message: res.errors ? d.form.check : d.member.failed, errors: fieldErrors(res.errors), values: body };
  return { ok: true, message: d.member.saved, values: body };
}

export async function logoutMember(lang: string) {
  await clearMemberSession();
  redirect(`/${isLocale(lang) ? lang : "th"}`);
}
