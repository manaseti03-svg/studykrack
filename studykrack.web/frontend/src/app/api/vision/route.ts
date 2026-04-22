import { NextRequest, NextResponse } from 'next/server';

/**
 * FILE 4 — frontend/app/api/vision/route.ts
 */

export async function POST(req: NextRequest) {
  try {
    const uid = req.cookies.get('session')?.value;
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Image file required' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files accepted' }, { status: 400 });
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Call Gemini vision
    const prompt = `Role: Academic Data Architect.
                  Task: Extract the student timetable and subject list from this image.
                  Rules: Expand abbreviations. Skip empty cells. Be precise with times.
                  Return ONLY valid JSON with no markdown:
                  { "timetable": [{ "day": string, "subject": string, "time": string }],
                    "subjects": string[],
                    "semester_id": string,
                    "semester_end_date": string }`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: file.type, data: base64 } },
              { text: prompt }
            ]
          }]
        })
      }
    );

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json(
        { error: 'Gemini returned no candidates. Image may have triggered safety filters.' },
        { status: 422 }
      );
    }
    const text = data.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/```json|```/g, '').trim();

    try {
      return NextResponse.json(JSON.parse(cleaned));
    } catch {
      return NextResponse.json({ error: 'Vision extraction failed: could not parse response' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Vision failed:', error);
    return NextResponse.json({ error: error.message || 'Vision failed' }, { status: 500 });
  }
}
