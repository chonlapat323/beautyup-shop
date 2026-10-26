"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, FileText, ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";

const TYPES = {
  image: {
    mime: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"],
    ext: [".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif"],
    hint: "JPG, PNG, WebP, AVIF, HEIC",
  },
  file: {
    mime: ["application/pdf"],
    ext: [".pdf"],
    hint: "PDF",
  },
} as const;
export type UploadKind = keyof typeof TYPES;
const MAX_BYTES = 10 * 1024 * 1024;

export const uploadHint = (kind: UploadKind) => `${TYPES[kind].hint} ไม่เกิน 10MB`;
const acceptFor = (kind: UploadKind) => [...TYPES[kind].mime, ...TYPES[kind].ext].join(",");

/** Uploads one file through the admin's /api/upload proxy and returns its public URL. */
export async function uploadFile(file: File, kind: UploadKind = "image"): Promise<string> {
  const lowerName = file.name.toLowerCase();
  const validMime = (TYPES[kind].mime as readonly string[]).includes(file.type.toLowerCase());
  const validExt = TYPES[kind].ext.some((ext) => lowerName.endsWith(ext));
  if (!validMime && !validExt) throw new Error(`${file.name}: รองรับเฉพาะ ${TYPES[kind].hint}`);
  if (file.size > MAX_BYTES) throw new Error(`${file.name}: ไฟล์ใหญ่เกิน 10MB`);
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.url) throw new Error(data?.message ? `${file.name}: ${data.message}` : `${file.name}: อัปโหลดไม่สำเร็จ`);
  return data.url as string;
}

const hasFiles = (e: DragEvent) => e.dataTransfer.types.includes("Files");

/**
 * One file: click, or drop a file onto the box. Shows progress and errors.
 * The box's size/shape comes from `className`; `empty` replaces the default placeholder.
 */
export function UploadBox({
  value,
  onChange,
  kind = "image",
  className,
  empty,
  fit = "contain",
}: {
  value: string;
  onChange: (url: string) => void;
  kind?: UploadKind;
  className?: string;
  empty?: ReactNode;
  /** "contain" shows the whole image (logos); "cover" fills the box (photos) */
  fit?: "contain" | "cover";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file, kind));
    } catch (e) {
      setError(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          setOver(false);
          upload(e.dataTransfer.files[0]);
        }}
        aria-label={value ? "เปลี่ยนไฟล์ (คลิกหรือลากไฟล์มาวาง)" : "อัปโหลดไฟล์ (คลิกหรือลากไฟล์มาวาง)"}
        className={clsx(
          "group relative grid place-items-center overflow-hidden rounded-xl border border-dashed text-muted transition-colors",
          over ? "border-brand bg-brand-soft text-brand" : "border-line bg-mist hover:border-brand hover:text-brand",
          className ?? "size-28",
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin" />
        ) : value && kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary upload host
          <img src={value} alt="" className={clsx("size-full", fit === "cover" ? "object-cover" : "object-contain")} />
        ) : value ? (
          <FileText className="size-8" />
        ) : (
          (empty ?? (
            <span className="flex flex-col items-center gap-1 p-2 text-center text-xs">
              <ImagePlus className="size-6" />
              {kind === "image" ? "ลากรูปมาวาง หรือคลิก" : "ลาก PDF มาวาง หรือคลิก"}
            </span>
          ))
        )}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input ref={input} type="file" hidden accept={acceptFor(kind)} onChange={(e) => upload(e.target.files?.[0])} />
    </div>
  );
}

/**
 * Many images in one box: drop or pick several files at once, drag a thumbnail to reorder,
 * × to remove. The first image is the cover.
 */
export function ImageGallery({ value, onChange, max = 20 }: { value: string[]; onChange: (urls: string[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  // Uploads finish after re-renders; always append to the newest list
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);
  const [pending, setPending] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const room = max - value.length - pending;

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files];
    const accepted = list.slice(0, Math.max(room, 0));
    const errs = list.length > accepted.length ? [`ใส่ได้สูงสุด ${max} รูป ไฟล์ที่เกินมาไม่ได้อัปโหลด`] : [];
    setErrors(errs);
    if (!accepted.length) return;
    setPending((n) => n + accepted.length);
    const results = await Promise.allSettled(accepted.map((f) => uploadFile(f)));
    setPending((n) => n - accepted.length);
    const urls = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    const failed = results.flatMap((r) => (r.status === "rejected" ? [r.reason instanceof Error ? r.reason.message : "อัปโหลดไม่สำเร็จ"] : []));
    if (failed.length) setErrors([...errs, ...failed]);
    if (urls.length) onChange([...latest.current, ...urls]);
    if (input.current) input.current.value = "";
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false);
        }}
        onDrop={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={clsx(
          "rounded-xl border border-dashed p-3 transition-colors",
          over ? "border-brand bg-brand-soft" : "border-line bg-mist/60",
        )}
      >
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {value.map((src, i) => (
            <li
              key={src + i}
              draggable
              onDragStart={(e) => {
                setDragIndex(i);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
              }}
              onDrop={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                move(dragIndex, i);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={clsx(
                "group relative aspect-square cursor-grab overflow-hidden rounded-lg border bg-white active:cursor-grabbing",
                dragIndex === i ? "border-brand opacity-50" : "border-line",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary upload host */}
              <img src={src} alt={`รูปที่ ${i + 1}`} className="size-full object-cover" draggable={false} />
              {i === 0 && <span className="absolute top-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-white">ปก</span>}
              <button
                type="button"
                aria-label={`ลบรูปที่ ${i + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-red-50 hover:text-red-600"
              >
                <X className="size-4" />
              </button>
              {/* Arrow buttons for keyboard and touch, where dragging is not available */}
              <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <button type="button" aria-label={`เลื่อนรูปที่ ${i + 1} ไปซ้าย`} disabled={i === 0} onClick={() => move(i, i - 1)} className="grid size-7 place-items-center rounded-full bg-white/90 shadow-sm disabled:invisible">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" aria-label={`เลื่อนรูปที่ ${i + 1} ไปขวา`} disabled={i === value.length - 1} onClick={() => move(i, i + 1)} className="grid size-7 place-items-center rounded-full bg-white/90 shadow-sm disabled:invisible">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </li>
          ))}
          {Array.from({ length: pending }, (_, i) => (
            <li key={`pending-${i}`} className="grid aspect-square place-items-center rounded-lg border border-line bg-white text-muted">
              <Loader2 className="size-6 animate-spin" />
            </li>
          ))}
          {room > 0 && (
            <li>
              <button
                type="button"
                onClick={() => input.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-white p-2 text-center text-xs text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <ImagePlus className="size-6" />
                เพิ่มรูป
              </button>
            </li>
          )}
        </ul>
        <p className="mt-3 text-xs text-muted">
          ลากรูปมาวางได้หลายรูปพร้อมกัน · ลากรูปเพื่อสลับลำดับ · รูปแรกเป็นรูปปก · {uploadHint("image")} · {value.length}/{max} รูป
        </p>
      </div>
      {errors.map((e) => (
        <p key={e} className="mt-1 text-xs text-red-600">
          {e}
        </p>
      ))}
      <input ref={input} type="file" multiple hidden accept={acceptFor("image")} onChange={(e) => add(e.target.files)} />
    </div>
  );
}
