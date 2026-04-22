"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import SentinelLogo from '@/components/SentinelLogo';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#050505] selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Neural Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/5 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <SentinelLogo className="w-8 h-8" />
          <span className="font-headline font-black text-xs uppercase tracking-widest text-white italic">StudyKrack v2.0</span>
        </div>
        <Link href="/auth" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        <div className="animate-[fade-in-up_1s_ease-out]">
          <SentinelLogo className="w-24 h-24 mb-10" />
          <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-white mb-6">
            BTech Code. <span className="bg-gradient-to-r from-cyan-400 to-amber-500 bg-clip-text text-transparent italic">Cracked.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-medium leading-relaxed mb-12">
            TOOLS is for reading. <span className="text-white font-bold">StudyKrack is for Winning.</span> <br/>
            Engineered to take you from a <span className="text-red-400/80 italic">7.27</span> to a dominant <span className="text-cyan-400 font-black">8.5+ SGPA</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-black uppercase tracking-widest text-xs shadow-[0_20px_40px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison: Marksman Engine */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-cyan-500 font-label font-bold uppercase tracking-[0.4em] text-[10px]">The AI Tutor Advantage</span>
          <h2 className="text-3xl font-headline font-bold text-white mt-2 italic">Standard AI vs StudyKrack Engine</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Standard AI Card */}
          <div className="bg-white/5 rounded-3xl p-8 border border-white/5 opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-zinc-500">robot_2</span>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">General Purpose Chatbot</span>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
              <div className="h-4 w-full bg-white/10 rounded-full"></div>
              <div className="h-4 w-5/6 bg-white/10 rounded-full"></div>
              <div className="h-24 w-full bg-white/5 rounded-2xl flex items-center justify-center italic text-zinc-600 text-xs text-center px-4">
                "Here is some information about your topic in long paragraphs that you'll likely forget during the exam..."
              </div>
            </div>
          </div>

          {/* StudyKrack Marksman Card */}
          <div className="bg-[#0a0a15] rounded-3xl p-8 border border-cyan-500/20 shadow-[0_20px_80px_rgba(6,182,212,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-cyan-500 text-[8px] font-black uppercase px-3 py-1 rounded-full text-black">Active Guard</span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <SentinelLogo className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">Exam Prep Mode v2.0</span>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-cyan-950/20 rounded-xl border border-cyan-500/20">
                <p className="text-[10px] font-black text-cyan-400 mb-2 uppercase italic tracking-tighter">14-Mark Logic Protocol</p>
                <ul className="space-y-2 text-[11px] text-zinc-300 font-medium">
                  <li className="flex items-center gap-2"><span className="text-cyan-500">01</span> Definition & Historical Context (2 Marks)</li>
                  <li className="flex items-center gap-2"><span className="text-cyan-500">02</span> Technical Proofs & Proof Logic (6 Marks)</li>
                  <li className="flex items-center gap-2"><span className="text-cyan-500">03</span> Marksman Diagram Construction (3 Marks)</li>
                  <li className="flex items-center gap-2"><span className="text-cyan-500">04</span> Industrial Application (3 Marks)</li>
                </ul>
              </div>
              <div className="h-10 w-full bg-cyan-500/10 rounded-xl border border-dashed border-cyan-500/20 flex items-center justify-center">
                 <span className="text-[9px] font-label font-bold text-cyan-500/60 uppercase tracking-widest italic">Target: 8.5+ SGPA Setting Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logic Vault Showcase */}
      <section className="py-24 bg-white/5">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-500 font-label font-bold uppercase tracking-[0.4em] text-[10px]">Zero Waste Architecture</span>
            <h2 className="text-4xl font-headline font-bold text-white mt-4 mb-6 italic">Upload Once. <br/>Use Forever.</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Our <span className="text-white font-bold">SHA-256 Deduplication</span> ensures every PDF you upload becomes a permanent neural node in your vault. 
              <br/><br/>
              If a friend uploads the same syllabus, StudyKrack identifies the duplicate hash instantly. <span className="text-amber-500">0 API waste. Instant RAG retrieval.</span>
            </p>
            <div className="p-6 bg-black rounded-2xl border border-white/5 flex gap-6 items-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500">security</span>
              </div>
              <div>
                <p className="text-white font-bold leading-none">Study Vault Protection</p>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Enterprise Privacy v2.0</p>
              </div>
            </div>
          </div>
          <div className="relative group">
             <div className="absolute inset-0 bg-amber-500/20 blur-[100px] opacity-20"></div>
             <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 aspect-square flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mb-8"></div>
                <div className="grid grid-cols-3 gap-4 w-full">
                   {[
                     "f1e2...8b9c", "a4d5...c6f7", "e8b9...d1a2",
                     "c3f4...e5b6", "b7a8...c9d0", "d2e3...f4a5",
                     "a1b2...c3d4", "e5f6...a7b8", "9c0d...1e2f"
                   ].map((hash, i) => (
                     <div key={i} className="aspect-square rounded-xl bg-[#080808] border border-white/10 flex flex-col items-center justify-center p-2 text-center group-hover:border-cyan-500/50 transition-colors">
                        <span className="text-[10px] mb-1">🔒</span>
                        <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-tighter mb-1 leading-none">SHA-256 Protected</span>
                        <span className="text-[8px] text-cyan-500/60 font-mono tracking-tighter">{hash}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing / Fuel Section */}
      <section className="py-32 px-6 flex flex-col items-center">
        <div className="max-w-lg w-full bg-gradient-to-b from-[#0a0a15] to-black rounded-[40px] p-12 border border-white/10 text-center relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <div className="mb-8 p-4 inline-block bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
             <span className="text-3xl">🥟</span>
          </div>

          <h2 className="text-2xl font-headline font-bold text-white mb-2">₹19 Fuel Plan</h2>
          <p className="text-zinc-500 text-sm mb-10 font-medium">Clear pricing. No hidden cloud debt.</p>

          <div className="text-center mb-10">
            <span className="text-6xl font-headline font-black text-white">₹19</span>
            <span className="text-zinc-500 uppercase font-bold text-xs tracking-widest ml-2">/ 20 AI Credits</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-10 text-left">
            <p className="text-[9px] font-label font-bold text-zinc-500 uppercase tracking-widest mb-4">Why ₹19?</p>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              "That is the cost of a single Samosa at your college canteen. Pay only when you are low on Fuel. No subscriptions. Just wins."
            </p>
          </div>

          <Link href="/auth" className="block w-full py-4 rounded-xl bg-cyan-500 text-black font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all">
            Get Fueled Up
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center px-6">
        <p className="text-[8px] font-label text-zinc-600 font-bold uppercase tracking-[0.6em]">
          Designed by Muni Manas | AIML Semester 2 | Under Logic Guard Protocol
        </p>
      </footer>
    </main>
  );
}
