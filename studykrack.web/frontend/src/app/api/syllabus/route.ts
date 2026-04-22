import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const uid = req.cookies.get('session')?.value;
    if (!uid) return NextResponse.json(
      { error: 'Unauthorized' }, { status: 401 }
    );

    const pvSnap = await adminDb
      .collection('private_vault')
      .where('owner_uid', '==', uid)
      .get();

    if (pvSnap.empty) return NextResponse.json([]);

    const stats: Record<string, { total: number; mastered: number }> = {};

    pvSnap.docs.forEach(doc => {
      const d = doc.data();
      const code = d.subject_code || 'GENERAL';
      if (!stats[code]) stats[code] = { total: 0, mastered: 0 };
      stats[code].total++;
      if (d.status === 'Mastered') stats[code].mastered++;
    });

    return NextResponse.json(
      Object.entries(stats).map(([subject, v]) => ({
        subject,
        percentage: v.total > 0
          ? Math.round((v.mastered / v.total) * 100)
          : 0,
        total: v.total,
        mastered: v.mastered
      }))
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Syllabus fetch failed' },
      { status: 500 }
    );
  }
}
