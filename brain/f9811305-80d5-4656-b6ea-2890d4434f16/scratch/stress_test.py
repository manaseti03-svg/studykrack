import sys
import unittest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
import os

# Set up environment for testing
os.environ["GEMINI_API_KEY"] = "test_key"
os.environ["FIREBASE_PROJECT_ID"] = "test_project"

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

import main
from main import app

class TestStudyKrackGovernor(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        # Mock Firestore
        main.db = MagicMock()
        # Mock Gemini
        main.gemini_model = MagicMock()
        # Mock Embeddings
        main.embed_model = MagicMock()
        main.embed_model.encode.return_value = [0.1] * 384

    @patch('sentinel_research.perform_sentinel_research')
    def test_01_cold_start(self, mock_research):
        print("\n[RUNNING] Test 1: Cold Start (Sentinel Research)")
        # Setup mock behavior
        mock_research.return_value = {
            "title": "Aeroelasticity",
            "summary": "Complex structures dance.",
            "key_points": ["Point 1", "Point 2"],
            "priority_level": "14-Mark Essay",
            "is_verified": False
        }
        
        # Mock empty database search
        main.db.collection().where().stream.return_value = []
        
        response = self.client.post("/search", json={"query": "Advanced Aeroelasticity in Civil Engineering structures."})
        
        self.assertEqual(response.status_code, 200)
        data = response.json()["results"][0]
        self.assertEqual(data["priority_level"], "14-Mark Essay")
        self.assertEqual(data["is_ai"], True)
        print("[VERIFIED] Result contains priority_level and is_ai: True")

    def test_02_zero_cost_cache(self):
        print("\n[RUNNING] Test 2: Zero-Cost Logic (Pulse Radar Cache)")
        
        # Mock a high similarity match in DB
        matching_doc = MagicMock()
        matching_doc.to_dict.return_value = {
            "title": "Aeroelasticity Cache",
            "summary": "From the vault.",
            "key_points": ["Point 1"],
            "embedding": [0.1] * 384,
            "is_ai": False,
            "priority_level": "14-Mark Essay"
        }
        main.db.collection().limit().stream.return_value = [matching_doc]
        
        # Mock cosine similarity to be 0.95 (Cache hit)
        with patch('main.cosine_similarity', return_value=0.95):
            response = self.client.post("/search", json={"query": "Aeroelasticity"})
        
        self.assertEqual(response.status_code, 200)
        # The first result should be the cached one
        self.assertEqual(response.json()["results"][0]["summary"], "From the vault.")
        print("[VERIFIED] [CACHE] Semantic Match Found. Zero API Cost.")

    def test_03_debt_wall(self):
        print("\n[RUNNING] Test 3: The Debt-Wall (Governor Protocol)")
        
        # Mock 20 calls in the last 24h
        main.db.collection().where().stream.return_value = [MagicMock()] * 20
        
        # This search should call check_api_quota and fail
        response = self.client.post("/search", json={"query": "Thermodynamics of Cement hydration"})
        
        self.assertEqual(response.status_code, 429)
        self.assertIn("Daily limit reached", response.json()["detail"])
        print("[VERIFIED] [SECURITY] Quota Exceeded. Blocked.")

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
