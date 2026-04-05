'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, CheckSquare, GraduationCap, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-8">Loading...</div>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navs = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Academics', href: '/dashboard/academics', icon: GraduationCap },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600">studyKrack</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navs.map((nav) => {
            const Icon = nav.icon;
            const active = pathname === nav.href;
            return (
              <Link 
                key={nav.name} 
                href={nav.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{nav.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
