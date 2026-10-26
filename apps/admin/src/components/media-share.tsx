"use client";

import { Check, Copy, Download, QrCode } from "lucide-react";
import { useState } from "react";

/** Public link + QR code the team can send to customers (e.g. over LINE). */
export function MediaShare({
  url,
  qr,
  fileName,
  published,
  unpublishedText = "ยังเป็นฉบับร่าง ลูกค้าจะเปิดลิงก์นี้ไม่ได้จนกว่าจะใส่วันที่เผยแพร่",
}: {
  url: string;
  qr: string;
  fileName: string;
  published: boolean;
  unpublishedText?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-labelledby="share-title" className="card mb-6 p-4 sm:p-5">
      <h2 id="share-title" className="flex items-center gap-2 text-sm font-semibold">
        <QrCode className="size-4" /> แชร์ให้ลูกค้า
      </h2>
      {!published && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {unpublishedText}
        </p>
      )}
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- data URL */}
        <img src={qr} alt={`QR code ของ ${url}`} className="size-32 shrink-0 rounded-lg border border-line bg-white" />
        <div className="min-w-0 flex-1 space-y-2">
          <input readOnly value={url} aria-label="ลิงก์แชร์" className="input font-mono text-xs" onFocus={(e) => e.target.select()} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
            </button>
            <a href={qr} download={fileName} className="btn btn-secondary">
              <Download className="size-4" /> ดาวน์โหลด QR
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
