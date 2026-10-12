"use client";

import { useEffect } from "react";

// Shown when the root layout itself fails (e.g. the API is down while loading the
// menu). It replaces the whole document, so it carries its own minimal styles and
// cannot use globals.css, fonts or the dictionary. Both languages are shown because
// the [lang] param is not available here.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const button = { minHeight: 44, padding: "0 24px", borderRadius: 999, fontSize: 15, cursor: "pointer" } as const;

  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          color: "#1c1917",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <title>BeautyUp Enterprise</title>
        <main style={{ maxWidth: 440 }}>
          <p style={{ fontSize: 56, margin: 0, color: "#9a5b3f", fontFamily: "Georgia, serif" }}>500</p>
          <h1 style={{ fontSize: 24, margin: "12px 0 4px" }}>ขออภัย เกิดข้อผิดพลาด</h1>
          <p style={{ color: "#6b6762", margin: 0 }} lang="en">
            Sorry, something went wrong
          </p>
          <p style={{ color: "#6b6762", lineHeight: 1.6, margin: "16px 0 0" }}>
            เว็บไซต์ขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งในอีกสักครู่
            <br />
            <span lang="en">The website is temporarily unavailable. Please try again shortly.</span>
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button type="button" onClick={() => retry()} style={{ ...button, border: 0, background: "#1c1917", color: "#fff" }}>
              ลองใหม่ · Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload on purpose: the app shell has crashed */}
            <a href="/th" style={{ ...button, border: "1px solid #1c1917", color: "#1c1917", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              หน้าหลัก · Home
            </a>
          </div>
          {error.digest && <p style={{ marginTop: 24, fontSize: 12, color: "#6b6762" }}>Ref: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
