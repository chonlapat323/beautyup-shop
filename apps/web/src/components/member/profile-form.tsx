"use client";

import type { MemberProfile } from "@beautyup/types";
import clsx from "clsx";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
import { useActionState, useTransition } from "react";
import { logoutMember, updateProfile } from "@/app/member-actions";
import { useDict, useLang } from "@/i18n/client";
import { LoadingImage } from "../loading-image";

export function ProfileForm({ member, provinces, since }: { member: MemberProfile; provinces: string[]; since: string }) {
  const d = useDict().member;
  const lang = useLang();
  const [state, action, pending] = useActionState(updateProfile, {});
  const [loggingOut, startLogout] = useTransition();
  const v = (k: "name" | "phone" | "shopName" | "province") => state.values?.[k] ?? member[k];
  const methods = [member.hasGoogle && "Google", member.hasPassword && d.email].filter(Boolean).join(", ");

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-line bg-white p-5 sm:p-6">
        {member.avatarUrl ? (
          <LoadingImage src={member.avatarUrl} alt="" referrerPolicy="no-referrer" loading="eager" className="size-14 rounded-full object-cover" />
        ) : (
          <span className="grid size-14 place-items-center rounded-full bg-blush font-display text-2xl text-brand-pink">
            {member.name.slice(0, 1)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{member.email}</p>
          <p className="text-sm text-muted">
            {d.memberSince(since)} · {d.signedInWith} {methods}
          </p>
        </div>
      </div>

      <form action={action} className="grid gap-5 rounded-3xl border border-line bg-white p-5 sm:grid-cols-2 sm:p-8">
        <input type="hidden" name="lang" value={lang} />
        {(
          [
            ["name", d.name, "name", true],
            ["phone", d.phone, "tel", false],
            ["shopName", d.shopName, "organization", false],
          ] as const
        ).map(([name, label, autoComplete, full]) => (
          <div key={name} className={clsx(full && "sm:col-span-2")}>
            <label htmlFor={`p-${name}`} className="mb-1.5 block text-sm font-medium">
              {label}
            </label>
            <input
              id={`p-${name}`}
              name={name}
              type={name === "phone" ? "tel" : "text"}
              autoComplete={autoComplete}
              required={name === "name"}
              defaultValue={v(name)}
              aria-invalid={state.errors?.[name] ? true : undefined}
              className="field"
            />
            {state.errors?.[name] && <p className="mt-1 text-sm text-red-600">{state.errors[name]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="p-province" className="mb-1.5 block text-sm font-medium">
            {d.province}
          </label>
          <select id="p-province" name="province" defaultValue={v("province")} className="field">
            <option value="">—</option>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={pending} className="btn btn-primary min-w-32">
            {pending && <Loader2 className="size-4 animate-spin" />}
            {d.save}
          </button>
          {state.message && (
            <p role="status" className={clsx("flex items-center gap-1.5 text-sm", state.ok ? "text-emerald-700" : "text-red-600")}>
              {state.ok && <CheckCircle2 className="size-4" />}
              {state.message}
            </p>
          )}
        </div>
      </form>

      <button
        type="button"
        disabled={loggingOut}
        onClick={() => startLogout(() => logoutMember(lang))}
        className="btn btn-outline"
      >
        {loggingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
        {d.logout}
      </button>
    </div>
  );
}
