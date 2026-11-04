import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { action, text, imageBase64, mimeType } = await req.json();

    let prompt = "";
    let contents: any[] = [];

    // ১. স্ক্যান ইমেজ থেকে টেক্সট বের করা (Bangla/English OCR)
    if (action === "ocr") {
      prompt = "Extract all text (Bengali or English) from this image accurately. Keep formatting intact. Do not add any extra explanation.";
      contents = [
        {
          inlineData: {
            data: imageBase64.split(",")[1],
            mimeType: mimeType || "image/jpeg"
          }
        },
        prompt
      ];
    }
    // ২. অনুবাদ ও দরখাস্ত প্রুফরিডিং
    else if (action === "translate_or_polish") {
      prompt = `You are an expert official letter writer in Bangladesh. Polish or translate the following text into formal, error-free standard formal Bengali for official/application purposes:\n\n${text}`;
      contents = [prompt];
    }
    // ৩. সিভির প্রফেশনাল সামারি তৈরি
    else if (action === "cv_summary") {
      prompt = `Create a professional 3-sentence CV summary/objective for a candidate with skills/role: "${text}". Make it modern and impactful in English.`;
      contents = [prompt];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "প্রসেস করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}