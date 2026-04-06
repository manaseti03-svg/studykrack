"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeStudyData(tasks: any[], grades: any[]) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a Senior Academic Coach. Analyze the following student data and provide insights.
      
      Tasks: ${JSON.stringify(tasks)}
      Grades: ${JSON.stringify(grades)}
      
      Requirements:
      1. Identify the subject with the lowest grade.
      2. Suggest a specific task to prioritize from the task list.
      3. Provide a 1-sentence motivational tip.
      
      Return the response as a clean, concise string (max 3 sentences). No markdown formatting like bolding or lists, just a professional paragraph.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, analysis: text };
  } catch (error: any) {
    console.error("Nexus synchronization failure:", error);
    return { 
      success: false, 
      error: "Nexus synchronization failure: Unable to fetch smart insights." 
    };
  }
}
