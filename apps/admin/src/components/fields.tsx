"use client";

import clsx from "clsx";
import { ArrowDown, ArrowUp, Check, Plus, Trash2, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import type { Field, Option } from "@/lib/fields";
import { ImageGallery, UploadBox, uploadHint, type UploadKind } from "./image-upload";
import { RichTextarea } from "./rich-textarea";

export type Locale = "th" | "en";
export type Errors = Record<string, string[]>;
type Value = unknown;
type Obj = Record<string, unknown>;

/* --------------------------------------------------------------- defaults */

export function defaultValue(field: Field): Value {
  switch (field.type) {
    case "localized":
    case "localizedTextarea":
      return { th: "", en: "" };
    case "boolean":
      return true;
    case "tags":
    case "list":
    case "productSizes":
    case "relations":
    case "images":
      return [];
    case "socials":
      return {};
    case "relation":
      return field.nullable ? null : "";
    case "color":
      return "#d6297f";
    default:
      return "";
  }
}

export function defaults(fields: readonly Field[]): Obj {
  return Object.fromEntries(fields.map((f) => [f.name, defaultValue(f)]));
}

/** Converts form state into what the API schema expects. */
export function toPayload(fields: readonly Field[], values: Obj): Obj {
  const out: Obj = { ...values };
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === "number") out[f.name] = v === "" || v == null ? (f.required ? undefined : null) : Number(v);
    if (f.type === "date") out[f.name] = v ? v : null;
    if (f.type === "relation" && f.nullable && !v) out[f.name] = null;
    if (f.type === "productSizes") {
      const arr = Array.isArray(v) ? v : [];
      const validSizes = arr
        .filter((item: any) => item && item.size !== "" && item.size != null)
        .map((item: any) => ({
          size: Number(item.size) || item.size,
          unit: "ML",
          price: Number(item.price) || 0,
        }));
      out[f.name] = validSizes;
      if (validSizes.length > 0) {
        out.price = validSizes[0].price;
      } else if (values.price != null && values.price !== "") {
        out.price = Number(values.price);
      } else {
        out.price = 0;
      }
      out.salePrice = null;
    }
  }
  return out;
}

/** Does the value miss an English translation anywhere? */
export function missingEnglish(fields: readonly Field[], values: Obj): number {
  let n = 0;
  for (const f of fields) {
    const v = values[f.name] as { th?: string; en?: string } | undefined;
    if ((f.type === "localized" || f.type === "localizedTextarea") && v?.th && !v.en) n++;
  }
  return n;
}

/* ---------------------------------------------------------------- wrapper */

