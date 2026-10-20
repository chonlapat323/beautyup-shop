"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { useDict } from "@/i18n/client";

/** LINE's official share dialog; works in the LINE app on phones and on desktop. */
const lineShareUrl = (url: string) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

/** Share a page: send it on LINE, copy the link, or scan/download its QR code. */
export function SharePanel({ url, qr, fileName }: { url: string; qr: string; fileName: string }) {
  const d = useDict().share;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-labelledby="share-title" className="mt-12 rounded-3xl border border-line bg-mist/50 p-5 sm:p-8">
      <h2 id="share-title" className="font-display text-2xl">{d.title}</h2>
      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <figure className="shrink-0 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
          <img src={qr} alt={d.qrAlt} width={160} height={160} className="mx-auto size-40 rounded-2xl border border-line bg-white p-2" />
          <figcaption className="mt-2 text-xs text-muted">{d.scan}</figcaption>
        </figure>
        <div className="flex flex-col gap-2 sm:min-w-56">
          <a
            href={lineShareUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn !border-transparent !bg-[#06C755] !text-white hover:!bg-[#05b34c]"
          >
            <LineIcon /> {d.line}
          </a>
          <button type="button" onClick={copy} className="btn btn-outline">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? d.copied : d.copy}
          </button>
          <a href={qr} download={fileName} className="btn btn-outline">
            <Download className="size-4" /> {d.downloadQr}
          </a>
        </div>
      </div>
    </section>
  );
}

function LineIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.03 3.58 7.4 8.41 8.04.33.07.77.22.88.5.1.25.07.65.03.9l-.14.86c-.04.25-.2 1 .87.54 1.08-.45 5.82-3.43 7.94-5.87C21.45 13.5 22 11.88 22 10.13 22 5.64 17.52 2 12 2Zm-3.6 10.88H6.42a.53.53 0 0 1-.53-.53V8.39a.53.53 0 1 1 1.06 0v3.43H8.4a.53.53 0 1 1 0 1.06Zm2.05-.53a.53.53 0 1 1-1.06 0V8.39a.53.53 0 1 1 1.06 0v3.96Zm4.76 0a.53.53 0 0 1-.95.32l-2.03-2.76v2.44a.53.53 0 1 1-1.06 0V8.39a.53.53 0 0 1 .95-.32l2.03 2.76V8.39a.53.53 0 1 1 1.06 0v3.96Zm3.2-2.51a.53.53 0 1 1 0 1.06h-1.45v.93h1.45a.53.53 0 1 1 0 1.06h-1.98a.53.53 0 0 1-.53-.53V8.39c0-.29.24-.53.53-.53h1.98a.53.53 0 1 1 0 1.06h-1.45v.93h1.45Z" />
    </svg>
  );
}
