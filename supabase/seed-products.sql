export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  image_url?: string;
};

export async function getProducts() {
  // 留空，让之前的 ProductSection 自己去连数据库
  return { products: [], error: null, source: "empty" };
