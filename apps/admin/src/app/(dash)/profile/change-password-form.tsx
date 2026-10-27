"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";
import { changeMyPassword } from "./actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeMyPassword, null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="card max-w-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b border-line pb-4 mb-6">
        <div className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
          <KeyRound className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">เปลี่ยนรหัสผ่านบัญชี</h2>
          <p className="text-xs text-muted">กำหนดรหัสผ่านใหม่เพื่อความปลอดภัยในการเข้าใช้งานระบบ</p>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        {state?.ok && (
          <div role="status" className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            <span>{state.message}</span>
          </div>
        )}

        {state && !state.ok && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {state.message}
          </div>
        )}

        <div>
          <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium">
            รหัสผ่านปัจจุบัน <span className="text-brand">*</span>
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              autoComplete="current-password"
              className="input pr-10"
              placeholder="กรอกรหัสผ่านเดิมที่ใช้งานอยู่"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted hover:text-ink"
              aria-label={showCurrent ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">
            รหัสผ่านใหม่ <span className="text-brand">*</span>
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              className="input pr-10"
              placeholder="ความยาวอย่างน้อย 8 ตัวอักษร"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted hover:text-ink"
              aria-label={showNew ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">แนะนำให้ผสมตัวอักษรพิมพ์เล็ก-ใหญ่ และตัวเลข</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
            ยืนยันรหัสผ่านใหม่ <span className="text-brand">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input"
            placeholder="พิมพ์รหัสผ่านใหม่อีกครั้งให้ตรงกัน"
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                กำลังบันทึกรหัสผ่าน...
              </>
            ) : (
              <>
                <Lock className="size-4" />
                บันทึกรหัสผ่านใหม่
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
