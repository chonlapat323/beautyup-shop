import type { Metadata } from "next";
import Link from "@/components/link";
import { Logo } from "@/components/logo";
import { resolveLang } from "@/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.login.title };
}

// UI only for now: member accounts are not wired to apps/api yet (members get no extra features).
export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { dict } = await resolveLang(params);
  const d = dict.login;
  return (
    <section className="container-page grid min-h-[70dvh] place-items-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 sm:p-10">
        <Logo className="h-20 sm:h-24 lg:h-24" />
        <h1 className="mt-8 font-display text-3xl">{d.title}</h1>
        <form className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">{d.email}</label>
            <input id="email" name="email" type="email" autoComplete="email" className="field" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">{d.password}</label>
            <input id="password" name="password" type="password" autoComplete="current-password" className="field" />
          </div>
          <button type="button" className="btn btn-primary w-full">{d.submit}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          {d.noAccount}{" "}
          <Link href="/login" className="text-accent hover:underline">{d.register}</Link>
        </p>
      </div>
    </section>
  );
}
