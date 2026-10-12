import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ProfileForm } from "@/components/member/profile-form";
import { dateLocale, resolveLang, type Locale } from "@/i18n";
import { getProvinces } from "@/lib/data";
import { getMember } from "@/lib/member";

export async function generateMetadata({ params }: PageProps<"/[lang]/account">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.member.accountTitle, robots: { index: false } };
}

export default async function AccountPage({ params }: PageProps<"/[lang]/account">) {
  const { lang, dict } = await resolveLang(params);
  return (
    <section className="container-page max-w-3xl py-10 sm:py-16">
      <h1 className="font-display text-4xl sm:text-5xl">{dict.member.accountTitle}</h1>
      <p className="mt-3 text-muted">{dict.member.accountLead}</p>
      {/* Reads the session cookie, so it renders per request behind a boundary */}
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse rounded-3xl bg-mist" />}>
        <Account lang={lang} />
      </Suspense>
    </section>
  );
}

async function Account({ lang }: { lang: Locale }) {
  const [member, provinces] = await Promise.all([getMember(), getProvinces()]);
  // Not signed in, or the session expired: clear the cookie and go to login
  if (!member) redirect(`/api/member/signout?lang=${lang}`);
  const since = new Date(member.createdAt).toLocaleDateString(dateLocale(lang), { year: "numeric", month: "long" });

  return <ProfileForm member={member} provinces={provinces} since={since} />;
}
