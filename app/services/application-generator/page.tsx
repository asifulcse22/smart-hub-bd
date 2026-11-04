"use client";

import React, { useState } from "react";
import { Printer } from "lucide-react";

export default function ApplicationGenerator() {
  const [template, setTemplate] = useState("leave");
  const [formData, setFormData] = useState({
    recipient: "বরাবর, চেয়ারম্যান মহোদয়",
    address: "১নং ইউনিয়ন পরিষদ, সদর, ঢাকা।",
    applicantName: "",
    fatherName: "",
    village: "",
    subject: "ওয়ারিশ কায়েম সনদের জন্য আবেদন।",
    reason: "",
    date: new Date().toLocaleDateString("bn-BD"),
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <div className="no-print bg-white p-6 rounded-xl border mb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">রেডি বাংলা আবেদনপত্র মেকার</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium">আবেদনকারীর নাম</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              placeholder="মো: রহিম আলী"
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">পিতা/স্বামীর নাম</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              placeholder="মো: করিম আলী"
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">গ্রাম/ঠিকানা</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              placeholder="গ্রাম: রামপুর, ডাকঘর: সদর"
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">আবেদনের বিষয়</label>
            <input
              type="text"
              className="w-full border p-2 rounded mt-1"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700"
        >
          <Printer className="w-4 h-4" /> সরাসরি প্রিন্ট / PDF সেভ করুন
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white p-12 border shadow-sm rounded-lg min-h-[600px] text-gray-900 leading-relaxed text-lg">
        <p>তারিখ: {formData.date}</p>
        <p className="mt-2">{formData.recipient}</p>
        <p>{formData.address}</p>

        <p className="font-bold mt-6 mb-4">বিষয়: {formData.subject}</p>

        <p>মহোদয়,</p>
        <p className="indent-8 mt-2 text-justify">
          বিনীত নিবেদন এই যে, আমি নিম্নস্বাক্ষরকারী {formData.applicantName || ".........."}, পিতা: {formData.fatherName || ".........."}, গ্রাম: {formData.village || ".........."} এর একজন স্থায়ী বাসিন্দা। আমার প্রয়োজনীয় দাপ্তরিক কাজের স্বার্থে উপরোক্ত বিষয়টি অনুমোদন পূর্বক সনদপত্র প্রদান করতে আপনার মর্জি হয়।
        </p>

        <p className="mt-6">
          অতএব, মহোদয়ের সমীপে বিনীত প্রার্থনা, উক্ত বিষয়টি বিবেচনা করে আমাকে প্রয়োজনীয় সনদপত্র বা অনুমোদন প্রদানে বাধিত করবেন।
        </p>

        <div className="mt-16 text-right">
          <p className="font-medium">বিনীত নিবেদক,</p>
          <p className="mt-4">{formData.applicantName || "..................."}</p>
          <p className="text-sm text-gray-600">স্বাক্ষর ও মোবাইল নম্বর</p>
        </div>
      </div>
    </div>
  );
}