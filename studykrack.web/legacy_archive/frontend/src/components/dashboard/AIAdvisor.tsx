'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import GlassPanel from '@/components/ui/GlassPanel';
import Icon from '@/components/ui/Icon';
import ScholarisButton from '@/components/ui/ScholarisButton';

const ADVICE_POOL = [
  "Your focus density is currently 14% above the archival baseline. A deep-flow synthesis session is recommended for 'Neural Network' records.",
  "Cognitive load analysis suggests a shift from 'Research' to 'Academics' for the next 45 units to maintain high-viscosity learning.",
  "Streak synchronization at 84%. Re-initializing the 'Morning Focus' node will secure your daily growth milestone.",
  "The 'The Ledger' indicates a performance peak during late-night cycles. Align your 'Macroeconomics' audit to this temporal window."
];

export default function AIAdvisor() {
  const [advice, setAdvice] = useState('');
  const [fullText, setFullText] = useState(ADVICE_POOL[0]);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setAdvice('');
    setTyping(true);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAdvice(prev => prev + fullText.charAt(index));
        index++;
      } else {
        setTyping(false);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [fullText]);

  const refreshAdvice = () => {
    const next = ADVICE_POOL[Math.floor(Math.random() * ADVICE_POOL.length)];
    setFullText(next);
  };

  return (
    <GlassPanel className="p-8 relative overflow-hidden group border-secondary/20" hoverable={true}>
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="space-y-1">
          <h3 className="text-xl font-headline font-black text-white uppercase italic tracking-tighter drop-shadow-[0_0_10px_#44d8f140]">Neural Advisor</h3>
          <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em] opacity-80 animate-pulse">Core Synthetic Logic</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
          <Icon name="psychology" className="text-2xl" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="relative w-40 h-40 shrink-0">
          <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
             <Image 
               src="/scholaris_ai_neural_avatar_1775440310852.png" 
               alt="AI Avatar" 
               fill 
               className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
             />
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-secondary/40 px-3 py-1 rounded-full flex items-center gap-2 shadow-2xl">
             <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
             <span className="text-[8px] font-bold text-white uppercase tracking-widest">Active</span>
          </div>
        </div>

        <div className="space-y-6 flex-1 text-center md:text-left">
          <div className="min-h-[80px] bg-white/5 p-6 rounded-2xl border border-white/5 relative">
             <Icon name="format_quote" className="absolute -top-3 -left-3 text-secondary/30 text-3xl" />
             <p className="text-on-surface text-sm font-body leading-relaxed italic">
               {advice}
               {typing && <span className="inline-block w-1 h-4 bg-secondary ml-1 animate-ping" />}
             </p>
          </div>
          
          <ScholarisButton 
            onClick={refreshAdvice} 
            variant="secondary" 
            className="!h-10 !px-6 !text-[9px] group-hover:scale-105"
            disabled={typing}
          >
            Re-Synthesize Intelligence
          </ScholarisButton>
        </div>
      </div>

      {/* Background Neural Decal */}
      <div className="absolute top-1/2 -right-10 -translate-y-1/2 text-[180px] text-white/5 font-black pointer-events-none select-none italic group-hover:translate-x-5 transition-transform duration-1000">
        AI
      </div>
    </GlassPanel>
  );
}
