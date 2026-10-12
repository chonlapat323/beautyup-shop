import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, apiUrl } from "@/lib/api";

/** Forwards a file upload to apps/api with the admin token (avoids server action size limits). */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const res = await fetch(`${apiUrl()}/admin/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
