'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import GlassPanel from '@/components/ui/GlassPanel';
import ScholarisButton from '@/components/ui/ScholarisButton';
import Icon from '@/components/ui/Icon';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [soundscape, setSoundscape] = useState('Silent');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessionCount(prev => prev + 1);
      toast.success('Cognitive reset complete.');
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60));

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-16 animate-fade-in text-on-surface">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-headline font-black tracking-tighter uppercase text-on-surface">Cognitive <span className="text-primary text-secondary">Sanctum</span></h1>
        <p className="text-on-surface-variant font-bold tracking-widest uppercase text-xs opacity-60">Isolate. Synthesize. Transcend.</p>
      </header>

      {/* Visual Timer Stage */}
      <div className="relative group cursor-pointer" onClick={toggleTimer}>
         {/* Outer Glow */}
         <div className={`absolute inset-0 bg-secondary/10 blur-[100px] rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
         
         <div className="relative w-80 h-80 rounded-full glass-panel border-white/5 flex items-center justify-center transition-transform hover:scale-105 duration-500 shadow-[0_0_100px_rgba(68,216,241,0.05)]">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle className="text-surface-container-highest/10" cx="160" cy="160" r="140" fill="transparent" stroke="currentColor" strokeWidth="4"></circle>
               <circle 
                  className="text-secondary transition-all duration-1000" 
                  cx="160" 
                  cy="160" 
                  r="140" 
                  fill="transparent" 
                  stroke="currentColor" 
                  strokeDasharray="879.6" 
                  strokeDashoffset={879.6 - (879.6 * progress)} 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  style={{ filter: 'drop-shadow(0 0 12px #44d8f1)' }}
               ></circle>
            </svg>
            <div className="text-center">
               <div className="text-7xl font-headline font-black text-white tracking-tight">{formatTime(timeLeft)}</div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">{isActive ? 'Flowing' : 'Stagnant'}</div>
            </div>
         </div>
      </div>

      {/* Depth Controls */}
      <div className="flex gap-8 items-center">
         <button 
           onClick={resetTimer}
           className="w-16 h-16 rounded-full glass-panel border-white/5 flex items-center justify-center text-outline hover:text-white transition-all hover:bg-white/5 group"
         >
           <Icon name="refresh" className="text-2xl group-hover:rotate-180 transition-transform duration-500" />
         </button>
         
         <button 
           onClick={toggleTimer}
           className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95 ${
             isActive ? 'bg-error/80 translate-y-1 shadow-error/20' : 'bg-secondary hover:scale-110 shadow-secondary/30'
           }`}
         >
           <Icon name={isActive ? 'pause' : 'play_arrow'} className="text-4xl text-white" />
         </button>

         <button className="w-16 h-16 rounded-full glass-panel border-white/5 flex items-center justify-center text-outline hover:text-white transition-all hover:bg-white/5">
           <Icon name="more_horiz" className="text-2xl" />
         </button>
      </div>

      {/* Soundscape Selection */}
      <section className="flex flex-wrap justify-center gap-4">
         {['Silent', 'Rain', 'Binaural', 'Lo-Fi'].map((s) => (
           <button 
             key={s}
             onClick={() => setSoundscape(s)}
             className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
               soundscape === s ? 'bg-secondary text-slate-900 shadow-lg shadow-secondary/20' : 'bg-surface-container-highest/20 text-slate-500 hover:text-white'
             }`}
           >
             {s}
           </button>
         ))}
      </section>

      {/* Flow Stats Summary */}
      <section className="grid grid-cols-2 gap-12 w-full max-w-xl pt-12 border-t border-white/5">
         <div className="text-center">
           <div className="text-4xl font-headline font-black text-white">{sessionCount}</div>
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Sessions Today</div>
         </div>
         <div className="text-center">
           <div className="text-4xl font-headline font-black text-white">124</div>
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Focus Minutes</div>
         </div>
      </section>
    </div>
  );
}
