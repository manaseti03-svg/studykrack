'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassPanel from '@/components/ui/GlassPanel';
import LiquidBackground from '@/components/ui/LiquidBackground';
import ScholarisButton from '@/components/ui/ScholarisButton';
import Icon from '@/components/ui/Icon';

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
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
      <LiquidBackground />

      <div className="relative z-10 w-full max-w-lg">
        {/* Branding header */}
        <div className="text-center mb-10 animate-fade-in">
          <Link href="/" className="text-4xl font-headline font-black tracking-tighter text-indigo-100 uppercase italic">studyKrack</Link>
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.4em] text-[8px] mt-2 opacity-50">Scholaris Research Systems</p>
        </div>

        <GlassPanel className="p-10 md:p-14" hoverable={false} animate={true}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 shadow-[0_0_15px_#44d8f1]"></div>
          
          <h2 className="text-3xl font-headline font-extrabold text-white mb-2 text-center uppercase tracking-tighter italic">Register / Archive</h2>
          <p className="text-center text-on-surface-variant text-sm mb-10 uppercase tracking-widest opacity-60 font-bold">Initialize Your Academic Record</p>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-[10px] font-bold text-center uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-5 opacity-60">Full Identity</label>
              <div className="relative group">
                 <Icon name="person" className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl" />
                 <input
                  type="text"
                  required
                  placeholder="The Alchemist"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-5 opacity-60">System Identifier</label>
              <div className="relative group">
                 <Icon name="alternate_email" className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl" />
                 <input
                  type="email"
                  required
                  placeholder="domain@archive.com"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-5 opacity-60">New Authentication Passkey</label>
              <div className="relative group">
                 <Icon name="key_visualizer" className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-xl" />
                 <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body text-xl tracking-[0.3em]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <ScholarisButton
              type="submit"
              variant="primary"
              className="w-full py-5 italic tracking-[0.3em] mt-4"
              disabled={loading}
            >
              {loading ? 'Initializing...' : 'Synthesize Record'}
            </ScholarisButton>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 opacity-60">
            Already verified?{' '}
            <Link href="/login" className="text-secondary hover:text-cyan-300 transition-colors italic">SignIn Access</Link>
          </p>
        </GlassPanel>
      </div>
      
      {/* Footer Markers */}
      <div className="fixed bottom-10 left-10 text-slate-700 text-[8px] font-bold uppercase tracking-widest hidden md:block opacity-40">
        Scholaris Terminal 2.0.4 // Encrypted
      </div>
      <div className="fixed bottom-10 right-10 text-slate-700 text-[8px] font-bold uppercase tracking-widest hidden md:block opacity-40 italic">
        Architecture Refined
      </div>
    </main>
  );
}
