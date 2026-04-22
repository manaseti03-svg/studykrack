from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.config import GEMINI_MODEL
from core.security import governor_limit_check, increment_governor_usage
from services.ai_service import marksman_agentic_loop, get_embed_model

router = APIRouter(prefix="/search", tags=["Radar Search"])

class SearchQuery(BaseModel):
    query: str
    user_id: str
    deep_research: bool = False

@router.post("")
async def handle_search(query: SearchQuery):
    """Marksman Search Engine with Governor Shield."""
    print(f"🔍 Received research request: {query.query} for {query.user_id}")
    
    # 1. Governor Protocol Check (Production Quota)
    await governor_limit_check(query.user_id)
    
    # 2. Defer loading of heavy embedding model to bypass Firebase analysis limit
    embed_model = get_embed_model()
    
    try:
        results = await marksman_agentic_loop(
            query.query, 
            GEMINI_MODEL, 
            embed_model, 
            lambda: None
        )
        
        # 3. Usage Accounting (Only if successful)
        increment_governor_usage(query.user_id)
        
        return {"status": "success", "results": results}
        
    except Exception as e:
        print(f"❌ Search Logic Fault: {e}")
        return {"status": "maintenance", "results": []}
