import type { Metadata } from "next";
import Link from "@/components/link";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getCompany } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact/payment">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.payment.title };
}

export default async function PaymentPage({ params }: PageProps<"/[lang]/contact/payment">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.payment;
  const company = await getCompany(lang);

  return (
    <>
      <PageHero
        eyebrow="Payment"
        title={d.title}
        description={d.lead}
      />
      <section className="container-page max-w-3xl py-10 md:py-16">
        <ul className="space-y-4">
          {company.bankAccounts.map((b) => (
            <li key={b.bank} className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <p className="text-sm text-muted">{b.bank}</p>
              <p className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">{b.accountNo}</p>
              <p className="mt-2">{b.accountName}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          {d.more}{" "}
          <Link href="/policy" className="text-accent underline-offset-4 hover:underline">
            {d.policyLink}
          </Link>
        </p>
      </section>
    </>
  );
}
