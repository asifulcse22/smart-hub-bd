"use client";

import React, { useState, useRef } from "react";
import { Download, Upload, Image as ImageIcon } from "lucide-react";

export default function JobResizer() {
  const [type, setType] = useState<"photo" | "signature">("photo");
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [fileSizeKB, setFileSizeKB] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetWidth = 300;
  const targetHeight = type === "photo" ? 300 : 80;
  const maxKB = type === "photo" ? 100 : 60;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setPreview(img.src);
        processResize(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processResize = (img: HTMLImageElement) => {
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    let quality = 0.9;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    // অটোমেটিক ফাইল সাইজ নির্ধারিত সীমার ভেতরে নিয়ে আসা
    while (Math.round((dataUrl.length * 3) / 4 / 1024) > maxKB && quality > 0.1) {
      quality -= 0.05;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    setOutput(dataUrl);
    setFileSizeKB(Math.round((dataUrl.length * 3) / 4 / 1024));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border mt-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">সরকারি চাকরির ছবি ও স্বাক্ষর রিসাইজার</h1>
      <p className="text-sm text-gray-500 mb-6">ছবি ৩০০×৩০০ (১০০ KB) এবং স্বাক্ষর ৩০০×৮০ (৬০ KB) অটোমেটিক কনভার্ট হবে।</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { setType("photo"); setOutput(null); }}
          className={`flex-1 py-2.5 rounded-lg border font-medium ${type === "photo" ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50"}`}
        >
          ছবি (৩০০×৩০০)
        </button>
        <button
          onClick={() => { setType("signature"); setOutput(null); }}
          className={`flex-1 py-2.5 rounded-lg border font-medium ${type === "signature" ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-50"}`}
        >
          স্বাক্ষর (৩০০×৮০)
        </button>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 mb-6">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-up" />
        <label htmlFor="file-up" className="cursor-pointer flex flex-col items-center">
          <Upload className="w-10 h-10 text-emerald-600 mb-2" />
          <span className="text-gray-700 font-medium">ফাইল সিলেক্ট করুন</span>
          <span className="text-xs text-gray-400 mt-1">JPG, JPEG বা PNG</span>
        </label>
      </div>

      {output && (
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border">
          <p className="text-xs text-emerald-600 font-semibold mb-2">
            তৈরি সম্পন্ন: {targetWidth}×{targetHeight} px | সাইজ: {fileSizeKB} KB
          </p>
          <img src={output} alt="Resized" className="border shadow-sm max-h-48 object-contain mb-4 bg-white" />
          <a
            href={output}
            download={`${type}_${targetWidth}x${targetHeight}.jpg`}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700"
          >
            <Download className="w-4 h-4" /> ডাউনলোড করুন
          </a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}