"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { inquiryStatusLabels } from "@/lib/inquiries";

export function InquiryStatusForm({
  status: initialStatus,
  note: initialNote,
  action,
}: {
  status: string;
  note: string;
  action: (data: { status: string; note: string }) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="card space-y-4 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await action({ status, note });
          setMsg({ ok: res.ok, text: res.ok ? "บันทึกแล้ว" : (res.message ?? "บันทึกไม่สำเร็จ") });
        });
      }}
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium">สถานะ</legend>
        <div className="grid gap-1.5">
          {Object.entries(inquiryStatusLabels).map(([v, l]) => (
            <label
              key={v}
              className={clsx(
                "flex min-h-10 items-center gap-3 rounded-lg border px-3 text-sm transition-colors",
                status === v ? "border-ink bg-mist" : "border-line hover:border-muted",
              )}
            >
              <input type="radio" name="status" value={v} checked={status === v} onChange={() => setStatus(v)} className="accent-brand" />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="note" className="mb-1 block text-sm font-medium">บันทึกภายใน</label>
        <textarea id="note" rows={4} className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="เช่น โทรกลับแล้ว นัดส่งของวันศุกร์" />
        <p className="mt-1 text-xs text-muted">เห็นเฉพาะทีมงาน</p>
      </div>
      {msg && <p role="status" className={clsx("text-sm", msg.ok ? "text-emerald-700" : "text-red-600")}>{msg.text}</p>}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        บันทึก
      </button>
    </form>
  );
}
