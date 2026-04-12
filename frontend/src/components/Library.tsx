"use client"
import { useState, useEffect } from "react";

export default function Library() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll fetch mastered nodes or just a sample
    const fetchNodes = async () => {
      try {
        const res = await fetch("http://localhost:8000/nodes/mastered"); // Hypothetical endpoint
        if (res.ok) {
          const data = await res.json();
          setNodes(data);
        }
      } catch (e) {
        console.error("Library fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchNodes();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
             <span className="font-label text-on-surface-variant font-bold text-[10px] tracking-[0.4em] uppercase">Knowledge Repository</span>
          </div>
          <h2 className="text-5xl font-headline font-bold text-white tracking-tight">The Vault</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-surface-container rounded-2xl px-8 py-4 border border-white/5 flex flex-col items-center justify-center">
            <span className="text-2xl font-headline font-bold text-white">24</span>
            <span className="text-[8px] font-label text-on-surface-variant font-bold uppercase tracking-widest mt-1">Saved Nodes</span>
          </div>
          <div className="bg-surface-container rounded-2xl px-8 py-4 border border-white/5 flex flex-col items-center justify-center">
            <span className="text-2xl font-headline font-bold text-tertiary">12</span>
            <span className="text-[8px] font-label text-on-surface-variant font-bold uppercase tracking-widest mt-1">Mastered</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Quantum Physics", count: 8, color: "primary", icon: "science" },
          { title: "Neuroscience", count: 5, color: "secondary", icon: "psychology" },
          { title: "Ancient India", count: 11, color: "tertiary", icon: "history_edu" }
        ].map((cat, i) => (
          <div key={i} className="glass-panel p-8 rounded-[32px] group hover:scale-[1.02] transition-transform duration-500 cursor-pointer overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${cat.color}/10 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-${cat.color}/20 transition-colors`}></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-${cat.color}/10 text-${cat.color}`}>
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors">arrow_forward</span>
            </div>
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-headline font-bold text-white">{cat.title}</h3>
              <p className="text-xs font-label text-on-surface-variant font-medium underline underline-offset-4 decoration-primary/20">
                {cat.count} High-Priority Nodes
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Activity / Detailed List */}
      <section className="glass-panel rounded-[40px] p-10 mt-12 overflow-hidden relative">
        <div className="ambient-glow absolute inset-0 opacity-10"></div>
        <div className="relative z-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Recent Archives</h3>
              <button className="font-label text-primary font-bold text-[10px] tracking-widest uppercase hover:underline">View All</button>
           </div>

           <div className="space-y-6">
             {[1, 2, 3].map((n) => (
               <div key={n} className="flex items-center justify-between p-6 bg-surface-container-low rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold">
                      {n}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-white">Heisenberg's Uncertainty Principle</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[8px] font-label text-zinc-500 font-bold uppercase tracking-widest">Mastered 2h ago</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                        <span className="text-[8px] font-label text-primary font-bold uppercase tracking-widest">Physics Core</span>
                      </div>
                    </div>
                 </div>
                 <button className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">download</button>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Decorative Action */}
      <div className="flex justify-center pt-8">
        <button className="px-12 py-5 bg-white text-on-surface-container-lowest rounded-full font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-2xl">
          Recall Mastered Knowledge
        </button>
      </div>
    </div>
  );
}
