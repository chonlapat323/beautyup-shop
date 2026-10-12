import { NextResponse } from "next/server";
import { getMember } from "@/lib/member";

/** Who is signed in, for the header. Minimal fields only; never cached. */
export async function GET() {
  const m = await getMember();
  return NextResponse.json(m ? { name: m.name, avatarUrl: m.avatarUrl } : null, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
