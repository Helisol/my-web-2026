"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export function AIDesigner() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const openInquiry = () => {
    setFormData({ 
      ...formData, 
      message: `I am interested in this AI designed item: ${prompt}. Please send me a quotation.` 
    });
    setIsInquiryOpen(true);
  };

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
    // 整个区域背景改成纯白色，文字改成深色
    <section className="bg-white text-zinc-900 py-16 px-6 relative">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-4">Custom Your Own Design</h2>
        <p className="text-zinc-600 mb-8 text-sm md:text-base">
          Tell us your idea, our AI will bring it to life. Need samples? Send us an inquiry!
        </p >
        
        {/* 输入框和按钮：强制垂直排列 */}
        <div className="flex flex-col gap-4 max-w-xl mx-auto mb-10">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A vintage denim jacket with tiger embroidery..."
            // 关键：使用 inline style 强制白底黑框
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#000000', 
              border: '2px solid #9ca3af',
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              outline: 'none'
            }}
            onKeyDown={(e) => e.key === "Enter" && generateDesign()}
          />
          <button
            onClick={generateDesign}
            disabled={isGenerating}
            className="w-full bg-zinc-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate Design"}
          </button>
        </div>

        {/* 图片展示区：强制白底灰虚线框 */}
        <div 
          style={{
            backgroundColor: '#f9fafb',
            border: '2px dashed #d1d5db',
            borderRadius: '16px',
            maxWidth: '512px',
            margin: '0 auto',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isGenerating && (
            <div className="text-zinc-500 animate-pulse text-lg">AI is drawing your design...</div>
          )}
          {!isGenerating && !imageUrl && (
            <div className="text-zinc-400 text-sm">Your design will appear here</div>
          )}
          {imageUrl && !isGenerating && (
            < img src={imageUrl} alt="AI Generated Design" className="w-full h-full object-cover rounded-2xl" />
          )}
        </div>
        
        {/* 获取报价按钮 */}
        {imageUrl && (
          <div className="mt-8">
             <button onClick={openInquiry} className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-400 transition">
               Love it? Contact us for a quote
             </button>
          </div>
        )}
      </div>

      {/* 询盘弹窗 */}
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
