"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Product } from "@/lib/products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export function ProductCatalog({ products, live }: { products: Product[], live: boolean }) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openInquiry = (productName: string) => {
    setSelectedProduct(productName);
    setFormData({ ...formData, message: `I am interested in ${productName}. Please send me a quotation.` });
    setIsInquiryOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
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

  if (!products || products.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading products...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Our Products</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            
            {item.image_url && (
               < img src={item.image_url} alt={item.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            )}
            
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', flex: 1 }}>{item.description}</p >
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>${item.price} USD</span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* 弹窗询盘按钮 */}
                  <button 
                    onClick={() => openInquiry(item.name)}
                    style={{ backgroundColor: '#000', color: '#fff', padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Inquire Now
                  </button>

                  {/* WhatsApp 按钮直接跳转 */}
                  <a 
                    href= "_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: '#25D366', color: '#fff', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', textAlign: 'center' }}
                  >
                    WhatsApp
                  </a >
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 询盘弹窗 */}
      {isInquiryOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>Request a Quote</h3>
              <button onClick={() => setIsInquiryOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', color: '#000' }} />
              <input required type="email" placeholder="Business Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', color: '#000' }} />
              <input required type="text" placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', color: '#000' }} />
              <textarea required rows={3} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px', color: '#000' }} />
              <button disabled={isSubmitting} type="submit" style={{ backgroundColor: '#10b981', color: '#fff', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                {isSubmitting ? "Sending..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
