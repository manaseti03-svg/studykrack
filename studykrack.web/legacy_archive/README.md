<h1 align="center">
  <br>
  📚 StudyKrack
  <br>
</h1>

<h4 align="center">An AI-powered study management platform built for the <strong>CynoSure 2K26 Hackathon</strong></h4>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.5_Flash-blue?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-hackathon">Hackathon</a>
</p>

---

## 🚀 About

**StudyKrack** is a unified academic companion that helps students manage tasks, track grades, get AI-powered tutoring, and maintain focus — all in one platform.

Built in **36 hours** at **CynoSure 2K26** as my first hackathon project as an **AIML student**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Neural Tutor** | Gemini 1.5 Flash powered Socratic tutor with LaTeX math support |
| 📊 **AI Study Insights** | Personalized academic coaching & performance analysis |
| ✅ **Task Manager** | Create, track, and complete study tasks with priorities |
| 📈 **Academic Tracker** | Grade trends and GPA visualization with Recharts |
| 🎯 **Focus Mode** | Pomodoro-style distraction-free study sessions |
| 🔐 **Auth System** | Firebase Authentication with Google OAuth support |
| 🌙 **Dark Mode UI** | Glassmorphism design with purple/blue gradient accents |

---

## 🛠 Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [Recharts](https://recharts.org/) — Data visualization
- [KaTeX](https://katex.org/) — Math equation rendering
- [Lucide React](https://lucide.dev/) — Icon system

**Backend & AI**
- [Firebase](https://firebase.google.com/) — Authentication & Firestore NoSQL Database
- [Google Generative AI (Gemini 1.5 Flash)](https://ai.google.dev/) — AI tutor & study insights
- Next.js Server Actions — Secure server-side AI calls

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A [Firebase](https://firebase.google.com) project (Auth + Firestore)
- A [Google AI Studio](https://aistudio.google.com) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/manaseti03-svg/studykrack.git
cd studykrack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
studykrack/
├── src/
│   ├── app/
│   │   ├── actions/          # Server actions (AI calls)
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── ai-tutor/     # Neural Tutor chat
│   │   │   ├── academics/    # Grade tracking
│   │   │   ├── tasks/        # Task manager
│   │   │   └── focus/        # Focus mode
│   │   ├── login/            # Auth pages
│   │   └── signup/
│   ├── components/
│   │   ├── dashboard/        # Dashboard UI components
│   │   ├── charts/           # Recharts wrappers
│   │   └── ui/               # Shared UI primitives
│   ├── lib/                  # Firebase config, Firestore services
│   ├── providers/            # React context providers (AuthProvider)
│   └── services/             # External service integrations
├── database/                 # Firestore rules & indexing info
└── public/                   # Static assets
```

---

## 🏆 Hackathon

**Event:** CynoSure 2K26  
**Theme:** AI for Education  
**Team:** Solo project  
**Duration:** 36 hours  
**Status:** Completed ✅

This was my **first hackathon** as a 2nd-year AIML student. I designed, built, and shipped a full-stack AI-powered web application from scratch — including authentication, database design, AI integration, and a custom design system.

### What I learned:
- Integrating Gemini AI with Next.js Server Actions securely
- Full-stack development with Firebase (Auth + Firestore)
- Rapid prototyping under time pressure
- Full-stack TypeScript development
- Prompt engineering for educational AI

---

## 📄 License

This project is private. All rights reserved © 2026 Muni Manas

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/manaseti03-svg">Muni Manas</a> — AIML Student, First Hackathon 🚀
</p>

