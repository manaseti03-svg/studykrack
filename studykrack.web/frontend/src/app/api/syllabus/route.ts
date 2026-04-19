import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const stats: Record<string, { total: number; mastered: number }> = {};
    const collections = ["private_vault", "global_syllabus"];

    for (const col of collections) {
      const snapshot = await adminDb.collection(col).get();
      snapshot.forEach(doc => {
        const d = doc.data();
        const code = d.subject_code || "GENERAL";
        const status = d.status || "Archived";

        if (!stats[code]) {
          stats[code] = { total: 0, mastered: 0 };
        }

        stats[code].total += 1;
        // Fix for Bug 3: status check inside the loop
        if (status === "Mastered") {
          stats[code].mastered += 1;
        }
      });
    }

    const results = Object.entries(stats).map(([k, v]) => ({
      subject: k,
      percentage: v.total > 0 ? (v.mastered / v.total) * 100 : 0
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("[SYLLABUS] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
