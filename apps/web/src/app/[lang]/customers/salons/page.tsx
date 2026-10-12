import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getRegions, getSalons } from "@/lib/data";
import { SalonFinder } from "./salon-finder";

export async function generateMetadata({ params }: PageProps<"/[lang]/customers/salons">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.salons.title };
}

export default async function SalonsPage({ params }: PageProps<"/[lang]/customers/salons">) {
  const { lang, dict } = await resolveLang(params);
  const [salons, regions] = await Promise.all([getSalons(), getRegions(lang)]);

  return (
    <>
      <PageHero
        eyebrow="Find a Salon"
        title={dict.salons.headline}
        description={dict.salons.lead}
      />
      <section className="container-page py-10 md:py-16">
        <Suspense>
          <SalonFinder salons={salons} regions={regions} />
        </Suspense>
      </section>
    </>
  );
}
