"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import SentinelLogo from '@/components/SentinelLogo';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleLogin = async () => {
    if (!accepted) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Initialize default profile if it doesn't exist
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          current_sgpa: 7.27, // Initial baseline as requested
          goal_sgpa: 8.5,
          semester: "AIML Semester 2",
          subscription_status: "free",
          created_at: serverTimestamp(),
          fuel_balance: 5, // Gift 5 starter power ingestions
          last_login: serverTimestamp()
        });
      } else {
        await setDoc(userRef, { last_login: serverTimestamp() }, { merge: true });
      }

      router.push('/dashboard');
    } catch (error) {
      console.error("Auth Failure:", error);
      alert("Verification Failed. Logic Guard Interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#050505]">
      {/* Background Neural Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/4 w-[60%] h-[60%] bg-cyan-900/10 blur-[180px] rounded-full animate-pulse-slow"></div>
      </div>

      {/* Left Panel: Pulse Radar Neural Animation */}
      <div className="hidden lg:flex w-3/5 relative flex-col items-center justify-center border-r border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden">
        <div className="pulse-radar-container relative">
            {/* Blinking Pulse Radar Concept */}
            <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] animate-pulse"></div>
            <div className="relative w-80 h-80 rounded-full border border-cyan-500/20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/10 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute w-60 h-60 rounded-full border border-cyan-500/10 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-t-cyan-500 animate-[spin_3s_linear_infinite]"></div>
                    <SentinelLogo className="w-24 h-24" />
                </div>
            </div>
            <div className="mt-16 text-center">
                <p className="text-[10px] font-label font-bold text-cyan-500 uppercase tracking-[0.6em] animate-pulse">
                   Initializing Sentinel...
                </p>
                <p className="text-zinc-600 text-[8px] mt-4 uppercase tracking-[0.3em]">Neural Bridge Active | AIML Sem 2 Roadmap detected</p>
            </div>
        </div>
      </div>

      {/* Right Panel: Auth Panel */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 bg-[#050505]/80">
        <div className="w-full max-w-sm bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <div className="flex flex-col items-center text-center mb-12">
            <SentinelLogo className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-headline font-bold text-white mb-2">Identity Verification</h2>
            <p className="text-zinc-500 text-sm font-medium">Access your Enterprise Logic Vault</p>
          </div>

          <div className="space-y-8">
            <button 
              onClick={handleLogin}
              disabled={!accepted || loading}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold tracking-tight
                ${!accepted ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50' : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)]'}
                ${loading ? 'animate-pulse' : ''}`}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? 'CALIBRATING...' : 'Continue with Google'}
            </button>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/20 transition-all cursor-pointer"
              />
              <label htmlFor="terms" className="text-[10px] leading-relaxed font-medium text-zinc-500 cursor-pointer">
                I accept the <span className="text-zinc-300 underline decoration-cyan-500/20">Terms & Conditions</span> and <span className="text-zinc-300 underline decoration-cyan-500/20">Logic Guard Policy v2.0</span>. I understand that my data is protected by Zero-Trust encryption.
              </label>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
             <p className="text-[9px] font-label font-bold text-zinc-600 text-center uppercase tracking-widest leading-loose">
               Secure Identity Portal <br/>
               Encrypted by StudyKrack Core
             </p>
          </div>
        </div>
      </div>
    </main>
  );
}
