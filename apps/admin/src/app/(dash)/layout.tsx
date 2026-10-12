import { Sidebar } from "@/components/sidebar";
import { api, getMe } from "@/lib/api";

export default async function DashLayout({ children }: LayoutProps<"/">) {
  const [me, inbox] = await Promise.all([
    getMe(),
    api<{ counts: Record<string, number> }>("/admin/inquiries?status=NEW"),
  ]);

  return (
    <div className="lg:flex">
      <Sidebar user={me} newInquiries={inbox.counts.NEW ?? 0} />
      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
