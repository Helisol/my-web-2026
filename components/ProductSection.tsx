import { ProductCatalog } from "@/components/ProductCatalog";
import { getProducts } from "@/lib/products";

export async function ProductSection() {
  const { products, error, source } = await getProducts();

  if (source === "setup") {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-[0_18px_50px_-32px_rgba(48,32,16,0.45)]">
          <p className="text-xs tracking-[0.35em] text-[var(--accent)]">SETUP</p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--ink)]">还读不到商品</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            页面已经连上 Supabase，但还没有 products 表，或这张表还没开放读取权限。打开项目里的
            supabase/seed-products.sql，复制到 Supabase 控制台的 SQL Editor 里运行即可。
          </p>
          {error ? (
            <p className="mt-4 rounded-2xl bg-[var(--muted)] p-4 font-mono text-xs leading-6 text-[var(--ink)]">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  if (source === "empty") {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--card)] p-8">
          <h2 className="font-serif text-3xl text-[var(--ink)]">货架还是空的</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            表已经能读到，但里面没有数据。把 supabase/seed-products.sql 里的 insert
            语句再运行一次，刷新这个页面就会出现商品卡片。
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {source === "offline" ? (
        <div className="mx-auto mb-8 w-full max-w-6xl px-6">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-5 py-4 text-sm leading-6 text-[var(--ink-soft)]">
            暂时连不上 Supabase，先用演示商品让你看到页面效果。表建好并且网络通了之后，会自动改成数据库里的真实商品。
            {error ? (
              <span className="mt-2 block font-mono text-xs text-[var(--ink)]">
                {error}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
      <ProductCatalog products={products} live={source === "supabase"} />
    </>
  );
}
