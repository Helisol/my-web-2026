import { createClient } from "@supabase/supabase-js";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  image_url?: string;
};

export async function getProducts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return { 
      products: (data as Product[]) || [], 
      error: null, 
      source: data && data.length > 0 ? "live" : "empty" 
    };

  } catch (err: any) {
    console.error("获取商品失败:", err.message);
    return { 
      products: [], 
      error: err.message, 
      source: "offline" 
    };
  }
} 
