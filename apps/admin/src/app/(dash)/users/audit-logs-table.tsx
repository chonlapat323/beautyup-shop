import clsx from "clsx";

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
}

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  UPDATE: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  DELETE: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
};

export function AuditLogsTable({ logs }: { logs: AuditLogItem[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-12 text-center text-muted">
        ยังไม่มีประวัติการทำรายการในระบบ
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-sand/40 text-xs font-semibold text-muted uppercase">
            <tr>
              <th className="px-4 py-3">วันเวลา</th>
              <th className="px-4 py-3">ผู้ดำเนินการ</th>
              <th className="px-4 py-3">การกระทำ</th>
              <th className="px-4 py-3">ทรัพยากร (Resource)</th>
              <th className="px-4 py-3">รายละเอียด (Details)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {logs.map((log) => {
              const dateStr = new Date(log.createdAt).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
              });
              const actionClass =
                actionColors[log.action] ||
                "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";

              return (
                <tr key={log.id} className="hover:bg-sand/20 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted font-mono">{dateStr}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{log.userName || log.userEmail || "ระบบ (System)"}</div>
                    {log.userEmail && log.userName && (
                      <div className="text-xs text-muted font-mono">{log.userEmail}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide",
                        actionClass,
                      )}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink font-semibold">
                    {log.resource}
                    {log.resourceId && (
                      <span className="block text-[11px] font-normal text-muted truncate max-w-[160px]">
                        ID: {log.resourceId}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {log.details ? (
                      <pre className="max-w-md overflow-x-auto rounded bg-sand/60 dark:bg-zinc-900/60 p-2 font-mono text-[11px] text-ink leading-relaxed">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
