"use client";

import clsx from "clsx";
import Link from "@/components/link";
import { useMemo, useState } from "react";
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
  const [mainCat, setMainCat] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const brandsInList = useMemo(
    () => [...new Set(products.map((p) => p.brandSlug))],
    [products],
  );
  const mainCatsInList = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      if (p.mainCategory?.slug && p.mainCategory?.name) {
        map.set(p.mainCategory.slug, p.mainCategory.name);
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [products]);

  const filtered = products.filter((p) => {
    if (brand !== "all" && p.brandSlug !== brand) return false;
    if (mainCat !== "all" && p.mainCategory?.slug !== mainCat) return false;
    return true;
  });

  return (
    <>
      {showFilter && (brandsInList.length > 1 || mainCatsInList.length > 0) && (
        <div className="mb-8 space-y-3">
          {brandsInList.length > 1 && (
            <div
              role="tablist"
              aria-label={dict.common.filterByBrand}
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
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
                  className="btn-tab"
                >
                  {slug === "all" ? dict.common.all : brandNames[slug] ?? slug}
                </button>
              ))}
            </div>
          )}
          {mainCatsInList.length > 0 && (
            <div
              role="tablist"
              aria-label="Filter by category"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mainCat === "all"}
                onClick={() => {
                  setMainCat("all");
                  setVisible(PAGE_SIZE);
                }}
                className="btn-tab"
              >
                {dict.common.all}
              </button>
              {mainCatsInList.map((mc) => (
                <button
                  key={mc.slug}
                  type="button"
                  role="tab"
                  aria-selected={mainCat === mc.slug}
                  onClick={() => {
                    setMainCat(mc.slug);
                    setVisible(PAGE_SIZE);
                  }}
                  className="btn-tab"
                >
                  {mc.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {filtered.slice(0, visible).map((p, i) => (
          <li key={p.slug} data-reveal suppressHydrationWarning style={stagger(i % 4)} className="group relative">
            <Link href={`/product/${p.slug}`} className="block">
              <div className="card-lift relative overflow-hidden rounded-2xl border border-transparent">
                <Media
                  src={p.imageUrl}
                  alt={p.name}
                  label={brandNames[p.brandSlug] || p.brandName}
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
                {brandNames[p.brandSlug] || p.brandName}
                {p.mainCategory?.name ? ` · ${p.mainCategory.name}` : ""}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-snug transition-colors group-hover:text-accent sm:text-base">{p.name}</p>
              <Price product={p} className="mt-2" />
            </Link>
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
