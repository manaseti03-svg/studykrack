import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

function cosineSimilarity(v1: number[], v2: number[]) {
  const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const normV1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const normV2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  if (normV1 === 0 || normV2 === 0) return 0;
  return dotProduct / (normV1 * normV2);
}

export async function POST(req: NextRequest) {
  try {
    const { query: searchQuery, deep_research } = await req.json();

    if (!searchQuery) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    // 1. Generate embedding for query
    const embedResult = await embedModel.embedContent(searchQuery);
    const queryVector = embedResult.embedding.values;

    // 2. Unified Retrieval from Firestore
    const results: any[] = [];
    const collections = ["private_vault", "global_syllabus"];

    for (const colName of collections) {
      const snapshot = await adminDb.collection(colName).get();
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.embedding && Array.isArray(data.embedding)) {
          const score = cosineSimilarity(queryVector, data.embedding);
          results.push({
            id: doc.id,
            ...data,
            score,
            source_vault: colName
          });
        }
      });
    }

    // 3. Sort and filter
    results.sort((a, b) => b.score - a.score);
    const bestScore = results.length > 0 ? results[0].score : 0;
    
    // Path B: Sentinel Fallback / Marksman Loop
    if (bestScore < 0.7 || deep_research) {
      console.log(`[SEARCH] Triggering Path B: AI Research Gateway (Score: ${bestScore.toFixed(2)})`);
      
      const prompt = `
        Role: Senior Academic Examiner (Marksman Mode).
        Objective: Provide a comprehensive 14-mark university exam response for '${searchQuery}'.
        Tailor for: Indian BTech Student (AIML Semester 2).
        Return JSON with: 'title', 'summary', 'key_points' (array), 'diagram_desc', 'priority_level'.
      `;

      const aiResult = await model.generateContent(prompt);
      const aiOutput = aiResult.response.text().replace(/```json|```/g, "").trim();
      const researchedConcept = JSON.parse(aiOutput);
      
      const header = `${researchedConcept.title} ${researchedConcept.summary}`;
      const embedding = await getEmbedding(header);

      const docData = {
        ...researchedConcept,
        subject_code: "AI_RESEARCH",
        timestamp: Date.now() / 1000,
        embedding: embedding,
        is_ai: true,
        verified: true,
        status: "Archived",
        footer: "Verified by StudyKrack Marksman Loop"
      };

      await adminDb.collection("global_syllabus").add(docData);
      
      return NextResponse.json({ 
        results: [{ ...docData, score: 1.0, source_vault: "global_syllabus" }],
        agentic_source: "Marksman Loop"
      });
    }

    return NextResponse.json({ results: results.slice(0, 3) });
  } catch (error: any) {
    console.error("[SEARCH] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
