"use client"
import { useState, useEffect } from "react";
import { Timer, Activity, Medal, TrendingUp } from "lucide-react";

export default function DailyStats() {
  const [metrics, setMetrics] = useState({ total_focus_minutes: 0, topics_mastered: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/metrics");
        const json = await res.json();
        const finalMetrics = json.status === "maintenance" ? json.data : json;
        setMetrics(finalMetrics);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const inv = setInterval(fetchStats, 10000);
    return () => clearInterval(inv);
  }, []);

  return (
    <div className="glass p-10 rounded-[40px] shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] rotate-12">
        <TrendingUp className="w-32 h-32 text-amber-500" />
      </div>

      <div className="flex items-center gap-4 mb-12 relative z-10">
        <div className="p-4 bg-amber-500/10 rounded-3xl">
          <Activity className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Opal Performance</h2>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">24h Quantitative Mastery</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="p-8 glass-light rounded-[32px] group hover:scale-[1.02] transition-all cursor-default">
          <div className="flex items-center gap-3 mb-4">
             <Timer className="w-4 h-4 text-amber-500" />
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Deep Seconds</span>
          </div>
          <p className="text-5xl font-black text-white tracking-tighter leading-none mb-1">{metrics.total_focus_minutes}</p>
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic opacity-50">Minutes logged today</p>
        </div>

        <div className="p-8 glass-light rounded-[32px] group hover:scale-[1.02] transition-all cursor-default">
          <div className="flex items-center gap-3 mb-4">
             <Medal className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Mastered</span>
          </div>
          <p className="text-5xl font-black text-white tracking-tighter leading-none mb-1">{metrics.topics_mastered}</p>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic opacity-50">Nodes Conquered</p>
        </div>
      </div>
      
      <div className="mt-10 p-5 bg-white/[0.02] rounded-2xl border border-white/5 text-[9px] font-black tracking-[0.6em] text-zinc-800 uppercase text-center relative z-10">
         Neural Resilience: {metrics.total_focus_minutes > 120 ? "OPTIMIZED" : "STABILIZING"}
      </div>
    </div>
  );
}