function FieldShell({
  id,
  label,
  help,
  required,
  errors,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  required?: boolean;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium">
          {label}
          {required && <span className="text-brand"> *</span>}
        </label>
      )}
      {children}
      {help && !errors?.length && <p className="mt-1 text-xs text-muted">{help}</p>}
      {errors?.map((e) => (
        <p key={e} id={`${id}-err`} className="mt-1 text-xs text-red-600">
          {e}
        </p>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- renderer */

export function FieldInput({
  field,
  value,
  onChange,
  locale,
  errors,
  path,
  relations,
}: {
  field: Field;
  value: Value;
  onChange: (v: Value) => void;
  locale: Locale;
  errors: Errors;
  /** Dotted path of this field, used to match API error keys */
  path: string;
  relations: Record<string, Option[]>;
}) {
  const id = useId();
  const own = errors[path];
  const invalid = own?.length ? true : undefined;
  const shell = (children: ReactNode) => (
    <FieldShell id={id} label={field.label} help={field.help} required={"required" in field && field.required} errors={own}>
      {children}
    </FieldShell>
  );

  switch (field.type) {
    case "text":
    case "url":
      return shell(
        <input id={id} className="input" type={field.type === "url" ? "url" : "text"} value={(value as string) ?? ""} aria-invalid={invalid} onChange={(e) => onChange(e.target.value)} />,
      );

    case "textarea":
      return shell(
        <RichTextarea
          id={id}
          value={(value as string) ?? ""}
          invalid={invalid}
          minRows={4}
          onChange={(v) => onChange(v)}
        />,
      );

    case "number":
      return shell(
        <input id={id} className="input" type="number" inputMode="decimal" step={field.step ?? "1"} value={(value as string | number) ?? ""} aria-invalid={invalid} onChange={(e) => onChange(e.target.value)} />,
      );

    case "date":
      return shell(
        <input id={id} className="input" type="date" value={value ? String(value).slice(0, 10) : ""} aria-invalid={invalid} onChange={(e) => onChange(e.target.value)} />,
      );

    case "color":
      return shell(
        <div className="flex items-center gap-2">
          <input id={id} type="color" className="h-10 w-14 rounded-lg border border-line bg-white p-1" value={(value as string) || "#d6297f"} onChange={(e) => onChange(e.target.value)} />
          <input className="input max-w-36 font-mono" value={(value as string) ?? ""} aria-label={`${field.label} (hex)`} onChange={(e) => onChange(e.target.value)} />
        </div>,
      );

    case "boolean":
      return (
        <label className="flex min-h-10 items-center gap-3 text-sm">
          <input type="checkbox" className="size-5 accent-brand" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      );

    case "select":
    case "relation": {
      const options = field.type === "select" ? field.options : (relations[field.resource] ?? []);
      const allowEmpty = field.type === "relation" ? field.nullable : !field.required;
      return shell(
        <select id={id} className="input" value={(value as string) ?? ""} aria-invalid={invalid} onChange={(e) => onChange(e.target.value)}>
          {(allowEmpty || !value) && <option value="">{allowEmpty ? "— ไม่ระบุ —" : "— เลือก —"}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>,
      );
    }

    case "relations": {
      const selected = (value as string[]) ?? [];
      const options = relations[field.resource] ?? [];
      const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{field.label}</legend>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const on = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(o.value)}
                  className={clsx(
                    "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
                    on ? "border-brand bg-brand-soft font-medium text-brand" : "border-line bg-white hover:border-muted",
                  )}
                >
                  {on && <Check className="size-3.5" />}
                  {o.label}
                </button>
              );
            })}
          </div>
          {field.help && !own?.length && <p className="mt-1 text-xs text-muted">{field.help}</p>}
          {own?.map((e) => (
            <p key={e} className="mt-1 text-xs text-red-600">
              {e}
            </p>
          ))}
        </fieldset>
      );
    }

    case "localized":
    case "localizedTextarea": {
      const v = (value as { th?: string; en?: string }) ?? {};
      const err = errors[`${path}.${locale}`] ?? own;
      const other = locale === "th" ? "en" : "th";
      return (
        <FieldShell id={id} label={field.label} help={field.help} required={locale === "th" && field.required} errors={err}>
          {field.type === "localizedTextarea" ? (
            <RichTextarea
              id={id}
              lang={locale}
              placeholder={locale === "en" && v.th ? v.th : undefined}
              value={v[locale] ?? ""}
              invalid={err?.length ? true : undefined}
              minRows={5}
              onChange={(next) => onChange({ ...v, [locale]: next })}
            />
          ) : (
            <div className="relative">
              <input
                id={id}
                className="input"
                lang={locale}
                placeholder={locale === "en" && v.th ? v.th : undefined}
                value={v[locale] ?? ""}
                aria-invalid={err?.length ? true : undefined}
                onChange={(e) => onChange({ ...v, [locale]: e.target.value })}
              />
              <span className="pointer-events-none absolute top-2 right-2 rounded bg-sand px-1.5 py-0.5 text-[10px] font-semibold text-muted uppercase">{locale}</span>
            </div>
          )}
          {locale === "en" && v.th && !v.en && <p className="mt-1 text-xs text-amber-700">ยังไม่มีคำแปล จะแสดงภาษาไทยแทน</p>}
          {locale === "th" && v[other] && <p className="mt-1 truncate text-xs text-muted">EN: {v[other]}</p>}
        </FieldShell>
      );
    }

    case "tags":
      return shell(<TagsInput id={id} value={(value as string[]) ?? []} onChange={onChange} suggestions={field.suggestions} />);

    case "socials": {
      const v = (value as Record<string, string>) ?? {};
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{field.label}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {["facebook", "instagram", "tiktok", "youtube", "line"].map((k) => (
              <label key={k} className="block">
                <span className="mb-1 block text-xs text-muted capitalize">{k}</span>
                <input className="input" type="url" value={v[k] ?? ""} placeholder="https://" onChange={(e) => onChange({ ...v, [k]: e.target.value })} />
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    case "image":
    case "file":
      return shell(<UploadInput id={id} kind={field.type} value={(value as string) ?? ""} onChange={onChange} />);

    case "images":
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{field.label}</legend>
          <ImageGallery value={(value as string[]) ?? []} onChange={onChange} max={field.max} />
          {field.help && <p className="mt-1 text-xs text-muted">{field.help}</p>}
          {own?.map((e) => (
            <p key={e} className="mt-1 text-xs text-red-600">
              {e}
            </p>
          ))}
        </fieldset>
      );

    case "productSizes":
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{field.label}</legend>
          {field.help && <p className="-mt-1 mb-2 text-xs text-muted">{field.help}</p>}
          <ProductSizesInput id={id} value={(value as any) ?? []} onChange={onChange} />
        </fieldset>
      );

    case "list":
      return <ListInput field={field} value={(value as Value[]) ?? []} onChange={onChange} locale={locale} errors={errors} path={path} relations={relations} />;
  }
}

