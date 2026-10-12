"use client";

import { Search } from "lucide-react";
import Link from "@/components/link";
import { useState } from "react";
import { useDict } from "@/i18n/client";

export interface SearchItem {
  kind: string;
  title: string;
  sub?: string;
  href: string;
}

export function SearchBox({ items }: { items: SearchItem[] }) {
  const d = useDict().searchPage;
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = query
    ? items.filter((i) => `${i.title} ${i.sub ?? ""}`.toLowerCase().includes(query)).slice(0, 30)
    : [];

  return (
    <>
      <label className="relative block">
        <span className="sr-only">{d.label}</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={d.placeholder}
          className="field !min-h-14 !rounded-full !pl-12 text-lg"
        />
      </label>
      <div aria-live="polite" className="mt-8">
        {query && (
          <p className="mb-4 text-sm text-muted">{d.found(results.length)}</p>
        )}
        <ul className="divide-y divide-line">
          {results.map((r) => (
            <li key={`${r.kind}-${r.title}`}>
              <Link href={r.href} className="group flex min-h-16 items-center gap-4 py-3">
                <span className="w-16 shrink-0 text-xs text-accent">{r.kind}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate group-hover:text-accent">{r.title}</span>
                  {r.sub && <span className="block truncate text-sm text-muted">{r.sub}</span>}
                </span>
                <span className="text-muted transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
