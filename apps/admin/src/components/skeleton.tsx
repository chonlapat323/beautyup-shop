import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/** Placeholder block shown while a page loads. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden style={style} className={clsx("animate-pulse rounded-lg bg-sand motion-reduce:animate-none", className)} />;
}

function Loading({ children }: { children: ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy>
      <span className="sr-only">กำลังโหลด</span>
      {children}
    </div>
  );
}

/** Title + description + optional action button, like PageHeader. */
function HeaderSkeleton({ back, action }: { back?: boolean; action?: boolean }) {
  return (
    <div className="mb-6 sm:mb-8">
      {back && <Skeleton className="mb-4 h-4 w-24" />}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        {action && <Skeleton className="h-10 w-32" />}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <Loading>
      <HeaderSkeleton />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card space-y-4 p-4 sm:p-5">
            <Skeleton className="size-5" />
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 mb-3 h-5 w-32" />
      <ListSkeleton rows={5} />
    </Loading>
  );
}

/** Rows like the inquiries inbox / recent messages. */
function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-line">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-4 w-28 sm:block" />
        </div>
      ))}
    </div>
  );
}

/** Data table (desktop) / cards (mobile), like DataTable. */
export function TableSkeleton({ search = true, thumb = true }: { search?: boolean; thumb?: boolean }) {
  return (
    <Loading>
      <HeaderSkeleton action />
      {search && <Skeleton className="mb-4 h-10 max-w-sm" />}
      <div className="card hidden overflow-hidden md:block">
        <div className="flex gap-4 border-b border-line bg-mist px-4 py-3">
          {[10, 30, 20, 15, 10].map((w, i) => (
            <Skeleton key={i} className="h-3" style={{ width: `${w}%` }} />
          ))}
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-0">
            {thumb && <Skeleton className="size-11 shrink-0" />}
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2 md:hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card flex items-center gap-3 p-3">
            {thumb && <Skeleton className="size-11 shrink-0" />}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Loading>
  );
}

/** Bilingual resource form: language tabs + fields + save button. */
export function FormSkeleton({ tabs = true, fields = 7, back = true }: { tabs?: boolean; fields?: number; back?: boolean }) {
  return (
    <Loading>
      <HeaderSkeleton back={back} action={back} />
      {tabs && <Skeleton className="mb-6 h-12 w-full sm:w-72" />}
      <div className="card grid gap-5 p-4 sm:p-6">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i}>
            <Skeleton className="mb-2 h-4 w-28" />
            <Skeleton className={i === 3 ? "h-28" : "h-10"} />
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-10 w-32" />
    </Loading>
  );
}

export function InboxSkeleton() {
  return (
    <Loading>
      <HeaderSkeleton />
      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ListSkeleton rows={8} />
    </Loading>
  );
}

export function InquirySkeleton() {
  return (
    <Loading>
      <HeaderSkeleton back action />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="card space-y-3 p-5 sm:p-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-1/2" />
          ))}
          <Skeleton className="mt-4 h-24" />
        </div>
        <div className="card space-y-3 p-5">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
          <Skeleton className="h-24" />
          <Skeleton className="h-10" />
        </div>
      </div>
    </Loading>
  );
}
