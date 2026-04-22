import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
const pdfParse = require('pdf-parse');
import { adminDb, adminStorage } from '@/lib/firebaseAdmin';

/**
 * Shared Helpers
 */

async function embedText(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await res.json();
  if (!data.embedding) throw new Error('Embedding failed');
  return data.embedding.values;
}

function cosineSim(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const nA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (nA * nB + 1e-10);
}

async function generateWithBreaker(prompt: string): Promise<string> {
  for (let i = 0; i < 3; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: controller.signal,
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates[0].content.parts[0].text;
    } catch (e) {
      if (i === 2) throw e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('Circuit breaker tripped');
}

/**
 * FILE 3 — frontend/app/api/forge/route.ts
 */

export async function POST(req: NextRequest) {
  try {
    const uid = req.cookies.get('session')?.value;
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { storagePath, subjectName, subjectCode } = await req.json();
    if (!storagePath) {
      return NextResponse.json({ error: 'storagePath required' }, { status: 400 });
    }

    // Download from Storage
    const bucket = adminStorage.bucket();
    const file = bucket.file(storagePath);
    let buffer: Buffer;
    try {
      const [downloadedBuffer] = await file.download();
      buffer = downloadedBuffer;
    } catch (e) {
      return NextResponse.json({ error: 'Storage download fail' }, { status: 500 });
    }

    // SHA-256 hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Dedupe check
    const [pvSnap, gsSnap] = await Promise.all([
      adminDb.collection('private_vault')
        .where('doc_hash', '==', hash)
        .where('owner_uid', '==', uid)
        .limit(1).get(),
      adminDb.collection('global_syllabus')
        .where('doc_hash', '==', hash)
        .limit(1).get()
    ]);

    if (!pvSnap.empty) {
      return NextResponse.json({
        status: 'deduplicated',
        message: 'Already in your vault. Linked via deduplication.',
        doc_id: pvSnap.docs[0].id
      });
    }

    if (!gsSnap.empty) {
      return NextResponse.json({
        status: 'deduplicated',
        message: 'This document exists in the global syllabus vault.',
        doc_id: gsSnap.docs[0].id
      });
    }

    // Extract PDF text
    let fullText: string;
    try {
      const pdfData = await pdfParse(buffer);
      fullText = pdfData.text;
    } catch (e) {
      return NextResponse.json({ error: 'PDF parse fail' }, { status: 500 });
    }

    // Chunk text
    const chunks: string[] = [];
    const size = 3000, overlap = 200;
    for (let i = 0; i < fullText.length; i += size - overlap) {
      chunks.push(fullText.slice(i, i + size));
    }

    let totalCount = 0;
    for (const chunk of chunks) {
      const prompt = `
      Role: Senior Academic Examiner.
      Task: Extract 14-mark academic concepts from this text.
      Return ONLY a valid JSON array:
      [{ "title": string, "summary": string, "key_points": string[],
         "diagram_desc": string, "application": string,
         "priority_level": string }]
      Text: ${chunk}`;

      try {
        const raw = await generateWithBreaker(prompt);
        const cleaned = raw.replace(/```json|```/g, '').trim();
        const concepts = JSON.parse(cleaned);

        for (const concept of concepts) {
          const embedding = await embedText(`${concept.title} ${concept.summary}`);
          await adminDb.collection('private_vault').add({
            ...concept,
            owner_uid: uid,
            doc_hash: hash,
            subject_name: subjectName,
            subject_code: subjectCode,
            source_file: storagePath,
            embedding,
            status: 'Archived',
            verified: true,
            is_ai: true,
            timestamp: Date.now(),
            footer: 'Verified by StudyKrack Forge'
          });
          totalCount++;
        }
      } catch (e) {
        console.error('Chunk failed, skipping:', e);
        continue;
      }
    }

    return NextResponse.json({ status: 'success', count: totalCount });

  } catch (error: any) {
    console.error('Forge failed:', error);
    return NextResponse.json({ error: error.message || 'Forge failed' }, { status: 500 });
  }
}
