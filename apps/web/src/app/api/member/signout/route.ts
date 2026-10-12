import { NextResponse, type NextRequest } from "next/server";
import { MEMBER_COOKIE } from "@/lib/member";

/**
 * Clears a stale/invalid member cookie, then goes to the login page.
 * Used when /account finds the session is no longer valid; without this the
 * proxy (which sends signed-in visitors from /login to /account) would loop.
 */
export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "th";
  const res = NextResponse.redirect(new URL(`/${lang}/login`, request.url));
  res.cookies.delete(MEMBER_COOKIE);
  return res;
}
