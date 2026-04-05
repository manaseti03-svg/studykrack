# Building Helix: Action Plan & Deliverables

## 1. Development Plan

1. **Setup & Initialization**: 
   - Initialized the Git repository.
   - Designed a project structure separating `/frontend` and `/backend`.
2. **Backend Development (FastAPI)**:
   - Configured `fastapi` with CORS for smooth local development.
   - Integrated Google Gemini AI (1.5 Pro) for powerful medical reasoning and multi-modal report text extraction/analysis.
   - Developed endpoints `/api/predict_disease` and `/api/analyze_report`.
3. **Frontend Development (HTML/CSS/JS)**:
   - Designed a modern, glassmorphism UI with gradient backgrounds and micro-animations.
   - Built dual-tab interface to support both the Symptom Checker and the Report Analyzer.
   - Implemented async javascript logic with a dynamic language selector for multi-language support.
4. **Final Polish**:
   - Added loading states.
   - Ensured responsive design handling for mobile and desktop views.

---

## 2. Setup Instructions

To run HELIX locally for your demo:

### Prerequisites:
- Python 3.9+ installed
- API Key from [Google AI Studio](https://aistudio.google.com/) (Gemini)

### Step 1: Start the Backend
1. Open up a terminal and navigate to the backend folder:
   ```bash
   cd c:\Users\manas\OneDrive\Desktop\CynoSure_2k26\helix-app\backend
   ```
2. Create and activate a Virtual Environment (optional but recommended):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set your API Key and run the server:
   ```bash
   set GEMINI_API_KEY=your_actual_api_key_here
   python main.py
   ```
   *The backend will run on `http://localhost:8000`.*

### Step 2: Start the Frontend
1. The frontend relies purely on Vanilla HTML/CSS/JS so no build process is necessary.
2. Simply open `c:\Users\manas\OneDrive\Desktop\CynoSure_2k26\helix-app\frontend\index.html` in your favorite browser (e.g. Chrome, Edge).
   *(Alternatively, use a Live Server extension in VS Code).*
3. Enjoy the app!

---

## 3. Git Workflow Plan

For a 24-hr Hackathon, follow this continuous integration approach:

### Branching Strategy
- `main` branch: Stable, working code used for the final presentation.
- `dev` branch: Integration branch. All features merge here first.
- Feature branches: Created off `dev` for specific tasks. (e.g., `feat/ui-design`, `feat/gemini-integration`, `bugfix/cors-error`).

### Commits & PRs
- **Commit frequently**: Make micro-commits like "Add symptom API endpoint" or "Style report upload dropzone".
- **PR Process**: Once a feature works, open a PR from `feat/...` to `dev`. Review quickly (even if alone, doing PRs shows good software engineering practices to judges).
- Merge `dev` into `main` 2 hours before the deadline to ensure you have a frozen, working demo branch.

---

## 4. Pitch Deck Outline (10 Slides)

**Slide 1: Title Slide**
- **HELIX** - Your Smart Medical Assistant.
- Catchphrase: *Making Healthcare Accessible, Understandable, and Immediate.*
- Team Name / CynoSure 2k26.

**Slide 2: The Problem**
- Medical jargon is hard to understand.
- Patients panic over simple lab test abnormalities.
- Access to immediate, basic medical clarification is delayed and language barriers make it worse.

**Slide 3: The Solution - HELIX**
- An AI-powered web app that simplifies medical information.
- Two core features: Symptom Analyzer & Report Explainer.
- Multi-lingual capabilities out-of-the-box.

**Slide 4: Key Features**
- Interactive Symptom Checker.
- Drag-and-drop document upload (PDF/Images) with intelligent context extraction.
- Jargon-free explanations in 5+ human languages.

**Slide 5: User Interface & User Experience**
- Modern Glassmorphism design constraints.
- Emphasizes calm, safe colors to reduce patient anxiety.
- Mobile-responsive.

**Slide 6: Architecture / Tech Stack**
- Frontend: Vanilla HTML, CSS, JavaScript (Lightweight & Fast).
- Backend: Python FastAPI (High performance).
- AI Engine: Google Gemini 1.5 Pro via REST API.

**Slide 7: How It Works (Diagram)**
- Describe the flow: User -> Frontend -> FastAPI -> Gemini API -> Formatted Markdown response back to User.

**Slide 8: Demo (Live or Video Placeholder)**
- Show the Symptom checker.
- Show uploading a dummy blood test report and having it translated to Spanish/Hindi.

**Slide 9: Future Scope**
- Integration with verified Doctor APIs for teleconsulting.
- Electronic Health Records (EHR) integration.
- Fine-tuned local models for complete data privacy (HIPAA compliance).

**Slide 10: Conclusion & Q&A**
- Summary of impact.
- Thank You + GitHub QR Code.

---

## 5. Demo Script (Optional)

*"Hi judges, we are excited to present HELIX. Have you ever received a blood test report, seen something slightly out of range, and panicked while furiously googling results for hours? We all have.*

*HELIX stops that anxiety. Let me show you.*

*(Switch to Symptom tab)*
*First, the Symptom Checker. I’ll type 'I have a sore throat and slight fever'. Notice how in seconds, HELIX gives me a structured, calm analysis of possible issues. But wait – what if my grandmother doesn't speak English? Let's switch the language to Hindi. Instantly, the interface and results adapt, maximizing accessibility.*

*(Switch to Report Analyzer tab)*
*Now for our core feature. I’m dragging a real PDF blood analysis report here. When I click 'Explain Report', HELIX reads the entire document, identifies that the Hemoglobin is slightly low, and explains what that means in simple, fifth-grade language. It even adds a disclaimer to consult a real physician, ensuring we stay within safe medical guidelines.*

*HELIX—making healthcare easy to read and easy to access. Thank you!"*
