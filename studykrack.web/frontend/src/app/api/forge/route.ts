import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';
import crypto from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

async function getEmbedding(text: string) {
  const result = await embedModel.embedContent(text);
  return result.embedding.values;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const subjectName = formData.get('subject_name') as string || 'General Study';

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // 1. Deduplication check
    const existing = await adminDb.collection("private_vault")
      .where("doc_hash", "==", fileHash)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({
        status: "success",
        message: "Note already exists (Deduplicated)",
        deduplicated: true
      });
    }

    // 2. Extract Text
    const pdfData = await pdf(buffer);
    const fullText = pdfData.text;

    // 3. Chunking & Concept Extraction
    // Simulating the "Chapters" logic from main.py
    const paragraphs = fullText.split('\n\n');
    const chunks: string[] = [];
    let currentChunk = "";
    
    for (const p of paragraphs) {
      if ((currentChunk + p).length < 8000) {
        currentChunk += " " + p;
      } else {
        chunks.push(currentChunk);
        currentChunk = p;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    const allConcepts: any[] = [];

    for (const [idx, chunkText] of chunks.entries()) {
      const cleaned = cleanText(chunkText);
      const prompt = `
        Role: Senior Academic Examiner (Marksman Mode).
        Task: Extract high-density 14-Mark academic concepts from Segment ${idx + 1}.
        Return JSON: array of {'title', 'definition', 'breakdown', 'diagram_desc', 'application'}.
        Text: ${cleaned.slice(0, 8000)}
      `;

      const result = await model.generateContent(prompt);
      const aiOutput = result.response.text().replace(/```json|```/g, "").trim();
      try {
        const concepts = JSON.parse(aiOutput);
        allConcepts.push(...concepts);
      } catch (e) {
        console.warn("Failed to parse AI output for chunk", idx);
      }
    }

    // 4. Batched Write to Firestore
    const batch = adminDb.batch();
    for (const concept of allConcepts) {
      const header = `${concept.title} ${concept.definition}`;
      const embedding = await getEmbedding(header);
      
      const docRef = adminDb.collection("private_vault").doc();
      batch.set(docRef, {
        ...concept,
        summary: concept.definition,
        key_points: concept.breakdown.split('.').filter((s: string) => s.trim().length > 5),
        subject_name: subjectName,
        subject_code: subjectName,
        timestamp: Date.now() / 1000,
        verified: true,
        doc_hash: fileHash,
        embedding: embedding,
        is_ai: true,
        status: "Archived",
        footer: "Verified by StudyKrack Next.js Engine"
      });
    }

    await batch.commit();

    return NextResponse.json({ status: "success", count: allConcepts.length });
  } catch (error: any) {
    console.error("[FORGE] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
