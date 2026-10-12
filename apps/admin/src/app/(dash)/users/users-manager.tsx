"use client";

import clsx from "clsx";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { removeUser, saveUser } from "./actions";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  isActive: boolean;
}

type Draft = { id?: string; email: string; name: string; role: "ADMIN" | "STAFF"; password: string; isActive: boolean };
const blank: Draft = { email: "", name: "", role: "STAFF", password: "", isActive: true };

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
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <ul className="card divide-y divide-line self-start">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 px-4 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{u.name.slice(0, 1)}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {u.name} {u.id === meId && <span className="text-xs text-muted">(คุณ)</span>}
              </span>
              <span className="block truncate text-xs text-muted">{u.email}</span>
            </span>
            <span className={clsx("hidden rounded-full px-2 py-0.5 text-xs sm:inline", u.role === "ADMIN" ? "bg-ink text-white" : "bg-sand")}>{u.role === "ADMIN" ? "ผู้ดูแลระบบ" : "ทีมงาน"}</span>
            {!u.isActive && <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">ปิดใช้งาน</span>}
            <button type="button" className="btn btn-secondary !min-h-8 !px-3 text-xs" onClick={() => open(u)}>แก้ไข</button>
          </li>
        ))}
      </ul>

      <div className="self-start">
        {draft ? (
          <form onSubmit={submit} className="card space-y-4 p-5" noValidate>
            <h2 className="font-semibold">{draft.id ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}</h2>
            {field("name", "ชื่อ")}
            {field("email", "อีเมล", "email")}
            {field("password", draft.id ? "รหัสผ่านใหม่" : "รหัสผ่าน", "password", draft.id ? "เว้นว่างถ้าไม่ต้องการเปลี่ยน" : "อย่างน้อย 8 ตัวอักษร")}
            <div>
              <label htmlFor="u-role" className="mb-1 block text-sm font-medium">สิทธิ์</label>
              <select id="u-role" className="input" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as Draft["role"] })}>
                <option value="STAFF">ทีมงาน (STAFF)</option>
                <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
              </select>
            </div>
            <label className="flex min-h-10 items-center gap-3 text-sm">
              <input type="checkbox" className="size-5 accent-brand" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
              เปิดใช้งาน
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
            <Plus className="size-4" /> เพิ่มผู้ใช้
          </button>
        )}
      </div>
    </div>
  );
}
