import { ProductSection } from "@/components/ProductSection";
import { AIDesigner } from "@/components/AIDesigner";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* 这里是 AI 设计区 */}
      <AIDesigner />
      
      {/* 这里是商品列表区 */}
      <div id="catalog">
        <ProductSection />
      </div>
    </main>
  );
}
