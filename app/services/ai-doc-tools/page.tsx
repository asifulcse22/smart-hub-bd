"use client";

import React, { useState } from "react";
import { Copy, FileText, Languages, Loader2, Upload } from "lucide-react";

export default function AiDocTools() {
  const [activeTab, setActiveTab] = useState<"ocr" | "translate">("ocr");
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // reader.target এর পরিবর্তে সরাসরি reader.result ব্যবহার করুন
      if (typeof reader.result === "string") {
        setInputImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunAi = async () => {
    setLoading(true);
    setResult("");
    try {
      const payload = activeTab === "ocr"
        ? { action: "ocr", imageBase64: inputImage, mimeType: "image/jpeg" }
        : { action: "translate_or_polish", text: inputText };

      const res = await fetch("/api/ai/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err) {
      setResult("সার্ভারে ত্রুটি হয়েছে। পরে চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl border mt-6 shadow-sm">
      <div className="flex border-b mb-6">
        <button
          onClick={() => { setActiveTab("ocr"); setResult(""); }}
          className={`pb-3 px-4 flex items-center gap-2 font-medium border-b-2 ${activeTab === "ocr" ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500"}`}
        >
          <FileText className="w-4 h-4" /> ছবি থেকে বাংলা টেক্সট (OCR)
        </button>
        <button
          onClick={() => { setActiveTab("translate"); setResult(""); }}
          className={`pb-3 px-4 flex items-center gap-2 font-medium border-b-2 ${activeTab === "translate" ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500"}`}
        >
          <Languages className="w-4 h-4" /> AI অনুবাদ ও শুদ্ধিকরণ
        </button>
      </div>

      {activeTab === "ocr" ? (
        <div className="mb-4">
          <input type="file" accept="image/*" onChange={handleImage} className="border p-2 rounded w-full" />
          {inputImage && <img src={inputImage} alt="preview" className="h-40 mt-3 rounded border object-contain" />}
        </div>
      ) : (
        <div className="mb-4">
          <textarea
            rows={4}
            className="w-full border p-3 rounded-lg"
            placeholder="আপনার অগোছালো ইংরেজি বা বাংলা লেখাটি এখানে পেস্ট করুন..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleRunAi}
        disabled={loading || (activeTab === "ocr" && !inputImage) || (activeTab === "translate" && !inputText)}
        className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "প্রসেস করুন"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border relative">
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border"
          >
            <Copy className="w-3.5 h-3.5" /> কপি করুন
          </button>
          <h4 className="font-semibold text-gray-700 mb-2">ফলাফল:</h4>
          <pre className="whitespace-pre-wrap font-sans text-gray-800">{result}</pre>
        </div>
      )}
    </div>
  );
}