import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from ..config import config

class FirebaseService:
    def __init__(self):
        self.db = None
        self._initialize()

    def _initialize(self):
        try:
            if not firebase_admin._apps:
                firebase_admin.initialize_app(options={'projectId': config.FIREBASE_PROJECT_ID})
            self.db = firestore.client()
            print(">>> Firebase Service: Initialized")
        except Exception as e:
            print(f">>> Firebase initialization error: {e}")

    def search_verified_answers(self, query: str):
        """
        Search Firestore for community-verified answers.
        In a real app, this would use semantic search. 
        For now, we'll do a simple keyword match or range query.
        """
        if not self.db:
            return None

        try:
            # Simple keyword search placeholder
            # Note: Firestore doesn't support full-text search directly without Algolia/Elastic
            # We will use the 'notes_history' or a new 'verified_concepts' collection
            collection_ref = self.db.collection('verified_concepts')
            results = collection_ref.where('keywords', 'array_contains', query.lower()).limit(1).get()
            
            if results:
                return results[0].to_dict()
        except Exception as e:
            print(f">>> Firestore search error: {e}")
        return None

    def ingest_answer(self, topic: str, content: str, source: str):
        if not self.db:
            return

        try:
            self.db.collection('verified_concepts').add({
                'topic': topic,
                'content': content,
                'source': source,
                'keywords': [k.strip().lower() for k in topic.split()],
                'timestamp': datetime.now(),
                'verified': False # Initial ingest is unverified
            })
            print(f">>> Ingested concept: {topic}")
        except Exception as e:
            print(f">>> Firestore ingest error: {e}")

firebase_service = FirebaseService()
