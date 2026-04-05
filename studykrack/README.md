# studyKrack

Crack Your Studies, Build Your Future. A minimal unified study management platform for tasks and academics.

## Quick Start (How to Run)

To run the application locally on your machine, follow these simple steps:

### 1. Requirements
- Make sure you have Node.js installed on your computer.

### 2. Enter the Folder
Open your terminal (PowerShell or Command Prompt) and navigate into the `studykrack` folder:
```bash
cd c:\Users\manas\OneDrive\Desktop\CynoSure_2k26\studykrack
```

### 3. Install Dependencies (First time only)
```bash
npm install
```

### 4. Start the Application
Run the Next.js development server:
```bash
npm run dev
```

### 5. View the App
Open your web browser and go to:
**http://localhost:3000**

---

### Supabase Setup (Optional but required for login)
To get the login page working, you must create a `.env.local` file inside this `studykrack` folder and paste your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```
