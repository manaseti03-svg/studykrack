'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message.replace('Firebase: ', ''));
      else setError('Registration failed. Archive full?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 opacity-30 mesh-gradient animate-pulse-slow"></div>

      <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
        {/* Branding header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-4xl font-headline font-black tracking-tighter text-secondary uppercase">studyKrack</Link>
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Scholaris Research Systems</p>
        </div>

        <div className="glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-3xl bg-slate-900/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
          
          <h2 className="text-3xl font-headline font-extrabold text-white mb-2 text-center">Register</h2>
          <p className="text-center text-on-surface-variant text-sm mb-10">Initialize your academic archive.</p>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">person</span>
                 <input
                  type="text"
                  required
                  placeholder="The Alchemist"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-secondary/40 focus:bg-white/5 transition-all font-body"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Identifier</label>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">alternate_email</span>
                 <input
                  type="email"
                  required
                  placeholder="name@archive.com"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-secondary/40 focus:bg-white/5 transition-all font-body"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-4">Passkey</label>
              <div className="relative group">
                 <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">key_visualizer</span>
                 <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-secondary/40 focus:bg-white/5 transition-all font-body text-2xl tracking-[0.2em]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-bold font-headline text-xs uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50 mt-4"
            >
              {loading ? 'Initializing...' : 'Initialize Archive'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Already verified?{' '}
            <Link href="/login" className="text-secondary hover:text-cyan-300 transition-colors">SignIn Access</Link>
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
