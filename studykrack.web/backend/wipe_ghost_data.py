import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

key_path = os.path.join(os.getcwd(), 'serviceAccountKey.json')
if os.path.exists(key_path):
    print("Using serviceAccountKey.json")
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
else:
    print("No service account key found, relying on default auth.")
    firebase_admin.initialize_app()

db = firestore.client()

def wipe_collection(collection_name):
    print(f"Wiping collection: {collection_name}")
    docs = db.collection(collection_name).stream()
    count = 0
    batch = db.batch()
    for doc in docs:
        batch.delete(doc.reference)
        count += 1
        if count % 500 == 0:
            batch.commit()
            batch = db.batch()
    if count > 0:
        batch.commit()
    print(f"Deleted {count} documents from {collection_name}.")

if __name__ == "__main__":
    wipe_collection("vault_status")
    wipe_collection("processing_queue")
    print("Ghost data successfully wiped. Clean start ready.")
