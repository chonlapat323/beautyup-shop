import type { Metadata } from "next";
import Link from "@/components/link";
import { RegisterForm } from "@/components/member/auth-forms";
import { resolveLang } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/register">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.member.registerTitle, robots: { index: false } };
}

export default async function RegisterPage({ params }: PageProps<"/[lang]/register">) {
  const { dict } = await resolveLang(params);
  const d = dict.member;

  return (
    <section className="container-page grid min-h-[70dvh] place-items-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-4xl sm:text-5xl">{d.registerTitle}</h1>
        <p className="mt-4 text-center text-muted">
          {d.haveAccount}{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            {d.loginLink}
          </Link>
        </p>
        <div className="mt-10">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
