"use client";

import React, { useState } from "react";
import { Copy, Upload, Loader2 } from "lucide-react";

export default function AiOcr() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleExtract = async () => {
    if (!image) return;
    setLoading(true);
    setText("");
    try {
      const res = await fetch("/api/ai/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ocr", imageBase64: image }),
      });
      const data = await res.json();
      setText(data.result || data.error);
    } catch {
      setText("টেক্সট রূপান্তর করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border mt-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ছবি থেকে টেক্সট কনভার্টার (AI OCR)</h1>
      <p className="text-sm text-gray-500 mb-4">স্ক্যান করা বা তোলা বাংলা/ইংরেজি কাগজের ছবি দিন।</p>

      <input type="file" accept="image/*" onChange={handleImage} className="border p-2 rounded w-full mb-3" />

      {image && <img src={image} alt="Upload" className="max-h-48 rounded border object-contain mb-4 mx-auto" />}

      <button
        onClick={handleExtract}
        disabled={loading || !image}
        className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "টেক্সট রূপান্তর করুন"}
      </button>

      {text && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border relative">
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="absolute top-3 right-3 text-xs bg-white border px-2 py-1 rounded flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> কপি
          </button>
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">{text}</pre>
        </div>
      )}
    </div>
  );
}