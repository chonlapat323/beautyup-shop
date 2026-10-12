"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm({ devLogin }: { devLogin?: { email: string; password: string } }) {
  const [state, action, pending] = useActionState(login, { error: "", email: devLogin?.email ?? "" });

  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">อีเมล</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="input" defaultValue={state.email} key={state.email} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">รหัสผ่าน</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" autoFocus={!!state.error} defaultValue={devLogin?.password} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {devLogin && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">โหมดพัฒนา: เติมบัญชีทดสอบให้อัตโนมัติ (ตั้งค่าใน .env.local)</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending && <Loader2 className="size-4 animate-spin" />}
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
