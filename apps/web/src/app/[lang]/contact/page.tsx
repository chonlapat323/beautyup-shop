import { Building2, CreditCard, Mail, MapPin, MessageSquareWarning, Phone, Store, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "@/components/link";
import { Suspense } from "react";
import { GrowYourVision } from "@/components/grow-your-vision";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui";
import { resolveLang } from "@/i18n";
import { getCompany, getGrowVision } from "@/lib/data";
import { contactFields } from "@/lib/forms";
import { FormSkeleton } from "@/components/skeleton";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.contact.title };
}

const icons = [Store, CreditCard, Users, MessageSquareWarning];

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang, dict } = await resolveLang(params);
  const d = dict.contact;
  const actions = d.actions.map((a, i) => ({ ...a, icon: icons[i] ?? Store }));
  const topics = d.topics;
  const [company, growVision] = await Promise.all([getCompany(lang), getGrowVision(lang)]);

  return (
    <>
      <PageHero eyebrow="Contact" title={d.headline} />

      <section className="container-page py-10 md:py-14">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {actions.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-6 card-lift rounded-2xl border border-line bg-white p-5 sm:p-6"
              >
                <Icon className="size-6 text-accent" />
                <span className="flex items-center justify-between gap-2 font-medium">
                  {label}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section pt-4 md:pt-8">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl sm:text-3xl">{company.name} {d.headOffice}</h2>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-accent" />
                <span>
                  {company.address}
                  <a href={company.mapUrl} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-accent hover:underline">
                    {d.openMap}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 size-5 shrink-0 text-accent" />
                <span className="flex flex-wrap gap-x-4">
                  {company.phones.map((p) => (
                    <a key={p} href={`tel:${p.replaceAll("-", "")}`} className="min-h-9 hover:text-accent">{p}</a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 size-5 shrink-0 text-accent" />
                <a href={`mailto:${company.email}`} className="break-all hover:text-accent">{company.email}</a>
              </li>
              <li className="flex gap-3">
                <Building2 className="mt-1 size-5 shrink-0 text-accent" />
                <span>{d.taxId} {company.taxId}</span>
              </li>
            </ul>

            <h3 className="mt-10 font-medium">{d.departments}</h3>
            <ul className="mt-3 divide-y divide-line border-y border-line">
              {company.departments.map((d) => (
                <li key={d.name} className="flex min-h-12 items-center justify-between gap-4">
                  <span>{d.name}</span>
                  <a href={`tel:${d.phone.replaceAll("-", "")}`} className="text-muted hover:text-accent">{d.phone}</a>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-medium">{d.topicsTitle}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t} className="rounded-full bg-sand px-3 py-1 text-sm">{t}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h2 className="mb-6 font-display text-2xl sm:text-3xl">{d.sendMessage}</h2>
            <Suspense fallback={<FormSkeleton fields={4} label={dict.common.loading} />}>
              <InquiryForm type="CONTACT" fields={contactFields} />
            </Suspense>
          </div>
        </div>
      </section>

      <GrowYourVision data={growVision} />
    </>
  );
}
