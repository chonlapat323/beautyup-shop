import clsx from "clsx";
import type { ReactNode } from "react";

/** Placeholder block shown while content loads. Pulses unless reduced motion is on. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={clsx("animate-pulse rounded-xl bg-sand motion-reduce:animate-none", className)} />;
}

/** Screen-reader-only "loading" announcement for a skeleton region. */
export function LoadingRegion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Matches InquiryForm: optional topic chips, fields in a 2-column grid, submit button. */
export function FormSkeleton({ fields = 4, chips = false, label = "Loading" }: { fields?: number; chips?: boolean; label?: string }) {
  return (
    <LoadingRegion label={label} className="rounded-3xl border border-line bg-white p-5 sm:p-8">
      {chips && (
        <div className="mb-6">
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="flex flex-wrap gap-2">
            {["w-24", "w-32", "w-28"].map((w) => (
              <Skeleton key={w} className={clsx("h-10 rounded-full", w)} />
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: fields }, (_, i) => {
          const last = i === fields - 1;
          return (
            <div key={i} className={clsx(last && "sm:col-span-2")}>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className={last ? "h-32" : "h-11"} />
            </div>
          );
        })}
      </div>
      <Skeleton className="mt-6 h-11 w-full rounded-full sm:w-40" />
    </LoadingRegion>
  );
}

/** Matches SalonFinder: search box + region filters beside a grid of salon cards. */
export function SalonFinderSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <LoadingRegion label={label} className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
      <div className="space-y-6">
        <Skeleton className="h-11" />
        <div className="flex gap-2 overflow-hidden lg:flex-col">
          {Array.from({ length: 7 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full lg:w-full lg:rounded-xl" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="mb-4 h-4 w-20" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="mt-3 h-4 w-1/2" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </LoadingRegion>
  );
}

/** Matches the account page: profile card + profile form + log out button. */
export function AccountSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <LoadingRegion label={label} className="mt-10 space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-line bg-white p-5 sm:p-6">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 rounded-3xl border border-line bg-white p-5 sm:grid-cols-2 sm:p-8">
        {[true, false, false, false].map((full, i) => (
          <div key={i} className={clsx(full && "sm:col-span-2")}>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-11" />
          </div>
        ))}
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
      <Skeleton className="h-11 w-40 rounded-full" />
    </LoadingRegion>
  );
}
