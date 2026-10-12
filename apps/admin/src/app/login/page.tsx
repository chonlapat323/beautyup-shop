import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { expired } = await searchParams;
  // Dev convenience: pre-fill from .env.local. Never applied in production builds.
  const devLogin =
    process.env.NODE_ENV === "development" && process.env.DEV_LOGIN_EMAIL
      ? { email: process.env.DEV_LOGIN_EMAIL, password: process.env.DEV_LOGIN_PASSWORD ?? "" }
      : undefined;
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        <Image src="/logo.png" alt="BeautyUp Enterprise" width={500} height={368} priority className="h-20 w-auto" />
        <h1 className="mt-8 text-2xl font-semibold">เข้าสู่ระบบหลังบ้าน</h1>
        <p className="mt-1 text-sm text-muted">สำหรับทีมงานบิวตี้อัพเท่านั้น</p>
        {expired && (
          <p role="status" className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง
          </p>
        )}
        <LoginForm devLogin={devLogin} />
      </div>
    </main>
  );
}
