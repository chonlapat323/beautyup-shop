import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: real authorization happens in apps/api on every call.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("bu_admin")) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api/|_next/static|_next/image|icon.png|logo.png|favicon.ico).*)"],
};
