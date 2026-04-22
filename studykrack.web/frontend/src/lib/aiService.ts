// src/lib/aiService.ts
// Redesigned for Production Bridge: FastAPI Integration

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sentinelPathway(userQuery: string, subjectCode: string = "GENERAL") {
  try {
    const response = await fetch(`${getApiUrl()}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userQuery, deep_research: true })
    });

    if (!response.ok) throw new Error("AI Tutor Gateway Error");
    const data = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error("[AI TUTOR] Neural Path Error:", error);
    throw error;
  }
}

export async function ingestDocument(file: File, subjectName: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_name", subjectName);

    const response = await fetch(`${getApiUrl()}/forge/upload`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Study Vault Ingestion Error");
    return await response.json();
  } catch (error) {
    console.error("[INGEST] Ingestion Failure:", error);
    throw error;
  }
}

export async function vaultPrioritySearch(searchQuery: string) {
  try {
    const response = await fetch(`${getApiUrl()}/search`, {
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
