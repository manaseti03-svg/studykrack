'use client';

import { useState, useEffect } from 'react';
import NeuralTutor from '@/components/dashboard/NeuralTutor';
import GlassPanel from '@/components/ui/GlassPanel';
import { Bot, Sparkles, Zap, BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';
import StudyService, { TaskNode } from '@/services/studyService';
import { useAuth } from '@/providers/AuthProvider';

export default function AITutorPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskNode[]>([]);

  useEffect(() => {
    if (user?.uid) {
      StudyService.fetchTasks(user.uid).then(setTasks);
    }
  }, [user]);
  return (
    <div className="space-y-12 animate-fade-in-up pb-32">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <h1 className="text-5xl font-headline font-black tracking-tighter text-white uppercase italic">Neural Synthesis</h1>
             <div className="h-0.5 w-12 bg-gradient-to-r from-secondary to-transparent"></div>
          </div>
          <p className="text-on-surface-variant font-bold text-[10px] uppercase tracking-[0.4em] opacity-60">
            Scholaris 2.0 // Deep Socratic Mentor Session
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#44d8f1]"></div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Logic: Online</span>
          </div>
        </div>
      </header>

      {/* Main Focus Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* The Core Tutor Engine */}
        <div className="lg:col-span-8">
           <NeuralTutor />
        </div>

        {/* Sidebar Analytical context */}
        <div className="lg:col-span-4 space-y-8">
           <GlassPanel className="p-8 border-none" hoverable={true}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-secondary/10 rounded-lg">
                    <BrainCircuit className="w-5 h-5 text-secondary" />
                 </div>
                 <h3 className="font-bold text-white uppercase tracking-wider text-sm">Session Metrics</h3>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                       <span>Synthesis Viscosity</span>
                       <span>84%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-[84%] bg-secondary shadow-[0_0_10px_#44d8f1]"></div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                       <span>Cognitive Load</span>
                       <span>Moderate</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-[42%] bg-primary"></div>
                    </div>
                 </div>
              </div>

              <div className="mt-10 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                 <p className="text-xs text-secondary/80 leading-relaxed italic text-center">
                    "Deep focus sessions are most effective in 45-minute cycles. Currently optimizing for your recent Physics grades."
                 </p>
              </div>
           </GlassPanel>

           <GlassPanel className="p-8 border-none" hoverable={true}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                 </div>
                 <h3 className="font-bold text-white uppercase tracking-wider text-sm">Research Context</h3>
              </div>
              
              <div className="space-y-3">
                 {tasks.slice(0, 3).map((task, i) => (
                    <div key={i} className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-secondary/10 hover:border-secondary/20 transition-all cursor-pointer">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white/70 uppercase tracking-tight truncate max-w-[120px]">
                             {task.title}
                          </span>
                          <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
                       </div>
                       <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-50">
                          {task.category}
                       </p>
                    </div>
                 ))}
                 {tasks.length === 0 && (
                    <p className="text-[10px] text-white/20 uppercase tracking-widest text-center py-4 italic">No active research nodes.</p>
                 )}
              </div>
           </GlassPanel>

           <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'LaTeX Enabled', icon: <Zap className="w-3 h-3"/>, color: 'text-amber-400' },
                { label: 'Socratic Mod', icon: <Sparkles className="w-3 h-3"/>, color: 'text-primary' }
              ].map(item => (
                <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                   <div className={item.color}>{item.icon}</div>
                   <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
