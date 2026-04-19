'use client';

import { useState, useEffect, useCallback } from 'react';
import StudyService from '@/services/studyService';
import { useAuth } from '@/providers/AuthProvider';
import BentoCard from '@/components/dashboard/BentoCard';
import StatsTracker from '@/components/dashboard/StatsTracker';
import Icon from '@/components/ui/Icon';
import GlassPanel from '@/components/ui/GlassPanel';
import ScholarisButton from '@/components/ui/ScholarisButton';
import NeuralTutor from '@/components/dashboard/NeuralTutor';
import AiInsights from '@/components/dashboard/AiInsights';
import { TaskNode, AcademicRecord } from '@/services/studyService';

import { useOpal } from '@/providers/OpalProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  const { isOpalMode } = useOpal();
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-12 animate-fade-in-up pb-32">
      {/* Header */}
      {!isOpalMode && (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-4">
               <h1 className="text-5xl font-headline font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_20px_#ffffff20]">Workspace</h1>
               <div className="h-0.5 w-16 bg-gradient-to-r from-secondary to-transparent"></div>
            </div>
            <p className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.4em] opacity-60">StudyKrack // 2.0 Sovereign</p>
          </div>
          
          <GlassPanel className="!py-3 !px-6 rounded-full border-white/5 flex items-center gap-4" hoverable={true} animate={false}>
             <div className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_#44d8f1]"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Link Active</span>
          </GlassPanel>
        </header>
      )}

      {/* Primary Analytical Grid */}
      <section className={`grid grid-cols-1 md:grid-cols-12 gap-8 ${isOpalMode ? 'transition-all duration-1000' : ''}`}>
        
        {/* Central AI Tutor - The heart of 2.0 */}
        <div className={`${isOpalMode ? 'md:col-span-12 scale-105 mt-20' : 'md:col-span-8'} transition-all duration-700`}>
          <NeuralTutor />
        </div>

        {/* Sidebar Utilities - Hidden in Opal Mode (via CSS or here) */}
        {!isOpalMode && (
          <div className="md:col-span-4 space-y-8 animate-fade-in-up">
            <BentoCard 
              span={12}
              header={{ title: "Daily Pulse", subtitle: "Growth Metrics", icon: "monitoring" }}
              className="p-8"
            >
              <StatsTracker 
                label="Knowledge Density"
                value="84.2"
                subtext="%"
                progress={0.84}
                size="md"
                color="text-secondary"
              />
            </BentoCard>

            <BentoCard 
              span={12}
              header={{ title: "Quick Research", subtitle: "Instant Archiving", icon: "inventory_2" }}
              className="p-8"
            >
               <div className="text-center space-y-4">
                  <div className="text-4xl font-headline font-black text-white">12</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-loose">Notes Synchronized <br/> with Cloud Brain</div>
               </div>
            </BentoCard>
          </div>
        )}

        {/* Statistics and Archive - Secondary rows */}
        {!isOpalMode && (
          <>
            <div className="md:col-span-12">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-6 px-2">Archival Synchronization</h3>
            </div>
            
            <BentoCard 
              span={12}
              header={{ title: "Recent Milestones", subtitle: "Community Verified Concepts", icon: "verified" }}
            >
              <div className="space-y-2 pt-4">
                 {[
                   { id: '1', title: 'Quantum Mechanics Basics', cat: 'Physics', status: 'Verified', color: 'text-secondary' },
                   { id: '2', title: 'Cell Structure Deep-dive', cat: 'Biology', status: 'Synchronized', color: 'text-primary' },
                   { id: '3', title: 'French Revolution Timeline', cat: 'History', status: 'Completed', color: 'text-amber-400' }
                 ].map((item) => (
                   <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/item">
                      <div className="flex items-center gap-6">
                        <div className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`}></div>
                        <span className="font-headline font-bold text-xl text-white tracking-tight">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-8">
                         <span className="text-slate-500 text-[10px] font-bold uppercase">{item.cat}</span>
                         <Icon name="chevron_right" className="text-slate-600 group-hover/item:translate-x-1 transition-transform" />
                      </div>
                   </div>
                 ))}
              </div>
            </BentoCard>
          </>
        )}
      </section>
    </div>
  );
}

