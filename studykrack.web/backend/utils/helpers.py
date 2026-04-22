import hashlib
import re

def clean_text(text: str) -> str:
    """Opal Glass Standard: Normalizes whitespace and removes academic noise."""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def compute_sha256(file_content: bytes) -> str:
    """Enterprise v2.0: SHA-256 Deduplication Hashing."""
    return hashlib.sha256(file_content).hexdigest()

def format_prompt(role: str, task: str, context: str) -> str:
    """Standardizes the prompt architecture for consistent AI responses across models."""
    return f"Role: {role}\nTask: {task}\nContext: {context}"
