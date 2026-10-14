"use client";

import clsx from "clsx";
import { MessageCircle, X } from "lucide-react";
import Link from "@/components/link";
import { useMemo, useRef, useState } from "react";
import { useDict } from "@/i18n/client";
import type { Product } from "@/lib/types";
import { Badge, Media, formatPrice, stagger } from "./ui";

const PAGE_SIZE = 8;

export function ProductGrid({
  products,
  brandNames,
  showFilter = true,
}: {
  products: Product[];
  brandNames: Record<string, string>;
  showFilter?: boolean;
}) {
  const dict = useDict();
  const [brand, setBrand] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const brandsInList = useMemo(
    () => [...new Set(products.map((p) => p.brandSlug))],
    [products],
  );
  const filtered = brand === "all" ? products : products.filter((p) => p.brandSlug === brand);

  const openQuickView = (p: Product) => {
    setSelected(p);
    dialogRef.current?.showModal();
  };

  return (
    <>
      {showFilter && brandsInList.length > 1 && (
        <div
          role="tablist"
          aria-label={dict.common.filterByBrand}
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {["all", ...brandsInList].map((slug) => (
            <button
              key={slug}
              type="button"
              role="tab"
              aria-selected={brand === slug}
              onClick={() => {
                setBrand(slug);
                setVisible(PAGE_SIZE);
              }}
              className={clsx(
                "min-h-10 shrink-0 rounded-full border px-4.5 py-1 text-sm font-medium whitespace-nowrap transition-all duration-300",
                brand === slug
                  ? "border-brand-pink bg-brand-pink text-white shadow-md shadow-brand-pink/25"
                  : "border-line/80 bg-white/90 text-ink/80 hover:border-brand-pink hover:bg-white hover:text-brand-pink hover:shadow-lg hover:shadow-brand-pink/20 hover:-translate-y-0.5 active:scale-95",
              )}
            >
              {slug === "all" ? dict.common.all : brandNames[slug] ?? slug}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {filtered.slice(0, visible).map((p, i) => (
          <li key={p.slug} data-reveal suppressHydrationWarning style={stagger(i % 4)} className="group relative">
            {/* The card links to the product page; "Quick view" opens the dialog on top */}
            <Link href={`/product/${p.slug}`} className="block">
              <div className="card-lift relative overflow-hidden rounded-2xl border border-transparent">
                <Media
                  src={p.imageUrl}
                  alt={p.name}
                  label={brandNames[p.brandSlug]}
                  tone={i}
                  className="card-img aspect-[4/5] w-full"
                />
                {p.badges?.length ? (
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1 sm:top-3 sm:left-3">
                    {p.badges.map((b) => (
                      <Badge key={b}>{b}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="mt-3 text-xs tracking-wide text-muted uppercase">
                {brandNames[p.brandSlug]}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-snug transition-colors group-hover:text-accent sm:text-base">{p.name}</p>
              <Price product={p} className="mt-2" />
            </Link>
            {/* Same box as the image, so the button sits at the image's bottom edge */}
            <div className="pointer-events-none absolute inset-x-0 top-0 hidden aspect-[4/5] sm:block">
              <button
                type="button"
                onClick={() => openQuickView(p)}
                className="pointer-events-auto absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/90 py-2 text-center text-sm opacity-0 backdrop-blur transition-all group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white focus-visible:opacity-100"
              >
                {dict.common.quickView}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {visible < filtered.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            {dict.common.loadMore(filtered.length - visible)}
          </button>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setSelected(null)}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-3xl bg-cream p-0 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        {selected && (
          <div className="grid max-h-[85dvh] grid-cols-1 overflow-y-auto sm:grid-cols-2">
            <Media
              src={selected.imageUrl}
              alt={selected.name}
              label={brandNames[selected.brandSlug]}
              className="aspect-square w-full sm:aspect-auto sm:h-full"
            />
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                aria-label={dict.common.close}
                onClick={() => dialogRef.current?.close()}
                className="absolute top-3 right-3 grid size-11 place-items-center rounded-full hover:bg-sand"
              >
                <X className="size-5" />
              </button>
              <p className="eyebrow">{brandNames[selected.brandSlug]}</p>
              <h3 className="mt-2 pr-10 font-display text-2xl leading-snug">{selected.name}</h3>
              <Price product={selected} className="mt-4 text-lg" />
              <p className="mt-4 text-sm text-muted">
                {selected.description ?? dict.common.orderNote}
              </p>
              <Link
                href={`/contact/salon-partner?product=${encodeURIComponent(selected.name)}`}
                className="btn btn-primary mt-8 w-full"
              >
                <MessageCircle className="size-4" />
                {dict.common.contactToOrder}
              </Link>
              <Link href={`/product/${selected.slug}`} className="btn btn-outline mt-2 w-full">
                {dict.product.viewDetails}
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function Price({ product, className }: { product: Product; className?: string }) {
  return (
    <p className={clsx("flex flex-wrap items-baseline gap-x-2", className)}>
      {product.salePrice ? (
        <>
          <span className="font-medium text-accent">{formatPrice(product.salePrice)}</span>
          <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>
        </>
      ) : (
        <span className="font-medium">{formatPrice(product.price)}</span>
      )}
    </p>
  );
}
