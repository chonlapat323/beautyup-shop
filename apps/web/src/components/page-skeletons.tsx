// Route-level loading UIs (used by loading.tsx). Shapes mirror the real pages so
// nothing jumps when content arrives.
import type { ReactNode } from "react";
import { LoadingRegion, Skeleton } from "./skeleton";

// Route fallbacks render before params are known (e.g. the catch-all 404 route),
// so they must not read the language; the label covers both.
function Region({ children }: { children: ReactNode }) {
  return <LoadingRegion label="กำลังโหลด / Loading">{children}</LoadingRegion>;
}

function HeroSkeleton() {
  return (
    <section className="border-b border-line">
      <div className="container-page py-12 sm:py-16 lg:py-24">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-5 h-10 w-full max-w-2xl sm:h-14" />
        <Skeleton className="mt-3 h-10 w-2/3 max-w-xl sm:h-14" />
        <Skeleton className="mt-6 h-5 w-full max-w-xl" />
        <Skeleton className="mt-2 h-5 w-3/4 max-w-lg" />
      </div>
    </section>
  );
}

/** Card with image + text lines (brands, courses, posts). */
function CardSkeleton({ aspect = "aspect-[4/3]" }: { aspect?: string }) {
  return (
    <div>
      <Skeleton className={`${aspect} w-full rounded-2xl`} />
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-4/5" />
      <Skeleton className="mt-2 h-4 w-3/5" />
    </div>
  );
}

/** Generic listing page: hero + section title + card grid. */
export function ListPageSkeleton() {
  return (
    <Region>
      <HeroSkeleton />
      <div className="container-page section">
        <Skeleton className="mb-10 h-9 w-64" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Region>
  );
}

/** Brand page: hero + product grid (2 / 3 / 4 columns like ProductGrid). */
export function ProductListSkeleton() {
  return (
    <Region>
      <HeroSkeleton />
      <div className="container-page py-12 md:py-20">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <li key={i}>
              <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
              <Skeleton className="mt-3 h-3 w-16" />
              <Skeleton className="mt-2 h-4 w-11/12" />
              <Skeleton className="mt-2 h-4 w-20" />
            </li>
          ))}
        </ul>
      </div>
    </Region>
  );
}

/** Course page: breadcrumb, cover, text + sticky price card. */
export function CourseSkeleton() {
  return (
    <Region>
      <div className="container-page py-8 md:py-14">
        <Skeleton className="mb-6 h-4 w-48" />
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div>
            <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
            <Skeleton className="mt-8 h-10 w-4/5" />
            <Skeleton className="mt-4 h-5 w-3/5" />
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="mt-5 h-5 w-full" />
            ))}
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 lg:self-start">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-10 w-40" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-6 h-11 w-full rounded-full" />
            <Skeleton className="mt-2 h-11 w-full rounded-full" />
          </div>
        </div>
      </div>
    </Region>
  );
}

/** Article page: breadcrumb, title, date, cover, paragraphs. */
export function ArticleSkeleton() {
  return (
    <Region>
      <div className="container-page max-w-3xl py-8 md:py-14">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-10 w-full sm:h-12" />
        <Skeleton className="mt-3 h-10 w-2/3 sm:h-12" />
        <Skeleton className="mt-4 h-4 w-32" />
        <Skeleton className="mt-8 aspect-[16/9] w-full rounded-3xl" />
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className={`mt-5 h-5 ${i % 2 ? "w-11/12" : "w-full"}`} />
        ))}
      </div>
    </Region>
  );
}
