# StudyKrack v2.0: The Academic Intelligence OS
![Project Status](https://img.shields.io/badge/Development_Status-Industrial_Release-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=googlegemini)

> **Mission Objective:** Engineered to bridge the gap between a 7.27 and an 8.5+ SGPA using Agentic RAG and highly specialized exam-driven intelligence loops.

StudyKrack v2.0 is an industrial-grade academic fortress. Designed as a "Mission Control Center," it intelligently processes engineering syllabi into high-density exam formats using a unique "Zero-Trust" AI architecture.

---

## 🔥 Enterprise v2.0 Infrastructure

### 1. Zero-Trust Gateway logic (API Routes)
- **Zero-Exposure Tokens**: All Gemini API calls are now handled server-side in Next.js API routes, preventing client-side API key exposure.
- **Circuit Breaker Logic**: Internal timeouts and retry loops ensure the backend never stalls during high-density research.
- **ID Token Verification**: Middleware verified via Firebase Admin SDK to protect dashboard access.

### 2. Logic Vault v2.0 (Semantic Schema)
- **Semantic Retrieval**: Migrated from lexicographic search to real semantic search using Gemini `text-embedding-004`.
- **SHA-256 Deduplication**: Every document undergoes a hashing layer before ingestion. If a document hash exists, it's linked via deduplication—eliminating redundant AI costs.

### 3. The Academic Matrix
- **AI Vision Ingestion**: Scan your timetable and syllabus image using Gemini 1.5 Flash Vision.
- **Human-in-the-Loop Audit**: Editable verification grid ensures 100% alignment with your college's schedule.

---

## 🛠 Tech Stack

**Unified Industrial Engine:**
- **Framework:** Next.js 15 (React 19) — Serving both UI and Backend API
- **AI Intelligence:** Gemini 1.5 Flash (via Node.js SDK)
- **Database:** Firebase Firestore (Advanced Dual-Vault Schema)
- **Embeddings:** Gemini `text-embedding-004`
- **Auth:** Firebase Auth + ID Token Middleware Verification

---

## ⚡ LOCALHOST SETUP

Get v2.0 running in under 5 minutes with **One Domain, One Command**:

### 1. Unified Initialization
```bash
# Enter the frontend
cd frontend
npm install
```

### 2. Environment Calibration
Create `frontend/.env.local` using `.env.local.template`:
- `GEMINI_API_KEY`: Your Google AI Studio key.
- `NEXT_PUBLIC_FIREBASE_*`: Your public Firebase config.
- `FIREBASE_SERVICE_ACCOUNT`: (Required) Your JSON service account string.

### 3. Launch the Matrix
```bash
npm run dev
```
Explore the system at `http://localhost:3000`.

---

## 📁 Project Structure (v2.0 Industrial)

```
CynoSure_2k26/
├── frontend/             # Unified Project Root
│   ├── src/
│   │   ├── app/api/       # Unified Backend logic (Node.js)
│   │   ├── lib/           # Industrial Logic (Firebase Admin, Gemini SDK)
│   │   └── components/    # Brutal UI Elements
├── backend/               # (Legacy Source - Migrated for Stability)
└── README.md
```

---

*Architected by Muni Manas | Sree Rama Engineering College | AIML 2026*
*Total Academic Dominance.*
