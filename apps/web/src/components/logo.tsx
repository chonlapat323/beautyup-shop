// Text wordmark until the real logo file is provided.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={`font-display text-xl font-semibold tracking-tight sm:text-2xl ${light ? "text-cream" : "text-ink"}`}
      >
        BeautyUp
      </span>
      <span
        className={`mt-1 text-[0.625rem] tracking-[0.3em] uppercase ${light ? "text-cream/60" : "text-muted"}`}
      >
        Enterprise
      </span>
    </span>
  );
}
