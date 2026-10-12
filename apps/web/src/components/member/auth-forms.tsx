"use client";

import clsx from "clsx";
import { Loader2, Mail } from "lucide-react";
import { useActionState, useState } from "react";
import Link from "@/components/link";
import { loginMember, registerMember, type MemberFormState } from "@/app/member-actions";
import { useDict, useLang } from "@/i18n/client";
import { GoogleButton } from "./google-button";

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  hint,
  state,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
  state: MemberFormState;
}) {
  const error = state.errors?.[name];
  return (
    <div>
      <label htmlFor={`m-${name}`} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={`m-${name}`}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        defaultValue={type === "password" ? undefined : state.values?.[name]}
        key={type === "password" ? undefined : state.values?.[name]}
        aria-invalid={error ? true : undefined}
        className={clsx("field", error && "!border-red-500")}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-4 text-sm text-muted" role="separator">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending && <Loader2 className="size-4 animate-spin" />}
      {label}
    </button>
  );
}

export function RegisterForm() {
  const d = useDict().member;
  const lang = useLang();
  const [state, action, pending] = useActionState(registerMember, {});
  // Unticked by default: PDPA consent must be an explicit choice
  const [consent, setConsent] = useState(false);
  const [showEmail, setShowEmail] = useState(Boolean(state.values));
  const [consentError, setConsentError] = useState(false);

  return (
    <div>
      <GoogleButton mode="signup" blocked={consent ? undefined : d.consentRequired} />
      <Divider label={d.or} />

      {!showEmail && !state.values ? (
        <button type="button" onClick={() => setShowEmail(true)} className="btn btn-outline w-full">
          <Mail className="size-4" />
          {d.withEmail}
        </button>
      ) : (
        <form
          action={action}
          // Check consent before submitting so the typed password is not cleared
          onSubmit={(e) => {
            if (!consent) {
              e.preventDefault();
              setConsentError(true);
            }
          }}
          className="space-y-4"
        >
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="consent" value={consent ? "on" : ""} />
          <Field name="name" label={d.name} autoComplete="name" state={state} />
          <Field name="email" label={d.email} type="email" autoComplete="email" state={state} />
          <Field name="password" label={d.password} type="password" autoComplete="new-password" hint={d.passwordHint} state={state} />
          {(consentError || state.message) && (
            <p role="alert" className="text-sm text-red-600">
              {consentError ? d.consentRequired : state.message}
            </p>
          )}
          <Submit pending={pending} label={d.submitRegister} />
        </form>
      )}

      <label className="mt-8 flex items-start gap-3 text-sm">
        <input type="checkbox" checked={consent} onChange={(e) => (setConsent(e.target.checked), setConsentError(false))} className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]" />
        <span>
          {d.consent}{" "}
          <Link href="/policy" className="text-accent underline underline-offset-4 hover:text-accent-dark">
            {d.consentMore}
          </Link>
        </span>
      </label>
    </div>
  );
}

export function LoginForm() {
  const d = useDict().member;
  const lang = useLang();
  const [state, action, pending] = useActionState(loginMember, {});

  return (
    <div>
      <GoogleButton mode="signin" />
      <Divider label={d.or} />
      <form action={action} className="space-y-4">
        <input type="hidden" name="lang" value={lang} />
        <Field name="email" label={d.email} type="email" autoComplete="email" state={state} />
        <Field name="password" label={d.password} type="password" autoComplete="current-password" state={state} />
        {state.message && (
          <p role="alert" className="text-sm text-red-600">
            {state.message}
          </p>
        )}
        <Submit pending={pending} label={d.submitLogin} />
      </form>
    </div>
  );
}
