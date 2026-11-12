"use client";

import { useState } from "react";
import { Product } from "@/lib/products";

export function ProductCatalog({ products, live }: { products: Product[], live: boolean }) {
  // 如果没有任何数据，显示提示
  if (!products || products.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading products... (Or no products found)</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Our Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff' }}>
            {item.image_url && (
               < img src={item.image_url} alt={item.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>{item.description}</p >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>${item.price} USD</span>
                <button style={{ backgroundColor: '#000', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Inquire Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
