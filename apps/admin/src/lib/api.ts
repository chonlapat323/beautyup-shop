import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "bu_admin";
const API_URL = process.env.API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

/**
 * Server-side fetch to apps/api with the admin's token from the httpOnly
 * cookie. The token never reaches browser JavaScript.
 */
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (res.status === 401) redirect("/login?expired=1");

  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(", ") : body?.message;
    if (res.status === 403) throw new ApiError(403, "ไม่มีสิทธิ์ทำรายการนี้ (สำหรับผู้ดูแลระบบเท่านั้น)");
    throw new ApiError(res.status, message || `เกิดข้อผิดพลาด (${res.status})`, body?.errors);
  }
  return body as T;
}

/** Unauthenticated call (login). */
export async function apiPublic<T>(path: string, init: RequestInit = {}): Promise<{ ok: boolean; status: number; body: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, body: (await res.json().catch(() => null)) as T };
}

export interface Me {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
}

export const getMe = () => api<Me>("/auth/me");

export function apiUrl() {
  return API_URL;
}
