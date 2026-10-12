"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import Link from "@/components/link";
import { useDict } from "@/i18n/client";

/** Error inside a page (header and footer still render). */
export default function PageError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const d = useDict();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page grid min-h-[60dvh] place-items-center py-16 text-center">
      <div className="max-w-md">
        <p className="font-display text-6xl text-accent sm:text-7xl">500</p>
        <h1 className="mt-4 font-display text-3xl">{d.error.title}</h1>
        <p className="mt-3 text-muted">{d.error.lead}</p>
        <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
          <button type="button" onClick={() => retry()} className="btn btn-primary">
            <RotateCcw className="size-4" />
            {d.error.retry}
          </button>
          <Link href="/" className="btn btn-outline">
            {d.error.home}
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-muted">
            {d.error.code}: <code>{error.digest}</code>
          </p>
        )}
      </div>
    </section>
  );
}
