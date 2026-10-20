import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getPage } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/policy">): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  return { title: (await getPage(lang, "policy"))?.title };
}

type Block =
  | { kind: "h2" | "h3" | "p"; text: string }
  | { kind: "ul"; items: string[] };

/** "## " section, "### " sub-section, "- " bullet; anything else is a paragraph. */
function parse(lines: string[]): Block[] {
  const blocks: Block[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("### ")) blocks.push({ kind: "h3", text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ kind: "h2", text: line.slice(3) });
    else if (line.startsWith("- ")) {
      const last = blocks.at(-1);
      if (last?.kind === "ul") last.items.push(line.slice(2));
      else blocks.push({ kind: "ul", items: [line.slice(2)] });
    } else blocks.push({ kind: "p", text: line });
  }
  return blocks;
}

/** Bolds a leading clause number such as "2.1". */
function Paragraph({ text }: { text: string }) {
  const m = /^(\d+\.\d+)\s+(.*)$/.exec(text);
  return (
    <p className="mt-4 leading-relaxed text-muted">
      {m ? (
        <>
          <strong className="font-semibold text-ink">{m[1]}</strong> {m[2]}
        </>
      ) : (
        text
      )}
    </p>
  );
}

export default async function PolicyPage({ params }: PageProps<"/[lang]/policy">) {
  const { lang, dict } = await resolveLang(params);
  const page = await getPage(lang, "policy");
  if (!page) notFound();

  return (
    <>
      <PageHero eyebrow={dict.policy.eyebrow} title={page.title} />
      <article className="container-page max-w-3xl py-10 md:py-16">
        {parse(page.body).map((b, i) => {
          switch (b.kind) {
            case "h2":
              return (
                <h2 key={i} className="mt-14 border-b border-line pb-4 font-display text-2xl text-ink first:mt-0 sm:text-3xl">
                  {b.text}
                </h2>
              );
            case "h3":
              return (
                <h3 key={i} className="mt-10 font-display text-xl text-ink">
                  {b.text}
                </h3>
              );
            case "ul":
              return (
                <ul key={i} className="mt-4 list-disc space-y-2 pl-6 text-muted marker:text-brand-pink">
                  {b.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            default:
              return <Paragraph key={i} text={b.text} />;
          }
        })}
      </article>
    </>
  );
}
