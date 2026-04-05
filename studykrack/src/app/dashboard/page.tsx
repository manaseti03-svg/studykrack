'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type GradePoint = {
  subject: string;
  percentage: number;
  score: number;
  total: number;
  date?: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [avgScore, setAvgScore] = useState<string>('—');
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(12);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [{ data: tasks }, { data: grades }] = await Promise.all([
      supabase.from('tasks').select('completed').eq('user_id', user.uid),
      supabase.from('grade_records').select('subject, score, total, created_at').eq('user_id', user.uid).order('created_at', { ascending: true }),
    ]);

    if (tasks) {
      setTotalTasks(tasks.length);
      setCompletedTasks(tasks.filter(t => t.completed).length);
    }

    if (grades && grades.length > 0) {
      const totalScore = grades.reduce((acc, g) => acc + g.score, 0);
      const totalMax = grades.reduce((acc, g) => acc + g.total, 0);
      setAvgScore(totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) + '%' : '—');
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface leading-tight">Dashboard <span className="text-secondary">2.0</span></h1>
          <p className="text-on-surface-variant font-medium text-lg">Good morning, {user?.displayName || 'Researcher'}. Your archive is expanding.</p>
        </div>
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-4 border-white/5">
          <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
          <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-indigo-300">Synchronized</span>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Hero Widget: Focus of the Day */}
        <section className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-container/80 to-secondary-container/20 p-1 animate-float">
          <div className="relative h-full glass-panel rounded-[2.4rem] p-10 flex flex-col justify-between border-white/10">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-4 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-4 inline-block">Current Focus</span>
                <h2 className="text-4xl font-headline font-bold text-white max-w-sm">Quantum Electrodynamics & Field Theory</h2>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-cyan-400 text-3xl">bolt</span>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col md:flex-row gap-8 items-end md:items-center justify-between">
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Session progress</p>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-1000" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-white font-headline font-bold">65%</span>
                </div>
              </div>
              <Link href="/dashboard/tasks" className="px-8 py-3 bg-white text-primary-container rounded-full font-bold text-sm hover:bg-secondary hover:text-white transition-all duration-300 shadow-xl">
                Resume Study
              </Link>
            </div>
          </div>
        </section>

        {/* Study Streak Card */}
        <aside className="md:col-span-4 glass-panel rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-6 border-white/5 hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
          <div className="relative">
            <svg className="w-40 h-40 -rotate-90">
              <circle className="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-secondary drop-shadow-[0_0_8px_rgba(68,216,241,0.4)]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * (streak/15))} strokeWidth="8" strokeLinecap="round"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-headline font-extrabold text-white">{streak}</span>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Days</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-headline font-bold text-on-surface">Study Streak</h3>
            <p className="text-sm text-on-surface-variant mt-2">You&apos;re in the top 5% of active researchers.</p>
          </div>
        </aside>

        {/* Weekly Progress: Visual Bar Chart */}
        <section className="md:col-span-12 glass-panel rounded-[2.5rem] p-10 border-white/5 hover:-translate-y-1 transition-all duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-2xl font-headline font-bold text-white">Academic Momentum</h3>
              <p className="text-sm text-on-surface-variant">Task completion rate: <span className="text-secondary font-bold">{loading ? '...' : completionRate + '%'}</span></p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-surface-container-highest text-[10px] font-bold text-white uppercase tracking-widest hover:bg-primary-container transition-colors">Intensity</button>
              <button className="px-4 py-2 rounded-full bg-primary-container text-[10px] font-bold text-white uppercase tracking-widest">Efficiency</button>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between px-4 gap-4">
            {[40, 70, 55, 90, 60, 45, 20].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-primary-container/20 to-secondary/40 rounded-t-2xl hover:scale-y-105 transition-transform duration-500 cursor-pointer relative group" style={{ height: `${h}%` }}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary opacity-0 group-hover:opacity-100 uppercase">{(h/10).toFixed(1)}h</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <Link href="/dashboard/tasks" className="glass-panel p-8 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all hover:-translate-y-2 border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">auto_stories</span>
                </div>
                <div>
                  <h4 className="text-xl font-headline font-bold text-white">Research Archive</h4>
                  <p className="text-sm text-slate-400">{loading ? '...' : totalTasks - completedTasks} items awaiting synthesization</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary group-hover:translate-x-2 transition-all">chevron_right</span>
           </Link>

           <Link href="/dashboard/academics" className="glass-panel p-8 rounded-3xl flex items-center justify-between group hover:bg-white/5 transition-all hover:-translate-y-2 border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">analytics</span>
                </div>
                <div>
                  <h4 className="text-xl font-headline font-bold text-white">Scholarly Average</h4>
                  <p className="text-sm text-slate-400">Current average: <span className="text-secondary font-bold">{loading ? '...' : avgScore}</span></p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary group-hover:translate-x-2 transition-all">chevron_right</span>
           </Link>
        </section>
      </div>
    </div>
  );
}
