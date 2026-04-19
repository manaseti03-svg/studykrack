"use server";

/**
 * StudyKrack 2.0: Neural Bridge (v6.1)
 * This action connects the Next.js Frontend to the FastAPI Architect Backend.
 * It bypasses the complex agent orchestrator to ensure 100% stability.
 */
export async function chatWithNeuralTutor(message: string) {
  try {
    console.log('[ai-tutor] Routing query to Architect Matrix (8000)...');
    
    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Matrix Offline (Status: ${response.status})`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.detail || "Neural synthesis failed.");
    }

    return {
      success: true,
      result: {
        answer: data.data.content,
        source: data.data.source,
        verified: data.data.source === 'Community Verified',
        resources: [
          { name: "Syllabus Masterclass", url: data.yt }
        ]
      }
    };

  } catch (error) {
    console.error('[ai-tutor] Neural link failure:', error);
    
    // Fallback response for stability during manual check
    return {
      success: false,
      error: "The StudyKrack Matrix is initializing. Please ensure the Python backend is running on Port 8000."
    };
  }
}
