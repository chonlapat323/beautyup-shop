"use client";

import Link from "@/components/link";
import { useState, useMemo, useRef } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ExternalLink, Filter, MessageCircle, X } from "lucide-react";
import type { Product } from "@/lib/types";
import type { BrandCategory } from "@/lib/brand-categories";
import { LoadingImage } from "./loading-image";
import { MockImagePlaceholder } from "./mock-image-placeholder";
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [showAll, setShowAll] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Filter products by the selected subcategory keyword in their name
  const filteredProducts = useMemo(() => {
    if (activeSub === "ทั้งหมด" || activeSub === "All") {
      return products;
    }
    const q = activeSub.toLowerCase();
    return products.filter((p) => {
      const name = p.name.toLowerCase();
      if (q.includes("แชมพู") || q.includes("shampoo")) {
        return name.includes("shampoo") || name.includes("แชมพู");
      }
      if (q.includes("มาส์ค") || q.includes("mask") || q.includes("ทรีทเมนท์") || q.includes("treatment")) {
        return name.includes("mask") || name.includes("มาส์ค") || name.includes("treatment");
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
      return name.includes(q);
    });
  }, [products, activeSub]);

  const openQuickView = (p: Product) => {
    setSelectedProduct(p);
    dialogRef.current?.showModal();
  };

  const PAGE_SIZE_DEFAULT = 12;
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    if (showAll) return filteredProducts;
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage, pageSize, showAll]);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = showAll ? totalItems : Math.min(safePage * pageSize, totalItems);

  const goToPage = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    setCurrentPage(target);
    const el = document.getElementById("products-view");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [1];
    if (safePage > 3) pages.push("...");
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  return (
    <div className="container-page py-10 sm:py-16" id="products-view">
      <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-8 lg:gap-12 items-start">
        {/* Left Filter Sidebar */}
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
                    onClick={() => {
                      setActiveSub(sub);
                      setCurrentPage(1);
                    }}
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

        {/* Right Products Area */}
        <div className="space-y-6">
          {/* Header count info & page size switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line/60">
            <div>
              <p className="text-xs sm:text-sm font-medium text-ink">
                {isThai
                  ? `แสดง ${startItem}–${endItem} จากทั้งหมด ${totalItems} รายการ`
                  : `Showing ${startItem}–${endItem} of ${totalItems} products`}
              </p>
              <p className="text-[11px] sm:text-xs text-muted">
                {isThai ? `หมวดหมู่ย่อย: ${activeSub}` : `Subcategory: ${activeSub}`}
              </p>
            </div>

            {totalItems > PAGE_SIZE_DEFAULT && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted">{isThai ? "ต่อหน้า:" : "Per page:"}</span>
                <div className="inline-flex rounded-lg border border-line bg-white p-0.5 text-xs">
                  {[12, 24, 48].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setShowAll(false);
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      className={clsx(
                        "rounded-md px-2.5 py-1 font-medium transition-colors",
                        !showAll && pageSize === size
                          ? "bg-brand-pink text-white shadow-xs"
                          : "text-muted hover:text-ink",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className={clsx(
                      "rounded-md px-2.5 py-1 font-medium transition-colors",
                      showAll ? "bg-brand-pink text-white shadow-xs" : "text-muted hover:text-ink",
                    )}
                  >
                    {isThai ? "ทั้งหมด" : "All"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              {/* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet/desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {paginatedProducts.map((p) => {
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
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 mb-3 sm:mb-4">
                          {p.imageUrl ? (
                            <LoadingImage
                              src={p.imageUrl}
                              alt={p.name}
                              className="size-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <MockImagePlaceholder label={p.name} />
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

              {/* Pagination Controls */}
              {totalPages > 1 && !showAll && (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line">
                  <p className="text-xs sm:text-sm text-muted order-2 sm:order-1">
                    {isThai
                      ? `หน้า ${safePage} จาก ${totalPages}`
                      : `Page ${safePage} of ${totalPages}`}
                  </p>

                  <nav aria-label="Pagination" className="flex items-center gap-1.5 order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={() => goToPage(safePage - 1)}
                      disabled={safePage === 1}
                      className="inline-flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-xs sm:text-sm font-medium text-ink transition-colors hover:bg-sand/40 disabled:opacity-30 disabled:pointer-events-none"
                      aria-label={isThai ? "หน้าก่อนหน้า" : "Previous page"}
                    >
                      <ChevronLeft className="size-4" />
                      <span className="hidden sm:inline">{isThai ? "ก่อนหน้า" : "Previous"}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {pageNumbers.map((p, idx) => {
                        if (p === "...") {
                          return (
                            <span key={`ellipsis-${idx}`} className="px-2 text-muted text-xs">
                              ...
                            </span>
                          );
                        }
                        const isCurrent = p === safePage;
                        return (
                          <button
                            key={`page-${p}`}
                            type="button"
                            onClick={() => goToPage(Number(p))}
                            className={clsx(
                              "size-9 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200",
                              isCurrent
                                ? "bg-brand-pink text-white shadow-sm"
                                : "text-muted hover:bg-sand/40 hover:text-ink border border-transparent hover:border-line",
                            )}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => goToPage(safePage + 1)}
                      disabled={safePage === totalPages}
                      className="inline-flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-xs sm:text-sm font-medium text-ink transition-colors hover:bg-sand/40 disabled:opacity-30 disabled:pointer-events-none"
                      aria-label={isThai ? "หน้าถัดไป" : "Next page"}
                    >
                      <span className="hidden sm:inline">{isThai ? "ถัดไป" : "Next"}</span>
                      <ChevronRight className="size-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-line p-10 sm:p-16 text-center">
              <p className="text-muted text-base">
                {isThai
                  ? "ไม่พบสินค้าในหมวดหมู่นี้ กรุณาเลือกหมวดหมู่อื่น"
                  : "No products found in this category. Please select another category."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveSub(subCategories[0] || (isThai ? "ทั้งหมด" : "All"));
                  setCurrentPage(1);
                }}
                className="btn btn-outline mt-4"
              >
                {isThai ? "ดูสินค้าทั้งหมด" : "View all products"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {/* Same quick view as the product grid elsewhere on the site */}
      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-3xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        {selectedProduct && (
          <div className="grid max-h-[85dvh] grid-cols-1 overflow-y-auto sm:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 sm:aspect-auto sm:h-full">
              {selectedProduct.imageUrl ? (
                <LoadingImage src={selectedProduct.imageUrl} alt={selectedProduct.name} className="size-full object-cover object-center" />
              ) : (
                <MockImagePlaceholder label={selectedProduct.name} />
              )}
            </div>
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                aria-label={dict.common.close}
                onClick={() => dialogRef.current?.close()}
                className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
              >
                <X className="size-5" />
              </button>
              <p className="eyebrow text-brand-pink">{brandName || "Brand"}</p>
              <h3 className="mt-2 pr-10 font-display text-xl leading-snug font-bold text-ink sm:text-2xl">{selectedProduct.name}</h3>
              <p className="mt-4 font-display text-2xl font-extrabold text-brand-pink">{formatPrice(selectedProduct.price)}</p>
              {selectedProduct.description && <p className="mt-4 text-sm text-muted">{selectedProduct.description}</p>}
              <Link
                href={`/contact/salon-partner?product=${encodeURIComponent(selectedProduct.name)}`}
                className="btn btn-primary mt-8 w-full"
              >
                <MessageCircle className="size-4" />
                {dict.common.contactToOrder}
              </Link>
              <Link href={`/product/${selectedProduct.slug}`} className="btn btn-outline mt-2 w-full">
                {dict.product.viewDetails}
              </Link>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
