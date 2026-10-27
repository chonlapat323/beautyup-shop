"use client";

import clsx from "clsx";
import { Loader2, Plus, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";
import type { Role } from "@beautyup/types";
import { removeUser, saveUser } from "./actions";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
}

type Draft = { id?: string; email: string; name: string; role: Role; password: string; isActive: boolean };
const blank: Draft = { email: "", name: "", role: "STAFF", password: "", isActive: true };

const roleInfo: Record<Role, { label: string; short: string; badge: string; desc: string }> = {
  ADMIN: {
    label: "ผู้ดูแลระบบสูงสุด (ADMIN)",
    short: "ผู้ดูแลระบบ",
    badge: "bg-ink text-white",
    desc: "เข้าถึงได้ทุกฟังก์ชัน จัดการผู้ใช้และการตั้งค่าระบบ",
  },
  MANAGER: {
    label: "ผู้จัดการระบบ (MANAGER)",
    short: "ผู้จัดการ",
    badge: "bg-purple-100 text-purple-800 border border-purple-200",
    desc: "จัดการสินค้า แบรนด์ เมนู และข้อความสอบถามได้ทั้งหมด",
  },
  EDITOR: {
    label: "ผู้ดูแลเนื้อหา (EDITOR)",
    short: "ผู้ดูแลเนื้อหา",
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
    desc: "จัดการหน้าเว็บ บทความ มีเดีย สไลด์ และฟอรั่ม",
  },
  STAFF: {
    label: "ทีมงานทั่วไป (STAFF)",
    short: "ทีมงาน",
    badge: "bg-sand text-ink",
    desc: "ดูและตอบข้อความสอบถาม และตรวจสอบสินค้า",
  },
};

export function UsersManager({ users, meId }: { users: AdminUser[]; meId: string }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();

  const open = (u?: AdminUser) => {
    setErrors({});
    setMessage("");
    setDraft(u ? { ...u, password: "" } : { ...blank });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    start(async () => {
      const res = await saveUser(draft);
      if (res.ok) setDraft(null);
      setErrors(res.errors ?? {});
      setMessage(res.ok ? "" : (res.message ?? ""));
    });
  };

  const field = (name: keyof Draft, label: string, type = "text", help?: string) => (
    <div>
      <label htmlFor={`u-${name}`} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={`u-${name}`}
        type={type}
        className="input"
        value={String(draft?.[name] ?? "")}
        autoComplete={type === "password" ? "new-password" : "off"}
        aria-invalid={errors[name] ? true : undefined}
        onChange={(e) => setDraft((d) => d && { ...d, [name]: e.target.value })}
      />
      {errors[name]?.map((m) => <p key={m} className="mt-1 text-xs text-red-600">{m}</p>) ?? (help && <p className="mt-1 text-xs text-muted">{help}</p>)}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <ul className="card divide-y divide-line self-start">
        {users.map((u) => {
          const r = roleInfo[u.role] || roleInfo.STAFF;
          return (
            <li key={u.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                {u.name.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {u.name} {u.id === meId && <span className="text-xs text-muted">(คุณ)</span>}
                </span>
                <span className="block truncate text-xs text-muted">{u.email}</span>
              </span>
              <span className={clsx("hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline", r.badge)}>
                {r.short}
              </span>
              {!u.isActive && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">ปิดใช้งาน</span>}
              <button type="button" className="btn btn-secondary !min-h-8 !px-3 text-xs" onClick={() => open(u)}>
                แก้ไข
              </button>
            </li>
          );
        })}
      </ul>

      <div className="self-start">
        {draft ? (
          <form onSubmit={submit} className="card space-y-4 p-5" noValidate>
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <ShieldCheck className="size-5 text-brand" />
              <h2 className="font-semibold">{draft.id ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}</h2>
            </div>
            {field("name", "ชื่อ-นามสกุล")}
            {field("email", "อีเมล", "email")}
            {field("password", draft.id ? "รหัสผ่านใหม่" : "รหัสผ่าน", "password", draft.id ? "เว้นว่างถ้าไม่ต้องการเปลี่ยน" : "อย่างน้อย 8 ตัวอักษร")}
            <div>
              <label htmlFor="u-role" className="mb-1 block text-sm font-medium">ระดับสิทธิ์ (Role)</label>
              <select
                id="u-role"
                className="input"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}
              >
                {(Object.keys(roleInfo) as Role[]).map((rKey) => (
                  <option key={rKey} value={rKey}>
                    {roleInfo[rKey].label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted">{roleInfo[draft.role]?.desc}</p>
            </div>
            <label className="flex min-h-10 items-center gap-3 text-sm">
              <input type="checkbox" className="size-5 accent-brand" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
              เปิดใช้งานบัญชีนี้
            </label>
            {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary flex-1" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                บันทึก
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setDraft(null)}>ยกเลิก</button>
            </div>
            {draft.id && draft.id !== meId && (
              <button
                type="button"
                className="btn btn-danger w-full"
                disabled={pending}
                onClick={() => {
                  if (!window.confirm(`ลบผู้ใช้ ${draft.email} ใช่หรือไม่?`)) return;
                  start(async () => {
                    const res = await removeUser(draft.id!);
                    if (res.ok) setDraft(null);
                    else setMessage(res.message ?? "");
                  });
                }}
              >
                ลบผู้ใช้
              </button>
            )}
          </form>
        ) : (
          <button type="button" className="btn btn-primary w-full" onClick={() => open()}>
            <Plus className="size-4" /> เพิ่มผู้ใช้ใหม่
          </button>
        )}
      </div>
    </div>
  );
}
