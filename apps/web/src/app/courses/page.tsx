import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { Media, PageHero, SectionHeading, stagger } from "@/components/ui";
import { getCourses } from "@/lib/data";

export const metadata: Metadata = { title: "คอร์สเรียน" };

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <>
      <PageHero
        eyebrow="Courses & Study Trips"
        title="คอร์สเรียนสุดพิเศษสำหรับมืออาชีพ"
        description="เรียนทำผม เรียนทำเล็บ ก้าวสู่มืออาชีพขั้นสูง ทั้งตัด ทำสี ดัด ยืด แก้ปัญหาเส้นผม พร้อมดูงานต่างประเทศและสร้างเครือข่ายกับช่างผมมืออาชีพ"
      />

      <section className="section">
        <div className="container-page">
          <ul className="grid gap-6 lg:grid-cols-2">
            {courses.map((c, i) => (
              <li key={c.slug} data-reveal style={stagger(i)}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white"
                >
                  <div className="overflow-hidden">
                    <Media
                      src={c.coverUrl}
                      tone={i + 1}
                      className="card-img aspect-[16/9] w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <p className="flex items-center gap-2 text-sm text-muted">
                      <Clock className="size-4" /> {c.duration}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{c.title}</h2>
                    <p className="mt-3 flex-1 text-muted">{c.summary}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                      <span className="font-display text-2xl">{c.priceText}</span>
                      <span className="font-medium group-hover:text-accent">
                        อ่านต่อ <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-line bg-mist">
        <div className="container-page">
          <SectionHeading eyebrow="Atmosphere" title="บรรยากาศ การเรียน การสอน การดูงาน" />
          <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Media
                key={i}
                tone={i}
                className={`mb-3 w-full break-inside-avoid rounded-2xl sm:mb-4 ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <GrowYourVision />
    </>
  );
}
