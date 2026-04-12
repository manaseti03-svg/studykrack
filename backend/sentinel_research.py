import json
import time
import google.generativeai as genai
from fastapi import HTTPException

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
        # Check quota for Pass 1
        check_quota_func()
        response = gemini_model.generate_content(research_prompt)
        ai_output = response.text.replace("```json", "").replace("```", "").strip()
        researched_concept = json.loads(ai_output)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Research Pass 1 Error: {e}")
        raise HTTPException(status_code=500, detail="Sentinel encountered a neural block.")

    # Pass 2: The Auditor (Hidden Pass)
    # Before returning the data to the user, send a hidden prompt to Gemini
    audit_prompt = f"""
    Verify this technical explanation for an Indian BTech student. 
    Identify any hallucinations or errors in formulas. 
    Content: {json.dumps(researched_concept)}
    Return the final, corrected JSON only.
    """
    
    try:
        # Check quota for Pass 2
        check_quota_func()
        audit_response = gemini_model.generate_content(audit_prompt)
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
            db.collection("community_library").add(doc_data)
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
