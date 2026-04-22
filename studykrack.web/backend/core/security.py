import os
import hmac
import hashlib
from fastapi import Request, HTTPException
from core.config import db, MAX_DAILY_QUOTA

GEMINI_SECRET_KEY = os.getenv("GEMINI_SECRET_KEY", "fallback_secret_key_development_only")

def verify_execution_token(token: str, payload: str) -> bool:
    """
    Zero-Trust Token Verification.
    Ensures the request has a valid execution ticket issued by the Cloud Function.
    """
    if not token or not payload:
        return False
    expected_token = hmac.new(
        GEMINI_SECRET_KEY.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_token, token)

async def governor_limit_check(user_id: str):
    """
    The Governor Protocol: Gemini API Quota Protection.
    Strictly enforces 20-use/day limit per User ID.
    Returns 429 if limit is exceeded.
    """
    if not user_id:
        raise HTTPException(status_code=401, detail="Identity Required: Cannot verify academic quota.")
    
    user_ref = db.collection("users").doc(user_id)
    doc = user_ref.get()
    
    if not doc.exists:
        # Auto-initialize user quota doc if missing
        user_ref.set({"daily_usage_count": 0, "remaining_quota": MAX_DAILY_QUOTA})
        return

    data = doc.to_dict()
    current_usage = data.get("daily_usage_count", 0)

    if current_usage >= MAX_DAILY_QUOTA:
        raise HTTPException(
            status_code=429, 
            detail={
                "error": "Quota Exhausted",
                "message": "The Governor Protocol has blocked this request. 20/20 AI Power used today.",
                "reset_in": "24h"
            }
        )

def increment_governor_usage(user_id: str):
    """Safely increments usage count after a successful AI execution."""
    user_ref = db.collection("users").doc(user_id)
    user_ref.update({
        "daily_usage_count": db.increment(1),
        "topics_archived": db.increment(1)
    })
