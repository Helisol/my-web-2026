import { Suspense } from 'react';
import { ProductSection } from "@/components/ProductSection";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductSection />
      </Suspense>
    </main>
  );
}
