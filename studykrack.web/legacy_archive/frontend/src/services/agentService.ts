import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type AgentMode = 'Socratic' | 'Researcher' | 'Solver';

export interface AgentResponse {
  thoughtProcess: string;
  response: string;
  nodesExtracted: string[];
  metadata: {
    suggestions: string[];
    confidence: number;
    modeSwitchedTo?: AgentMode;
  };
}

const SYSTEM_PROMPTS: Record<AgentMode, string> = {
  Socratic: `You are the Socratic Tutor for StudyKrack (Scholaris 2.0).
Your goal is to guide students through concepts without giving direct answers.
Ask probing questions, provide mental models, and encourage critical thinking.
Always maintain a high-viscosity academic tone (premium, intelligent, and supportive).
Response must be in Markdown with LaTeX for any mathematical notations.`,
  
  Researcher: `You are the Deep Researcher for StudyKrack (Scholaris 2.0).
Your goal is to provide comprehensive, well-documented information on any topic.
Break down complex subjects into atomic parts and provide cross-references.
Use authoritative sources and structured formatting.
Response must be in Markdown with LaTeX for any technicals.`,
  
  Solver: `You are the Problem Solver for StudyKrack (Scholaris 2.0).
Your goal is to help students solve specific problems step-by-step.
Focus on methodology, logic, and proof.
Explain each step clearly and ensure the student understands the underlying principle.
Response must be in Markdown with LaTeX for all calculations and formulas.`
};

const RESPONSE_SCHEMA = {
  description: "Structured response from the StudyKrack AI Agent",
  type: SchemaType.OBJECT,
  properties: {
    thoughtProcess: {
      type: SchemaType.STRING,
      description: "Internal monologue and reasoning steps. Shown to users to visualize how the AI thinks."
    },
    response: {
      type: SchemaType.STRING,
      description: "The main response content in Markdown/LaTeX. This is what the student primarily reads."
    },
    nodesExtracted: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Key concepts, entities, or topics extracted from the conversation."
    },
    metadata: {
      type: SchemaType.OBJECT,
      properties: {
        suggestions: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "Follow-up questions or next learning steps."
        },
        confidence: {
          type: SchemaType.NUMBER,
          description: "Confidence score (0.0 to 1.0) of the response accuracy."
        }
      },
      required: ["suggestions", "confidence"]
    }
  },
  required: ["thoughtProcess", "response", "nodesExtracted", "metadata"]
};

export class ChatOrchestrator {
  private model;

  constructor(mode: AgentMode = 'Socratic') {
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
      systemInstruction: SYSTEM_PROMPTS[mode],
    });
  }

  async processMission(userMessage: string, history: any[] = []): Promise<AgentResponse> {
    try {
      // 1. Retrieve grounded context from Python Backend
      let groundedContext = "";
      let nextStudyStep = "";
      
      try {
        const retrievalResponse = await fetch('http://localhost:8000/retrieve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userMessage })
        });
        
        if (retrievalResponse.ok) {
          const data = await retrievalResponse.json();
          if (data.context && data.context.length > 0) {
            groundedContext = "\n[GROUNDED CONTEXT FROM NOTES]:\n" + data.context.join("\n");
            nextStudyStep = data.next_step;
          }
        }
      } catch (e) {
        console.warn('[ChatOrchestrator] Backend retrieval unavailable. Proceeding with zero-shot.');
      }

      // 2. Prepare Chat with Context
      const chat = this.model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
      });

      const promptWithContext = groundedContext 
        ? `${userMessage}\n\n${groundedContext}`
        : userMessage;

      const result = await chat.sendMessage(promptWithContext);
      const outputText = result.response.text();
      const finalResult = JSON.parse(outputText) as AgentResponse;

      // 3. Inject Planning Logic
      if (nextStudyStep) {
        finalResult.metadata.suggestions.unshift(`Recommended: ${nextStudyStep}`);
      }

      return finalResult;
    } catch (error) {
      console.error('[ChatOrchestrator] Error processing mission:', error);
      throw new Error('Intelligence Layer failure: Unable to process cognitive steps.');
    }
  }

  /**
   * Determine the best mode based on user intent
   */
  static detectIntent(input: string): AgentMode {
    const text = input.toLowerCase();
    if (text.includes('solve') || text.includes('calculate') || text.includes('how to do')) return 'Solver';
    if (text.includes('research') || text.includes('explain') || text.includes('detail') || text.includes('what is')) return 'Researcher';
    return 'Socratic'; // Default
  }
}
