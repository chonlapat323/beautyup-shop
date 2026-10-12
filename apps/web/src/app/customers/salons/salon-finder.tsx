"use client";

import clsx from "clsx";
import { MapPin, Phone, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Region, Salon } from "@/lib/types";

export function SalonFinder({
  salons,
  regions,
}: {
  salons: Salon[];
  regions: { key: Region; label: string }[];
}) {
  const params = useSearchParams();
  const initial = params.get("region") as Region | null;
  const [region, setRegion] = useState<Region | "ALL">(
    initial && regions.some((r) => r.key === initial) ? initial : "ALL",
  );
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const results = salons.filter(
    (s) =>
      (region === "ALL" || s.region === region) &&
      (!query || `${s.name} ${s.province}`.toLowerCase().includes(query)),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
        <label className="relative block">
          <span className="sr-only">ค้นหาชื่อร้านหรือจังหวัด</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ชื่อร้าน หรือ จังหวัด"
            className="field !pl-10"
          />
        </label>
        <div
          role="tablist"
          aria-label="ภูมิภาค"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col"
        >
          {[{ key: "ALL" as const, label: "ทุกภาค" }, ...regions].map((r) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={region === r.key}
              onClick={() => setRegion(r.key)}
              className={clsx(
                "min-h-10 shrink-0 rounded-full border px-4 text-left text-sm whitespace-nowrap transition-colors lg:rounded-xl",
                region === r.key ? "border-ink bg-ink text-cream" : "border-line bg-white hover:border-ink",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted" aria-live="polite">
          พบ {results.length} ร้าน
        </p>
        {results.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {results.map((s) => (
              <li key={s.name} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-medium">{s.name}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <MapPin className="size-4 shrink-0" />
                  {s.address ?? s.province}
                </p>
                {s.phone && (
                  <a
                    href={`tel:${s.phone.replaceAll("-", "")}`}
                    className="mt-1 flex min-h-9 items-center gap-2 text-sm text-muted hover:text-accent"
                  >
                    <Phone className="size-4 shrink-0" />
                    {s.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
            ไม่พบร้านที่ค้นหา
          </p>
        )}
      </div>
    </div>
  );
}
