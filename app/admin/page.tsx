."use client";

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

  // 改成了下拉框选择状态
  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from("inquiries").update({ status: newStatus }).eq("id", id);
    fetchInquiries(); 
  };

  if (isLoading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">客户询盘管理后台</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            退出登录
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-100 border-b border-zinc-200">
                <th className="p-4 font-semibold text-zinc-600 w-40">收到时间</th>
                <th className="p-4 font-semibold text-zinc-600">客户需求详情 (AI / 商品)</th>
                <th className="p-4 font-semibold text-zinc-600 w-36">跟进状态</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="p-4 text-sm text-zinc-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-zinc-800 whitespace-pre-wrap break-words">
                    {item.message}
                  </td>
                  <td className="p-4">
                    {/* 下拉框直接改状态 */}
                    <select 
                      value={item.status || "new"}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium outline-none border cursor-pointer appearance-none ${
                        item.status === "contacted" 
                          ? "bg-green-100 text-green-700 border-green-300" 
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      <option value="new">待跟进 (New)</option>
                      <option value="contacted">已联系 (Contacted)</option>
                    </select>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-zinc-500">暂无询盘数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
