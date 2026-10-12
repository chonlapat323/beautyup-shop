import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import { BackToTop } from "@/components/back-to-top";
import { CookieConsent } from "@/components/cookie-consent";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LOCALES, resolveLang } from "@/i18n";
import { LangProvider } from "@/i18n/client";
import { getCompany, getMenu } from "@/lib/data";
import "../globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

const serifThai = Noto_Serif_Thai({
  variable: "--font-serif-thai",
  subsets: ["thai", "latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang, dict } = await resolveLang(params);
  return {
    title: { default: dict.meta.title, template: "%s | BeautyUp Enterprise" },
    description: dict.meta.description,
    alternates: { languages: { th: "/th", en: "/en" } },
    openGraph: { locale: lang === "th" ? "th_TH" : "en_US", siteName: "BeautyUp Enterprise" },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang, dict } = await resolveLang(params);
  const [menu, company] = await Promise.all([getMenu(lang), getCompany(lang)]);

  return (
    <html lang={lang} className={`${plexThai.variable} ${serifThai.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        <LangProvider lang={lang}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          {dict.common.skip}
        </a>
        <SiteHeader menu={menu} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter menu={menu} company={company} dict={dict.footer} />
        <RevealObserver />
        <BackToTop />
        <CookieConsent />
        </LangProvider>
      </body>
    </html>
  );
}
