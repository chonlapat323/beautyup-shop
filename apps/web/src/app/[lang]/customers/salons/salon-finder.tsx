"use client";

import clsx from "clsx";
import { ExternalLink, MapPin, Phone, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDict } from "@/i18n/client";
import type { Region, Salon } from "@/lib/types";

export function SalonFinder({
  salons,
  regions,
}: {
  salons: Salon[];
  regions: { key: Region; label: string }[];
}) {
  const d = useDict().salons;
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
          <span className="sr-only">{d.searchLabel}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={d.searchPlaceholder}
            className="field !pl-10"
          />
        </label>

        {query ? (
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(
              `ร้านทำผม near ${query.includes("จังหวัด") ? query : `จังหวัด${query}`}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl border border-brand-pink/30 bg-brand-pink/5 p-3 text-xs font-medium text-brand-pink transition-colors hover:bg-brand-pink hover:text-white"
          >
            <span className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              <span>ค้นหาบน Google Maps: &quot;{query}&quot;</span>
            </span>
            <ExternalLink className="size-3.5 shrink-0" />
          </a>
        ) : null}

        <div
          role="tablist"
          aria-label={d.regions}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col"
        >
          {[{ key: "ALL" as const, label: d.allRegions }, ...regions].map((r) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={region === r.key}
              onClick={() => setRegion(r.key)}
              className="btn-tab text-left lg:rounded-xl"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-muted" aria-live="polite">
          {d.found(results.length)}
        </p>
        {results.length ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((s) => {
              const provinceClean = s.province ? s.province.replace(/^จังหวัด\s*/, "").trim() : "";
              const mapUrl =
                s.mapUrl ||
                `https://www.google.com/maps/search/${encodeURIComponent(
                  provinceClean ? `ร้านทำผม near จังหวัด${provinceClean}` : `ร้านทำผม near ${s.name}`,
                )}`;

              return (
                <li
                  key={s.name}
                  className="group relative flex flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:border-brand-pink/60 hover:shadow-lg hover:shadow-brand-pink/5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-ink transition-colors hover:text-brand-pink flex items-center gap-1.5"
                      >
                        <span>{s.name}</span>
                        <ExternalLink className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-brand-pink" />
                      </a>
                    </div>

                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand-pink"
                    >
                      <MapPin className="size-4 shrink-0 text-brand-pink" />
                      <span>{s.address || (provinceClean ? `จังหวัด${provinceClean}` : s.province)}</span>
                    </a>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-sm">
                    {s.phone ? (
                      <a
                        href={`tel:${s.phone.replaceAll("-", "")}`}
                        className="flex items-center gap-1.5 text-muted transition-colors hover:text-brand-pink"
                      >
                        <Phone className="size-3.5 shrink-0" />
                        <span>{s.phone}</span>
                      </a>
                    ) : (
                      <span />
                    )}

                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-pink transition-colors hover:underline"
                    >
                      <span>เปิด Google Maps</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="text-muted">{d.none}</p>
            {query && (
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  `ร้านทำผม near ${query.includes("จังหวัด") ? query : `จังหวัด${query}`}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-4 inline-flex items-center gap-2"
              >
                <MapPin className="size-4 text-brand-pink" />
                <span>ค้นหา &quot;ร้านทำผม near {query}&quot; บน Google Maps ↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
