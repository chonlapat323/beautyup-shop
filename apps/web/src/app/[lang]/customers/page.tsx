import type { Metadata } from "next";
import Link from "@/components/link";
import { GrowYourVision } from "@/components/grow-your-vision";
import { VipCustomerHero } from "@/components/vip-customer-hero";
import { Media, SectionHeading, SocialLinks, stagger } from "@/components/ui";
import { dateLocale, resolveLang } from "@/i18n";
import { getAmbassadors, getGrowVision, getRegions, getVipCustomerData } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[lang]/customers">): Promise<Metadata> {
  return { title: (await resolveLang(params)).dict.customers.title };
}

export default async function CustomersPage({ params }: PageProps<"/[lang]/customers">) {
  const { lang, dict } = await resolveLang(params);
  const c = dict.customers;
  const [vipCustomer, ambassadors, regions, growVision] = await Promise.all([
    getVipCustomerData(lang),
    getAmbassadors(lang),
    getRegions(lang),
    getGrowVision(lang),
  ]);
  const total = regions.reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <VipCustomerHero data={vipCustomer} />

      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Brand Ambassador" title={c.ambassadors} />
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-5">
            {ambassadors.map((a, i) => (
              <li key={a.name} data-reveal suppressHydrationWarning style={stagger(i)}>
                <div className="overflow-hidden rounded-2xl">
                  <Media src={a.photoUrl} alt={a.name} label={a.name} tone={i} className="aspect-[3/4] w-full transition-transform duration-700 hover:scale-[1.03]" />
                </div>
                <p className="mt-4 font-display text-xl">{a.name}</p>
                <p className="text-sm text-muted">{a.title}</p>
                <SocialLinks socials={a.socials} className="mt-3" />
              </li>
            ))}
            <li data-reveal suppressHydrationWarning style={stagger(ambassadors.length)}>
              <Link
                href="/contact/salon-partner"
                className="group block"
              >
                <div className="overflow-hidden rounded-2xl border border-line bg-sand/20">
                  <Media
                    src="/ambassadors/5.jpg"
                    alt="YOU ร่วมเป็นส่วนหนึ่งกับเรา"
                    className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 font-display text-xl transition-colors group-hover:text-brand-pink">YOU</p>
                <p className="text-sm font-medium text-muted transition-colors group-hover:text-brand-pink flex items-center gap-1">
                  <span>{c.joinUs}</span>
                </p>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section border-t border-line bg-mist">
        <div className="container-page">
          <SectionHeading
            eyebrow="Salon Directory"
            title={c.directory}
            description={c.directoryLead(total.toLocaleString(dateLocale(lang)))}
          />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {regions.map((r) => (
              <li key={r.key}>
                <Link
                  href={`/customers/salons?region=${r.key}`}
                  className="group flex h-full flex-col justify-between gap-6 card-lift rounded-2xl border border-line bg-white p-5 sm:p-6"
                >
                  <span className="text-sm sm:text-base">{r.label}</span>
                  <span className="flex items-end justify-between">
                    <span className="font-display text-4xl sm:text-5xl">{r.count}</span>
                    <span className="text-sm text-muted transition-transform group-hover:translate-x-1">{dict.common.shops} →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-2">
            <Link href="/customers/salons" className="btn btn-primary">{c.findSalon}</Link>
            <Link href="/contact/salon-partner" className="btn btn-outline">{c.applySalon}</Link>
          </div>
        </div>
      </section>

      <GrowYourVision data={growVision} />
    </>
  );
}
