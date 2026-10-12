import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["th", "en"];

/** Sends paths without a language prefix to /th or /en (from Accept-Language, Thai by default). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const prefersEnglish = accept.startsWith("en") && !accept.includes("th");
  const url = request.nextUrl.clone();
  url.pathname = `/${prefersEnglish ? "en" : "th"}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|icon.png|logo.png|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|txt|xml)$).*)"],
};
