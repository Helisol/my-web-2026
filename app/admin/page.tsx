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

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
    } else {
      fetchInquiries();
    }
  };

  const fetchInquiries = async () => {
    const { data } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setInquiries(data);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    fetchInquiries(); 
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>客户询盘管理</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
          退出登录
        </button>
      </div>

      {/* 彻底放弃表格，改用 Flex 卡片布局，手机端绝对不竖排 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {inquiries.map((item) => (
          <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', border: '1px solid #e5e7eb' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                🕒 {new Date(item.created_at).toLocaleString()}
              </div>
              
              <select 
                value={item.status || "new"}
                onChange={(e) => updateStatus(item.id, e.target.value)}
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  border: '1px solid #d1d5db', 
                  fontSize: '13px',
                  fontWeight: 'bold',
                  backgroundColor: item.status === 'contacted' ? '#dcfce7' : '#fee2e2',
                  color: item.status === 'contacted' ? '#166534' : '#991b1b',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="new">待跟进 (New)</option>
                <option value="contacted">已联系 (Contacted)</option>
              </select>
            </div>

            {/* 这块是文字内容，加了自动换行，手机端绝对不会变成竖条 */}
            <div style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.6' }}>
              {item.message}
            </div>

          </div>
        ))}
        {inquiries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>暂无询盘数据</div>
        )}
      </div>
    </div>
  );
}
