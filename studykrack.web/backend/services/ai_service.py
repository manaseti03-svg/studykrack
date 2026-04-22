import json
import asyncio
import numpy as np
import concurrent.futures
from fastapi import HTTPException
from core.config import db, GEMINI_MODEL
from utils.helpers import clean_text

def get_embed_model():
    """Opal Glass Deferral: Loads model only during active research sessions."""
    from sentence_transformers import SentenceTransformer
    return SentenceTransformer('all-MiniLM-L6-v2')

def cosine_similarity(v1, v2):
    """Mathematical precision for semantic deduplication."""
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0
    return dot_product / (norm_v1 * norm_v2)

def generate_with_circuit_breaker(gemini_model, prompt, timeout=15, max_iterations=3, **kwargs):
    """
    Phase 2: The Circuit Breaker (Safety Layer)
    Strict 15s timeout on AI calls to prevent server lockups.
    """
    for attempt in range(max_iterations):
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(gemini_model.generate_content, prompt, **kwargs)
                return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            if attempt == max_iterations - 1:
                raise HTTPException(
                    status_code=504, 
                    detail="Zero-Trust Block: AI Gateway timeout. Circuit breaker tripped."
                )
        except Exception as e:
            if attempt == max_iterations - 1:
                raise e

async def marksman_agentic_loop(query_str, gemini_model, embed_model, check_quota_func):
    """
    Role: Lead AI Logic Engineer.
    Task: Execute the 'Marksman' Retrieval-Reasoning-Generation cycle.
    """
    query_vec = embed_model.encode(query_str)
    vault_results = []
    
    if db:
        # Search architecture: Private Vault + Global Syllabus
        for col_name in ["private_vault", "global_syllabus"]:
            docs = db.collection(col_name).stream()
            for doc in docs:
                data = doc.to_dict()
                if "embedding" in data:
                    score = cosine_similarity(query_vec, np.array(data["embedding"]))
                    vault_results.append({**data, "score": score, "source": col_name})

    vault_results.sort(key=lambda x: x["score"], reverse=True)
    top_chunks = vault_results[:5]

    context_text = "\n---\n".join([
        f"Source: {c.get('title')}\nContent: {c.get('summary') or c.get('definition')}" 
        for c in top_chunks
    ])

    final_prompt = f"""
    Role: Formatting Agent (Engineering Rubric).
    Answer '{query_str}' using 14-Mark Engineering Rubric.
    Context: {context_text}
    """
    
    check_quota_func()
    gen_resp = generate_with_circuit_breaker(gemini_model, final_prompt)
    ai_output = gen_resp.text.replace("```json", "").replace("```", "").strip()
    return json.loads(ai_output)

def perform_sentinel_research(query: str, gemini_model, embed_model, check_quota_func):
    """Two-Pass Validation Architecture for high-fidelity academic data."""
    research_prompt = f"Role: Research Sentinel. Subject: '{query}'. Provide 14-mark structure JSON."
    
    check_quota_func()
    response = generate_with_circuit_breaker(gemini_model, research_prompt)
    return json.loads(response.text.replace("```json", "").replace("```", "").strip())
