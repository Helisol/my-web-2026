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
      router.push("/admin/login"); // 如果没登录，踢回登录页
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

  const updateStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "new" ? "contacted" : "new";
    await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    fetchInquiries(); // 刷新列表
  };

  if (isLoading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">客户询盘管理</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            退出登录
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100 border-b">
                <th className="p-4 font-medium text-zinc-600">时间</th>
                <th className="p-4 font-medium text-zinc-600">客户需求详情</th>
                <th className="p-4 font-medium text-zinc-600">状态</th>
                <th className="p-4 font-medium text-zinc-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr key={item.id} className="border-b hover:bg-zinc-50">
                  <td className="p-4 text-sm text-zinc-500 w-48">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-zinc-800 whitespace-pre-wrap">
                    {item.message}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "new" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {item.status === "new" ? "待跟进" : "已联系"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => updateStatus(item.id, item.status)}
                      className="text-sm border px-3 py-1 rounded hover:bg-zinc-100"
                    >
                      标记为{item.status === "new" ? "已联系" : "未联系"}
                    </button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">暂无询盘数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
