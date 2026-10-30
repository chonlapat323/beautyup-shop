import type { Metadata } from "next";
import Link from "@/components/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { PageHero, SocialLinks } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getAboutData, getGrowVision, getTimeline } from "@/lib/data";
import { langAlternates } from "@/lib/site";
import { LoadingImage } from "@/components/loading-image";
import { AboutSlider } from "@/components/about-slider";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const about = await getAboutData(lang);
  return {
    title: about.headline || dict.about.title,
    description: about.lead || dict.about.lead,
    alternates: langAlternates("/about", lang),
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang, dict } = await resolveLang(params);
  const a = dict.about;
  const about = await getAboutData(lang);
  const timeline = await getTimeline(lang);
  const growVision = await getGrowVision(lang);

  return (
    <>
      <PageHero
        eyebrow={about.eyebrow || a.eyebrow}
        title={about.headline || a.headline}
        description={about.lead || a.lead}
      >
        {about.welcomeText && (
          <p className="mt-4 font-display text-base sm:text-lg font-medium text-brand-pink">
            ✨ {about.welcomeText}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {about.links.map((l) => {
            const isExternal = l.href.startsWith("http");
            if (isExternal) {
              return (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-xs sm:text-sm hover:border-brand-pink hover:text-brand-pink transition-colors"
                >
                  {l.label} ↗
                </a>
              );
            }
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="btn btn-outline text-xs sm:text-sm hover:border-brand-pink hover:text-brand-pink transition-colors"
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </PageHero>

      {/* Dynamic Slide Carousel / Gallery */}
      {about.slides && about.slides.length > 0 && (
        <AboutSlider
          slides={about.slides}
          title={lang === "th" ? "ภาพกิจกรรม & บรรยากาศบิวตี้อัพ" : "BeautyUp Highlights & Moments"}
        />
      )}

      {/* Founder & Journey */}
      <section className="section">
        <div className="container-page grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Founder Photo */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-sand/40 shadow-xl shadow-brand-pink/5 lg:sticky lg:top-28">
            {about.founderPhoto ? (
              <LoadingImage
                src={about.founderPhoto}
                alt={about.founderName}
                loading="eager"
                className="size-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-rose-100/60 to-pink-100/60 p-6 text-center">
                <span className="font-display text-5xl font-light text-brand-pink/70">BU</span>
                <p className="mt-4 font-display text-xl font-medium text-ink">{about.founderName}</p>
                <p className="mt-1 text-sm text-muted">{about.founderRole}</p>
                <p className="mt-4 text-xs text-brand-pink/70">
                  {lang === "th"
                    ? "(สามารถอัปโหลดรูปผู้ก่อตั้งได้ผ่านระบบ Admin ➔ หน้าเกี่ยวกับเรา)"
                    : "(Founder photo can be uploaded via Admin ➔ About Us)"}
                </p>
              </div>
            )}
          </div>

          {/* Founder Bio, Education & Journey */}
          <div>
            <p className="eyebrow text-brand-pink">{about.founderRole}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-5xl text-ink">
              {about.founderName}
            </h2>

            {/* Education */}
            {about.education && about.education.length > 0 && (
              <dl className="mt-8 rounded-2xl bg-sand/30 p-5 sm:p-6 border border-line/60">
                <dt className="text-sm font-semibold tracking-wide text-ink">
                  {a.education}
                </dt>
                <dd className="mt-3 space-y-2 text-muted text-sm sm:text-base">
                  {about.education.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-pink" />
                      <span>{item.replace(/^-\s*/, "")}</span>
                    </div>
                  ))}
                </dd>
              </dl>
            )}

            {/* Social Links */}
            <div className="mt-6">
              <SocialLinks socials={about.socials} />
            </div>

            {/* Journey Timeline */}
            <h3 className="mt-14 font-display text-2xl font-semibold text-ink">
              {a.journey}
            </h3>
            <ol className="mt-6 border-l-2 border-brand-pink/30">
              {timeline.map((t) => (
                <li key={t.year + t.text} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute top-1.5 -left-[7px] size-3 rounded-full bg-brand-pink ring-4 ring-white" />
                  <p className="font-display text-2xl font-bold text-brand-pink">{t.year}</p>
                  <p className="mt-1 text-muted text-sm sm:text-base">{t.text}</p>
                </li>
              ))}
            </ol>

            {/* Bottom Actions */}
            <div className="mt-12 flex flex-wrap gap-2.5">
              <Link href="/courses" className="btn btn-primary">
                {a.courses}
              </Link>
              <Link href="/members/media" className="btn btn-outline">
                {a.media}
              </Link>
              <Link href="/members/articles" className="btn btn-outline">
                {a.articles}
              </Link>
              <a
                href="https://www.facebook.com/groups/582427686617116"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline hover:border-brand-pink hover:text-brand-pink transition-colors"
              >
                {lang === "th" ? "โปรโมทร้านทำผมฟรี ↗" : "Free Salon Promotion ↗"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <GrowYourVision data={growVision} />
    </>
  );
}
