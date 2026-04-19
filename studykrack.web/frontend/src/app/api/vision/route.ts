import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const prompt = `
        Role: Academic Data Architect.
        Task: Extract the student's timetable and list of subjects from this image.
        Format: Strictly return ONLY a valid JSON object.
        Structure:
        {
          "timetable": [{"day": "Monday", "subject": "Mathematics", "time": "9:00 AM - 10:00 AM"}],
          "subjects": ["Mathematics", "Data Structures", "AIML"],
          "semester_id": "SEM_2_2026",
          "semester_end_date": "2026-06-30"
        }
        Data Extraction Rule: Be extremely precise. If a subject name is abbreviated, expand it to full form.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type
        }
      }
    ]);

    const text = result.response.text().replace(/```json|```/g, "").trim();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[VISION] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
