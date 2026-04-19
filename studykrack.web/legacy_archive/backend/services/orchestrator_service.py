from .gemini_service import gemini_service
from .firebase_service import firebase_service
from .rag_service import rag_service

class OrchestratorService:
    def __init__(self):
        self.modes = {
            "Socratic": (
                "You are the Socratic Tutor for StudyKrack 2.0. "
                "Guide students through concepts with probing questions and mental models. "
                "Maintain a premium, intelligent, and supportive tone."
            ),
            "Researcher": (
                "You are the Deep Researcher for StudyKrack 2.0. "
                "Provide comprehensive, well-documented information. "
                "Break down complex subjects into atomic parts."
            ),
            "Solver": (
                "You are the Problem Solver for StudyKrack 2.0. "
                "Solve specific problems step-by-step. Focus on methodology and logic."
            )
        }

    def detect_intent(self, query: str) -> str:
        text = query.lower()
        if any(w in text for w in ["solve", "calculate", "how to"]):
            return "Solver"
        if any(w in text for w in ["research", "explain", "detail", "what is"]):
            return "Researcher"
        return "Socratic"

    async def process_mission(self, query: str):
        # 1. RAG Check (Firestore First)
        rag_result = await rag_service.process_query(query)
        
        # If RAG found a verified community answer, we use it
        if rag_result["source"] == "Community Verified":
            return rag_result

        # 2. Intelligent AI Generation with Mode Detection
        mode = self.detect_intent(query)
        system_instruction = self.modes[mode]
        
        # Use our gemini_service with the specific instruction
        prompt = f"{system_instruction}\n\nUser Query: {query}\n\nProvide a deep, structured response."
        
        # For simplicity, we use the same gemini_service method but we could expand it
        # to support system instructions more robustly.
        explanation = gemini_service.generate_explanation(prompt)
        
        # Auto-ingest for the 'Community' if it's a good explanation
        firebase_service.ingest_answer(query, explanation, f"AI {mode} Mode")
        
        return {
            "source": f"Sovereign AI ({mode})",
            "content": explanation,
            "confidence": 0.9,
            "mode": mode
        }

orchestrator_service = OrchestratorService()
