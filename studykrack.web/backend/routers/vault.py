from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import io
import PIL.Image
import json
from core.config import db, bucket, gemini_model, embed_model
from utils.helpers import compute_sha256, clean_text
from services.ai_service import generate_with_circuit_breaker, bulk_research
from core.security import governor_limit_check, increment_governor_usage

router = APIRouter(prefix="/vault", tags=["Vault Ingestion"])

class BulkQuery(BaseModel):
    topics: list
    subject_code: str
    user_id: str

@router.post("/vision/timetable")
async def analyze_timetable(file: UploadFile = File(...), user_id: str = Form(...)):
    """Academic Matrix Extraction from images."""
    await governor_limit_check(user_id)
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Image file required.")
    
    image_data = await file.read()
    img = PIL.Image.open(io.BytesIO(image_data))
    
    prompt = "Extract academic timetable as strictly valid JSON object."
    response = gemini_model.generate_content([prompt, img])
    data = json.loads(response.text.replace("```json", "").replace("```", "").strip())
    increment_governor_usage(user_id)
    return data

@router.post("/forge")
async def forge_note(
    file: UploadFile = File(...), 
    user_id: str = Form(...),
    subject_name: str = Form("General Study")
):
    """Governor-Shielded PDF Ingestion with SHA-256 Deduplication."""
    await governor_limit_check(user_id)
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="PDF only")
        
    file_bytes = await file.read()
    file_hash = compute_sha256(file_bytes)
    
    # Dedupe check
    existing = db.collection("private_vault").where("doc_hash", "==", file_hash).limit(1).get()
    if existing:
        return {"status": "deduplicated", "doc_id": existing[0].id}
        
    # Logic Shield: Marksman Processing...
    # (Simplified for router clarity, actual logic remains in service soon)
    return {"status": "success", "message": "Forge Ingestion Started"}
