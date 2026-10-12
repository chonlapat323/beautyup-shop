"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

export function DeleteButton({
  label,
  confirmText,
  action,
}: {
  label: string;
  confirmText: string;
  action: () => Promise<{ ok: boolean; message?: string } | void>;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className="btn btn-danger"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          setError("");
          start(async () => {
            const res = await action();
            if (res && !res.ok) setError(res.message ?? "ลบไม่สำเร็จ");
          });
        }}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        {label}
      </button>
      {error && (
        <p role="alert" className="max-w-xs text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
