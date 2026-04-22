import { NextRequest, NextResponse } from 'next/server';
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
 * FILE 5 — frontend/app/api/metrics/route.ts
 */

export async function GET(req: NextRequest) {
  try {
    const uid = req.cookies.get('session')?.value;
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = Date.now();
    const oneDayAgo = now - 86400000;

    const [pvSnap, gsSnap, metricsSnap, userDoc] = await Promise.all([
      adminDb.collection('private_vault').where('owner_uid', '==', uid).get(),
      adminDb.collection('global_syllabus').get(),
      adminDb.collection('system_metrics')
        .where('timestamp', '>=', oneDayAgo)
        .where('type', '==', 'gemini_api_call').get(),
      adminDb.collection('users').doc(uid).get()
    ]);

    let topics_archived = pvSnap.size + gsSnap.size;
    let topics_mastered = 0;

    pvSnap.docs.forEach((doc) => {
      if (doc.data().status === 'Mastered') topics_mastered++;
    });

    const gemini_calls_today = metricsSnap.size;
    const remaining_quota = Math.max(0, 20 - gemini_calls_today);
    const userData = userDoc.exists ? userDoc.data() : {};
    const fuel_balance = userData?.fuel_balance ?? 0;
    const subscription_status = userData?.subscription_status ?? 'free';
    const money_saved = topics_archived * 5;

    return NextResponse.json({
      topics_archived,
      topics_mastered,
      gemini_calls_today,
      remaining_quota,
      fuel_balance,
      subscription_status,
      money_saved
    });

  } catch (error: any) {
    console.error('Metrics failed:', error);
    return NextResponse.json({ error: error.message || 'Metrics failed' }, { status: 500 });
  }
}
