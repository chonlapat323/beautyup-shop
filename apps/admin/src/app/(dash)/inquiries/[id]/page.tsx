import { Mail, MapPin, Phone, Store } from "lucide-react";
import type { Metadata } from "next";
import { DeleteButton } from "@/components/delete-button";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import { formatDateTime, inquiryTypeLabels, type Inquiry } from "@/lib/inquiries";
import { deleteInquiry, updateInquiry } from "../actions";
import { InquiryStatusForm } from "./status-form";

export const metadata: Metadata = { title: "ข้อความ" };

export default async function InquiryPage({ params }: PageProps<"/inquiries/[id]">) {
  const { id } = await params;
  const it = await api<Inquiry>(`/admin/inquiries/${id}`);
  const extra = Object.entries(it.data ?? {}).filter(([, v]) => v !== "" && v != null);

  return (
    <>
      <PageHeader
        title={it.name}
        description={`${inquiryTypeLabels[it.type]} · ${formatDateTime(it.createdAt)}`}
        back={{ href: "/inquiries", label: "กล่องข้อความ" }}
        actions={<DeleteButton label="ลบข้อความ" confirmText="ลบข้อความนี้ใช่หรือไม่?" action={deleteInquiry.bind(null, id)} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="card p-5 sm:p-6">
          <ul className="space-y-3 text-sm">
            {it.phone && (
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-muted" />
                <a href={`tel:${it.phone}`} className="hover:text-brand">{it.phone}</a>
              </li>
            )}
            {it.email && (
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-muted" />
                <a href={`mailto:${it.email}`} className="break-all hover:text-brand">{it.email}</a>
              </li>
            )}
            {it.shopName && (
              <li className="flex items-center gap-3">
                <Store className="size-4 text-muted" /> {it.shopName}
              </li>
            )}
            {it.province && (
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-muted" /> {it.province}
              </li>
            )}
          </ul>
          <h2 className="mt-6 text-sm font-medium text-muted">ข้อความ</h2>
          <p className="mt-2 whitespace-pre-wrap">{it.message || "—"}</p>
          {extra.length > 0 && (
            <dl className="mt-6 grid gap-2 rounded-xl bg-mist p-4 text-sm sm:grid-cols-2">
              {extra.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="break-words">{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <aside>
          <InquiryStatusForm status={it.status} note={it.note} action={updateInquiry.bind(null, id)} />
        </aside>
      </div>
    </>
  );
}
