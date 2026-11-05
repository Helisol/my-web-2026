export function ProductGridSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="mb-10 h-16 w-64 animate-pulse rounded-2xl bg-[var(--muted)]" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)]"
          >
            <div className="aspect-[4/5] animate-pulse bg-[var(--muted)]" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
