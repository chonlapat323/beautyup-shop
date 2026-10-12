import type { Metadata } from "next";
import Link from "@/components/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { Media, PageHero, SocialLinks } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getTimeline } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.about.title };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang, dict } = await resolveLang(params);
  const a = dict.about;
  const links = a.links;
  const timeline = await getTimeline(lang);

  return (
    <>
      <PageHero
        eyebrow={a.eyebrow}
        title={a.headline}
        description={a.lead}
      >
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="btn btn-outline">
              {l.label}
            </Link>
          ))}
        </div>
      </PageHero>

      {/* Gallery */}
      <section className="container-page py-12 md:py-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Media
              key={i}
              tone={i}
              className={
                i === 0
                  ? "col-span-2 row-span-2 aspect-square rounded-3xl"
                  : "aspect-square rounded-3xl"
              }
            />
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="section">
        <div className="container-page grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Media label="Amy Phorlaphat" tone={2} className="aspect-[4/5] w-full rounded-3xl lg:sticky lg:top-28" />
          <div>
            <p className="eyebrow">{a.founderRole}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-5xl">
              {a.founderName}
            </h2>
            <dl className="mt-8 space-y-4 text-muted">
              <div>
                <dt className="text-sm font-medium text-ink">{a.education}</dt>
                <dd className="mt-1">
                  {a.educationText}
                </dd>
              </div>
            </dl>
            <SocialLinks
              className="mt-6"
              socials={{
                facebook: "https://www.facebook.com/pholaphat.sothanarphisarn",
                instagram: "https://www.instagram.com/pholraphatamy/",
                tiktok: "https://www.tiktok.com/@pholraphatamysoth",
                youtube: "https://www.youtube.com/@FanolaOfficial",
              }}
            />

            <h3 className="mt-14 font-display text-2xl">{a.journey}</h3>
            <ol className="mt-6 border-l border-line">
              {timeline.map((t) => (
                <li key={t.year} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-accent" />
                  <p className="font-display text-2xl text-accent">{t.year}</p>
                  <p className="mt-1">{t.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap gap-2">
              <Link href="/courses" className="btn btn-primary">
                {a.courses}
              </Link>
              <Link href="/members/media" className="btn btn-outline">
                {a.media}
              </Link>
              <Link href="/members/articles" className="btn btn-outline">
                {a.articles}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GrowYourVision dict={dict.grow} />
    </>
  );
}
