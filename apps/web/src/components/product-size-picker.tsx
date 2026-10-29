"use client";

import clsx from "clsx";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product, ProductSize } from "@/lib/types";
import { formatPrice } from "./ui";

export function ProductSizePicker({
  product,
  phone,
  callLabel,
  contactToOrderLabel,
  orderTitle,
  orderText,
  priceLabel,
}: {
  product: Product;
  phone?: string;
  callLabel: string;
  contactToOrderLabel: string;
  orderTitle: string;
  orderText: string;
  priceLabel: string;
}) {
  const sizes = (product.sizes ?? []).filter(
    (s): s is ProductSize => Boolean(s && (s.size !== "" && s.size != null)),
  );
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const selectedSize = sizes[selectedIdx];
  const currentPrice = selectedSize ? selectedSize.price : product.price;

  const orderProductParam = selectedSize
    ? `${product.name} (${selectedSize.size} ${selectedSize.unit || "ML"}) - ${formatPrice(currentPrice)}`
    : product.name;

  return (
    <div>
      {/* Price Display */}
      <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
        <span className="sr-only">{priceLabel}</span>
        <span className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          {formatPrice(currentPrice)}
        </span>
      </p>

      {/* Dynamic Sizes Selector (ML) */}
      {sizes.length > 0 && (
        <div className="mt-6 border-t border-line/70 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              ขนาด / ปริมาณ (ML):
            </span>
            {selectedSize && (
              <span className="text-xs font-medium text-brand-pink">
                {selectedSize.size} {selectedSize.unit || "ML"} · {formatPrice(selectedSize.price)}
              </span>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {sizes.map((s, idx) => {
              const active = idx === selectedIdx;
              const unit = s.unit || "ML";
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={clsx(
                    "group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                    active
                      ? "border border-brand-pink bg-brand-pink text-white shadow-xs"
                      : "border border-line bg-white text-ink hover:border-brand-pink hover:text-brand-pink",
                  )}
                >
                  <span className="font-semibold">{s.size} {unit}</span>
                  <span
                    className={clsx(
                      "text-xs transition-colors",
                      active ? "text-white/85" : "text-muted group-hover:text-brand-pink",
                    )}
                  >
                    ({formatPrice(s.price)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Order CTA Box */}
      <div className="mt-8 rounded-3xl border border-line bg-mist p-6">
        <p className="font-medium">{orderTitle}</p>
        <p className="mt-1 text-sm text-muted">{orderText}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/contact/salon-partner?product=${encodeURIComponent(orderProductParam)}`}
            className="btn btn-primary"
          >
            <MessageCircle className="size-4" />
            {contactToOrderLabel}
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replaceAll("-", "")}`}
              className="btn btn-outline"
            >
              <Phone className="size-4" />
              {callLabel} {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
