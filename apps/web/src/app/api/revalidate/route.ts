import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { CONTENT_TAG } from "@/lib/data";

/** Called by the admin panel after content changes. */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = request.headers.get("x-revalidate-secret") ?? "";
  const ok = secret.length > 0 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  revalidateTag(CONTENT_TAG, "max");
  return NextResponse.json({ ok: true });
}
