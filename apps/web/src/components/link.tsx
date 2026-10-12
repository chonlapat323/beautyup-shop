"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/i18n";
import { useLang } from "@/i18n/client";

/** next/link that keeps the current language: "/products" -> "/en/products". */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const lang = useLang();
  return <NextLink href={typeof href === "string" ? localizeHref(href, lang) : href} {...props} />;
}
