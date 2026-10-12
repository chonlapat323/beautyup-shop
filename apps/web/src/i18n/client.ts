"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, getDictionary, isLocale, type Locale } from ".";

export function useLang(): Locale {
  const params = useParams<{ lang?: string }>();
  return params?.lang && isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
}

/** Dictionary for client components (dictionaries contain functions, so they are not passed as props). */
export function useDict() {
  return getDictionary(useLang());
}
