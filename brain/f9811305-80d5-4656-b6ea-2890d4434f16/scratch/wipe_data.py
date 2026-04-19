import os
from google.cloud import firestore
from dotenv import load_dotenv

# Load credentials
load_dotenv()
project_id = os.getenv("FIREBASE_PROJECT_ID")

if not project_id:
    print("[ERROR] FIREBASE_PROJECT_ID not found in .env")
    exit(1)

db = firestore.Client(project=project_id)

def wipe_test_data():
    print("[RESET] 🛡️ Global Ingestion Prep: Cleaning Library...")
    
    # We define "test" data as nodes with subject_name "AI Research" or "Bulk Ingest" 
    # or nodes that don't have a verified status.
    # To be safe and thorough for the "final build", we clear the community_library collection.
    
    docs = db.collection("community_library").stream()
    count = 0
    
    batch = db.batch()
    for doc in docs:
        batch.delete(doc.reference)
        count += 1
        if count % 500 == 0:
            batch.commit()
            batch = db.batch()
            
    batch.commit()
    print(f"[SUCCESS] 🧪 {count} test nodes purged. Library is now a CLEAN SLATE.")

if __name__ == "__main__":
    confirm = input("ARE YOU SURE? This will WIPE the entire community_library. (y/n): ")
    if confirm.lower() == 'y':
        wipe_test_data()
    else:
        print("[ABORT] Wipe cancelled.")
