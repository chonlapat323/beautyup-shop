"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, getDictionary, type Locale } from ".";

// The language comes from the [lang] layout through context (not useParams), so
// client components never read URL params and pages stay prerenderable.
const LangContext = createContext<Locale>(DEFAULT_LOCALE);

export function LangProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return createElement(LangContext.Provider, { value: lang }, children);
}

export function useLang(): Locale {
  return useContext(LangContext);
}

/** Dictionary for client components (dictionaries contain functions, so they are not passed as props). */
export function useDict() {
  return getDictionary(useLang());
}
