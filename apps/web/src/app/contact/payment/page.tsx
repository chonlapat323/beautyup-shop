import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getCompany } from "@/lib/data";

export const metadata: Metadata = { title: "การชำระเงิน" };

export default async function PaymentPage() {
  const company = await getCompany();

  return (
    <>
      <PageHero
        eyebrow="Payment"
        title="การชำระเงิน"
        description="โอนเงินเข้าบัญชีบริษัทเท่านั้น และแจ้งหลักฐานการโอนกับพนักงานขายหรือทีมงานทุกครั้ง"
      />
      <section className="container-page max-w-3xl py-10 md:py-16">
        <ul className="space-y-4">
          {company.bankAccounts.map((b) => (
            <li key={b.bank} className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <p className="text-sm text-muted">{b.bank}</p>
              <p className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">{b.accountNo}</p>
              <p className="mt-2">{b.accountName}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          อ่านเงื่อนไขเพิ่มเติมได้ที่{" "}
          <Link href="/policy" className="text-accent underline-offset-4 hover:underline">
            นโยบายการจำหน่ายและชำระเงิน
          </Link>
        </p>
      </section>
    </>
  );
}
