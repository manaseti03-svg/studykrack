"use client";
import React, { useState } from "react";

export default function SettingsPage() {
  const [agentLevel, setAgentLevel] = useState<"standard" | "advanced">("standard");

  return (
    <div className="min-h-[500px] md:min-h-[800px] animate-in fade-in duration-700">
      <div className="glass-panel p-8 rounded-[32px] border border-white/5 max-w-2xl">
        <h2 className="text-2xl font-headline font-bold text-white mb-6">Platform Settings</h2>
        
        <div className="space-y-8">
           {/* Setting 1: Agentic Reasoning Level */}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">smart_toy</span>
                      Agentic Reasoning Level
                    </h3>
                    <p className="text-zinc-400 text-sm">Control AI depth. Higher levels use more API credits but provide deeper RAG synthesis.</p>
                 </div>
                 <div className="flex bg-[#050505] rounded-xl p-1 border border-white/10">
                    <button 
                      onClick={() => setAgentLevel("standard")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${agentLevel === 'standard' ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'}`}>
                       Standard
                    </button>
                    <button 
                      onClick={() => setAgentLevel("advanced")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${agentLevel === 'advanced' ? 'bg-secondary text-black' : 'text-zinc-500 hover:text-white'}`}>
                       Advanced
                    </button>
                 </div>
              </div>
              {agentLevel === 'advanced' && (
                <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center gap-3">
                   <span className="material-symbols-outlined text-secondary text-xl">warning</span>
                   <p className="text-secondary text-xs font-bold tracking-wide">Warning: Advanced mode consumes 3x faster API credits (Gemini 1.5 Pro enabled).</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
