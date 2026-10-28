import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@/components/link";

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
      nodes.push(
        <strong key={key++} className="font-semibold text-ink">
          {match[2]}
        </strong>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <u key={key++} className="underline underline-offset-4">
          {match[3]}
        </u>,
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <em key={key++} className="italic">
          {match[4]}
        </em>,
      );
    } else if (match[5] !== undefined && match[6] !== undefined) {
      const href = match[6];
      if (href.startsWith("http")) {
        nodes.push(
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline underline-offset-2 hover:opacity-80"
          >
            {match[5]}
          </a>,
        );
      } else {
        nodes.push(
          <Link key={key++} href={href} className="font-medium text-accent underline underline-offset-2 hover:opacity-80">
            {match[5]}
          </Link>,
        );
      }
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes.length ? nodes : [text];
}

/** Multi-line rich text renderer supporting HTML, headings (## ), bullet lists (- ), numbered lists (1. ), and inline formatting. */
export function RichText({
  text,
  className = "space-y-3",
  paragraphClassName = "",
}: {
  text?: string | string[] | null;
  className?: string;
  paragraphClassName?: string;
}) {
  if (!text) return null;

  // If text contains HTML tags (from rich text editor), render HTML safely with typography styling
  if (typeof text === "string" && /<\/(p|h2|h3|h4|ul|ol|li|blockquote|strong|em|u|a)>/i.test(text)) {
    return (
      <div
        className={clsx(
          "max-w-none text-ink space-y-3 leading-relaxed",
          "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-6 [&_h2]:mb-2",
          "[&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mt-4 [&_h3]:mb-2",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5",
          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5",
          "[&_blockquote]:border-l-3 [&_blockquote]:border-brand-pink [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted",
          "[&_a]:text-brand-pink [&_a]:underline [&_a]:underline-offset-2",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  const lines = Array.isArray(text) ? text.flatMap((t) => t.split("\n")) : text.split("\n");
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
        <h3 key={`h-${i}`} className="font-display text-xl sm:text-2xl font-semibold text-ink pt-2 first:pt-0">
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
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1.5">
          {items.map((it, idx) => (
            <li key={idx} className={paragraphClassName}>
              {renderInlineRichText(it)}
            </li>
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
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-1.5">
          {items.map((it, idx) => (
            <li key={idx} className={paragraphClassName}>
              {renderInlineRichText(it)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    blocks.push(
      <p key={`p-${i}`} className={paragraphClassName}>
        {renderInlineRichText(line)}
      </p>,
    );
    i++;
  }

  return <div className={className}>{blocks}</div>;
}
