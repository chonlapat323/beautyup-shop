import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { salonPartnerFields } from "@/lib/forms";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact/salon-partner">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.partner.title };
}

export default async function SalonPartnerPage({ params }: PageProps<"/[lang]/contact/salon-partner">) {
  const { dict } = await resolveLang(params);
  const d = dict.partner;
  return (
    <>
      <PageHero
        eyebrow="Order · Salon Partner · Course"
        title={d.title}
        description={d.lead}
      />
      <section className="container-page max-w-3xl py-10 md:py-16">
        <Suspense>
          <InquiryForm
            type="SALON"
            fields={salonPartnerFields}
            typeOptions={["ORDER", "SALON", "COURSE"]}
          />
        </Suspense>
      </section>
    </>
  );
}
