"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("登录失败：账号或密码错误！");
      setIsLoading(false);
    } else {
      // 登录成功，跳转到管理后台
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-zinc-800">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p >}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-zinc-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border p-2 rounded-md focus:ring-1 focus:ring-zinc-900" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-zinc-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border p-2 rounded-md focus:ring-1 focus:ring-zinc-900" />
        </div>
        
        <button disabled={isLoading} type="submit" className="w-full bg-zinc-900 text-white py-2 rounded-md hover:bg-zinc-800 disabled:bg-zinc-400">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
