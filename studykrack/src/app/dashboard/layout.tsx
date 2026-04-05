'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
      <div className="text-primary font-headline text-2xl font-black tracking-tighter">studyKrack</div>
      <div className="text-secondary font-medium mt-2">Entering your cognitive sanctuary...</div>
    </div>
  );

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navs = [
    { name: 'Home', href: '/dashboard', icon: 'home_max' },
    { name: 'Statistics', href: '/dashboard/academics', icon: 'analytics' },
    { name: 'Focus', href: '/dashboard/focus', icon: 'timer' },
    { name: 'Research', href: '/dashboard/tasks', icon: 'auto_stories' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* Global Background Mesh */}
      <div className="fixed inset-0 z-[-1] liquid-mesh opacity-20"></div>

      {/* Side Navigation Bar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 bg-slate-950/60 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-50 py-8 px-4 gap-8">
        <div className="flex flex-col gap-2 px-6">
          <span className="text-xl font-bold text-indigo-200 font-headline tracking-tighter">The Archive</span>
          <span className="font-manrope font-semibold text-[10px] uppercase tracking-widest text-slate-500">Scholaris Phase II</span>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          {navs.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <Link
                key={nav.name}
                href={nav.href}
                className={`flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-500/20 text-cyan-300 shadow-[0_0_15px_rgba(68,216,241,0.2)]' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-indigo-100'
                } hover:translate-x-2`}
              >
                <span className="material-symbols-outlined text-xl">{nav.icon}</span>
                <span className="font-headline font-semibold text-xs uppercase tracking-widest">{nav.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 flex flex-col gap-4">
           <Link 
             href="/dashboard/tasks" 
             className="w-full py-4 bg-gradient-to-r from-primary-container to-secondary-container text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform active:scale-95 text-center flex items-center justify-center"
           >
              New Entry
           </Link>
           <button 
             onClick={handleLogout}
             className="flex items-center justify-center gap-3 px-6 py-3 text-slate-500 hover:text-error transition-colors text-xs font-bold uppercase tracking-widest"
           >
              <span className="material-symbols-outlined text-sm">logout</span>
              Sign Out
           </button>
        </div>
      </aside>

      {/* Top Header (Mobile Only) */}
      <header className="md:hidden sticky top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center px-8 h-20 shadow-[0_8px_32px_0_rgba(68,216,241,0.05)] border-b border-white/5">
        <span className="text-2xl font-extrabold tracking-tighter text-indigo-100 font-headline">studyKrack</span>
        <div className="flex items-center gap-4">
           <span className="material-symbols-outlined text-indigo-300">notifications</span>
           <div className="w-8 h-8 rounded-full overflow-hidden border border-secondary/30">
              <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
           </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 md:ml-72 pt-8 md:pt-12 px-6 md:px-12 pb-32">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-slate-900/50 backdrop-blur-lg rounded-t-[3rem] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navs.map((nav) => {
          const isActive = pathname === nav.href;
          return (
            <Link
              key={nav.name}
              href={nav.href}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                isActive ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined">{nav.icon}</span>
              <span className="font-body text-[10px] font-medium mt-1">{nav.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
