"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export function ProductCatalog({
  products,
  live,
}: {
  products: Product[];
  live: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");

  const categories = useMemo(() => {
    const values = new Set(
      products.map((item) => item.category).filter((item): item is string => Boolean(item)),
    );
    return ["全部", ...Array.from(values)];
  }, [products]);

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((item) => {
      const matchCategory = category === "全部" || item.category === category;
      const matchQuery =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        (item.description ?? "").toLowerCase().includes(keyword);
      return matchCategory && matchQuery;
    });
  }, [products, query, category]);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs tracking-[0.35em] text-[var(--accent)]">CATALOG</p>
          <h2 className="font-serif text-3xl text-[var(--ink)] md:text-4xl">本季上架</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            共 {products.length} 件，{live ? "数据来自你的 Supabase products 表。" : "当前是演示数据。"}
          </p>
        </div>
        <label className="block w-full md:max-w-xs">
          <span className="sr-only">搜索商品</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索名称或介绍"
            className="w-full rounded-full border border-[var(--line)] bg-[var(--card)] px-5 py-3 text-sm outline-none ring-[var(--accent)] transition focus:ring-2"
          />
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              category === item
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "border border-[var(--line)] bg-[var(--card)] text-[var(--ink-soft)] hover:border-[var(--ink)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--card)] px-6 py-16 text-center text-[var(--ink-soft)]">
          没有符合条件的商品，换个关键词或分类试试。
        </div>
      )}
    </section>
  );
}
