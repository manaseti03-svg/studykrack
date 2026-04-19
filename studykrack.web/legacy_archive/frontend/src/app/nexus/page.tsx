'use client';

import { useAuth } from '@/providers/AuthProvider';
import AppShell from '@/components/nexus/AppShell';
import GlassPanel from '@/components/ui/GlassPanel';
import ScholarisButton from '@/components/ui/ScholarisButton';
import { startNewLearningSession } from '@/app/actions/ai-tutor';
import { useRouter } from 'next/navigation';
import { Brain, Sparkles, BookOpen, Calculator } from 'lucide-react';
import { useState } from 'react';
import { AgentMode } from '@/services/agentService';

export default function NexusPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartSession = async (mode: AgentMode = 'Socratic') => {
    if (!user) return;
    setLoading(true);
    try {
      const sessionId = await startNewLearningSession(user.uid, `New ${mode} Mission`, mode);
      router.push(`/nexus/${sessionId}`);
    } catch (err) {
      console.error('Failed to start session:', err);
      setLoading(false);
    }
  };

  const modes = [
    { 
      id: 'Socratic' as AgentMode, 
      label: 'Socratic Tutor', 
      desc: 'Deep conceptual mastery through active synthesis and inquiry.',
      icon: <Brain className="w-8 h-8 text-secondary" />,
      color: 'border-secondary/30 bg-secondary/5'
    },
    { 
      id: 'Researcher' as AgentMode, 
      label: 'Deep Researcher', 
      desc: 'Rapid archival deconstruction and structured knowledge mapping.',
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      color: 'border-primary/30 bg-primary/5'
    },
    { 
      id: 'Solver' as AgentMode, 
      label: 'Problem Solver', 
      desc: 'Metric-driven methodology for complex paradoxes and proofs.',
      icon: <Calculator className="w-8 h-8 text-amber-500" />,
      color: 'border-amber-500/30 bg-amber-500/5'
    }
  ];

  return (
    <AppShell>
      <div className="h-full flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
             <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border border-secondary/20 flex items-center justify-center text-secondary">
                  <Sparkles size={24} />
                </div>
             </div>
             <h2 className="text-5xl font-headline font-black text-white uppercase italic tracking-tighter">Initialize Neural Link</h2>
             <p className="max-w-xl mx-auto text-on-surface-variant font-bold text-xs uppercase tracking-[0.4em] opacity-60">Select cognitive operational mode to begin synthesis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <GlassPanel 
                key={mode.id}
                className={`p-8 hover:scale-105 transition-all cursor-pointer border ${mode.color} group`}
                hoverable={true}
                onClick={() => handleStartSession(mode.id)}
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 transition-colors group-hover:bg-white/10">
                    {mode.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-headline text-xl font-bold text-white uppercase italic tracking-tight">{mode.label}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      {mode.desc}
                    </p>
                  </div>
                  <div className="pt-4">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Plus size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>

          <div className="pt-12">
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.5em] italic animate-pulse">
               Protocol 7: Focus is the currency of mastery
             </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
