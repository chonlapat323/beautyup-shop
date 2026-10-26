import type { ReactNode } from "react";
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

/** Multi-line rich text renderer supporting headings (## ), bullet lists (- ), numbered lists (1. ), and inline formatting. */
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
