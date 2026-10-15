import clsx from "clsx";
import { ImageOff } from "lucide-react";

interface MockImagePlaceholderProps {
  label?: string;
  subLabel?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Standard neutral-gray mock placeholder for unuploaded or pending images.
 * Clearly signals to the team and users that the photo is intentionally pending management.
 */
export function MockImagePlaceholder({
  label,
  subLabel,
  className,
  compact = false,
}: MockImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label ? `รออัปเดตรูปภาพ: ${label}` : "รออัปเดตรูปภาพ (Mock Image)"}
      className={clsx(
        "relative flex size-full flex-col items-center justify-center overflow-hidden select-none",
        "border border-dashed border-neutral-300 bg-neutral-100 text-neutral-400 transition-colors",
        compact ? "p-2" : "p-4 sm:p-6",
        className,
      )}
    >
      {/* Subtle grid pattern background to feel like a photographic canvas placeholder */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:16px_16px]"
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Soft rounded icon badge */}
        <div
          className={clsx(
            "grid place-items-center rounded-2xl bg-neutral-200/90 text-neutral-500 shadow-xs mb-2",
            compact ? "size-8 rounded-xl" : "size-11 sm:size-12",
          )}
        >
          <ImageOff className={compact ? "size-4" : "size-5 sm:size-6 stroke-[1.75]"} />
        </div>

        {/* Clear Notice: รออัปเดตรูปภาพ / ยังไม่ได้จัดการรูป */}
        <span
          className={clsx(
            "font-semibold text-neutral-600 line-clamp-1 max-w-[90%]",
            compact ? "text-[10px]" : "text-xs sm:text-sm",
          )}
        >
          {label || "รออัปเดตรูปภาพ"}
        </span>

        {/* Sub-label */}
        <span
          className={clsx(
            "text-neutral-400 uppercase tracking-wider font-mono mt-0.5",
            compact ? "text-[8px]" : "text-[9px] sm:text-[10px]",
          )}
        >
          {subLabel || "ยังไม่ได้จัดการรูปภาพ"}
        </span>
      </div>
    </div>
  );
}
