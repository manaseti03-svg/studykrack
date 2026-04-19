'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  History, 
  Settings, 
  LogOut, 
  Plus, 
  LayoutDashboard,
  BrainCircuit,
  Database,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { FirestoreService, Session } from '@/lib/firestore-service';
import GlassPanel from '../ui/GlassPanel';
import Icon from '../ui/Icon';

interface AppShellProps {
  children: ReactNode;
  activeSessionId?: string;
}

export default function AppShell({ children, activeSessionId }: AppShellProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    let unsubscribe: () => void;
    FirestoreService.getSessions(user.uid, (data) => {
      setSessions(data);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => unsubscribe?.();
  }, [user]);

  const navItems = [
    { label: 'Nexus Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
    { label: 'Neural Chat', icon: <MessageSquare size={18} />, href: '/nexus' },
    { label: 'Archival Ledger', icon: <Database size={18} />, href: '/dashboard/tasks' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[0%] right-[0%] w-[30%] h-[30%] bg-primary/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar - Left (Sessions & Nav) */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-20'
        } hidden md:flex flex-col border-r border-white/5 bg-slate-900/20 backdrop-blur-3xl transition-all duration-500 ease-in-out z-30`}
      >
        <div className="flex items-center justify-between p-6">
          {isSidebarOpen ? (
            <h1 className="text-xl font-headline font-black tracking-tighter text-white uppercase italic">studyKrack</h1>
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-background font-bold">S</div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="px-4 space-y-2 flex-1 overflow-y-auto no-scrollbar pt-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                pathname === item.href 
                ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={pathname === item.href ? 'text-secondary' : 'group-hover:text-secondary'}>
                {item.icon}
              </div>
              {isSidebarOpen && (
                <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
              )}
            </Link>
          ))}

          {isSidebarOpen && (
            <div className="mt-12 space-y-4">
              <div className="flex items-center justify-between px-4 mb-4">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Temporal Nodes</span>
                <Link href="/nexus/new" className="text-secondary hover:scale-110 transition-transform">
                  <Plus size={16} />
                </Link>
              </div>
              <div className="space-y-1">
                {sessions.map((session) => (
                  <Link 
                    key={session.id}
                    href={`/nexus/${session.id}`}
                    className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${
                      activeSessionId === session.id 
                      ? 'bg-white/5 text-white border border-white/10' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[11px] font-bold tracking-tight truncate max-w-[140px]">
                      {session.title || 'Untitled Mission'}
                    </span>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeSessionId === session.id ? 'opacity-100 text-secondary' : ''}`} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center bg-white/5 p-3 rounded-2xl border border-white/5 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-secondary/20 flex-shrink-0" />
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate uppercase tracking-tighter">{user?.email?.split('@')[0] || 'Scholar'}</p>
                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Mastery Level 7</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5">
          <h1 className="text-lg font-headline font-black tracking-tighter text-white uppercase italic">studyKrack</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-secondary"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>

      {/* Right Sidebar (Optional Info / Stats / Knowledge) */}
      <aside className="hidden lg:flex w-72 flex-col border-l border-white/5 bg-slate-900/10 backdrop-blur-2xl p-6">
        <div className="space-y-8 h-full overflow-y-auto no-scrollbar">
          <section className="space-y-4">
             <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Cognitive Metrics</h3>
             <GlassPanel className="p-4 bg-secondary/5 border-secondary/10">
                <div className="flex items-center justify-between mb-4">
                   <BrainCircuit className="text-secondary w-5 h-5" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Node Density</span>
                </div>
                <div className="text-2xl font-headline font-black text-white">84.2%</div>
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                   <div className="w-[84%] h-full bg-secondary shadow-[0_0_8px_#44d8f1]" />
                </div>
             </GlassPanel>
          </section>

          <section className="space-y-4">
             <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">Neural Mode</h3>
             <div className="grid grid-cols-1 gap-2">
                {['Socratic', 'Researcher', 'Solver'].map(mode => (
                  <div key={mode} className={`p-3 rounded-xl border flex items-center justify-between group cursor-pointer transition-all ${
                    mode === 'Socratic' ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${mode === 'Socratic' ? 'text-secondary' : 'text-slate-500 group-hover:text-white'}`}>{mode}</span>
                    {mode === 'Socratic' && <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
                  </div>
                ))}
             </div>
          </section>

          <section className="flex-1 flex flex-col">
             <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4">Extracted Concepts</h3>
             <div className="flex-1 rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col items-center justify-center text-center opacity-30 italic text-[10px] text-slate-500">
                Awaiting mission context...
             </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
