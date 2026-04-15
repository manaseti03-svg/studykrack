# StudyKrack v2.0: The Academic Intelligence OS
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=googlegemini)

> **Mission Objective:** Engineered to bridge the gap between a 7.27 and an 8.5+ SGPA using Agentic RAG and highly specialized exam-driven intelligence loops.

StudyKrack v2.0 is an industrial-grade academic fortress. Designed as a "Mission Control Center," it intelligently processes engineering syllabi into high-density exam formats using a unique "Zero-Trust" AI architecture.

---

## 🔥 Enterprise v2.0 Infrastructure

### 1. Zero-Trust Guardrail Protocol
- **Server-Side Fuel Validation**: Every Gemini API call is protected by a server-side Cloud Function that performs atomic fuel consumption transactions.
- **Execution Tickets**: Implemented HMAC-signed execution tokens to prevent frontend manipulation and ensure only authorized, paid-for requests reach the AI brain.
- **Circuit Breaker API**: All AI generation is wrapped in a strict **15-second timeout** and a 3-attempt retry loop, preventing backend stalling.

### 2. Logic Vault v2.0 (Enterprise Schema)
- **Dual-Vault Retrieval**: Optimized RAG pipeline that searches across `global_syllabus` (theory) and `private_vault` (personal notes) in parallel.
- **SHA-256 Deduplication**: Every document undergoes a hashing layer before ingestion. If a document hash exists, it linked to the user's profile instantly—eliminating 100% redundant AI embedding costs.

### 3. The Academic Matrix (Onboarding Wizard)
- **AI Vision Ingestion**: Scan your timetable and syllabus image using Gemini 1.5 Flash Vision.
- **Human-in-the-Loop Audit**: Editable verification grid ensures 100% alignment with your college's schedule before locking the "Academic Matrix."
- **Daily Operations**: A context-aware dashboard that prompts you to "Upload Lab Observations" or "Index Class Notes" based on today's timetable.

### 4. Sentinel Visual Identity
- **Opal Glass Design**: High-fidelity glassmorphism with `backdrop-blur-xl` and AMOLED-friendly Pure Black modes.
- **Pulse Radar Animation**: Neural-network visualization that signals active AI research gates.

---

## 🛠 Tech Stack

**Frontend Pipeline:**
- **Framework:** Next.js 15 (React 19)
- **State Management:** React Context + Firestore Real-time Listeners
- **Security:** Firebase Auth (Google) + Zero-Trust Token Verification

**Backend Intelligence:**
- **Engine:** Python / FastAPI
- **Cloud Brain:** Gemini 1.5 Flash (Vision & Text)
- **Storage:** Firestore (Dual-Vault Architecture)

---

## 🚀 Deployment Protocols

### 1. Backend Engagement
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Cloud Functions & Rules
Deploy security boundaries before launching:
```bash
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### 3. Frontend Ignition
```bash
cd frontend
npm install
npm run dev
```

---

*Architected by Muni Manas | Sree Rama Engineering College | AIML 2026*
*Total Academic Dominance.*
