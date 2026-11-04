"use client";

import React, { useState } from "react";
import { Copy, Languages, Loader2 } from "lucide-react";

export default function AiTranslator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "translate_or_polish", text: input }),
      });
      const data = await res.json();
      setOutput(data.result || data.error);
    } catch {
      setOutput("অনুবাদ সম্পন্ন করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border mt-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">AI অনুবাদ ও দরখাস্ত শুদ্ধিকরণ</h1>
      <p className="text-sm text-gray-500 mb-4">অগোছালো লেখা বা ইংরেজি দরখাস্ত দিন, অফিশিয়াল মানসম্পন্ন বাংলায় রূপান্তর হবে।</p>

      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border p-3 rounded-lg mb-3"
        placeholder="এখানে আপনার লেখা পেস্ট করুন..."
      />

      <button
        onClick={handleTranslate}
        disabled={loading || !input}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "শুদ্ধ ও প্রফেশনাল করুন"}
      </button>

      {output && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border relative">
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="absolute top-3 right-3 text-xs bg-white border px-2 py-1 rounded flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> কপি
          </button>
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">{output}</pre>
        </div>
      )}
    </div>
  );
}