'use client';

import { useState, useEffect, useCallback } from 'react';
import StudyService from '@/services/studyService';
import { useAuth } from '@/providers/AuthProvider';
import BentoCard from '@/components/dashboard/BentoCard';
import StatsTracker from '@/components/dashboard/StatsTracker';
import Icon from '@/components/ui/Icon';
import GlassPanel from '@/components/ui/GlassPanel';
import ScholarisButton from '@/components/ui/ScholarisButton';

export default function DashboardPage() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
  const [academicGpa, setAcademicGpa] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<number[]>([]);

  useEffect(() => {
    // Generate mock data only on client after mount
    const data = Array.from({ length: 28 }, () => 
      Math.random() > 0.4 ? (Math.random() * 100) : 0
    );
    setHeatmapData(data);
  }, []);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const [tasks, grades] = await Promise.all([
        StudyService.fetchTasks(user.uid),
        StudyService.fetchGrades(user.uid),
      ]);

      const tCount = tasks.length;
      const tComp = tasks.filter(t => t.completed).length;
      setTaskStats({ total: tCount, completed: tComp });

      if (grades && grades.length > 0) {
        const totalPercentage = grades.reduce((acc, r) => acc + (r.score / r.total), 0);
        setAcademicGpa(((totalPercentage / grades.length) * 10).toFixed(2));
      }
    } catch (err) {
      console.error('Nexus synchronization failure.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const mockHeatmap = Array.from({ length: 28 }, (_, i) => Math.random() > 0.4 ? (Math.random() * 100) : 0);

  return (
    <div className="space-y-16 animate-fade-in-up pb-32">
      {/* Elite Hero Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-6xl font-headline font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_20px_#ffffff20]">Nexus</h1>
             <div className="h-0.5 w-16 bg-gradient-to-r from-secondary to-transparent"></div>
          </div>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.4em] opacity-60">Scholaris Research Portal // Node 7</p>
        </div>
        
        <GlassPanel className="!py-3 !px-6 rounded-full border-white/5 flex items-center gap-4 group" hoverable={true} animate={false}>
           <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-400' : 'bg-secondary'} animate-pulse shadow-[0_0_10px_#44d8f1]`}></div>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{loading ? 'Syncing Matrix...' : 'Systems Online'}</span>
           <Icon name="verified_user" className="text-secondary text-base group-hover:rotate-[360deg] transition-transform duration-1000" />
        </GlassPanel>

        {/* Decorative background glow behind header */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
      </header>

      {/* Primary Analytical Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-min">
        
        {/* Central Intelligence Hero */}
        <BentoCard 
          span={8}
          header={{ title: "Focus of the Day", subtitle: "Active Synthesis Pipeline", icon: "offline_bolt", iconColor: "text-amber-400" }}
          className="relative min-h-[400px] flex flex-col justify-between"
        >
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                 {['Neural', 'Deep Flow', 'Active'].map(tag => (
                   <span key={tag} className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-400">{tag}</span>
                 ))}
              </div>
              <h2 className="text-5xl font-headline font-black text-white leading-[0.9] tracking-tight">Quantum <br/> Bibliometrics</h2>
              <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">Systematic deconstruction of archival materials into high-viscosity knowledge nodes. Node density: 84%.</p>
            </div>
            
            <div className="flex items-center gap-10">
               <ScholarisButton variant="primary" className="!px-10 h-14">Initialize Session</ScholarisButton>
               <div className="hidden lg:flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-slate-800" />)}
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Collaborators Synced</span>
               </div>
            </div>
          </div>

          {/* Decorative Visualizer inside Hero Card */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 border-[40px] border-secondary/5 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-12 w-1 h-32 bg-gradient-to-b from-transparent via-secondary/20 to-transparent"></div>
        </BentoCard>

        {/* Real-time Velocity Tracker */}
        <BentoCard 
          span={4}
          header={{ title: "Daily Pulse", subtitle: "Activity Velocity", icon: "monitoring" }}
          className="flex flex-col items-center justify-center p-12 text-center"
        >
          <StatsTracker 
            label="Velocity Offset"
            value="+14.2"
            subtext="v/hr"
            progress={0.75}
            size="lg"
            color="text-secondary"
          />
        </BentoCard>

        {/* The Ledger Mini-Display */}
        <BentoCard 
          span={4}
          header={{ title: "Numerical Archive", subtitle: "Growth Metrics", icon: "inventory_2" }}
          className="flex flex-col justify-center"
        >
           <div className="flex justify-center py-4">
             <StatsTracker 
               label="Current GPA"
               value={academicGpa}
               subtext="/ 10.0"
               progress={Number(academicGpa) / 10}
               size="md"
               color="text-primary"
             />
           </div>
        </BentoCard>

        {/* Quantum Activity Thermal Map */}
        <BentoCard 
          span={8}
          header={{ title: "Focus Thermal Density", subtitle: "Temporal Research Heatmap", icon: "bubble_chart", iconColor: "text-secondary" }}
          className="flex flex-col h-full"
        >
           <div className="grid grid-cols-7 gap-3 mt-4 h-full pb-8">
              {heatmapData.map((v, i) => (
                <div 
                  key={i} 
                  className="aspect-square rounded-xl transition-all duration-700 hover:scale-110 cursor-alias border border-white/5"
                  style={{ 
                    backgroundColor: v > 0 ? `rgba(68, 216, 241, ${v/100})` : 'rgba(255,255,255,0.02)',
                    boxShadow: v > 50 ? `0 0 15px rgba(68, 216, 241, ${v/200})` : 'none'
                  }}
                ></div>
              ))}
           </div>
           <div className="flex justify-between items-center text-[8px] font-bold text-slate-600 tracking-widest uppercase">
              <span>Mon</span>
              <span>Daily Knowledge Yield</span>
              <span>Sun</span>
           </div>
        </BentoCard>

        {/* Operational Milestone Archive (Tableized View) */}
        <BentoCard 
          span={12}
          header={{ title: "Archival Milestones", subtitle: "Record of Recent Synchronizations", icon: "verified" }}
        >
          <div className="space-y-2 pt-4">
             {[
               { id: '1', title: 'Neural Network Synthesis', cat: 'Research', status: 'Verified', color: 'text-secondary' },
               { id: '2', title: 'Macroeconomic Audit', cat: 'Ledger', status: 'Synchronized', color: 'text-primary' },
               { id: '3', title: 'Binaural Flow Session', cat: 'Focus', status: 'Completed', color: 'text-amber-400' }
             ].map((item, idx) => (
               <div key={item.id} className={`flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item ${idx === 0 ? 'bg-secondary/10 border-secondary/20' : ''}`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`}></div>
                    <span className="font-headline font-bold text-xl text-white tracking-tight">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-8">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.cat}</span>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>{item.status}</span>
                     <Icon name="chevron_right" className="text-slate-600 group-hover/item:translate-x-1 transition-transform" />
                  </div>
               </div>
             ))}
          </div>
          <div className="mt-10 flex justify-center">
             <ScholarisButton variant="secondary" href="/dashboard/tasks" className="!px-12 !h-12 !text-[9px]">Expand Full Archive</ScholarisButton>
          </div>
        </BentoCard>

      </section>
    </div>
  );
}
