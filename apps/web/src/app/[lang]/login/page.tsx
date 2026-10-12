import type { Metadata } from "next";
import Link from "@/components/link";
import { LoginForm } from "@/components/member/auth-forms";
import { resolveLang } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.member.loginLink, robots: { index: false } };
}

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { dict } = await resolveLang(params);
  const d = dict.member;

  return (
    <section className="container-page grid min-h-[70dvh] place-items-center py-12 sm:py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-4xl sm:text-5xl">{dict.login.title}</h1>
        <p className="mt-4 text-center text-muted">
          {d.noAccount}{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            {d.registerLink}
          </Link>
        </p>
        <div className="mt-10">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
