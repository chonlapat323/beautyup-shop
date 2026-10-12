import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { issueFields } from "@/lib/forms";
import { FormSkeleton } from "@/components/skeleton";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact/report">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.report.title };
}

export default async function ReportPage({ params }: PageProps<"/[lang]/contact/report">) {
  const { dict } = await resolveLang(params);
  const d = dict.report;
  return (
    <>
      <PageHero
        eyebrow="Report an issue"
        title={d.title}
        description={d.lead}
      />
      <section className="container-page max-w-3xl py-10 md:py-16">
        <Suspense fallback={<FormSkeleton fields={5} label={dict.common.loading} />}>
          <InquiryForm type="ISSUE" fields={issueFields} submitLabel={d.submit} />
        </Suspense>
      </section>
    </>
  );
}
