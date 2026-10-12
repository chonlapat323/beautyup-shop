import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

// MOCK: UI only. Auth will be wired to apps/api later.
export default function LoginPage() {
  return (
    <section className="container-page grid min-h-[70dvh] place-items-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 sm:p-10">
        <Logo />
        <h1 className="mt-8 font-display text-3xl">เข้าสู่ระบบสมาชิก</h1>
        <form className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">อีเมล</label>
            <input id="email" name="email" type="email" autoComplete="email" className="field" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">รหัสผ่าน</label>
            <input id="password" name="password" type="password" autoComplete="current-password" className="field" />
          </div>
          <button type="button" className="btn btn-primary w-full">เข้าสู่ระบบ</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          ยังไม่เป็นสมาชิก?{" "}
          <Link href="/login" className="text-accent hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </section>
  );
}
