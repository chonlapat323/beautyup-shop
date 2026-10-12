import { ArrowRight, Inbox, Newspaper, Package, Store } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { api, getMe } from "@/lib/api";
import { formatDateTime, inquiryTypeLabels, statusStyle, inquiryStatusLabels, type Inquiry } from "@/lib/inquiries";
import { listResource } from "@/lib/resources";

export default async function DashboardPage() {
  const [me, inbox, products, posts, salons] = await Promise.all([
    getMe(),
    api<{ items: Inquiry[]; counts: Record<string, number> }>("/admin/inquiries"),
    listResource("products"),
    listResource("posts"),
    listResource("salons"),
  ]);

  const stats = [
    { label: "ข้อความใหม่", value: inbox.counts.NEW ?? 0, href: "/inquiries?status=NEW", icon: Inbox, highlight: (inbox.counts.NEW ?? 0) > 0 },
    { label: "สินค้า", value: products.length, href: "/r/products", icon: Package },
    { label: "บทความ / กิจกรรม", value: posts.length, href: "/r/posts", icon: Newspaper },
    { label: "ซาลอนในระบบ", value: salons.length, href: "/r/salons", icon: Store },
  ];

  return (
    <>
      <PageHeader title={`สวัสดี ${me.name}`} description="ภาพรวมเว็บไซต์บิวตี้อัพ" />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon, highlight }) => (
          <li key={label}>
            <Link href={href} className={`card group flex h-full flex-col gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5 sm:p-5 ${highlight ? "border-brand/40" : ""}`}>
              <Icon className={`size-5 ${highlight ? "text-brand" : "text-muted"}`} />
              <span>
                <span className="block text-3xl font-semibold tabular-nums">{value}</span>
                <span className="text-sm text-muted">{label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">ข้อความล่าสุด</h2>
          <Link href="/inquiries" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-brand">
            ดูทั้งหมด <ArrowRight className="size-4" />
          </Link>
        </div>
        {inbox.items.length ? (
          <ul className="card divide-y divide-line">
            {inbox.items.slice(0, 6).map((q) => (
              <li key={q.id}>
                <Link href={`/inquiries/${q.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-mist sm:flex-row sm:items-center sm:gap-4">
                  <span className={`w-fit shrink-0 rounded-full px-2 py-0.5 text-xs ${statusStyle[q.status]}`}>{inquiryStatusLabels[q.status]}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">
                    <span className="font-medium">{q.name}</span>
                    <span className="text-muted"> · {inquiryTypeLabels[q.type]}</span>
                  </span>
                  <span className="text-xs text-muted">{formatDateTime(q.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="card p-8 text-center text-sm text-muted">ยังไม่มีข้อความ</p>
        )}
      </section>
    </>
  );
}
