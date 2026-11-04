"use client";

import React, { useState } from "react";
import { Download, Sparkles, Printer } from "lucide-react";

export default function CvMaker() {
  const [data, setData] = useState({
    name: "মো: আরিফুল ইসলাম",
    title: "কম্পিউটার অপারেটর ও অফিস সহকারী",
    phone: "017XXXXXXXX",
    email: "example@gmail.com",
    address: "ঢাকা, বাংলাদেশ",
    summary: "দক্ষ ও অভিজ্ঞ কর্মী, দ্রুত টাইপিং ও সকল প্রকার অফিশিয়াল অনলাইন সেবায় পারদর্শী।",
    skills: "MS Word, Excel, বাংলা ও ইংরেজি টাইপিং, অনলাইন আবেদন",
    education: "এইচএসসি (ব্যবসায় শিক্ষা) - ঢাকা বোর্ড (২০২২)"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="no-print bg-white p-6 rounded-xl border mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">স্মার্ট AI সিভি মেকার</h1>
        <p className="text-sm text-gray-500 mb-4">তথ্য পরিবর্তন করুন এবং সাথে সাথে ডানপাশে প্রিভিউ ও প্রিন্ট করুন।</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <input className="border p-2 rounded" placeholder="পূর্ণ নাম" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
          <input className="border p-2 rounded" placeholder="পদবী" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
          <input className="border p-2 rounded" placeholder="মোবাইল নম্বর" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
          <input className="border p-2 rounded" placeholder="ইমেইল" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
          <input className="border p-2 rounded md:col-span-2" placeholder="ঠিকানা" value={data.address} onChange={e => setData({...data, address: e.target.value})} />
          <textarea className="border p-2 rounded md:col-span-2" rows={2} placeholder="ক্যারিয়ার সামারি" value={data.summary} onChange={e => setData({...data, summary: e.target.value})} />
          <input className="border p-2 rounded md:col-span-2" placeholder="দক্ষতা (কমা দিয়ে লিখুন)" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} />
          <input className="border p-2 rounded md:col-span-2" placeholder="শিক্ষাগত যোগ্যতা" value={data.education} onChange={e => setData({...data, education: e.target.value})} />
        </div>

        <button onClick={handlePrint} className="mt-4 flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700">
          <Printer className="w-4 h-4" /> সিভি প্রিন্ট / PDF ডাউনলোড করুন
        </button>
      </div>

      {/* CV Sheet */}
      <div className="bg-white p-8 md:p-12 border shadow rounded-lg text-gray-800 font-sans">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">{data.name}</h2>
          <p className="text-emerald-700 font-medium text-lg">{data.title}</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2">
            <span>📞 {data.phone}</span>
            <span>✉️ {data.email}</span>
            <span>📍 {data.address}</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-gray-900 border-b pb-1 mb-2 text-sm uppercase">ক্যারিয়ার লক্ষ্য ও বিবরণ</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-gray-900 border-b pb-1 mb-2 text-sm uppercase">দক্ষতা সমূহ</h3>
          <p className="text-sm text-gray-700">{data.skills}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-gray-900 border-b pb-1 mb-2 text-sm uppercase">শিক্ষাগত যোগ্যতা</h3>
          <p className="text-sm text-gray-700">{data.education}</p>
        </div>
      </div>
    </div>
  );
}