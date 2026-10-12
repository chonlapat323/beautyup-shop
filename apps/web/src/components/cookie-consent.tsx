"use client";

import { Cookie } from "lucide-react";
import { useSyncExternalStore } from "react";
import Link from "@/components/link";
import { useDict } from "@/i18n/client";

export const CONSENT_COOKIE = "bu_consent";
export type Consent = "all" | "necessary";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const v = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))?.[1];
  return v === "all" || v === "necessary" ? v : null;
}

/**
 * Load analytics / marketing scripts only when this returns true, and listen for
 * the "bu:consent" event to start them right after the visitor accepts.
 */
export const hasAnalyticsConsent = () => readConsent() === "all";

const subscribe = (onChange: () => void) => {
  window.addEventListener("bu:consent", onChange);
  return () => window.removeEventListener("bu:consent", onChange);
};

/** PDPA cookie banner. Shown until the visitor chooses; the choice is kept for a year. */
export function CookieConsent() {
  const d = useDict().cookie;
  // Server (static page) renders nothing; the browser reads the cookie
  const consent = useSyncExternalStore(subscribe, readConsent, () => "unknown" as const);
  const open = consent === null;

  const choose = (value: Consent) => {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax${secure}`;
    window.dispatchEvent(new CustomEvent("bu:consent", { detail: value }));
  };

  if (!open) return null;

  return (
    <section
      role="region"
      aria-label={d.label}
      className="fixed inset-x-3 bottom-3 z-40 animate-fade-up rounded-3xl border border-line bg-white/95 p-4 shadow-2xl shadow-ink/10 backdrop-blur sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:p-5"
    >
      <div className="flex gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blush text-brand-pink">
          <Cookie className="size-4" />
        </span>
        <p className="text-sm leading-relaxed text-muted">
          {d.text}{" "}
          <Link href="/policy" className="text-accent underline underline-offset-4 hover:text-accent-dark">
            {d.more}
          </Link>
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose("necessary")} className="btn btn-outline !min-h-10 !px-3 text-sm">
          {d.necessary}
        </button>
        <button type="button" onClick={() => choose("all")} className="btn btn-primary !min-h-10 !px-3 text-sm">
          {d.accept}
        </button>
      </div>
    </section>
  );
}
