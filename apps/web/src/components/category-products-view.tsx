"use client";

import Image from "next/image";
import Link from "@/components/link";
import { useState, useMemo, useRef } from "react";
import clsx from "clsx";
import { ExternalLink, Filter, MessageCircle, X } from "lucide-react";
import type { Product } from "@/lib/types";
import type { BrandCategory } from "@/lib/brand-categories";
import { formatPrice } from "./ui";
import { useDict } from "@/i18n/client";

interface CategoryProductsViewProps {
  category: BrandCategory;
  products: Product[];
  brandName?: string;
  brandSlug: string;
}

export function CategoryProductsView({
  category,
  products,
  brandName,
  brandSlug,
}: CategoryProductsViewProps) {
  const dict = useDict();
  const isThai = dict.common.loading === "กำลังโหลด";

  // Subcategories from category data or defaults
  const subCategories = useMemo(() => {
    if (category.subCategories && category.subCategories.length > 0) {
      return category.subCategories;
    }
    return [
      isThai ? "ทั้งหมด" : "All",
      isThai ? "แชมพู" : "Shampoo",
      isThai ? "มาส์ค&ทรีทเมนท์" : "Mask & Treatment",
      isThai ? "ลีฟอิน" : "Leave In",
    ];
  }, [category.subCategories, isThai]);

  const [activeSub, setActiveSub] = useState<string>(subCategories[0] || (isThai ? "ทั้งหมด" : "All"));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Filter products by selected subcategory keyword in name or category
  const filteredProducts = useMemo(() => {
    if (activeSub === "ทั้งหมด" || activeSub === "All") {
      return products;
    }
    const q = activeSub.toLowerCase();
    return products.filter((p) => {
      const name = p.name.toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const series = (p.series || "").toLowerCase();
      if (q.includes("แชมพู") || q.includes("shampoo")) {
        return name.includes("shampoo") || name.includes("แชมพู") || cat.includes("shampoo");
      }
      if (q.includes("มาส์ค") || q.includes("mask") || q.includes("ทรีทเมนท์") || q.includes("treatment")) {
        return name.includes("mask") || name.includes("มาส์ค") || name.includes("treatment") || cat.includes("mask");
      }
      if (q.includes("ลีฟอิน") || q.includes("leave in")) {
        return name.includes("leave in") || name.includes("ลีฟอิน") || name.includes("potion");
      }
      if (q.includes("บลูโฟม") || q.includes("foam")) {
        return name.includes("foam") || name.includes("โฟม");
      }
      if (q.includes("สเปรย์") || q.includes("spray") || q.includes("mist")) {
        return name.includes("mist") || name.includes("สเปรย์") || name.includes("cream");
      }
      return name.includes(q) || cat.includes(q) || series.includes(q);
    });
  }, [products, activeSub]);

  const openQuickView = (p: Product) => {
    setSelectedProduct(p);
    dialogRef.current?.showModal();
  };

  return (
    <div className="container-page py-10 sm:py-16" id="products-view">
      <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-8 lg:gap-12 items-start">
        {/* Left Filter Sidebar (matches Image 2) */}
        <aside className="lg:sticky lg:top-28 space-y-6">
          <div className="border-b border-line pb-4">
            <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2">
              <Filter className="size-4 text-brand-pink" />
              <span>{isThai ? "กรองตาม" : "Filter by"}</span>
            </h3>
          </div>

          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-line/60">
              <span className="text-sm font-semibold text-ink">
                {isThai ? "หมวดหมู่" : "Category"}
              </span>
              <span className="text-xs text-muted">—</span>
            </div>

            {/* Subcategory List (Vertical on Desktop, Horizontal scroll on Mobile) */}
            <div
              role="tablist"
              className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col lg:space-y-1"
            >
              {subCategories.map((sub) => {
                const isSelected = activeSub === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveSub(sub)}
                    className={clsx(
                      "rounded-xl px-3.5 py-2 text-left text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 lg:w-full flex items-center justify-between",
                      isSelected
                        ? "bg-brand-pink text-white shadow-sm"
                        : "text-muted hover:bg-sand/40 hover:text-ink",
                    )}
                  >
                    <span>{sub}</span>
                    {isSelected && (
                      <span className="hidden lg:inline-block size-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Products Area (matches Image 2) */}
        <div className="space-y-6">
          {/* Header count info */}
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-muted">
              {isThai
                ? `แสดง ${filteredProducts.length} รายการ ในหมวดหมู่ ${activeSub}`
                : `Showing ${filteredProducts.length} products in ${activeSub}`}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            /* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet/desktop */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((p) => {
                const hasHot = p.badges?.some((b) => b.toLowerCase().includes("hot"));
                const hasNew = p.badges?.some((b) => b.toLowerCase().includes("new"));
                const primaryBadge = p.badges && p.badges.length > 0 ? p.badges[0] : null;

                return (
                  <div
                    key={p.slug}
                    className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-line bg-white p-3.5 sm:p-5 transition-all duration-300 hover:border-brand-pink/50 hover:shadow-xl hover:shadow-brand-pink/10"
                  >
                    <div>
                      {/* Product Image Frame */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-50 mb-3 sm:mb-4">
                        {p.imageUrl ? (
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-sand/30 text-xs text-muted">
                            {brandName || "Product"}
                          </div>
                        )}

                        {/* Top Badge (Hot / New / Sale) */}
                        {primaryBadge && (
                          <span
                            className={clsx(
                              "absolute top-2 left-2 z-10 rounded-md px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm",
                              hasHot
                                ? "bg-blue-600"
                                : hasNew
                                  ? "bg-emerald-600"
                                  : "bg-brand-pink",
                            )}
                          >
                            {primaryBadge}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-medium text-xs sm:text-sm md:text-base text-ink line-clamp-2 leading-snug group-hover:text-brand-pink transition-colors">
                        {p.name}
                      </h4>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                      <span className="font-display font-semibold text-sm sm:text-base md:text-lg text-ink">
                        {formatPrice(p.price)}
                      </span>

                      <button
                        type="button"
                        onClick={() => openQuickView(p)}
                        className="rounded-lg p-1.5 text-muted hover:bg-sand/40 hover:text-brand-pink transition-colors"
                        title={isThai ? "ดูรายละเอียดด่วน" : "Quick View"}
                      >
                        <ExternalLink className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-line p-10 sm:p-16 text-center">
              <p className="text-muted text-base">
                {isThai
                  ? "ไม่พบสินค้าในหมวดหมู่นี้ กรุณาเลือกหมวดหมู่อื่น"
                  : "No products found in this category. Please select another category."}
              </p>
              <button
                type="button"
                onClick={() => setActiveSub(subCategories[0] || (isThai ? "ทั้งหมด" : "All"))}
                className="btn btn-outline mt-4"
              >
                {isThai ? "ดูสินค้าทั้งหมด" : "View all products"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/60 rounded-3xl p-0 w-full max-w-lg shadow-2xl border border-line bg-white open:animate-in open:fade-in open:zoom-in-95"
      >
        {selectedProduct && (
          <div className="relative p-6 sm:p-8">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="absolute top-4 right-4 rounded-full p-2 text-muted hover:bg-sand/40 hover:text-ink transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-50 mb-6">
              {selectedProduct.imageUrl ? (
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover object-center"
                />
              ) : null}
            </div>

            <p className="eyebrow text-brand-pink">{brandName || "Brand"}</p>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-ink">
              {selectedProduct.name}
            </h3>
            <p className="mt-4 font-display text-2xl font-extrabold text-brand-pink">
              {formatPrice(selectedProduct.price)}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href={`/product/${selectedProduct.slug}`}
                className="btn btn-primary flex-1 text-center"
              >
                {isThai ? "ดูรายละเอียดสินค้าเต็ม" : "View Full Details"}
              </Link>
              <a
                href="https://lin.ee/beautyup"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="size-4" />
                <span>{isThai ? "สอบถาม / สั่งซื้อ" : "Order / Inquire"}</span>
              </a>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
