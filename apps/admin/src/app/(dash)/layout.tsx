import { Sidebar } from "@/components/sidebar";
import { api, getMe } from "@/lib/api";
import type { RolePermissions } from "@beautyup/types";

export default async function DashLayout({ children }: LayoutProps<"/">) {
  const [me, inbox, settings] = await Promise.all([
    getMe(),
    api<{ counts?: Record<string, number> }>("/admin/inquiries?status=NEW").catch(() => ({ counts: {} as Record<string, number> })),
    api<Record<string, unknown>>("/admin/settings").catch(() => ({} as Record<string, unknown>)),
  ]);

  const rolePermissions = settings.rolePermissions as RolePermissions | undefined;

  return (
    <div className="lg:flex">
      <Sidebar user={me} newInquiries={inbox.counts?.NEW ?? 0} rolePermissions={rolePermissions} />
      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
