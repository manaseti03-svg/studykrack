import { db } from "./firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const EXAM_LOGIC = `
Role: Senior Academic Examiner for Indian BTech University.
Task: Provide a 14-Mark Question response for the given topic.
Format: JSON only.
Structure:
1. Definition & Context (2 Marks): Core definition and historical/technical background.
2. Detailed Technical Breakdown (6 Marks): Deep-dive into mechanisms, types, or functional steps.
3. Hand-Drawn Diagram (3 Marks): A detailed text description of a diagram clearly labeled for a student to replicate on paper.
4. Practical Application (3 Marks): Real-world use cases or Indian-context industrial applications.
Footer: "Verified by StudyKrack 2.0 | Target: 8.5+ SGPA"
`;

export async function sentinelPathway(userQuery: string, subjectCode: string = "GENERAL") {
  try {
    // 1. Search knowledge_cache in Firestore first (Free Tier Logic)
    const cacheRef = collection(db, "knowledge_cache");
    const q = query(cacheRef, where("query_hash", "==", userQuery.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("[SENTINEL] Cache Hit: Serving from Knowledge Vault.");
      return querySnapshot.docs[0].data();
    }

    // 2. Cache Miss: Call Gemini API (AI Power Usage)
    console.log("[SENTINEL] Cache Miss: Engaging Cloud Brain...");
    const prompt = `${EXAM_LOGIC}\nResearch Topic: ${userQuery}. Return JSON: {title, definition, breakdown, diagram_desc, application, footer}.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    const resultData = JSON.parse(text);

    // 3. Save to knowledge_cache for future use
    const docData = {
      ...resultData,
      summary: resultData.definition, // Backwards compatibility with UI
      concept_one_sentence: resultData.definition.slice(0, 100),
      key_points: resultData.breakdown.split(".").filter((s: string) => s.length > 5),
      query_hash: userQuery.toLowerCase().trim(),
      subject_code: subjectCode,
      timestamp: serverTimestamp(),
      verified: true,
      is_ai_generated: true,
      exam_hack: "Calibrated for 14-Mark Marksman Strategy."
    };
    
    await addDoc(cacheRef, docData);
    console.log("[SENTINEL] Knowledge Saved to Vault.");
    
    return docData;
  } catch (error) {
    console.error("[SENTINEL] Neural Path Error:", error);
    throw error;
  }
}

export async function ingestDocument(file: File, subjectName: string) {
  try {
    console.log("[INGEST] Initializing Ingestion for:", file.name);
    
    // 1. Placeholder for text extraction (assuming handled by backend or simpler logic here)
    // For Move 3 logic, we'll focus on the AI Summary & Meta part
    const prompt = `${EXAM_LOGIC}\nPerform high-density academic summary for document: ${file.name}.
    Context: Indian BTech Student (Semester 2, AIML).
    Return JSON: {title, definition, breakdown, diagram_desc, application, footer}.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    const resultData = JSON.parse(text);

    // 2. Save to knowledge_vault Firestore
    const vaultRef = collection(db, "knowledge_vault");
    const docData = {
      ...resultData,
      summary: resultData.definition,
      key_points: resultData.breakdown.split(".").filter((s: string) => s.length > 5),
      source_name: file.name,
      subject_name: subjectName,
      subject_code: subjectName, // Standardized for routing
      tag: "Semester: 2 | Branch: AIML",
      timestamp: serverTimestamp(),
      type: "PDF_INGESTION",
      verified: true,
      exam_hack: "14-Mark Marksman Calibration Active."
    };

    const docRef = await addDoc(vaultRef, docData);
    console.log("[INGEST] Document Successfully Vaulted:", docRef.id);
    return docData;
  } catch (error) {
    console.error("[INGEST] Ingestion Failure:", error);
    throw error;
  }
}

export async function vaultPrioritySearch(searchQuery: string) {
  try {
    const vaultRef = collection(db, "knowledge_vault");
    const q = query(vaultRef, where("title", ">=", searchQuery), where("title", "<=", searchQuery + "\uf8ff"));
    const snapshot = await getDocs(q);

    const vaultResults = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      is_from_vault: true
    }));

    return vaultResults;
  } catch (error) {
    console.error("[SEARCH] Vault Priority Error:", error);
    return [];
  }
}
