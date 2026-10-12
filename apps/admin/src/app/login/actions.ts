"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, apiPublic } from "@/lib/api";

export interface LoginState {
  error: string;
  /** Echoed back because React resets the form after an action */
  email: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const { ok, status, body } = await apiPublic<{ accessToken?: string; message?: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: formData.get("password") }),
  });
  if (!ok || !body?.accessToken) {
    return { email, error: status === 401 ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : body?.message || "เข้าสู่ระบบไม่สำเร็จ" };
  }

  (await cookies()).set(SESSION_COOKIE, body.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
