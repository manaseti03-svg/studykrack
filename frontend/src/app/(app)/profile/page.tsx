"use client";
import React, { useState } from "react";

export default function ProfilePage() {
  const [cgpa] = useState("8.5+");
  const [semester] = useState("Semester 2");
  const [department] = useState("AIML");
  const [name] = useState("Muni Manas");

  return (
    <div className="min-h-[500px] md:min-h-[800px] animate-in fade-in duration-700">
      <div className="glass-panel p-8 rounded-[32px] border border-white/5 flex flex-col items-center">
        
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-surface-container-highest flex items-center justify-center shadow-[0_0_40px_rgba(74,225,131,0.2)]">
            <span className="material-symbols-outlined text-6xl text-primary">person</span>
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-tertiary rounded-full border-2 border-[#050505]"></div>
        </div>

        <h2 className="text-3xl font-headline font-bold text-white mb-1">{name}</h2>
        <p className="text-zinc-500 font-label tracking-widest uppercase text-xs mb-8">{department} • {semester}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-secondary text-3xl mb-2">military_tech</span>
              <p className="text-zinc-400 text-xs tracking-widest uppercase font-bold mb-1">Target SGPA</p>
              <h3 className="text-2xl font-bold text-white">{cgpa}</h3>
           </div>
           
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-tertiary text-3xl mb-2">verified</span>
              <p className="text-zinc-400 text-xs tracking-widest uppercase font-bold mb-1">Rank</p>
              <h3 className="text-2xl font-bold text-white">Top 10%</h3>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">library_books</span>
              <p className="text-zinc-400 text-xs tracking-widest uppercase font-bold mb-1">Modules</p>
              <h3 className="text-2xl font-bold text-white">4 Mastered</h3>
           </div>
        </div>

      </div>
    </div>
  );
}
