"use client";

import clsx from "clsx";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { createReply, createTopic, type ForumFormState } from "@/app/forum-actions";
import { useDict, useLang } from "@/i18n/client";

const MAX_IMAGES = 4;
const MAX_SIDE = 1600;

type Photo = { file: File; url: string };

/** Phone photos are often 3-8MB; send a 1600px JPEG instead. Falls back to the original if the browser can't decode it. */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  return blob ? new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
}

type Props =
  | { mode: "topic"; categories: { slug: string; name: string }[]; defaultCategory?: string; defaultName?: string }
  | { mode: "reply"; topicId: string; defaultName?: string };

export function ForumForm(props: Props) {
  const d = useDict().forum;
  const lang = useLang();
  // The ref is what the submit reads; the state drives the previews
  const photosRef = useRef<Photo[]>([]);
  const [photos, setPhotosState] = useState<Photo[]>([]);
  const setPhotos = (next: Photo[]) => {
    photosRef.current = next;
    setPhotosState(next);
  };
  const [preparing, setPreparing] = useState(false);

  const submit = props.mode === "topic" ? createTopic : createReply;
  const [state, action, pending] = useActionState<ForumFormState, FormData>(async (prev, data) => {
    // Photos are attached here: React resets the form (and any file input) after each submit
    for (const p of photosRef.current) data.append("images", p.file, p.file.name);
    const result = await submit(prev, data);
    if (result.ok) {
      for (const p of photosRef.current) URL.revokeObjectURL(p.url);
      setPhotos([]);
    }
    return result;
  }, { ok: false });

  const addPhotos = async (files: FileList | null) => {
    const picked = [...(files ?? [])].slice(0, MAX_IMAGES - photosRef.current.length);
    if (!picked.length) return;
    setPreparing(true);
    const shrunk = await Promise.all(picked.map(shrink));
    setPhotos([...photosRef.current, ...shrunk.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(0, MAX_IMAGES));
    setPreparing(false);
  };

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(photosRef.current[i].url);
    setPhotos(photosRef.current.filter((_, j) => j !== i));
  };

  const err = state.errors ?? {};
  // After a failed post the form is reset to these, so nothing typed is lost
  const typed = state.values ?? {};
  const field = (name: string) => ({
    id: `forum-${name}`,
    name,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `forum-${name}-error` : undefined,
    className: clsx("field", err[name] && "!border-red-500"),
  });
  const errorFor = (name: string) =>
    err[name] && (
      <p id={`forum-${name}-error`} className="mt-1 text-sm text-red-600">
        {err[name]}
      </p>
    );

  return (
    <form action={action} noValidate className="relative rounded-3xl border border-line bg-white p-5 sm:p-8">
      <input type="hidden" name="lang" value={lang} />
      {props.mode === "reply" && <input type="hidden" name="topicId" value={props.topicId} />}
      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {props.mode === "topic" && (
          <>
            <div>
              <label htmlFor="forum-category" className="mb-1.5 block text-sm font-medium">
                {d.category} <span className="text-accent">*</span>
              </label>
              <select {...field("category")} defaultValue={typed.category || props.defaultCategory || props.categories[0]?.slug} required>
                {props.categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errorFor("category")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="forum-title" className="mb-1.5 block text-sm font-medium">
                {d.topicTitle} <span className="text-accent">*</span>
              </label>
              <input {...field("title")} type="text" maxLength={150} defaultValue={typed.title} required />
              {errorFor("title")}
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="forum-body" className="mb-1.5 block text-sm font-medium">
            {props.mode === "topic" ? d.body : d.replyTitle} <span className="text-accent">*</span>
          </label>
          <textarea {...field("body")} rows={props.mode === "topic" ? 7 : 4} maxLength={5000} defaultValue={typed.body} required />
          {errorFor("body")}
        </div>

        <div>
          <label htmlFor="forum-authorName" className="mb-1.5 block text-sm font-medium">
            {d.name} <span className="text-accent">*</span>
          </label>
          <input
            {...field("authorName")}
            type="text"
            maxLength={60}
            defaultValue={typed.authorName ?? props.defaultName}
            autoComplete="nickname"
            required
          />
          {errorFor("authorName")}
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-sm font-medium">{d.images}</legend>
          <ul className="flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <li key={p.url} className="relative size-24 overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
                <img src={p.url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label={d.removeImage}
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-white/90 shadow-sm hover:text-red-600"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
            {photos.length < MAX_IMAGES && (
              <li>
                <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-xs text-muted transition-colors hover:border-ink hover:text-ink">
                  {preparing ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
                  {d.addImages}
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      addPhotos(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </li>
            )}
          </ul>
          <p className="mt-1.5 text-xs text-muted">{d.imagesHint(MAX_IMAGES)}</p>
        </fieldset>
      </div>

      <p className="mt-5 text-xs text-muted">{d.rules}</p>

      {state.message && (
        <p role={state.ok ? "status" : "alert"} className={clsx("mt-4 text-sm", state.ok ? "text-accent" : "text-red-600")}>
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending || preparing} className="btn btn-primary mt-5 w-full sm:w-auto sm:min-w-40">
        {pending && <Loader2 className="size-4 animate-spin" />}
        {props.mode === "topic" ? d.submitTopic : d.submitReply}
      </button>
    </form>
  );
}
