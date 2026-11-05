"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(product.image_url) && !broken;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-[0_18px_50px_-32px_rgba(48,32,16,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(48,32,16,0.5)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--muted)]">
        {showImage ? (
          // External product URLs vary; skip next/image optimization for a beginner-friendly setup.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url ?? ""}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#f3e4cf,_#d9c3a6)] text-sm tracking-[0.3em] text-[var(--ink-soft)]">
            拾光
          </div>
        )}
        {product.category ? (
          <span className="absolute left-4 top-4 rounded-full bg-[rgba(255,252,247,0.92)] px-3 py-1 text-xs tracking-wide text-[var(--ink)]">
            {product.category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-snug text-[var(--ink)]">
            {product.name}
          </h3>
          <p className="shrink-0 text-sm font-medium text-[var(--accent)]">
            {formatPrice(product.price)}
          </p>
        </div>
        {product.description ? (
          <p className="line-clamp-3 flex-1 text-sm leading-6 text-[var(--ink-soft)]">
            {product.description}
          </p>
        ) : (
          <p className="flex-1 text-sm text-[var(--ink-soft)]">暂无介绍</p>
        )}
        <button
          type="button"
          className="mt-2 rounded-full border border-[var(--ink)] px-4 py-2 text-sm transition hover:bg-[var(--ink)] hover:text-[var(--paper)]"
        >
          加入心愿单
        </button>
      </div>
    </article>
  );
}