/* ----------------------------------------------------------- product sizes */

interface ProductSizeItem {
  size: number | string;
  unit?: string;
  price: number | string;
}

const COMMON_SIZES = [100, 250, 350, 500, 1000];

function ProductSizesInput({
  id: _id,
  value = [],
  onChange,
}: {
  id: string;
  value: ProductSizeItem[];
  onChange: (v: ProductSizeItem[]) => void;
}) {
  const list = Array.isArray(value) ? value : [];

  const add = (size: number | string = 100, price: number | string = "") => {
    onChange([...list, { size, unit: "ML", price }]);
  };

  const update = (idx: number, patch: Partial<ProductSizeItem>) => {
    onChange(list.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  const remove = (idx: number) => {
    onChange(list.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Quick Add Presets */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-muted text-[11px]">เพิ่มขนาดด่วน:</span>
        {COMMON_SIZES.map((ml) => (
          <button
            key={ml}
            type="button"
            onClick={() => add(ml)}
            className="rounded-md border border-line bg-mist px-2 py-0.5 font-medium text-muted hover:border-brand hover:text-brand transition-colors"
          >
            + {ml} ML
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <div className="space-y-2">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-xl border border-line bg-white p-2.5 shadow-2xs"
            >
              <span className="text-xs font-semibold text-muted w-6 text-center shrink-0">
                #{idx + 1}
              </span>

              {/* Size / Volume input */}
              <div className="flex items-center rounded-lg border border-line bg-mist/50 focus-within:border-brand focus-within:bg-white transition-colors flex-1 min-w-[130px]">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={item.size ?? ""}
                  placeholder="เช่น 100, 350"
                  onChange={(e) => update(idx, { size: e.target.value ? Number(e.target.value) : "" })}
                  className="w-full bg-transparent px-3 py-1.5 text-sm focus:outline-none"
                />
                <span className="border-l border-line px-2.5 py-1 text-xs font-semibold text-brand shrink-0">
                  ML
                </span>
              </div>

              {/* Price input */}
              <div className="flex items-center rounded-lg border border-line bg-mist/50 focus-within:border-brand focus-within:bg-white transition-colors flex-1 min-w-[140px]">
                <span className="border-r border-line px-2 text-xs text-muted shrink-0">
                  ฿
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price ?? ""}
                  placeholder="ราคา (บาท)"
                  onChange={(e) => update(idx, { price: e.target.value ? Number(e.target.value) : "" })}
                  className="w-full bg-transparent px-3 py-1.5 text-sm focus:outline-none"
                />
                <span className="border-l border-line px-2.5 py-1 text-xs text-muted shrink-0">
                  บาท
                </span>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                title="ลบขนาดนี้"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-mist/40 p-4 text-center text-xs text-muted">
          ยังไม่ได้เพิ่มขนาด (หากมีหลายขนาด เช่น 100 ML, 350 ML, 1000 ML สามารถกดปุ่มลัดด้านบนหรือกดเพิ่มขนาดด้านล่างได้เลยครับ)
        </div>
      )}

      <button
        type="button"
        onClick={() => add("", "")}
        className="btn btn-secondary !py-1.5 text-xs font-medium inline-flex items-center gap-1.5"
      >
        <Plus className="size-3.5" />
        เพิ่มขนาด / ปริมาณ (ML)
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------- tags */

function TagsInput({ id, value, onChange, suggestions = [] }: { id: string; value: string[]; onChange: (v: string[]) => void; suggestions?: string[] }) {
  const [draft, setDraft] = useState("");
  const add = (t: string) => {
    const tag = t.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };
  return (
    <div>
      <div className="input flex flex-wrap items-center gap-1.5 !py-1.5">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-md bg-sand px-2 py-0.5 text-sm">
            {t}
            <button type="button" aria-label={`ลบ ${t}`} className="rounded text-muted hover:text-red-600" onClick={() => onChange(value.filter((x) => x !== t))}>
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="min-w-24 flex-1 bg-transparent py-1 outline-none"
          value={draft}
          placeholder={value.length ? "" : "พิมพ์แล้วกด Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={() => draft && add(draft)}
        />
      </div>
      {suggestions.some((s) => !value.includes(s)) && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !value.includes(s))
            .map((s) => (
              <button key={s} type="button" className="rounded-md border border-dashed border-line px-2 py-0.5 text-xs text-muted hover:border-ink hover:text-ink" onClick={() => add(s)}>
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- uploads */

function UploadInput({ id, kind, value, onChange }: { id: string; kind: UploadKind; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <UploadBox value={value} onChange={onChange} kind={kind} className="size-28 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <input id={id} className="input text-sm" value={value} placeholder="หรือวางลิงก์ https://..." onChange={(e) => onChange(e.target.value)} />
        {value && (
          <button type="button" className="btn btn-danger !min-h-8 !px-3 text-xs" onClick={() => onChange("")}>
            ลบ
          </button>
        )}
        <p className="text-xs text-muted">คลิกหรือลากไฟล์มาวางที่กรอบ · {uploadHint(kind)}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- list */

function ListInput({
  field,
  value,
  onChange,
  locale,
  errors,
  path,
  relations,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Value[];
  onChange: (v: Value[]) => void;
  locale: Locale;
  errors: Errors;
  path: string;
  relations: Record<string, Option[]>;
}) {
  // A single unnamed sub-field means each item IS that value (e.g. a list of localized strings)
  const scalar = field.item.length === 1 && !field.item[0].name;
  const blank = () => (scalar ? defaultValue(field.item[0]) : defaults(field.item));
  const set = (i: number, v: Value) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const prefix = path ? `${path}.` : "";

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{field.label}</legend>
      {field.help && <p className="-mt-1 mb-2 text-xs text-muted">{field.help}</p>}
      <ol className="space-y-3">
        {value.map((item, i) => (
          <li key={i} className="rounded-xl border border-line bg-mist/60 p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted">#{i + 1}</span>
              <div className="flex gap-1">
                <IconBtn label="เลื่อนขึ้น" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp className="size-4" />
                </IconBtn>
                <IconBtn label="เลื่อนลง" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDown className="size-4" />
                </IconBtn>
                <IconBtn label="ลบรายการ" danger onClick={() => onChange(value.filter((_, j) => j !== i))}>
                  <Trash2 className="size-4" />
                </IconBtn>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {field.item.map((sub) => (
                <div key={sub.name || "value"} className={clsx(sub.type !== "text" && sub.type !== "number" && "sm:col-span-2")}>
                  <FieldInput
                    field={sub}
                    value={scalar ? item : (item as Obj)?.[sub.name]}
                    onChange={(v) => set(i, scalar ? v : { ...(item as Obj), [sub.name]: v })}
                    locale={locale}
                    errors={errors}
                    path={scalar ? `${prefix}${i}` : `${prefix}${i}.${sub.name}`}
                    relations={relations}
                  />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-secondary mt-3" onClick={() => onChange([...value, blank()])}>
        <Plus className="size-4" /> เพิ่ม{field.label}
      </button>
    </fieldset>
  );
}

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "grid size-8 place-items-center rounded-lg text-muted transition-colors disabled:opacity-30",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-white hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
