// src/lib/aiService.ts
// Redesigned for Move 3: Zero-Exposure Logic

export async function sentinelPathway(userQuery: string, subjectCode: string = "GENERAL") {
  try {
    // 1. Engaging Path B: Semantic Search + Gemini Fallback (Handled by unified API)
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userQuery, deep_research: true })
    });

    if (!response.ok) throw new Error("Sentinel Gateway Error");
    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error("[SENTINEL] Neural Path Error:", error);
    throw error;
  }
}

export async function ingestDocument(file: File, subjectName: string) {
  try {
    console.log("[INGEST] Route: /api/forge");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_name", subjectName);

    const response = await fetch("/api/forge", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Ingestion Gateway Error");
    return await response.json();
  } catch (error) {
    console.error("[INGEST] Ingestion Failure:", error);
    throw error;
  }
}

export async function vaultPrioritySearch(searchQuery: string) {
  try {
    // Task 8 Fix: Replacing lexicographic query with semantic search
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery })
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("[SEARCH] Semantic Search Error:", error);
    return [];
  }
}
