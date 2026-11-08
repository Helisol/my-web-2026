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
        model: "black-forest-labs/FLUX.1-schnell",
        prompt: `fashion clothing design, professional product photography, ${prompt}, high quality, 4k`,
        image_size: "1024x1024",
        batch_size: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to generate image");
    }

    return NextResponse.json({ imageUrl: data.images[0].url });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
