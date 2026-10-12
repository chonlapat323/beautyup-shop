import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { BackToTop } from "@/components/back-to-top";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteHeader } from "@/components/site-header";
import { getCompany, getMenu } from "@/lib/data";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

const serifThai = Noto_Serif_Thai({
  variable: "--font-serif-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BeautyUp Enterprise | ผลิตภัณฑ์ซาลอนมืออาชีพ",
    template: "%s | BeautyUp Enterprise",
  },
  description:
    "ศูนย์รวมผลิตภัณฑ์ซาลอนมืออาชีพ Fanola, Nook, Sweet Professional และเคาน์เตอร์แบรนด์ชั้นนำ",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [menu, company] = await Promise.all([getMenu(), getCompany()]);

  return (
    <html
      lang="th"
      className={`${plexThai.variable} ${serifThai.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          ข้ามไปยังเนื้อหา
        </a>
        <SiteHeader menu={menu} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter menu={menu} company={company} />
        <RevealObserver />
        <BackToTop />
      </body>
    </html>
  );
}
