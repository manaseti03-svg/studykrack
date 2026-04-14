# StudyKrack 2.0: The Academic Intelligence OS
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=googlegemini)

> **Mission Objective:** Engineered to bridge the gap between a 7.27 and an 8.5+ SGPA using Agentic RAG and highly specialized exam-driven intelligence loops.

StudyKrack 2.0 is not just a study tool; it is a high-performance, mobile-first academic fortress. Designed to operate identically to a "Mission Control Center," it intelligently processes, analyzes, and translates vast engineering syllabi into strict, high-density exam formats using localized AI architecture.

---

## 🔥 Core Infrastructure & Features

1. **Marksman Agentic Loop**
   StudyKrack completely reinvents automated reasoning by prioritizing the **Standard Engineering Rubric**. The Marksman AI doesn't just answer queries; it evaluates them directly against University 14-Mark grading schemas, isolating conceptual overviews, dense technical proofs, and strict examiner diagram notes. If data is missing from the local vault, it refuses to hallucinate facts.

2. **Logic Vault & Anti-Debt Shield**
   Every generated node is permanently cached into Firestore using localized Vector Embeddings. Built with a hardcoded **Anti-Debt Shield**, the system natively throttles bot attacks and automatically rolls over request surges to verify data without unnecessarily depleting Gemini 1.5 API quotas.

3. **Opal Glass UI & Accessible Verbiage**
   The Next.js 15 frontend runs on a custom **Stitch v2.0 'Opal Glass'** design methodology. Utilizing high-fidelity `backdrop-blur-xl` and AMOLED-friendly Pure Black modes, the dashboard offers a distraction-free focus state. We have explicitly translated all complex engineering and tech jargon into ultra-accessible, kid-friendly verbiage (e.g., "Knowledge Vault" -> "My Learning Library") to eliminate cognitive friction.

4. **₹19 Fuel Plan (Sachet Monetization)**
   Architected for sustainable AI expansion, the backend leverages a robust usage tracker natively protecting API throughput. Users on the 'Free' tier hitting their daily 5 high-precision limit hit an elegant paywall offering 'Turbo Search' prioritization for just ₹19—a scalable Fintech model optimized for Indian students.

---

## 🛠 Tech Stack

**Frontend Pipeline:**
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS (Custom Design Tokens)
- **Architecture:** Mobile-First PWA (Progressive Web Application)

**Backend Intelligence:**
- **Engine:** Python / FastAPI
- **Cloud Brain:** Gemini 1.5 Flash API
- **Embedding:** `SentenceTransformers` (`all-MiniLM-L6-v2`)

**State & Persistence (Firebase):**
- **Database:** Firestore (with Native Offline Resilience)
- **File System:** Core Firebase Storage
- **Identity:** Fast & secure authentication boundaries

---

## 🚀 Installation & Launch Protocols

### Phase 1: Local T480 Setup

#### 1. Database Configuration
Create a `.env` file in your root folder and map your critical variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
GEMINI_API_KEY=your_gemini_key
```
*Ensure `serviceAccountKey.json` is placed inside the `/backend` directory for Admin persistence.*

#### 2. Spin Up Neural Backend
Engage the FastAPI Logic Engine via `uvicorn`:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 3. Engage Frontend Radar
Initialize the Next.js Opal Glass Interface:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to interact with the console.

### Phase 2: Mobile PWA Integration
StudyKrack incorporates robust offline resilience caches natively hooked into the Android/iOS environment. 
1. Access the Next.js port via your local network IP directly from your mobile browser.
2. Tap the `Install StudyKrack` button organically rendered in the header or use the browser prompt to snap StudyKrack explicitly to your Mobile Home Screen. 
3. **Airplane Mode verified:** The frontend Service Worker handles visual persistence seamlessly.

---

*Architected by Muni Manas | Sree Rama Engineering College | AIML 2026*
