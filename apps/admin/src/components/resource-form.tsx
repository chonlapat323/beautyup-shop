"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Field, Option } from "@/lib/fields";
import { FieldInput, defaults, missingEnglish, toPayload, type Errors, type Locale } from "./fields";

export interface SaveResult {
  ok: boolean;
  message?: string;
  errors?: Errors;
}

/** Generic bilingual form. `onSave` is a server action bound to the resource. */
export function ResourceForm({
  fields,
  initial,
  relations = {},
  onSave,
  redirectTo,
  submitLabel = "บันทึก",
  rootPath = "",
}: {
  fields: readonly Field[];
  initial?: Record<string, unknown>;
  relations?: Record<string, Option[]>;
  onSave: (payload: Record<string, unknown>) => Promise<SaveResult>;
  redirectTo?: string;
  submitLabel?: string;
  /** For settings whose value is a bare list (field name "") */
  rootPath?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...defaults(fields), ...initial }));
  const [locale, setLocale] = useState<Locale>("th");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const hasLocalized = JSON.stringify(fields).includes('"localized');
  const missing = missingEnglish(fields, values);
  const errorIn = (l: Locale) => Object.keys(errors).some((k) => k.endsWith(`.${l}`));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    start(async () => {
      const res = await onSave(toPayload(fields, values));
      setErrors(res.errors ?? {});
      if (res.ok) {
        if (redirectTo) {
          router.push(redirectTo);
          router.refresh();
        } else {
          setMessage({ ok: true, text: res.message ?? "บันทึกแล้ว" });
          router.refresh();
        }
      } else {
        setMessage({ ok: false, text: res.message ?? "บันทึกไม่สำเร็จ" });
        if (res.errors && Object.keys(res.errors).some((k) => k.endsWith(".th"))) setLocale("th");
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {hasLocalized && (
        <div className="sticky top-14 z-10 -mx-4 flex flex-wrap items-center gap-3 border-b border-line bg-mist/95 px-4 py-3 backdrop-blur sm:top-0 sm:mx-0 sm:rounded-xl sm:border sm:bg-white sm:px-3 sm:py-2">
          <div role="tablist" aria-label="ภาษาที่กำลังแก้ไข" className="flex rounded-lg bg-sand p-1">
            {(["th", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={locale === l}
                onClick={() => setLocale(l)}
                className={clsx(
                  "relative min-h-8 rounded-md px-4 text-sm font-medium transition-colors",
                  locale === l ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {l === "th" ? "ภาษาไทย" : "English"}
                {errorIn(l) && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-red-500" aria-label="มีข้อผิดพลาด" />}
              </button>
            ))}
          </div>
          {missing > 0 ? (
            <span className="text-xs text-amber-700">ยังไม่แปลภาษาอังกฤษ {missing} ช่อง</span>
          ) : (
            <span className="text-xs text-emerald-700">แปลครบทุกช่อง</span>
          )}
        </div>
      )}

      <div className="card grid gap-5 p-4 sm:p-6">
        {fields.map((f) => (
          <FieldInput
            key={f.name || "root"}
            field={f}
            value={f.name ? values[f.name] : values[""]}
            onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
            locale={locale}
            errors={errors}
            path={f.name || rootPath}
            relations={relations}
          />
        ))}
      </div>

      {message && (
        <p role={message.ok ? "status" : "alert"} className={clsx("rounded-lg px-3 py-2 text-sm", message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700")}>
          {message.text}
          {!message.ok && errors._ && <> — {errors._.join(", ")}</>}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 flex gap-2 border-t border-line bg-mist/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="submit" className="btn btn-primary min-w-32 flex-1 sm:flex-none" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </button>
        {redirectTo && (
          <button type="button" className="btn btn-secondary" onClick={() => router.push(redirectTo)}>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
