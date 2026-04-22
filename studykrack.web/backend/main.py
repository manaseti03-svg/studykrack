from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import db, MAX_DAILY_QUOTA
from routers import search, vault

app = FastAPI(
    title="StudyKrack Academic OS 2.0",
    description="Enterprise Modular Backend with Governor Protocol and Logic Shields."
)

# 1. Logic Shield: CORS Configuration
# Essential for local T480 development and cross-domain Cloud deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Mounting Enterprise Routers
# Decomposed logic paths for scalability and security auditing
app.include_router(search.router)
app.include_router(vault.router)

# 3. System Resilience & Monitoring
@app.get("/health")
async def health_check():
    """System heartbeat for monitoring tools."""
    return {
        "status": "optimized", 
        "mode": "Enterprise v2.0", 
        "engine": "Marksman Agentic"
    }

@app.get("/api/metrics")
async def get_metrics():
    """Consolidated metrics for Opal Glass UI."""
    return {
        "status": "online",
        "quota_limit": MAX_DAILY_QUOTA,
        "sync": "real-time"
    }

# 4. Production Launch Configuration
if __name__ == "__main__":
    import uvicorn
    # Targeted local binding for the T480 development cycle
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
