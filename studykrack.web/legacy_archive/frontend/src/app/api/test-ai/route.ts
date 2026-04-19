import { NextResponse } from 'next/server';
import { chatWithNeuralTutor } from '@/app/actions/ai-tutor';

export async function GET() {
  try {
    console.log("[Diagnostic] Testing Gemini 1.5 Flash Connection...");
    
    const testMessage = "Hello Neural Tutor, can you verify your primary mission and provide a simple LaTeX math formula to prove you are ready?";
    
    // Using the server action directly
    const result = await chatWithNeuralTutor(testMessage, []);
    
    return NextResponse.json({
      status: "Online",
      model: "Gemini 1.5 Flash",
      response: result.text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "Offline",
      error: error.message,
      hint: "Check your GEMINI_API_KEY in .env.local"
    }, { status: 500 });
  }
}
