"use client"
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import VideoModal from "./VideoModal";

type Preset = "Architect" | "Sprinter" | "Manual";

interface FocusTimerProps {
  onFocusChange: (isFocused: boolean) => void;
  activeNode?: any;
}

export default function FocusTimer({ onFocusChange, activeNode }: FocusTimerProps) {
  const [preset, setPreset] = useState<Preset>("Architect");
  const [studyTime, setStudyTime] = useState(40);
  const [restTime, setRestTime] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [minutes, setMinutes] = useState(40);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"study" | "rest">("study");

  const totalTime = mode === "study" ? studyTime * 60 : restTime * 60;
  const timeRemaining = minutes * 60 + seconds;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  const handlePreset = (p: Preset) => {
    setPreset(p);
    setIsActive(false);
    if (p === "Architect") {
      setStudyTime(40);
      setRestTime(20);
      setMinutes(40);
    } else if (p === "Sprinter") {
      setStudyTime(25);
      setRestTime(5);
      setMinutes(25);
    }
    setSeconds(0);
    setMode("study");
  };

  const logFocusSession = async (minutes: number, sessionMode: string) => {
    try {
      await fetch("http://localhost:8000/focus/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, mode: sessionMode }),
      });
    } catch (e) {
      console.error("Focus logging failed", e);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          playChime();
          logFocusSession(mode === "study" ? studyTime : restTime, mode);
          const nextMode = mode === "study" ? "rest" : "study";
          setMode(nextMode);
          setMinutes(nextMode === "study" ? studyTime : restTime);
          setSeconds(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, studyTime, restTime]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error("Audio failed", e);
    }
  };

  /* --- LOGIC SHIELD START: DO NOT MODIFY --- */
  const startTimer = () => {
    const newState = !isActive;
    setIsActive(newState);
    onFocusChange(newState);
    
    // If stopping a session manually, log the partial progress
    if (!newState) {
       const elapsed = mode === "study" ? (studyTime - minutes) : (restTime - minutes);
       if (elapsed > 0) logFocusSession(elapsed, mode);
    }
  };
  /* --- LOGIC SHIELD END --- */

  return (
    <div className={`transition-all duration-1000 ${isActive ? 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-[100px]' : 'relative'}`}>
      <div className={`glass-panel transition-all duration-700 flex flex-col items-center overflow-hidden
        ${isActive 
          ? 'p-12 rounded-[48px] max-w-lg w-full scale-110 shadow-2xl relative' 
          : 'p-6 rounded-[32px] w-64 shadow-xl border-white/5 hover:border-primary/20 group'}`}>
        
        {/* Modal Overlay Glow */}
        {isActive && <div className="absolute inset-0 opal-glow opacity-30 pointer-events-none"></div>}

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-tertiary success-indicator' : 'bg-primary/40'}`}></div>
            <span className="font-label text-on-surface-variant font-bold text-[10px] tracking-[0.4em] uppercase">
              {isActive ? (mode === "study" ? "Deep Focus" : "Neural Recharge") : "Ready to Focus"}
            </span>
          </div>

          <div className="relative mb-8">
            {/* Visual Ring */}
            <svg className={`transform -rotate-90 transition-all duration-700 ${isActive ? 'w-64 h-64' : 'w-32 h-32'}`}>
              <circle
                cx={isActive ? "128" : "64"}
                cy={isActive ? "128" : "64"}
                r={isActive ? "120" : "60"}
                stroke="currentColor"
                strokeWidth="1"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx={isActive ? "128" : "64"}
                cy={isActive ? "128" : "64"}
                r={isActive ? "120" : "60"}
                stroke="currentColor"
                strokeWidth={isActive ? "4" : "4"}
                fill="transparent"
                strokeDasharray={isActive ? 754 : 377}
                strokeDashoffset={(isActive ? 754 : 377) - ((isActive ? 754 : 377) * progress) / 100}
                className={`transition-all duration-1000 ${mode === "study" ? 'text-primary' : 'text-secondary'}`}
                strokeLinecap="round"
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`font-headline font-light tracking-tight text-white tabular-nums leading-none transition-all duration-700 ${isActive ? 'text-6xl' : 'text-2xl'}`}>
                {String(minutes).padStart(2, '0')}<span className="opacity-20">:</span>{String(seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={startTimer}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-label font-bold text-[10px] tracking-[0.2em] transition-all
                ${isActive 
                  ? 'bg-surface-container-highest text-on-surface hover:bg-white/10' 
                  : 'bg-primary text-on-primary hover:opacity-90'}`}
            >
              <span className="material-symbols-outlined text-lg">
                {isActive ? 'stop' : 'play_arrow'}
              </span>
              {isActive ? 'ABORT' : 'INITIATE'}
            </button>
            
            {!isActive && (
              <button
                onClick={() => { setMinutes(studyTime); setSeconds(0); }}
                className="p-4 bg-surface-container-highest rounded-xl text-on-surface-variant hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-lg whitespace-nowrap">replay</span>
              </button>
            )}
          </div>

          {isActive && activeNode?.video_resource?.url && (
              <button
                  onClick={() => setModalOpen(true)}
                  className="mt-8 flex items-center gap-3 px-8 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold tracking-widest text-red-500 hover:bg-red-500/20 transition-all"
              >
                  <span className="material-symbols-outlined">play_circle</span>
                  WATCH & LEARN
              </button>
          )}

          {isActive && (
            <div className="mt-8">
              <p className="font-label text-[8px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Stitch Protocol v2.0</p>
            </div>
          )}
        </div>
      </div>

      <VideoModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        videoUrl={activeNode?.video_resource?.url} 
        title={activeNode?.video_resource?.title} 
      />
    </div>
  );
}
