"use client";

import React, { useState, useRef } from "react";
import { Download, Upload } from "lucide-react";

export default function PassportPhotoMaker() {
  const [image, setImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setImage(img.src);
        drawCanvas(img, bgColor);
      };
      // reader.target এর বদলে reader.result
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = (img: HTMLImageElement, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 413; // পাসপোর্ট সাইজ স্ট্যান্ডার্ড (35mm x 45mm at 300 DPI)
    canvas.height = 531;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ব্যাকগ্রাউন্ড কালার দেওয়া
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ইমেজ সেন্টারে ড্র করা
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border mt-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">পাসপোর্ট সাইজ ফটো মেকার</h1>
      <p className="text-sm text-gray-500 mb-4">পাসপোর্ট সাইজ (৩৫ মিমি × ৪৫ মিমি) ছবি প্রস্তুত করুন।</p>

      <input type="file" accept="image/*" onChange={handleUpload} className="border p-2 rounded w-full mb-4" />

      <div className="flex gap-4 items-center mb-6">
        <span className="text-sm font-medium">ব্যাকগ্রাউন্ড রঙ:</span>
        <button onClick={() => { setBgColor("#ffffff"); if(image){ const img = new Image(); img.src=image; img.onload=()=>drawCanvas(img, "#ffffff"); } }} className="px-4 py-1.5 border rounded text-xs bg-white text-gray-800">সাদা</button>
        <button onClick={() => { setBgColor("#00a2ed"); if(image){ const img = new Image(); img.src=image; img.onload=()=>drawCanvas(img, "#00a2ed"); } }} className="px-4 py-1.5 border rounded text-xs bg-[#00a2ed] text-white">অফিশিয়াল নীল</button>
      </div>

      <div className="flex flex-col items-center">
        <canvas ref={canvasRef} className="border shadow rounded max-w-[200px]" />
        {image && (
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.download = "passport-photo.jpg";
              link.href = canvasRef.current?.toDataURL("image/jpeg") || "";
              link.click();
            }}
            className="mt-4 flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg"
          >
            <Download className="w-4 h-4" /> ডাউনলোড পাসপোর্ট ছবি
          </button>
        )}
      </div>
    </div>
  );
}