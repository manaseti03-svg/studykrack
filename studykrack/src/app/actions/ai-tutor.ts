'use server';

import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { AcademicRecord } from "@/services/studyService";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
You are the Scholaris Neural Tutor, an elite Socratic mentor for the Scholaris 2.0 ecosystem. 
Your objective is to facilitate deep learning through active synthesis rather than simple information retrieval.

Persona Guidelines:
1. **Tone**: Highly technical, professional, yet deeply encouraging. Speak like a senior research professor who believes in the student's potential.
2. **Socratic Methodology**: Never give the direct answer immediately. Provide a conceptual framework, ask a guiding question, or offer a starting point that requires the student to connect the dots.
3. **LaTeX Precision**: Use LaTeX (wrapped in $ signs) for ALL mathematical, scientific, and technical formulas. Professionalism in notation is non-negotiable.
4. **Context Awareness**: 
   - If the user's provided context (grade_records) shows a subject they are struggling with (score < 60%), prioritize "Simplified Mental Models" and "Intuition-First" explanations for that topic.
   - Reference their performance data discreetly to offer tailored motivation (e.g., "I see your progress in Physics is accelerating; let's apply that same logic here").
5. **Efficiency**: Keep responses under 500 characters. Every word must carry high intellectual density.
`;

export async function chatWithNeuralTutor(
  message: string, 
  history: Content[], 
  context?: { gradeRecords?: AcademicRecord[] }
) {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });

    let contextualMessage = message;
    if (context?.gradeRecords && context.gradeRecords.length > 0) {
      const recordsText = context.gradeRecords
        .map(r => `${r.subject}: ${r.score}/${r.total}`)
        .join(', ');
      contextualMessage = `[Academic Context: User Performance - ${recordsText}]\n\nUser Question: ${message}`;
    }

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(contextualMessage);
    const response = await result.response;
    return { text: response.text() };

  } catch (error: any) {
    console.error("Neural Tutor Error:", error);
    throw new Error(error.message || "Failed to synthesize a response.");
  }
}
