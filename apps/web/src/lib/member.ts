import "server-only";
import type { MemberProfile } from "@beautyup/types";
import { cookies, headers } from "next/headers";

export const MEMBER_COOKIE = "bu_member";
const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export interface MemberApiResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  code?: string;
  errors?: Record<string, string[]>;
}

/** Calls /members/* on the API with the member's token (from the httpOnly cookie) and visitor IP. */
export async function memberApi<T>(path: string, init: RequestInit = {}, withToken = true): Promise<MemberApiResult<T>> {
  const h = new Headers(init.headers);
  h.set("Content-Type", "application/json");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) h.set("X-Forwarded-For", ip);
  if (withToken) {
    const token = (await cookies()).get(MEMBER_COOKIE)?.value;
    if (!token) return { ok: false, status: 401 };
    h.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${API_URL}/members${path}`, { ...init, headers: h, cache: "no-store" }).catch(() => null);
  if (!res) return { ok: false, status: 0 };
  const body = await res.json().catch(() => null);
  return res.ok
    ? { ok: true, status: res.status, data: body as T }
    : { ok: false, status: res.status, code: body?.code, errors: body?.errors };
}

/** The signed-in member, or null. */
export async function getMember(): Promise<MemberProfile | null> {
  const res = await memberApi<MemberProfile>("/me");
  return res.ok && res.data ? res.data : null;
}

export async function setMemberSession(token: string) {
  (await cookies()).set(MEMBER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearMemberSession() {
  (await cookies()).delete(MEMBER_COOKIE);
}
