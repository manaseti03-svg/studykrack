'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import GlassPanel from '@/components/ui/GlassPanel';
import BentoCard from '@/components/dashboard/BentoCard';
import StatsTracker from '@/components/dashboard/StatsTracker';
import Icon from '@/components/ui/Icon';

export default function DashboardPage() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
  const [academicGpa, setAcademicGpa] = useState('0.00');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      const [{ data: tasks }, { data: grades }] = await Promise.all([
        supabase.from('tasks').select('completed').eq('user_id', user.uid),
        supabase.from('grade_records').select('score, total').eq('user_id', user.uid),
      ]);

      const tCount = tasks?.length || 0;
      const tComp = tasks?.filter(t => t.completed).length || 0;
      setTaskStats({ total: tCount, completed: tComp });

      if (grades && grades.length > 0) {
        const totalPercentage = grades.reduce((acc, r) => acc + (r.score / r.total), 0);
        setAcademicGpa(((totalPercentage / grades.length) * 10).toFixed(2));
      }
    } catch (err) {
      console.error('Data retrieval failed.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-12 animate-fade-in-up">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-5xl font-headline font-black tracking-tighter text-white uppercase italic">Nexus</h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.4em]">Integrated Intelligence Matrix</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
           <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-500' : 'bg-secondary'} animate-pulse shadow-lg`}></div>
           {loading ? 'Synchronizing...' : 'Systems Online'}
        </div>
      </header>

      {/* Main Analytical Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Focus of the Day (Hero) */}
        <BentoCard 
          span={8}
          header={{ title: "Focus of the Day", subtitle: "Active Flow Priority", icon: "bolt", iconColor: "text-amber-400" }}
          className="relative overflow-hidden"
        >
          <div className="pt-4 space-y-6">
            <div className="space-y-2">
              <h4 className="text-3xl font-headline font-bold text-white leading-tight">Advanced Research <br/> Synthesis Phase II</h4>
              <p className="text-on-surface-variant text-sm max-w-sm">Deep learning modules are synchronized. Isolate now to achieve peak cognitive synthesis.</p>
            </div>
            <div className="flex items-center gap-8 pt-4">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-slate-800" />)}
                 <div className="w-10 h-10 rounded-full border-2 border-surface bg-secondary/10 flex items-center justify-center text-[10px] font-bold text-secondary">+12</div>
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shared Research Cluster</span>
            </div>
          </div>
          {/* Decorative center glow */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full" />
        </BentoCard>

        {/* Global Streak (Secondary Stat) */}
        <BentoCard 
          span={4}
          header={{ title: "Daily Pulse", subtitle: "Consistency Stream", icon: "local_fire_department" }}
          className="flex flex-col items-center justify-center text-center"
        >
          <StatsTracker 
            label="Current Streak"
            value={14}
            subtext="Days"
            progress={0.7}
            size="lg"
            color="text-amber-400"
          />
        </BentoCard>

        {/* Academic Analytics (Secondary Grid) */}
        <BentoCard 
          span={4}
          header={{ title: "The Ledger", subtitle: "Cumulative Growth", icon: "history_edu" }}
        >
          <div className="flex py-6 justify-center">
             <StatsTracker 
               label="Current GPA"
               value={academicGpa}
               subtext="/ 10.0"
               progress={Number(academicGpa) / 10}
               size="md"
             />
          </div>
        </BentoCard>

        {/* Data Analytics Overview */}
        <BentoCard 
          span={8}
          header={{ title: "Academic Momentum", subtitle: "Cognitive Load Variance", icon: "activity_zone", iconColor: "text-secondary" }}
          className="flex flex-col justify-end"
        >
           <div className="h-48 flex items-end justify-between px-4 gap-4 pt-12">
            {[40, 70, 55, 90, 60, 45, 20].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-primary-container/20 to-secondary/40 rounded-t-2xl hover:scale-y-105 transition-transform duration-500 cursor-pointer relative group" 
                style={{ height: `${h}%` }}
              >
                <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary opacity-0 group-hover:opacity-100 uppercase tracking-widest">{(h/10).toFixed(1)}h</span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Task Archive Status */}
        <BentoCard 
          span={12}
          header={{ title: "Operational Archive", subtitle: "Task Processing Status", icon: "inventory_2" }}
          className="hover:bg-slate-900/60"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-8">
             <div className="flex-1 space-y-8 w-full">
                <div className="space-y-4">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>Refinement Lifecycle</span>
                      <span className="text-secondary">{Math.round((taskStats.completed/taskStats.total)*100) || 0}% Complete</span>
                   </div>
                   <div className="h-3 w-full bg-surface-container-highest/50 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-container to-secondary transition-all duration-1000 shadow-[0_0_15px_#44d8f1]" 
                        style={{ width: `${(taskStats.completed / taskStats.total) * 100 || 0}%` }}
                      />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-3xl font-headline font-black text-white">{taskStats.total}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logged Units</div>
                   </div>
                   <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-3xl font-headline font-black text-secondary">{taskStats.completed}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Synchronized</div>
                   </div>
                </div>
             </div>
             <div className="w-56 h-56 flex-shrink-0 animate-float hidden md:block">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-container/20 via-transparent to-secondary/20 flex items-center justify-center p-8 border border-white/5 relative group">
                   <Icon name="verified" className="text-9xl text-white opacity-10 blur-sm group-hover:blur-none transition-all duration-700" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-7xl font-headline font-black text-white/40">{taskStats.completed}</span>
                   </div>
                </div>
             </div>
          </div>
        </BentoCard>

      </section>
    </div>
  );
}
