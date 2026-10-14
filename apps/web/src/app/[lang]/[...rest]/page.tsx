import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GrowYourVision } from "@/components/grow-your-vision";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getGrowVision, getPage } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/[...rest]">): Promise<Metadata> {
  const { lang } = await resolveLang(params);
  const rest = (await params).rest;
  const slug = rest.join("/");
  const page = (await getPage(lang, slug)) || (rest.length === 1 ? await getPage(lang, rest[0]) : undefined);
  if (!page) return {};
  return { title: page.title };
}

export default async function DynamicCatchAllPage({ params }: PageProps<"/[lang]/[...rest]">) {
  const { lang, dict } = await resolveLang(params);
  const rest = (await params).rest;
  const slug = rest.join("/");
  
  // Try matching full slug or first segment
  const [page, growVision] = await Promise.all([
    (await getPage(lang, slug)) || (rest.length === 1 ? await getPage(lang, rest[0]) : undefined),
    getGrowVision(lang),
  ]);

  if (!page) notFound();

  // "## " lines start a section; other lines are paragraphs
  const sections: { title?: string; paragraphs: string[] }[] = [];
  for (const line of page.body) {
    if (line.startsWith("## ")) {
      sections.push({ title: line.slice(3).trim(), paragraphs: [] });
    } else if (line.trim()) {
      if (sections.length === 0) sections.push({ paragraphs: [] });
      sections.at(-1)?.paragraphs.push(line);
    }
  }

  return (
    <>
      <PageHero eyebrow="BeautyUp" title={page.title} />

      <main className="container-page max-w-4xl py-12 md:py-20">
        <article className="prose prose-neutral max-w-none space-y-8">
          {sections.map((sec, i) => (
            <div key={i} className="rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-sm">
              {sec.title && (
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink border-b border-line pb-4 mb-4">
                  {sec.title}
                </h2>
              )}
              <div className="space-y-4">
                {sec.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-muted leading-relaxed text-base sm:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </article>
      </main>

      <GrowYourVision data={growVision} />
    </>
  );
}
