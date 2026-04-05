import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold text-indigo-600 mb-4">studyKrack</h1>
      <p className="text-xl text-slate-600 mb-8 max-w-md">
        Crack Your Studies, Build Your Future. 
        A unified study management platform to track tasks and academics.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
