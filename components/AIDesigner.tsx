"use client";

import { useState } from "react";

export function AIDesigner() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDesign = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setImageUrl(data.imageUrl);
    } catch (error) {
      alert("AI is busy, please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="bg-zinc-900 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-4">Custom Your Own Design</h2>
        <p className="text-zinc-400 mb-8 text-sm md:text-base">
          Tell us your idea, our AI will bring it to life. Need samples? Send us an inquiry!
        </p >
        
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A vintage denim jacket with tiger embroidery..."
            className="flex-1 p-4 rounded-xl text-black outline-none"
            onKeyDown={(e) => e.key === "Enter" && generateDesign()}
          />
          <button
            onClick={generateDesign}
            disabled={isGenerating}
            className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? "Generating..." : "Generate Design"}
          </button>
        </div>

        <div className="mt-10 max-w-lg mx-auto aspect-square bg-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative">
          {isGenerating && (
            <div className="text-zinc-400 animate-pulse text-lg">AI is drawing your design...</div>
          )}
          {!isGenerating && !imageUrl && (
            <div className="text-zinc-500 text-sm">Your design will appear here</div>
          )}
          {imageUrl && !isGenerating && (
            < img src={imageUrl} alt="AI Generated Design" className="w-full h-full object-cover" />
          )}
        </div>
        
        {imageUrl && (
          <div className="mt-8">
             <a href=" " className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-400 transition">
               Love it? Contact us for a quote
             </a >
          </div>
        )}
      </div>
    </section>
  );
}
