import { Mail, MapPin, Phone } from "lucide-react";
import Link from "@/components/link";
import type { Dictionary } from "@/i18n";
import { getCurrentYear } from "@/lib/data";
import type { CompanyInfo, MenuItem } from "@/lib/types";
import { Logo } from "./logo";

export async function SiteFooter({
  menu,
  company,
  dict,
}: {
  menu: MenuItem[];
  company: CompanyInfo;
  dict: Dictionary["footer"];
}) {
  return (
    <footer className="border-t border-line bg-mist text-ink">
      <div className="container-page grid gap-12 py-14 md:grid-cols-2 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo className="h-16 sm:h-20 lg:h-20" />
          <p className="mt-5 max-w-sm text-sm text-muted">
            {dict.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Fanola", "Nook", "Sweet"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted transition-colors hover:border-ink hover:text-ink"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <nav aria-label={dict.menu} className="lg:col-span-3">
          <p className="eyebrow">{dict.menu}</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm lg:grid-cols-1">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-5">
          <p className="eyebrow">{dict.contact}</p>
          <p className="mt-4 font-medium">{company.name}</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink/40" />
              <span>{company.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-ink/40" />
              <span className="flex flex-wrap gap-x-3">
                {company.phones.map((p) => (
                  <a key={p} href={`tel:${p.replaceAll("-", "")}`} className="transition-colors hover:text-accent">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-ink/40" />
              <a href={`mailto:${company.email}`} className="break-all transition-colors hover:text-accent">
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>©{await getCurrentYear()} {company.name}</p>
          <Link href="/policy" className="transition-colors hover:text-accent">
            {dict.policy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
