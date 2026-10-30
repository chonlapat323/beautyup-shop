import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getRegions, getSalons } from "@/lib/data";
import { langAlternates } from "@/lib/site";
import { SalonFinder } from "./salon-finder";
import { SalonFinderSkeleton } from "@/components/skeleton";

export async function generateMetadata({ params }: PageProps<"/[lang]/customers/salons">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  return {
    title: dict.salons.title,
    alternates: langAlternates("/customers/salons", lang),
  };
}

export default async function SalonsPage({ params }: PageProps<"/[lang]/customers/salons">) {
  const { lang, dict } = await resolveLang(params);
  const [salons, regions] = await Promise.all([getSalons(lang), getRegions(lang)]);

  return (
    <>
      <PageHero
        eyebrow="Find a Salon"
        title={dict.salons.headline}
        description={dict.salons.lead}
      />
      <section className="container-page py-10 md:py-16">
        <Suspense fallback={<SalonFinderSkeleton label={dict.common.loading} />}>
          <SalonFinder salons={salons} regions={regions} />
        </Suspense>
      </section>
    </>
  );
}
