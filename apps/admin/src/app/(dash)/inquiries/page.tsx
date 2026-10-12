import clsx from "clsx";
import { ChevronRight, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import { formatDateTime, inquiryStatusLabels, inquiryTypeLabels, statusStyle, type Inquiry } from "@/lib/inquiries";

export const metadata: Metadata = { title: "กล่องข้อความ" };

export default async function InquiriesPage({ searchParams }: PageProps<"/inquiries">) {
  const sp = await searchParams;
  const str = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const [status, type, q, page] = [str("status"), str("type"), str("q"), Number(str("page")) || 1];
  const qs = new URLSearchParams({ ...(status && { status }), ...(type && { type }), ...(q && { q }), page: String(page) });
  const data = await api<{ items: Inquiry[]; total: number; page: number; pageSize: number; counts: Record<string, number> }>(`/admin/inquiries?${qs}`);
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const link = (patch: Record<string, string>) => {
    const next = new URLSearchParams({ ...(status && { status }), ...(type && { type }), ...(q && { q }), ...patch });
    for (const [k, v] of [...next]) if (!v) next.delete(k);
    return `/inquiries?${next}`;
  };

  return (
    <>
      <PageHeader title="กล่องข้อความ" description="ข้อความจากฟอร์มบนเว็บไซต์: ติดต่อ, สั่งสินค้า, สมัครซาลอน, ลงเรียน, แจ้งปัญหา" />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="สถานะ" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {[["", "ทั้งหมด"], ...Object.entries(inquiryStatusLabels)].map(([value, label]) => (
            <Link
              key={value}
              href={link({ status: value, page: "" })}
              aria-current={status === value ? "page" : undefined}
              className={clsx(
                "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
                status === value ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-muted",
              )}
            >
              {label}
              {value && data.counts[value] ? <span className="text-xs opacity-70">{data.counts[value]}</span> : null}
            </Link>
          ))}
        </nav>
        <form className="flex gap-2" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <select name="type" defaultValue={type} className="input !w-auto" aria-label="ประเภท">
            <option value="">ทุกประเภท</option>
            {Object.entries(inquiryTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input name="q" type="search" defaultValue={q} placeholder="ชื่อ, เบอร์, ร้าน..." aria-label="ค้นหา" className="input !pl-9" />
          </div>
          <button className="btn btn-secondary">ค้นหา</button>
        </form>
      </div>

      {data.items.length ? (
        <ul className="card divide-y divide-line">
          {data.items.map((it) => (
            <li key={it.id}>
              <Link href={`/inquiries/${it.id}`} className="group flex items-start gap-3 px-4 py-4 transition-colors hover:bg-mist sm:items-center">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyle[it.status]}`}>{inquiryStatusLabels[it.status]}</span>
                    <span className="rounded-full bg-sand px-2 py-0.5 text-xs">{inquiryTypeLabels[it.type]}</span>
                    <span className="font-medium">{it.name}</span>
                    {it.shopName && <span className="text-sm text-muted">· {it.shopName}</span>}
                  </span>
                  {it.message && <span className="mt-1 block truncate text-sm text-muted">{it.message}</span>}
                </span>
                <span className="hidden shrink-0 text-xs text-muted sm:block">{formatDateTime(it.createdAt)}</span>
                <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="card p-10 text-center text-sm text-muted">ไม่มีข้อความ</p>
      )}

      {pages > 1 && (
        <nav aria-label="หน้า" className="mt-4 flex items-center justify-between text-sm">
          <Link aria-disabled={page <= 1} className={clsx("btn btn-secondary", page <= 1 && "pointer-events-none opacity-40")} href={link({ page: String(page - 1) })}>
            ก่อนหน้า
          </Link>
          <span className="text-muted">
            หน้า {page} / {pages}
          </span>
          <Link aria-disabled={page >= pages} className={clsx("btn btn-secondary", page >= pages && "pointer-events-none opacity-40")} href={link({ page: String(page + 1) })}>
            ถัดไป
          </Link>
        </nav>
      )}
    </>
  );
}
