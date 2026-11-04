"use client";

import React, { useState } from "react";
import { Download, FileUp } from "lucide-react";
import { jsPDF } from "jspdf";

export default function PdfTools() {
  const [images, setImages] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          urls.push(reader.result);
          if (urls.length === files.length) {
            setImages((prev) => [...prev, ...urls]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const generatePdf = () => {
    if (images.length === 0) return;
    const doc = new jsPDF();
    images.forEach((img, index) => {
      if (index > 0) doc.addPage();
      doc.addImage(img, "JPEG", 15, 15, 180, 240);
    });
    doc.save("converted_document.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border mt-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ইমেজ টু PDF কনভার্টার</h1>
      <p className="text-sm text-gray-500 mb-4">একাধিক ছবি সিলেক্ট করুন এবং এক ফাইলে PDF ডাউনলোড করুন।</p>

      <input type="file" multiple accept="image/*" onChange={handleFiles} className="border p-2 rounded w-full mb-4" />

      {images.length > 0 && (
        <div>
          <p className="text-xs text-emerald-600 font-semibold mb-2">{images.length}টি ছবি যুক্ত হয়েছে</p>
          <button
            onClick={generatePdf}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700"
          >
            <Download className="w-4 h-4" /> PDF ডাউনলোড করুন
          </button>
        </div>
      )}
    </div>
  );
}