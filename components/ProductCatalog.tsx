"use client";

import { useState } from "react";
import { Product } from "@/lib/products";

export function ProductCatalog({ products, live }: { products: Product[], live: boolean }) {
  if (!products || products.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading products...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Our Products</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            
            {/* 商品图片 */}
            {item.image_url && (
               < img src={item.image_url} alt={item.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            )}
            
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', flex: 1 }}>{item.description}</p >
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>${item.price} USD</span>
                
                {/* 询价按钮组 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* 邮件询盘按钮 */}
                  <a 
                    href= '#000', 
                      color: '#fff', 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      cursor: 'pointer', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  >
                    Email Us
                  </a >

                  {/* WhatsApp 按钮 */}
                  <a 
                    href={`https://wa.me/8613450864641?text=Hello, I am interested in ${item.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      backgroundColor: '#25D366', 
                      color: '#fff', 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      cursor: 'pointer', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  >
                    WhatsApp
                  </a >
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
