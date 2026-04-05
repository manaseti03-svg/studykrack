'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message.replace('Firebase: ', ''));
      else setError('Access denied. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message.replace('Firebase: ', ''));
      else setError('Biometric bypass failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 opacity-30 mesh-gradient animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
        {/* Branding header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-headline font-black tracking-tighter text-indigo-100 uppercase">studyKrack</Link>
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Scholaris Research Systems</p>
        </div>

        <div className="glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-3xl bg-slate-900/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <h2 className="text-3xl font-headline font-extrabold text-white mb-2 text-center">Authenticate</h2>
          <p className="text-center text-on-surface-variant text-sm mb-10">Enter your credentials to access the archive.</p>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          {/* Social Auth */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-300">
              {googleLoading ? 'Initiating...' : 'Sync with Google'}
            </span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Credentials</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Identifier</label>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">alternate_email</span>
                 <input
                  type="email"
                  required
                  placeholder="name@archive.com"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Passkey</label>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">key_visualizer</span>
                 <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body text-2xl tracking-[0.2em]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-bold font-headline text-xs uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Authorize Access'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            No record found?{' '}
            <Link href="/signup" className="text-secondary hover:text-cyan-300 transition-colors">Create Archive</Link>
          </p>
        </div>
      </div>
      
      {/* Decorative footer elements */}
      <div className="fixed bottom-10 left-10 text-slate-600 text-[8px] font-bold uppercase tracking-widest hidden md:block">
        System 2.0.4 // Encrypted
      </div>
      <div className="fixed bottom-10 right-10 text-slate-600 text-[8px] font-bold uppercase tracking-widest hidden md:block">
        © Scholaris Foundation
      </div>
    </main>
  );
}
