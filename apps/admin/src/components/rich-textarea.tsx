"use client";

import clsx from "clsx";
import { Bold, Eye, Heading2, Italic, Link2, List, ListOrdered, PencilLine, Underline } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/** Renders inline formatting (**bold**, __underline__, *italic*, [label](url)) safely as React nodes. */
export function renderInlineRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      nodes.push(<strong key={key++} className="font-semibold text-ink">{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(<u key={key++} className="underline underline-offset-4">{match[3]}</u>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key++} className="italic">{match[4]}</em>);
    } else if (match[5] !== undefined && match[6] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={match[6]}
          target={match[6].startsWith("http") ? "_blank" : undefined}
          rel={match[6].startsWith("http") ? "noopener noreferrer" : undefined}
          className="font-medium text-brand underline underline-offset-2 hover:opacity-80"
        >
          {match[5]}
        </a>,
      );
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes.length ? nodes : [text];
}

/** Preview block renderer for the Admin Text Editor */
export function RichTextPreview({ value, placeholder }: { value: string; placeholder?: string }) {
  const raw = value.trim();
  if (!raw) {
    return <p className="text-sm text-muted/60 italic">{placeholder || "ยังไม่มีข้อความ..."}</p>;
  }

  const lines = value.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push(
        <h3 key={i} className="font-display text-lg font-bold text-ink mt-3 first:mt-0">
          {renderInlineRichText(trimmed.slice(3))}
        </h3>,
      );
      i++;
      continue;
    }

    if (/^[-•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-•]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 text-sm text-ink/90">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineRichText(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1 text-sm text-ink/90">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineRichText(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    blocks.push(
      <p key={i} className="text-sm leading-relaxed text-ink/90">
        {renderInlineRichText(line)}
      </p>,
    );
    i++;
  }

  return <div className="space-y-2.5">{blocks}</div>;
}

