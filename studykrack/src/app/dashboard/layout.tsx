'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import GlassPanel from '@/components/ui/GlassPanel';
import LiquidBackground from '@/components/ui/LiquidBackground';
import ScholarisButton from '@/components/ui/ScholarisButton';
import Icon from '@/components/ui/Icon';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'home_max' },
  { name: 'Research Archive', href: '/dashboard/tasks', icon: 'check_box' },
  { name: 'The Ledger', href: '/dashboard/academics', icon: 'history_edu' },
  { name: 'Neural Tutor', href: '/dashboard/ai-tutor', icon: 'psychology' },
  { name: 'Focus Mode', href: '/dashboard/focus', icon: 'filter_vintage' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('System De-authorized.');
      router.push('/login');
    } catch (error: any) {
      toast.error('Exit trajectory failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary/20 relative overflow-hidden flex">
      <LiquidBackground />

      {/* Modern Adaptive Sidebar (The Archive) */}
      <aside className="w-80 h-screen p-6 hidden lg:flex flex-col relative z-20">
        <GlassPanel className="h-full flex flex-col p-6 border-white/5" hoverable={false} animate={false}>
          <div className="mb-12 px-2">
            <Link href="/" className="text-3xl font-headline font-black tracking-tighter text-indigo-100 uppercase">studyKrack</Link>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Scholaris Research Systems</p>
          </div>

          <nav className="flex-1 space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-xl shadow-white/5' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon 
                    name={item.icon} 
                    className={`text-xl transition-all ${isActive ? 'text-secondary' : 'group-hover:text-cyan-400'}`} 
                  />
                  <span className="font-headline font-bold text-xs uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-4">
             <ScholarisButton href="/dashboard/tasks" variant="primary" className="w-full">
                New Entry
             </ScholarisButton>
             <button 
               onClick={handleLogout}
               className="flex items-center justify-center gap-3 px-6 py-3 text-slate-500 hover:text-error transition-colors text-[10px] font-bold uppercase tracking-widest"
             >
                <Icon name="logout" className="text-sm" />
                Sign Out / De-auth
             </button>
          </div>
        </GlassPanel>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 lg:p-12 relative z-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto pb-20">
          {children}
        </div>
      </main>

      {/* Mobile Portal Navigation (Consolidated) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <GlassPanel className="py-2 px-4 border-white/10 rounded-full flex justify-around items-center" hoverable={false}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`p-4 rounded-full transition-all ${isActive ? 'text-secondary bg-white/5' : 'text-slate-500'}`}
              >
                <Icon name={item.icon} className="text-2xl" />
              </Link>
            );
          })}
        </GlassPanel>
      </nav>
    </div>
  );
}
