"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 初始化 Supabase 客户端（为了能把留言存进数据库）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export function AIDesigner() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 弹窗和表单状态
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateDesign = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setImageUrl(data.imageUrl);
    } catch (error: any) {
      alert("报错详情: " + (error.message || "未知错误"));
    } finally {
      setIsGenerating(false);
    }
  };

  // 点击获取报价按钮，打开弹窗并自动填入需求
  const openInquiry = () => {
    setFormData({ 
      ...formData, 
      message: `I am interested in this AI designed item: ${prompt}. Please send me a quotation.` 
    });
    setIsInquiryOpen(true);
  };

  // 提交询盘到数据库
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("inquiries").insert([
        {
          message: `Company: ${formData.company}\nAI Design Prompt: ${prompt}\nDetails: ${formData.message}\nEmail: ${formData.email}`,
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
    <section className="bg-zinc-900 text-white py-16 px-6 relative">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-4">Custom Your Own Design</h2>
        <p className="text-zinc-400 mb-8 text-sm md:text-base">
          Tell us your idea, our AI will bring it to life. Need samples? Send us an inquiry!
        </p >
        
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A vintage denim jacket with tiger embroidery..."
            className="flex-1 p-4 rounded-xl text-black outline-none"
            onKeyDown={(e) => e.key === "Enter" && generateDesign()}
          />
          <button
            onClick={generateDesign}
            disabled={isGenerating}
            className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? "Generating..." : "Generate Design"}
          </button>
        </div>

        <div className="mt-10 max-w-lg mx-auto aspect-square bg-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative">
          {isGenerating && (
            <div className="text-zinc-400 animate-pulse text-lg">AI is drawing your design...</div>
          )}
          {!isGenerating && !imageUrl && (
            <div className="text-zinc-500 text-sm">Your design will appear here</div>
          )}
          {imageUrl && !isGenerating && (
            < img src={imageUrl} alt="AI Generated Design" className="w-full h-full object-cover" />
          )}
        </div>
        
        {/* 按钮改成触发弹窗 */}
        {imageUrl && (
          <div className="mt-8">
             <button onClick={openInquiry} className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-400 transition">
               Love it? Contact us for a quote
             </button>
          </div>
        )}
      </div>

      {/* AI 专属询盘弹窗 */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-black text-left">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Request a Quote</h2>
              <button onClick={() => setIsInquiryOpen(false)} className="text-zinc-400 hover:text-black">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input required type="text" placeholder="Your Name" className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Business Email" className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder="Company Name" className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
              <textarea required rows={3} placeholder="Your Requirements..." className="w-full rounded-lg border p-3 text-sm focus:ring-1" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              
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
