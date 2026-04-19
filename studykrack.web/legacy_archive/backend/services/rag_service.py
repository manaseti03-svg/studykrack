from .firebase_service import firebase_service
from .gemini_service import gemini_service
from ..config import config

class RAGService:
    async def process_query(self, query: str):
        # 1. Search Firestore First
        verified_answer = firebase_service.search_verified_answers(query)
        
        # Simplified confidence check
        # In a real RAG, we'd use cosine similarity scores
        if verified_answer:
            return {
                "source": "Community Verified",
                "content": verified_answer['content'],
                "confidence": 1.0
            }

        # 2. Gemini Fallback
        # If no verified answer, call Gemini
        print(f">>> Fallback to Gemini for: {query}")
        explanation = gemini_service.generate_explanation(query)
        
        # 3. Auto-Ingest
        # Save back to Firestore for the next student
        firebase_service.ingest_answer(query, explanation, "Gemini AI")
        
        return {
            "source": "Sovereign AI (Gemini)",
            "content": explanation,
            "confidence": 0.9 # Simulated confidence
        }

rag_service = RAGService()
