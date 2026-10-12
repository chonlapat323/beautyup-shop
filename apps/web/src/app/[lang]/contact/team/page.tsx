import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Media, PageHero, SectionHeading } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getTeam } from "@/lib/data";
import type { TeamMember } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact/team">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.team.title };
}

export default async function TeamPage({ params }: PageProps<"/[lang]/contact/team">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.team;
  const team = await getTeam(lang);
  const groups: { id: string; title: string; eyebrow: string; members: TeamMember[] }[] = [
    { id: "sales", eyebrow: "Sales", title: d.sales, members: team.filter((m) => m.department === "SALES") },
    { id: "technician", eyebrow: "Technician", title: d.technician, members: team.filter((m) => m.department === "TECHNICIAN") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title={d.headline}
        description={d.lead}
      />
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="section scroll-mt-20 border-b border-line last:border-b-0">
          <div className="container-page">
            <SectionHeading eyebrow={g.eyebrow} title={g.title} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.members.map((m, i) => (
                <li key={m.name} className="flex gap-4 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-muted sm:p-5">
                  <Media src={m.photoUrl} alt={m.name} tone={i} className="size-20 shrink-0 rounded-xl sm:size-24" />
                  <div className="min-w-0">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted">{m.position}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4">
                      {m.phone && (
                        <a href={`tel:${m.phone.replaceAll("-", "")}`} className="inline-flex min-h-9 items-center gap-1.5 text-sm transition-colors hover:text-accent">
                          <Phone className="size-4" /> {m.phone}
                        </a>
                      )}
                      {m.lineId && (
                        <span className="inline-flex min-h-9 items-center gap-1.5 text-sm">
                          <MessageCircle className="size-4" /> {m.lineId}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
