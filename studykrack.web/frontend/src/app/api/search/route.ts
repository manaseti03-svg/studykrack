import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';

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
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
 * FILE 2 — frontend/app/api/search/route.ts
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = req.cookies.get('session')?.value || body.user_id;
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const query = body.query;
    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    let queryVec: number[] | null = null;
    try {
      queryVec = await embedText(query);
    } catch (e) {
      console.warn("Embedding failed, falling back to direct AI generation.", e);
    }

    // Fetch in parallel targeting Cloud caches
    const [pvSnap, gsSnap] = await Promise.all([
      adminDb.collection('private_vault').where('owner_uid', '==', uid).get(),
      adminDb.collection('global_syllabus').get()
    ]);

    const results: any[] = [];
    if (queryVec) {
      for (const snap of [pvSnap, gsSnap]) {
        const source = snap === pvSnap ? 'private_vault' : 'global_syllabus';
        for (const doc of snap.docs) {
          const d = doc.data();
          if (!d.embedding || !Array.isArray(d.embedding)) continue;
          const score = cosineSim(queryVec, d.embedding);
          results.push({
            id: doc.id,
            ...d,
            score,
            source_vault: source
          });
        }
      }

      results.sort((a, b) => b.score - a.score);
      const best = results[0]?.score ?? 0;

      if (best >= 0.75) {
        return NextResponse.json({
          status: 'vault_hit',
          source: 'vault',
          results: results.slice(0, 3)
        });
      }
    }

    // Fallback to Gemini Logic Generator
    const prompt = `
    Role: Senior Academic Examiner for Indian BTech University.
    Topic: ${query}
    Task: Generate a complete 14-mark answer.
    Structure:
    [DEFINITION & CONTEXT] (2 Marks)
    [TECHNICAL BREAKDOWN] (6 Marks) — use bullet points
    [DIAGRAM DESCRIPTION] (3 Marks) — precise labeled diagram
    [PRACTICAL APPLICATION] (3 Marks) — Indian BTech context
    Return ONLY valid JSON:
    { "title": string, "summary": string, "key_points": string[],
      "diagram_desc": string, "application": string,
      "priority_level": "14-Mark Essay",
      "footer": "Verified by StudyKrack Marksman Engine" }`;

    const raw = await generateWithBreaker(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        title: query,
        summary: raw,
        key_points: [],
        diagram_desc: '',
        application: '',
        priority_level: '14-Mark Essay',
        footer: 'Verified by StudyKrack Marksman Engine'
      };
    }

    // Massive Latency Optimization: Pre-allocate ID and respond instantly.
    const docRef = adminDb.collection('global_syllabus').doc();
    
    // Background execution: Generating embeddings is slow, so we don't await this!
    Promise.resolve().then(async () => {
      try {
        const embedding = await embedText(`${parsed.title} ${parsed.summary}`);
        await docRef.set({
          ...parsed,
          embedding,
          subject_code: 'AI_RESEARCH',
          is_ai: true,
          verified: false,
          timestamp: Date.now(),
          agentic_source: 'Marksman Loop'
        });
      } catch (err) {
        console.error('Background embed failed', err);
      }
    });

    // Return to the student UI immediately without waiting for embedding/saving delays!

    return NextResponse.json({
      status: 'gemini_hit',
      source: 'gemini',
      results: [{ ...parsed, id: docRef.id }]
    });

  } catch (error: any) {
    console.error('Search failed:', error);
    return NextResponse.json({ error: error.message || 'Search failed' }, { status: 500 });
  }
}
