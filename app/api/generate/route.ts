import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await fetch("https://api.siliconflow.cn/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Kwai-Kolors/Kolors",
        prompt: prompt, 
        image_size: "1024x1024",
        batch_size: 1
      })
    });

    const data = await response.json();

    // 如果 API 报错，直接把 API 的原话抛出来
    if (!response.ok) {
      throw new Error(data.message || data.error || JSON.stringify(data));
    }

    return NextResponse.json({ imageUrl: data.images[0].url });

  } catch (error: any) {
    console.error("后端报错:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
