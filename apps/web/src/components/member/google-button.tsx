"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { googleSignIn } from "@/app/member-actions";
import { useDict, useLang } from "@/i18n/client";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleId {
  initialize(opts: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: string }): void;
  renderButton(el: HTMLElement, opts: Record<string, unknown>): void;
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

/**
 * "Sign in with Google" using Google Identity Services. The ID token is verified by
 * the API (never trusted in the browser). `blocked` shows a message instead of
 * signing in, e.g. until the consent box is ticked.
 */
export function GoogleButton({ mode, blocked }: { mode: "signup" | "signin"; blocked?: string }) {
  const d = useDict().member;
  const lang = useLang();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onCredential = useCallback(
    async ({ credential }: { credential: string }) => {
      setBusy(true);
      setError("");
      const res = await googleSignIn(credential, lang);
      if (res.ok) router.push(`/${lang}/account`);
      else {
        setError(res.message ?? d.googleFailed);
        setBusy(false);
      }
    },
    [d.googleFailed, lang, router],
  );

  useEffect(() => {
    if (!loaded || !CLIENT_ID || !ref.current || !window.google) return;
    window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: onCredential });
    window.google.accounts.id.renderButton(ref.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text: mode === "signup" ? "signup_with" : "signin_with",
      locale: lang,
      width: Math.min(ref.current.offsetWidth || 320, 400),
    });
  }, [loaded, lang, mode, onCredential]);

  if (!CLIENT_ID) {
    return (
      <p className="rounded-full border border-dashed border-line px-4 py-3 text-center text-sm text-muted">
        {d.googleNotConfigured}
      </p>
    );
  }

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setLoaded(true)} />
      <div className="relative">
        <div ref={ref} className="flex min-h-11 justify-center" aria-busy={busy} />
        {blocked && (
          // Google's button is an iframe, so a transparent cover enforces consent first
          <button
            type="button"
            className="absolute inset-0 cursor-pointer rounded-full"
            aria-label={blocked}
            onClick={() => setError(blocked)}
          />
        )}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
