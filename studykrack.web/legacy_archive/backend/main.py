import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .services.orchestrator_service import orchestrator_service
from .config import config

app = FastAPI(title="StudyKrack 2.0 API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    text: str

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"}

@app.post("/ask")
async def ask_tutor(request: QueryRequest):
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Query text is required")
        
        result = await orchestrator_service.process_mission(request.text)
        return {
            "success": True,
            "data": result,
            "yt": f"https://www.youtube.com/results?search_query={request.text}+cynohub"
        }
    except Exception as e:
        print(f">>> API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
