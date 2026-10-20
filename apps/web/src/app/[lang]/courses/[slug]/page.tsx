import { Check, Clock, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "@/components/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/ui";
import { resolveLang, type Locale } from "@/i18n";
import { getCompany, getCourse, getCourses } from "@/lib/data";

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const courses = await getCourses(params.lang as Locale);
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/courses/[slug]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  const course = await getCourse(lang, (await params).slug);
  return { title: course?.title ?? dict.courses.notFound, description: course?.summary };
}

export default async function CoursePage({ params }: PageProps<"/[lang]/courses/[slug]">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.courses;
  const { slug } = await params;
  const [course, company] = await Promise.all([getCourse(lang, slug), getCompany(lang)]);
  if (!course) notFound();

  return (
    <article className="container-page py-8 md:py-14">
      <nav aria-label={dict.common.breadcrumb} className="mb-6 text-sm text-muted">
        <Link href="/courses" className="hover:text-ink">{d.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{course.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div>
          <Media src={course.coverUrl} tone={1} className="aspect-[16/9] w-full rounded-3xl" />
          <h1 className="mt-8 font-display text-3xl leading-tight text-balance sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{course.summary}</p>
          <h2 className="mt-10 font-display text-2xl">{d.learn}</h2>
          <ul className="mt-5 space-y-4">
            {course.content.map((line) => (
              <li key={line} className="flex gap-3">
                <Check className="mt-1 size-5 shrink-0 text-accent" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {course.images.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl">{d.gallery}</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {course.images.map((src, i) => (
                  <Media key={src + i} src={src} tone={i} className="aspect-square w-full rounded-2xl" />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sticky summary on desktop, inline card on mobile */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <p className="text-sm text-muted">{d.fee}</p>
            <p className="mt-1 font-display text-4xl">{course.priceText}</p>
            <p className="mt-4 flex items-center gap-2 text-muted">
              <Clock className="size-4" /> {course.duration}
            </p>
            <Link href={`/contact/salon-partner?course=${course.slug}`} className="btn btn-primary mt-6 w-full">
              {d.register}
            </Link>
            {company.phones[0] && (
              <a href={`tel:${company.phones[0].replaceAll("-", "")}`} className="btn btn-outline mt-2 w-full">
                <Phone className="size-4" /> {company.phones[0]}
              </a>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
