"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { createClient } from "@supabase/supabase-js";

// 初始化 Supabase 客户端用于提交询盘
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export function ProductCatalog({
  products,
  live,
}: {
  products: Product[];
  live: boolean;
}) {
  const [query, setQuery] = useState("");
  
  // 询盘弹窗状态
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  
  // 表单状态
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 搜索过滤
  const visible = useMemo(() => {
    return products.filter((item) =>
      item.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [products, query]);

  // 点击询盘按钮
  const openInquiry = (productName: string) => {
    setSelectedProduct(productName);
    setFormData({ ...formData, message: `I am interested in ${productName}. Please send me a quotation.` });
    setIsInquiryOpen(true);
  };

  // 提交询盘到数据库
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 写入 inquiries 表
      const { error } = await supabase.from("inquiries").insert([
        {
          message: `Company: ${formData.company}\nProduct: ${selectedProduct}\nDetails: ${formData.message}\nEmail: ${formData.email}`,
          status: "new"
        }
      ]);

      if (error) throw error;
      
      alert("Inquiry sent successfully! We will contact you soon.");
      setIsInquiryOpen(false);
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      alert("Failed to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24 relative">
      
      {/* 顶部标题和搜索框 */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs tracking-[0.35em] text-zinc-500">OUR COLLECTION</p >
          <h2 className="font-serif text-3xl text-zinc-900 md:text-4xl">Wholesale Catalog</h2>
          <p className="mt-2 text-sm text-zinc-500">
            {products.length} products available for OEM/ODM.
          </p >
        </div>
        
        <label className="block w-full md:max-w-xs">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm outline-none ring-zinc-900 transition focus:ring-1"
          />
        </label>
      </div>

      {/* 商品网格 */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <div key={item.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:shadow-lg">
            
            {/* 图片展示区 */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 text-sm">No Image</div>
              )}
            </div>
            
            {/* 信息区 */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-serif text-lg text-zinc-900">{item.name}</h3>
                {/* 美金显示 */}
                <p className="font-medium text-zinc-900 whitespace-nowrap">${item.price} USD</p >
              </div>
              <p className="mt-2 flex-1 text-sm text-zinc-500 line-clamp-3">
                {item.description || "High-quality factory direct supply. Contact us for details."}
              </p >
              
              {/* B2B 专属按钮：立即询盘 */}
              <button 
                onClick={() => openInquiry(item.name)}
                className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Inquire Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 询盘弹窗 */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Request a Quote</h2>
              <button onClick={() => setIsInquiryOpen(false)} className="text-zinc-400 hover:text-black">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input required type="text" placeholder="Your Name" className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Business Email" className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder="Company Name" className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
              <textarea required rows={4} placeholder="Tell us your requirements (Quantity, Customization)..." className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              
              <button disabled={isSubmitting} type="submit" className="mt-2 w-full rounded-full bg-zinc-900 py-3 text-white font-medium hover:bg-zinc-800 disabled:bg-zinc-400">
                {isSubmitting ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}