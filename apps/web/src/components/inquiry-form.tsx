"use client";

import clsx from "clsx";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/actions";
import type { Dictionary } from "@/i18n";
import { useDict, useLang } from "@/i18n/client";
import type { InquiryType } from "@/lib/types";

export interface FormField {
  name: string;
  /** Key of dict.form.fields */
  label: keyof Dictionary["form"]["fields"];
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  half?: boolean;
  autoComplete?: string;
}

export function InquiryForm({
  type,
  fields,
  submitLabel,
  typeOptions,
}: {
  type: InquiryType;
  fields: FormField[];
  submitLabel?: string;
  /** Lets the visitor choose the inquiry type (e.g. order / salon / course). */
  typeOptions?: InquiryType[];
}) {
  const dict = useDict().form;
  const lang = useLang();
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {
    ok: false,
  });
  const params = useSearchParams();
  const product = params.get("product");
  const course = params.get("course");
  const presetType: InquiryType = product ? "ORDER" : course ? "COURSE" : type;
  const presetMessage = product
    ? dict.interestedProduct(product)
    : course
      ? dict.interestedCourse(course)
      : "";

  if (state.ok) {
    return (
      <div role="status" className="rounded-3xl border border-line bg-white p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-12 text-accent" />
        <p className="mt-4 font-display text-2xl">{state.message}</p>
        <p className="mt-2 text-muted">{dict.successSub}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="relative rounded-3xl border border-line bg-white p-5 sm:p-8">
      <input type="hidden" name="lang" value={lang} />
      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="required" value={fields.filter((f) => f.required).map((f) => f.name).join(",")} />
      {typeOptions ? (
        <fieldset className="mb-6">
          <legend className="mb-3 text-sm font-medium">{dict.topic}</legend>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((value) => ({ value, label: dict.types[value as keyof typeof dict.types] ?? value })).map((o) => (
              <label key={o.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={o.value}
                  defaultChecked={o.value === presetType}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-accent">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <input type="hidden" name="type" value={type} />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const error = state.errors?.[f.name];
          const id = `f-${f.name}`;
          const common = {
            id,
            name: f.name,
            required: f.required,
            autoComplete: f.autoComplete,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${id}-error` : undefined,
            className: clsx("field", error && "!border-red-500"),
          };
          return (
            <div key={f.name} className={clsx(!f.half && "sm:col-span-2")}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
                {dict.fields[f.label]}
                {f.required && <span className="text-accent"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={5}
                  defaultValue={f.name === "message" ? presetMessage : undefined}
                />
              ) : f.type === "select" ? (
                <select {...common} defaultValue="">
                  <option value="" disabled>
                    {dict.choose(dict.fields[f.label])}
                  </option>
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input {...common} type={f.type ?? "text"} />
              )}
              {error && (
                <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="mt-5 text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full sm:w-auto sm:min-w-40">
        {pending && <Loader2 className="size-4 animate-spin" />}
        {submitLabel ?? dict.send}
      </button>
    </form>
  );
}
