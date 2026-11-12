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

  // 使用最原始的内联样式，绝对不乱
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>客户询盘管理</h1>
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          退出登录
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', width: '150px' }}>时间</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>客户需求详情</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', width: '150px' }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px', color: '#666' }}>
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {item.message}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <select 
                    value={item.status || "new"}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="new">待跟进 (New)</option>
                    <option value="contacted">已联系 (Contacted)</option>
                  </select>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center' }}>暂无询盘数据</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
