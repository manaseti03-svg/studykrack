import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const uid = req.headers.get('x-user-id') || "muni_manas_01";
    
    const now = Date.now() / 1000;
    const oneDayAgo = now - 24 * 3600;

    // 1. Quota metrics
    const systemMetrics = await adminDb.collection("system_metrics")
        .where("timestamp", ">=", oneDayAgo)
        .get();
    const used = systemMetrics.size;
    const remaining = Math.max(0, 20 - used);

    // 2. Vault Metrics
    let topicsCount = 0;
    let masteredCount = 0;
    
    const collections = ["private_vault", "global_syllabus"];
    for (const col of collections) {
      const snapshot = await adminDb.collection(col).get();
      topicsCount += snapshot.size;
      snapshot.forEach(doc => {
        if (doc.data().status === "Mastered") {
          masteredCount++;
        }
      });
    }

    // 3. Focus Metrics
    const focusLogs = await adminDb.collection("focus_metrics")
        .where("timestamp", ">=", oneDayAgo)
        .get();
    let totalFocusMinutes = 0;
    focusLogs.forEach(doc => {
      totalFocusMinutes += (doc.data().minutes || 0);
    });

    const moneySaved = topicsCount * 5;

    return NextResponse.json({
        remaining_quota: remaining,
        topics_archived: topicsCount,
        topics_mastered: masteredCount,
        total_focus_minutes: totalFocusMinutes,
        money_saved: moneySaved,
        uid: uid // Confirming UID used
    });
  } catch (error: any) {
    console.error("[METRICS] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
