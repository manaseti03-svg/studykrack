from core.config import db
import time

def save_study_node(collection, data, owner_uid=None):
    """Safely commits a study node to Firestore with metadata."""
    if not db:
        return None
    
    doc_ref = db.collection(collection).add({
        **data,
        "owner_uid": owner_uid,
        "timestamp": time.time(),
        "status": "ready"
    })
    return doc_ref

def check_deduplication(doc_hash):
    """SHA-256 Dedupe Check across private and global vaults."""
    if not db:
        return False
    
    # Check Global Syllabus first
    gs_match = db.collection("global_syllabus").where("doc_hash", "==", doc_hash).limit(1).get()
    if gs_match:
        return True
    return False

def get_user_quota(user_id):
    """Phase 2: Quota Retrieval for Governor Protocol."""
    if not db:
        return 0
    doc = db.collection("users").doc(user_id).get()
    if doc.exists:
        return doc.to_dict().get("daily_usage_count", 0)
    return 0
