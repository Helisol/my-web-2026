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

  // 使用绝对的内联样式，无视任何 CSS 丢失
  return (
    <section style={{ backgroundColor: '#ffffff', color: '#000000', padding: '64px 24px' }}>
      <div style={{ maxWidth: '768px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 'bold' }}>Custom Your Own Design</h2>
        <p style={{ color: '#4b5563', marginBottom: '32px' }}>Tell us your idea, our AI will bring it to life. Need samples? Send us an inquiry!</p >
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '512px', margin: '0 auto 40px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A vintage denim jacket..."
            onKeyDown={(e) => e.key === "Enter" && generateDesign()}
            style={{ 
              backgroundColor: '#ffffff', 
              color: '#000000', 
              border: '2px solid #000000', // 绝对的黑边框
              width: '100%', 
              padding: '16px', 
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={generateDesign}
            disabled={isGenerating}
            style={{ backgroundColor: '#000000', color: '#ffffff', padding: '16px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {isGenerating ? "Generating..." : "Generate Design"}
          </button>
        </div>

        <div style={{ backgroundColor: '#f3f4f6', border: '2px dashed #9ca3af', maxWidth: '512px', aspectRatio: '1/1', margin: '0 auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isGenerating && <div style={{ color: '#6b7280' }}>AI is drawing...</div>}
          {!isGenerating && !imageUrl && <div style={{ color: '#9ca3af' }}>Your design will appear here</div>}
          {imageUrl && !isGenerating && < img src={imageUrl} alt="Design" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />}
        </div>
        
        {imageUrl && (
          <div style={{ marginTop: '32px' }}>
             <button onClick={openInquiry} style={{ backgroundColor: '#14b8a6', color: '#ffffff', padding: '12px 32px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
               Love it? Contact us for a quote
             </button>
          </div>
        )}
      </div>

      {/* 弹窗部分保留原本的逻辑 */}
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
