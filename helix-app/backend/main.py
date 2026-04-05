import os
import tempfile
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI(title="HELIX Medical Assistant API")

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key directly from environment for simplicity
# Recommend setting it in terminal: set GEMINI_API_KEY=your_key
API_KEY = os.environ.get("GEMINI_API_KEY", "")

if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None

class SymptomRequest(BaseModel):
    symptoms: str
    language: str = "English"

@app.get("/")
def read_root():
    return {"status": "HELIX API is running. Configure GEMINI_API_KEY environment variable to enable AI."}

@app.post("/api/predict_disease")
async def predict_disease(request: SymptomRequest):
    if not model:
        return {"result": "⚠️ API key not configured. Please set GEMINI_API_KEY in your environment.\n\n**Mock Response:**\nBased on your symptoms, it could be:\n1. Viral Fever\n2. Common Cold\n3. Seasonal Allergies\n\n*Consult a doctor for accurate diagnosis.*"}
    
    prompt = f"""
    Act as a helpful medical assistant named HELIX. 
    A user has the following symptoms: {request.symptoms}. 
    Please provide a list of top 3 possible diseases it could be, with a short explanation for each, and some general advice. 
    Format using Markdown.
    Translate your entire response to {request.language}. 
    IMPORTANT: End with a clear disclaimer that you are an AI and they must consult a real doctor.
    """
    
    try:
        response = model.generate_content(prompt)
        return {"result": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze_report")
async def analyze_report(
    file: UploadFile = File(...), 
    language: str = Form("English")
):
    if not model:
         return {"result": "⚠️ API key not configured.\n\n**Mock Response:**\nYour report parameters (like Hemoglobin and WBC) seem normal based on standard ranges. Minor deviance in Vitamin D levels. *Consult a doctor.*"}
    
    # Save uploaded file to a temporary location to pass to Gemini API
    extension = file.filename.split('.')[-1] if '.' in file.filename else 'tmp'
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as temp_file:
        contents = await file.read()
        temp_file.write(contents)
        temp_file_path = temp_file.name
        
    try:
        # Uploading the file to Gemini API temporarily
        uploaded_file = genai.upload_file(temp_file_path)
        
        prompt = f"""
        Act as a helpful medical assistant named HELIX.
        Analyze this uploaded medical report/image and explain it in very simple, easy-to-understand terms. 
        Highlight any values that are out of standard ranges in a polite, non-alarmist way.
        Format using Markdown.
        Translate your entire response to {language}.
        IMPORTANT: End with a clear disclaimer that you are an AI and they must consult a real doctor.
        """
        
        response = model.generate_content([prompt, uploaded_file])
        
        # Cleanup uploaded file from Gemini (optional, but good practice to clean up API storage)
        try:
            genai.delete_file(uploaded_file.name)
        except:
            pass
            
        return {"result": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Ensure local tmp file is deleted
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
