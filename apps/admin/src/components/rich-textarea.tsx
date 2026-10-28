"use client";

import clsx from "clsx";
import {
  Bold,
  Code,
  Eraser,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  RotateCw,
  Strikethrough,
  Underline as UnderlineIcon,
  Unlink,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";

/* -------------------------------------------------------------------------
 * 1. BACKWARD COMPATIBLE EXPORTS (used by other components)
 * ----------------------------------------------------------------------- */

/** Renders inline formatting (**bold**, __underline__, *italic*, [label](url)) safely as React nodes. */
export function renderInlineRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\n]+)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\))/g;
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

/** Preview block renderer for Markdown text (kept for backwards compatibility) */
export function RichTextPreview({ value, placeholder }: { value: string; placeholder?: string }) {
  const raw = value?.trim();
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
        <h3 key={i} className="font-serif text-lg font-bold text-ink">
          {renderInlineRichText(trimmed.slice(3))}
        </h3>,
      );
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={i} className="list-disc pl-5 space-y-1 text-sm text-ink/90">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineRichText(it)}</li>
          ))}
        </ul>,
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

/* -------------------------------------------------------------------------
 * 2. MODERN TIPTAP WYSIWYG RICH TEXT EDITOR
 * ----------------------------------------------------------------------- */

interface RichTextareaProps {
  id?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  lang?: string;
  invalid?: boolean;
  minRows?: number;
}

export function RichTextarea({
  id,
  value,
  onChange,
  placeholder = "พิมพ์รายละเอียดเนื้อหาที่นี่...",
  lang,
  invalid,
  minRows = 5,
}: RichTextareaProps) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand underline underline-offset-2",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || (lang === "en" ? "Type details here..." : "พิมพ์รายละเอียดเนื้อหาที่นี่..."),
      }),
      Markdown.configure({
        html: true,
        tightLists: true,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: clsx(
          "tiptap min-h-[160px] p-4 text-sm leading-relaxed text-ink outline-none",
          minRows > 6 ? "min-h-[220px]" : "min-h-[160px]",
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      // Return clean markdown for full database & website backward compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage = ed.storage as any;
      const md = storage.markdown?.getMarkdown ? storage.markdown.getMarkdown() : ed.getHTML();
      onChange(md);
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync when value changes externally (e.g. language tab switch)
  useEffect(() => {
    if (!editor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storage = editor.storage as any;
    const current = storage.markdown?.getMarkdown ? storage.markdown.getMarkdown() : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Set link helper
  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setLinkModalOpen(true);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("/")
        ? linkUrl
        : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkModalOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-line bg-white p-6 text-center text-xs text-muted">
        กำลังโหลด Editor...
      </div>
    );
  }

  // Word count & Character count
  const textContent = editor.getText();
  const charCount = textContent.length;
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  return (
    <div
      className={clsx(
        "group flex flex-col rounded-xl border bg-white transition-all shadow-2xs",
        invalid ? "border-red-500 ring-1 ring-red-500/20" : "border-line focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10",
      )}
    >
      {/* Sticky Modern Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-line/80 bg-mist/60 px-2.5 py-1.5 rounded-t-xl text-ink">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors",
            editor.isActive("heading", { level: 2 }) ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="หัวข้อหลัก (Heading 2)"
          aria-label="หัวข้อหลัก"
        >
          <Heading2 className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors",
            editor.isActive("heading", { level: 3 }) ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="หัวข้อย่อย (Heading 3)"
          aria-label="หัวข้อย่อย"
        >
          <Heading3 className="size-4" />
        </button>

        <span className="mx-1 h-4 w-px bg-line" aria-hidden />

        {/* Text Styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("bold") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="ตัวหนา (Ctrl+B)"
          aria-label="ตัวหนา"
        >
          <Bold className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("italic") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="ตัวเอียง (Ctrl+I)"
          aria-label="ตัวเอียง"
        >
          <Italic className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("underline") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="ขีดเส้นใต้ (Ctrl+U)"
          aria-label="ขีดเส้นใต้"
        >
          <UnderlineIcon className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("strike") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="ขีดฆ่า"
          aria-label="ขีดฆ่า"
        >
          <Strikethrough className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("code") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="เน้นคำ (Code)"
          aria-label="เน้นคำ"
        >
          <Code className="size-4" />
        </button>

        <span className="mx-1 h-4 w-px bg-line" aria-hidden />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("bulletList") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="รายการแบบจุด (Bullet List)"
          aria-label="รายการแบบจุด"
        >
          <List className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("orderedList") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="รายการแบบตัวเลข (Numbered List)"
          aria-label="รายการแบบตัวเลข"
        >
          <ListOrdered className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("blockquote") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="อ้างอิง / คำคม (Blockquote)"
          aria-label="อ้างอิง"
        >
          <Quote className="size-4" />
        </button>

        <span className="mx-1 h-4 w-px bg-line" aria-hidden />

        {/* Link */}
        <button
          type="button"
          onClick={handleSetLink}
          className={clsx(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors",
            editor.isActive("link") ? "bg-white text-brand shadow-xs" : "text-muted hover:bg-white hover:text-ink",
          )}
          title="แทรกลิงก์ (Link)"
          aria-label="แทรกลิงก์"
        >
          <Link2 className="size-4" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-red-600"
            title="ลบลิงก์"
            aria-label="ลบลิงก์"
          >
            <Unlink className="size-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-ink"
          title="ล้างการจัดรูปแบบ (Clear Formatting)"
          aria-label="ล้างการจัดรูปแบบ"
        >
          <Eraser className="size-4" />
        </button>

        <span className="mx-1 h-4 w-px bg-line" aria-hidden />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-30"
          title="ย้อนกลับ (Undo - Ctrl+Z)"
          aria-label="ย้อนกลับ"
        >
          <RotateCcw className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-30"
          title="ทำซ้ำ (Redo - Ctrl+Y)"
          aria-label="ทำซ้ำ"
        >
          <RotateCw className="size-4" />
        </button>
      </div>

      {/* WYSIWYG Content Area */}
      <EditorContent editor={editor} />

      {/* Editor Footer / Info Bar */}
      <div className="flex items-center justify-between border-t border-line/60 bg-[#fbfaf8] px-3.5 py-1.5 text-[11px] text-muted rounded-b-xl">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
          Tiptap WYSIWYG Editor
        </span>
        <div className="flex items-center gap-3">
          <span>{wordCount} คำ</span>
          <span>·</span>
          <span>{charCount} ตัวอักษร</span>
        </div>
      </div>

      {/* Link Dialog Modal */}
      {linkModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-2xs animate-in fade-in"
          onClick={(e) => e.target === e.currentTarget && setLinkModalOpen(false)}
        >
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-xl space-y-4">
            <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
              <Link2 className="size-4 text-brand" />
              กำหนดลิงก์ (URL)
            </h3>
            <p className="text-xs text-muted">
              วางที่อยู่เว็บไซต์ เช่น https://example.com หรือที่อยู่หน้าเว็บภายใน เช่น /shop
            </p>
            <input
              type="text"
              autoFocus
              className="input w-full"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveLink();
                } else if (e.key === "Escape") {
                  setLinkModalOpen(false);
                }
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="btn btn-secondary text-xs px-3.5 py-1.5"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={saveLink}
                className="btn btn-primary text-xs px-4 py-1.5"
              >
                บันทึกลิงก์
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
