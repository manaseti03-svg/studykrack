import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Config:
    # Firebase
    FIREBASE_PROJECT_ID = os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "studykrack")
    
    # Gemini
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # RAG Settings
    CONFIDENCE_THRESHOLD = 0.85
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    LIBRARY_DIR = os.path.join(BASE_DIR, "library")

config = Config()
