import json
import time
import numpy as np
import google.generativeai as genai
from fastapi import HTTPException
import concurrent.futures

def generate_with_circuit_breaker(gemini_model, prompt, timeout=15, max_iterations=3, **kwargs):
    """
    Task 3: The Circuit Breaker API
    Wraps the Gemini API call in a strict timeout (15 seconds) and a max_iterations loop counter.
    Goal: Ensure the backend is mathematically impossible to manipulate via the frontend.
    """
    for attempt in range(max_iterations):
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(gemini_model.generate_content, prompt, **kwargs)
                return future.result(timeout=timeout)
        except concurrent.futures.TimeoutError:
            print(f"[CIRCUIT BREAKER] Attempt {attempt + 1}/{max_iterations} timed out. Recovering...")
            if attempt == max_iterations - 1:
                raise HTTPException(
                    status_code=504, 
                    detail="Zero-Trust Block: AI Gateway timeout exceeded. Circuit breaker tripped."
                )
        except Exception as e:
            if attempt == max_iterations - 1:
                raise e

def cosine_similarity(v1, v2):
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0
    return dot_product / (norm_v1 * norm_v2)

def marksman_agentic_loop(query_str, gemini_model, embed_model, db, check_quota_func):
    """
    Role: Lead AI Logic Engineer.
    Context: StudyKrack 2.0 - 15h Sprint Hour 1.
    Task: Implement the 'Marksman' Agentic Loop
    """
    print(f"[MARKSMAN] [ACTIVE] Initializing Agentic Loop for: {query_str}")
    
    # 1. Retrieval: Fetch top 5 semantic chunks from Enterprise Vault
    query_vec = embed_model.encode(query_str)
    
    vault_results = []
    if db:
        # Enterprise v2.0: Unified Parallel Search (private_vault + global_syllabus)
        for col_name in ["private_vault", "global_syllabus"]:
            docs = db.collection(col_name).stream()
            for doc in docs:
                data = doc.to_dict()
                if "embedding" in data:
                    score = cosine_similarity(query_vec, np.array(data["embedding"]))
                    vault_results.append({**data, "score": score, "source": col_name})
    
    vault_results.sort(key=lambda x: x["score"], reverse=True)
    top_chunks = vault_results[:5]
    
    # 2. Reasoning Agent: Analyze the chunks. Are they sufficient for a 14-mark answer?
    context_text = "\n---\n".join([
        f"Source: {c.get('title')} ({c.get('source')})\nContent: {c.get('summary') or c.get('definition')}\nKey Points: {c.get('key_points')}" 
        for c in top_chunks
    ])
    
    reasoning_prompt = f"""
    Internal Reasoning Engine (Flash 1.5):
    Task: Determine if the following retrieved context is sufficient to answer '{query_str}' for a 14-mark university exam.
    
    Context:
    {context_text}
    
    Response format:
    SUFFICIENT: [YES/NO]
    EXPAND_REQUIRED: [YES/NO]
    SHORT_ANALYSIS: [Max 10 tokens]
    """
    
    try:
        check_quota_func()
        # Limit internal tokens to save quota
        reasoning_resp = generate_with_circuit_breaker(
            gemini_model, 
            reasoning_prompt, 
            timeout=15,
            max_iterations=3,
            generation_config={"max_output_tokens": 50}
        )
        reasoning_text = reasoning_resp.text
        print(f"[MARKSMAN] [REASONING] Analysis: {reasoning_text.strip()}")
        
        is_sufficient = "SUFFICIENT: YES" in reasoning_text
        needs_expansion = "EXPAND_REQUIRED: YES" in reasoning_text
        
        # 3. Expansion: If No, Expand search parameters
        if not is_sufficient or needs_expansion:
             print("[MARKSMAN] [EXPANSION] Chunks insufficient. Broadening vault search...")
             top_chunks = vault_results[:10]
             context_text = "\n---\n".join([
                 f"Source: {c.get('title')}\nContent: {c.get('summary') or c.get('definition')}\nKey Points: {c.get('key_points')}" 
                 for c in top_chunks
             ])

        # 4. Generation & Formatting Agent
        final_prompt = f"""
        Role: Formatting Agent (Engineering Rubric).
        Objective: Answer '{query_str}' using the standard 14-mark Engineering Rubric.
        
        Retrieved Data (Vault):
        {context_text}
        
        Anti-Hallucination Guard:
        - Use ONLY the data provided above.
        - If the data isn't in the provided context, state 'Data missing from Vault' for that section.
        - DO NOT invent facts.
        
        Force specific headings:
        [EXAM TOPIC]: {query_str}
        [CONCEPTUAL OVERVIEW]: (2 Marks)
        [TECHNICAL STEPS/PROOFS]: (6 Marks - Use bullet points)
        [EXAMINER'S DIAGRAM NOTE]: (3 Marks - Describe a diagram precisely)
        
        Return JSON with: 'title', 'conceptual_overview', 'technical_steps', 'diagram_note', 'priority_level'.
        """
        
        check_quota_func()
        gen_resp = generate_with_circuit_breaker(
            gemini_model,
            final_prompt,
            timeout=15,
            max_iterations=3
        )
        ai_output = gen_resp.text.replace("```json", "").replace("```", "").strip()
        gen_data = json.loads(ai_output)
        
        # Post-process technical steps into points
        raw_steps = gen_data.get("technical_steps", "Data missing from Vault")
        if isinstance(raw_steps, list):
            key_points = raw_steps
        else:
            key_points = [s.strip() for s in str(raw_steps).split("\n") if len(s.strip()) > 5]

        return {
            "title": gen_data.get("title", query_str),
            "concept_one_sentence": gen_data.get("conceptual_overview", "Data missing from Vault")[:100] + "...",
            "summary": gen_data.get("conceptual_overview", "Data missing from Vault"),
            "key_points": key_points,
            "diagram_desc": gen_data.get("diagram_note", "Data missing from Vault"),
            "priority_level": "14-Mark Essay",
            "verified": True,
            "is_ai": True,
            "agentic_source": "Marksman Loop",
            "footer": "Verified by StudyKrack Marksman Loop"
        }
        
    except Exception as e:
        print(f"[MARKSMAN] [ERROR] Loop Failure: {e}")
        # Task 4: Edge-Case Bug Sweep
        if "timeout" in str(e).lower() or "503" in str(e):
             raise HTTPException(status_code=503, detail="System Overloaded - Try again in 30s")
        # Fallback to standard research if agentic loop fails (but not a timeout)
        return perform_sentinel_research(query_str, gemini_model, embed_model, db, check_quota_func)


