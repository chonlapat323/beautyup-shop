import Link from "next/link";
import { Media } from "./ui";

const items = [
  { title: "ผลิตภัณฑ์ซาลอน", text: "Fanola, Nook, Sweet Professional", href: "/products" },
  { title: "เคาน์เตอร์แบรนด์", text: "La Prairie, La Mer, Clarins และอีกมากมาย", href: "/shop" },
  { title: "โปรโมทร้านทำผมฟรี", text: "เข้ากลุ่ม Facebook ชี้เป้าร้านทำผม", href: "https://www.facebook.com/groups/582427686617116" },
];

export function GrowYourVision() {
  return (
    <section className="section">
      <div className="container-page">
        <div data-reveal className="overflow-hidden rounded-3xl border border-line bg-mist md:grid md:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="eyebrow">BeautyUp</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Grow Your Vision
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {items.map((item) => {
                const external = item.href.startsWith("http");
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      {...(external && { target: "_blank", rel: "noreferrer" })}
                      className="group flex min-h-16 items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="block text-lg transition-colors group-hover:text-accent">{item.title}</span>
                        <span className="block text-sm text-muted">{item.text}</span>
                      </span>
                      <span className="text-2xl transition-all group-hover:translate-x-1 group-hover:text-accent">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <Media label="Heona · No Yellow · Sweet" tone={2} className="min-h-64 md:min-h-full" />
        </div>
      </div>
    </section>
  );
}
