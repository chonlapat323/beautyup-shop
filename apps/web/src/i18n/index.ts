import { notFound } from "next/navigation";
import { en } from "./en";
import { th, type Dictionary } from "./th";

// Kept here (not imported from @beautyup/types) so client bundles do not pull in zod
export const LOCALES = ["th", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "th";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { th, en };

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/** Resolves the [lang] param or 404s for unsupported locales. */
export async function resolveLang(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { lang, dict: dictionaries[lang] };
}

/** Prefixes internal paths with the locale; leaves external links and anchors alone. */
export function localizeHref(href: string, lang: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (LOCALES.some((l) => href === `/${l}` || href.startsWith(`/${l}/`))) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

export const dateLocale = (lang: Locale) => (lang === "th" ? "th-TH" : "en-GB");
