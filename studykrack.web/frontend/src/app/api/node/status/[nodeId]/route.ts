import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const uid = req.cookies.get('session')?.value;
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const resolvedParams = await params;
    const nodeId = resolvedParams.nodeId;
    const body = await req.json();
    const newStatus = body.status;

    if (!nodeId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Attempt to update if the ID directly points to a private_vault document they own
    const directVaultRef = adminDb.collection('private_vault').doc(nodeId);
    const directVaultDoc = await directVaultRef.get();

    if (directVaultDoc.exists && directVaultDoc.data()?.owner_uid === uid) {
      await directVaultRef.update({ status: newStatus });
      return NextResponse.json({ success: true, message: 'Status updated directly' });
    }

    // 2. Check if it was imported previously but with an auto-generated private_vault ID
    const existingImportQuery = await adminDb.collection('private_vault')
      .where('owner_uid', '==', uid)
      .where('original_node_id', '==', nodeId)
      .get();

    if (!existingImportQuery.empty) {
      const existingDocRef = existingImportQuery.docs[0].ref;
      await existingDocRef.update({ status: newStatus });
      return NextResponse.json({ success: true, message: 'Imported status updated' });
    }

    // 3. If missing, it means the student clicked "Save to Library" on a Global Syllabus response
    const globalRef = adminDb.collection('global_syllabus').doc(nodeId);
    const globalDoc = await globalRef.get();

    if (!globalDoc.exists) {
      return NextResponse.json({ error: 'Global node not found' }, { status: 404 });
    }

    // Embed/save to their personal private vault without querying Gemini again
    await adminDb.collection('private_vault').add({
      ...globalDoc.data(),
      owner_uid: uid,
      status: newStatus,
      imported_at: Date.now(),
      original_node_id: nodeId
    });

    return NextResponse.json({ success: true, message: 'Imported to private vault' });

  } catch (error: any) {
    console.error('Node status update failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
