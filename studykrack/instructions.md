# studyKrack Next.js Setup

## 1. Project Initialization & Dependencies
I've initialized the project and installed dependencies:
```bash
npx create-next-app@latest studykrack --ts --tailwind --eslint --app --src-dir --use-npm
cd studykrack
npm install @supabase/supabase-js @heroicons/react lucide-react
```

## 2. Supabase Configuration
Create a project on Supabase and in your project root, create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Enable Authentication
In your Supabase dashboard, go to Authentication -> Providers and enable Email/Password login.

## 3. Running Locally
Run the development server natively:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with studyKrack!

## 4. Deployment to Anti Gravity
1. Push your `studykrack` folder to a new GitHub repository.
2. In Anti Gravity (or Vercel), create a new Next.js project.
3. Select your repository.
4. Input your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Environment Variables for the build.
5. Click **Deploy**. Your MVP will be live in minutes.

---

## 2-Minute Demo Script

> *"Hi everyone, we built **studyKrack**. It’s incredibly easy for students to get overwhelmed with coursework, managing deadlines spread across notebooks, Canvas, and spreadsheets. We built studyKrack as a single, unified digital hub. Let me show you."*
> 
> *[Show Landing Page]*
> *"Our landing page has a clean, distraction-free design. Let's log in using our Supabase-powered authentication."*
>
> *[Show Dashboard Overview]*
> *"Once in, the student gets a unified bird's-eye view of their performance. In the next phases, we'll hook these stat widgets directly to our database, but here you can see the minimal layout."*
>
> *[Navigate to Tasks]*
> *"We’ve implemented Task Management. Students can quickly add tasks, tag them by subject like 'Calculus', and mark them off for instant dopamine. The UI is built with Next.js and Tailwind to be incredibly responsive."*
>
> *[Navigate to Academics]*
> *"Finally, the Academic Tracking page. Instead of waiting for the end of the semester to panic, students insert their grades as they get them. studyKrack immediately calculates and visualizes their running average."*
>
> *"studyKrack simplifies student life. Thank you!"*