export function RichTextarea({
  id,
  value,
  onChange,
  placeholder,
  lang,
  invalid,
  minRows = 5,
}: {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  lang?: string;
  invalid?: boolean;
  minRows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const lineCount = value ? value.split("\n").length : 1;
  const computedRows = Math.max(minRows, Math.min(16, lineCount + 1));

  /** Wraps or unwraps the selected text with `before` and `after` markers. */
  const wrapSelection = (before: string, after = before, defaultText = "ข้อความ") => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    // If already wrapped, unwrap it
    if (
      start >= before.length &&
      value.slice(start - before.length, start) === before &&
      value.slice(end, end + after.length) === after
    ) {
      const next = value.slice(0, start - before.length) + selected + value.slice(end + after.length);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start - before.length, end - before.length);
      });
      return;
    }

    const content = selected || defaultText;
    const next = value.slice(0, start) + before + content + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + content.length);
    });
  };

  /** Prefixes or toggles a line prefix (e.g. "## ", "- ", "1. ") on selected lines. */
  const prefixLines = (prefix: string | "numbered") => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const nextNewline = value.indexOf("\n", end);
    const lineEnd = nextNewline === -1 ? value.length : nextNewline;

    const block = value.slice(lineStart, lineEnd);
    const rawLines = block.split("\n");

    const updatedLines = rawLines.map((l, idx) => {
      if (prefix === "numbered") {
        const p = `${idx + 1}. `;
        return /^\d+\.\s+/.test(l) ? l.replace(/^\d+\.\s+/, "") : p + l.replace(/^[-•#]+\s*/, "");
      }
      if (l.startsWith(prefix)) {
        return l.slice(prefix.length);
      }
      return prefix + l.replace(/^(?:##\s+|[-•]\s+|\d+\.\s+)/, "");
    });

    const replacement = updatedLines.join("\n");
    const next = value.slice(0, lineStart) + replacement + value.slice(lineEnd);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + replacement.length);
    });
  };

  const insertLink = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "ข้อความลิงก์";
    const url = window.prompt("ใส่ลิงก์ปลายทาง (เช่น https://... หรือ /products):", "https://");
    if (!url) return;
    const snippet = `[${selected}](${url.trim()})`;
    const next = value.slice(0, start) + snippet + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      if (k === "b") {
        e.preventDefault();
        wrapSelection("**", "**", "ตัวหนา");
      } else if (k === "i") {
        e.preventDefault();
        wrapSelection("*", "*", "ตัวเอียง");
      } else if (k === "u") {
        e.preventDefault();
        wrapSelection("__", "__", "ขีดเส้นใต้");
      }
    }
  };

  return (
    <div
      className={clsx(
        "overflow-hidden rounded-xl border bg-white transition-colors focus-within:border-ink",
        invalid ? "border-red-500" : "border-line",
      )}
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-line bg-mist/70 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          <ToolbarBtn
            label="ตัวหนา (Ctrl+B)"
            disabled={preview}
            onClick={() => wrapSelection("**", "**", "ตัวหนา")}
          >
            <Bold className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            label="ตัวเอียง (Ctrl+I)"
            disabled={preview}
            onClick={() => wrapSelection("*", "*", "ตัวเอียง")}
          >
            <Italic className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            label="ขีดเส้นใต้ (Ctrl+U)"
            disabled={preview}
            onClick={() => wrapSelection("__", "__", "ขีดเส้นใต้")}
          >
            <Underline className="size-3.5" />
          </ToolbarBtn>

          <span className="mx-1 h-4 w-px bg-line" aria-hidden />

          <ToolbarBtn
            label="หัวข้อย่อย (## หัวข้อ)"
            disabled={preview}
            onClick={() => prefixLines("## ")}
          >
            <Heading2 className="size-3.5" />
            <span className="text-[11px] font-medium">หัวข้อ</span>
          </ToolbarBtn>
          <ToolbarBtn
            label="รายการจุด (Bullet List)"
            disabled={preview}
            onClick={() => prefixLines("- ")}
          >
            <List className="size-3.5" />
            <span className="text-[11px] font-medium">รายการจุด</span>
          </ToolbarBtn>
          <ToolbarBtn
            label="รายการตัวเลข (Numbered List)"
            disabled={preview}
            onClick={() => prefixLines("numbered")}
          >
            <ListOrdered className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            label="แทรกลิงก์"
            disabled={preview}
            onClick={insertLink}
          >
            <Link2 className="size-3.5" />
          </ToolbarBtn>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className={clsx(
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
              preview ? "bg-brand text-white" : "bg-white text-muted hover:text-ink border border-line/80",
            )}
          >
            {preview ? <PencilLine className="size-3.5" /> : <Eye className="size-3.5" />}
            {preview ? "กลับไปแก้ไข" : "ดูตัวอย่าง"}
          </button>
          {lang && (
            <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] font-semibold text-muted uppercase">
              {lang}
            </span>
          )}
        </div>
      </div>

      {/* Editor Body or Live Preview */}
      {preview ? (
        <div className="min-h-32 bg-white p-3.5">
          <RichTextPreview value={value} placeholder={placeholder} />
        </div>
      ) : (
        <textarea
          ref={ref}
          id={id}
          rows={computedRows}
          lang={lang}
          placeholder={placeholder}
          value={value}
          aria-invalid={invalid}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y border-0 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/60"
        />
      )}

      {/* Footer status bar */}
      <div className="flex items-center justify-between border-t border-line/60 bg-mist/40 px-3 py-1 text-[11px] text-muted">
        <span>ลากคลุมข้อความแล้วกดปุ่มด้านบนเพื่อจัดรูปแบบ · ขึ้นบรรทัดใหม่ด้วยปุ่ม Enter</span>
        <span>
          {lineCount} บรรทัด · {value.length} ตัวอักษร
        </span>
      </div>
    </div>
  );
}

function ToolbarBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-ink/80 transition-colors hover:bg-white hover:text-brand hover:shadow-2xs disabled:opacity-40"
    >
      {children}
    </button>
  );
}
