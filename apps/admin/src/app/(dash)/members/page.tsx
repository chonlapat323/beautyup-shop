import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";

export const metadata: Metadata = { title: "สมาชิกเว็บไซต์" };

interface MemberRow {
  id: string;
  email: string;
  name: string;
  phone: string;
  shopName: string;
  province: string;
  avatarUrl: string;
  hasPassword: boolean;
  hasGoogle: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default async function MembersPage() {
  const members = await api<MemberRow[]>("/admin/members");

  return (
    <>
      <PageHeader title="สมาชิกเว็บไซต์" description={`ทั้งหมด ${members.length} คน · สมัครผ่านหน้าเว็บด้วยอีเมลหรือ Google`} />
      {members.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="border-b border-line bg-mist text-left text-xs text-muted">
              <tr>
                {["สมาชิก", "ร้าน / จังหวัด", "เบอร์โทร", "สมัครด้วย", "สมัครเมื่อ", "เข้าใช้ล่าสุด"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {members.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-mist">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- Google profile photo
                        <img src={m.avatarUrl} alt="" referrerPolicy="no-referrer" className="size-9 rounded-full object-cover" />
                      ) : (
                        <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{m.name.slice(0, 1)}</span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{m.name}</span>
                        <a href={`mailto:${m.email}`} className="block truncate text-xs text-muted hover:text-brand">{m.email}</a>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {m.shopName || "—"}
                    {m.province && <span className="block text-xs text-muted">{m.province}</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{m.phone ? <a href={`tel:${m.phone}`} className="hover:text-brand">{m.phone}</a> : "—"}</td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap gap-1">
                      {m.hasGoogle && <span className="rounded-full bg-sand px-2 py-0.5 text-xs">Google</span>}
                      {m.hasPassword && <span className="rounded-full bg-sand px-2 py-0.5 text-xs">อีเมล</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{fmt(m.createdAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{fmt(m.lastLoginAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="card p-10 text-center text-sm text-muted">ยังไม่มีสมาชิก</p>
      )}
    </>
  );
}
