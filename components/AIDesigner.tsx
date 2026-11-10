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
    setFormData({ ...formData, message: `I am interested in this AI designed item: ${prompt}. Please send me a quotation.` });
    setIsInquiryOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("inquiries").insert([{
        message: `Company: ${formData.company}\nAI Design Prompt: ${prompt}\nDetails: ${formData.message}\nEmail: ${formData.email}`,
        status: "new"
      }]);
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
    <section className="bg-white text-black py-16 px-6 relative">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-4">Custom Your Own Design</h2>
        <p className="text-zinc-600 mb-8 text-sm md:text-base">
          Tell us your idea, our AI will bring it to life. Need samples? Send us an inquiry!
        </p >
        
        {/* 彻底改变布局结构，用最原始的 table 布局思维来强制对齐 */}
        <div className="w-full max-w-xl mx-auto mb-10">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your design idea here..."
            style={{ 
              backgroundColor: '#ffffff !important', 
              color: '#000000 !important', 
              border: '4px solid #000000 !important', // 加粗到4像素的边框
              display: 'block !important',
              width: '100% !important', 
              height: '60px !important', // 强制高度
              padding: '16px !important', 
              fontSize: '18px !important',
              marginBottom: '16px !important',
              zIndex: 999,
              position: 'relative'
            }}
            onKeyDown={(e) => e.key === "Enter" && generateDesign()}
          />
          <button
            onClick={generateDesign}
            disabled={isGenerating}
            className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold text-lg"
          >
            {isGenerating ? "Generating..." : "Generate Design"}
          </button>
        </div>

        <div className="bg-white border-4 border-dashed border-gray-300 max-w-lg mx-auto aspect-square flex items-center justify-center rounded-2xl">
          {isGenerating && <div className="text-gray-500">AI is drawing...</div>}
          {!isGenerating && !imageUrl && <div className="text-gray-400">Your design will appear here</div>}
          {imageUrl && !isGenerating && < img src={imageUrl} alt="Design" className="w-full h-full object-cover rounded-2xl" />}
        </div>
        
        {imageUrl && (
          <div className="mt-8">
             <button onClick={openInquiry} className="bg-teal-500 text-white px-8 py-3 rounded-full font-medium text-lg">
               Love it? Contact us for a quote
             </button>
          </div>
        )}
      </div>

      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-left">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold text-black">Request a Quote</h2>
              <button onClick={() => setIsInquiryOpen(false)} className="text-zinc-400 hover:text-black">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input required type="text" placeholder="Your Name" className="w-full rounded-lg border p-3 text-sm text-black" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Business Email" className="w-full rounded-lg border p-3 text-sm text-black" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder="Company Name" className="w-full rounded-lg border p-3 text-sm text-black" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
              <textarea required rows={3} placeholder="Your Requirements..." className="w-full rounded-lg border p-3 text-sm text-black" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              <button disabled={isSubmitting} type="submit" className="mt-2 w-full rounded-full bg-zinc-900 py-3 text-white font-medium">
                {isSubmitting ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
