from google import genai
from ..config import config

class GeminiService:
    def __init__(self):
        self.client = None
        self._initialize()

    def _initialize(self):
        if config.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=config.GEMINI_API_KEY)
                print(">>> Gemini Service: Online")
            except Exception as e:
                print(f">>> Gemini initialization error: {e}")

    def generate_explanation(self, query: str):
        if not self.client:
            return "AI Service Offline."

        try:
            prompt = (
                f"You are the 'Sovereign Tutor' for StudyKrack 2.0. "
                f"Provide a clean, professional, and deep explanation for: {query}. "
                f"Keep it concise but insightful. 3-5 sentences."
            )
            response = self.client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f">>> Gemini generation error: {e}")
            return f"Error researching '{query}'."

gemini_service = GeminiService()
