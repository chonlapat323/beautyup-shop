import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getPage } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/policy">): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  return { title: (await getPage(lang, "policy"))?.title };
}

export default async function PolicyPage({ params }: PageProps<"/[lang]/policy">) {
  const { lang, dict } = await resolveLang(params);
  const page = await getPage(lang, "policy");
  if (!page) notFound();

  // "## " lines start a numbered section; other lines are paragraphs
  const sections: { title?: string; paragraphs: string[] }[] = [];
  for (const line of page.body) {
    if (line.startsWith("## ")) sections.push({ title: line.slice(3), paragraphs: [] });
    else (sections.at(-1) ?? sections[sections.push({ paragraphs: [] }) - 1]).paragraphs.push(line);
  }
  let n = 0;

  return (
    <>
      <PageHero eyebrow={dict.policy.eyebrow} title={page.title} />
      <article className="container-page max-w-3xl py-10 md:py-16">
        {sections.map((s, i) => (
          <section key={i} className="border-b border-line py-8 first:pt-0 last:border-b-0">
            {s.title && (
              <h2 className="font-display text-2xl">
                <span className="mr-3 text-accent">{String(++n).padStart(2, "0")}</span>
                {s.title}
              </h2>
            )}
            {s.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
