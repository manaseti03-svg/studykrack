import os
import firebase_admin
from firebase_admin import credentials, firestore, storage
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Environment Loading (Local T480 Development Mode)
load_dotenv()

# 2. Path Hardening
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, 'serviceAccountKey.json')

# 3. Firebase Architecture Initialization
def init_firebase():
    if not firebase_admin._apps:
        try:
            # 1. Try Default Cloud Credentials (Production Mode)
            firebase_admin.initialize_app(options={
                'storageBucket': os.getenv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
            })
        except Exception:
            # 2. Local Fallback (Development Mode)
            if os.path.exists(SERVICE_ACCOUNT_PATH):
                cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
                firebase_admin.initialize_app(cred, {
                    'storageBucket': os.getenv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
                })
            else:
                # Basic init if nothing else works
                firebase_admin.initialize_app()
    
    return firestore.client(), storage.bucket()

# Initialize DB/Storage
db, bucket = init_firebase()

# 4. Global Logic Shields (Production Settings)
MAX_DAILY_QUOTA = 20
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

GEMINI_MODEL = genai.GenerativeModel('gemini-1.5-flash')
# Note: EMBED_MODEL is deferred to services.ai_service to bypass Firebase Analysis limits