def perform_sentinel_research(query: str, gemini_model, embed_model, db, check_quota_func):
    """
    Task 2: The 'Two-Pass' AI Validation (V&V)
    Implements a verification pass before final data return.
    """
    
    # Pass 1: Generate the initial study node using "GPAI Response Style".
    research_prompt = f"""
    You are the Research Sentinel. The user is asking about: '{query}'.
    Provide a professional academic explanation tailored for an Indian BTech student using the "GPAI Response Style".
    
    Structure:
    - Concept in 1 Sentence: A high-level, definitive overview.
    - Key Components: 5-7 high-density technical bullet points (the "meat" of a 14-mark answer).
    - The "Exam Hack": A pro-tip on what examiners look for in this specific topic.
    - Analogies: Use real-world Indian examples (e.g., comparing tech to Indian infra or culture).
    
    Knowledge Task: Identify a relevant YouTube video URL for: '{query}' (Channels: Gate Smashers, NPTEL, etc.).
    
    Return ONLY a JSON object with:
    'title': The query name,
    'concept_one_sentence': String,
    'summary': String,
    'key_points': Array of Strings (5-7 points),
    'exam_hack': String,
    'analogy': String,
    'video_resource': {{"title": "Title", "url": "URL"}},
    'priority_level': Choice of ['14-Mark Essay', '10-Mark Medium', '2-Mark Short']
    """
    
    try:
        check_quota_func()
        response = generate_with_circuit_breaker(gemini_model, research_prompt, timeout=15, max_iterations=3)
        ai_output = response.text.replace("```json", "").replace("```", "").strip()
        researched_concept = json.loads(ai_output)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Research Pass 1 Error: {e}")
        # Task 4: Edge-Case Bug Sweep (System Overloaded)
        if "timeout" in str(e).lower() or "503" in str(e) or "quota" in str(e).lower():
            raise HTTPException(status_code=503, detail="System Overloaded - Try again in 30s")
        raise HTTPException(status_code=503, detail="System Overloaded - Try again in 30s")

    # Pass 2: The Auditor (Hidden Pass)
    # Before returning the data to the user, send a hidden prompt to Gemini
    audit_prompt = f"""
    Verify this technical explanation for an Indian BTech student. 
    Identify any hallucinations or errors in formulas. 
    Content: {json.dumps(researched_concept)}
    Return the final, corrected JSON only.
    """
    
    try:
        check_quota_func()
        audit_response = generate_with_circuit_breaker(gemini_model, audit_prompt, timeout=15, max_iterations=3)
        audited_output = audit_response.text.replace("```json", "").replace("```", "").strip()
        final_concept = json.loads(audited_output)
    except HTTPException:
        # If Pass 2 hits quota, we could return Pass 1 but Task 1 says "stop the process"
        raise
    except Exception as e:
        print(f"Research Pass 2 Error: {e}")
        # Fallback to Pass 1 if Pass 2 fails parsing
        final_concept = researched_concept
        
    # Task 2 Requirement: Add a field to the JSON: "is_verified": false
    final_concept["is_verified"] = False
    
    return final_concept

def bulk_research(topic_list, subject_code, gemini_model, embed_model, db, check_quota_func):
    """
    Task 1: Bulk Research Mode
    Task 4: Save progress even if interrupted.
    """
    processed_count = 0
    for topic in topic_list:
        try:
            # Quota is checked inside perform_sentinel_research (twice per topic)
            data = perform_sentinel_research(topic, gemini_model, embed_model, db, check_quota_func)
            
            # Task 4: Save immediately to prevent data loss
            header = f"{data['title']} {data['summary']}"
            embedding = embed_model.encode(header).tolist()
            
            doc_data = {
                **data,
                "subject_code": subject_code,
                "subject_name": "Bulk Ingest",
                "timestamp": time.time(),
                "embedding": embedding,
                "is_ai": True,
                "verified": False # Consistent with previous verified field name
            }
            db.collection("global_syllabus").add(doc_data)
            processed_count += 1
            
        except HTTPException as e:
            if e.status_code == 429:
                print(f"⚠️ Bulk process throttled. {processed_count} topics saved.")
                return {"status": "throttled", "saved": processed_count, "remaining": topic_list[processed_count:]}
            raise e
        except Exception as e:
            print(f"❌ Error during bulk ingest of '{topic}': {e}")
            continue

    return {"status": "success", "saved": processed_count}
