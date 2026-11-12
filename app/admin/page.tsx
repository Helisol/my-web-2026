"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 新品表单状态
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", image_url: "" });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
    } else {
      fetchInquiries();
      setIsLoading(false);
    }
  };

  const fetchInquiries = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (data) setInquiries(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    fetchInquiries(); 
  };

  // 上传图片到 Supabase Storage
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("product-images").upload(fileName, file);

    if (error) {
      alert("图片上传失败: " + error.message);
    } else {
      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      setNewProduct({ ...newProduct, image_url: publicUrlData.publicUrl });
      alert("图片上传成功！");
    }
    setIsUploading(false);
  };

  // 提交新商品
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.image_url) {
      alert("请填写商品名字并上传图片！");
      return;
    }

    const { error } = await supabase.from("products").insert([{
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price) || 0,
      image_url: newProduct.image_url
    }]);

    if (error) {
      alert("添加失败: " + error.message);
    } else {
      alert("商品发布成功！");
      setNewProduct({ name: "", description: "", price: "", image_url: "" }); 
    }
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>老板管理后台</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          退出登录
        </button>
      </div>

      {/* 添加新商品区块 */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#374151' }}>➕ 发布新商品</h2>
        <form onSubmit={addProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input placeholder="商品名称 (例如: 牛仔外套)" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
          <input placeholder="商品描述 (例如: OEM/ODM, 100% Cotton)" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
          <input type="number" placeholder="价格 (例如: 25)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>上传商品图片：</label>
            <input type="file" accept="image/*" onChange={uploadImage} disabled={isUploading} />
            {isUploading && <span style={{ color: 'blue', fontSize: '14px' }}>上传中...</span>}
            {newProduct.image_url && <span style={{ color: 'green', fontSize: '14px' }}>✅ 已上传</span>}
          </div>

          <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>保存并发布到网站</button>
        </form>
      </div>

      {/* 询盘列表区块 */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#374151' }}>📩 客户询盘列表</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {inquiries.map((item) => (
          <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                🕒 {new Date(item.created_at).toLocaleString()}
              </div>
              <select value={item.status || "new"} onChange={(e) => updateStatus(item.id, e.target.value)} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: 'bold', backgroundColor: item.status === 'contacted' ? '#dcfce7' : '#fee2e2', color: item.status === 'contacted' ? '#166534' : '#991b1b', outline: 'none', cursor: 'pointer' }}>
                <option value="new">待跟进 (New)</option>
                <option value="contacted">已联系 (Contacted)</option>
              </select>
            </div>
            <div style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.6' }}>
              {item.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
