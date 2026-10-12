"use client";

import Link from "@/components/link";
import { useDict } from "@/i18n/client";

export default function NotFound() {
  const d = useDict().notFound;
  return (
    <section className="container-page grid min-h-[60dvh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-7xl text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl">{d.title}</h1>
        <p className="mt-3 text-muted">{d.lead}</p>
        <Link href="/" className="btn btn-primary mt-8">
          {d.back}
        </Link>
      </div>
    </section>
  );
}
