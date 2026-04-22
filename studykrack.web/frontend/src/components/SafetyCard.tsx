"use client"
import { useState, useEffect } from "react";
import { getNeuralResilienceStatus } from "@/lib/utils";

export default function SafetyCard() {
  const [metrics, setMetrics] = useState({ 
    remaining_quota: 20, 
    topics_archived: 0, 
    money_saved: 0, 
    total_focus_minutes: 0 
  });
  const [loading, setLoading] = useState(true);

  /* --- LOGIC SHIELD START: DO NOT MODIFY --- */
  const governorCheck = () => {
    // Safety Limit: Gemini API Quota Control
    return metrics.remaining_quota > 0;
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        const finalMetrics = data.status === "maintenance" ? data.data : data;
        setMetrics(finalMetrics);
      } catch (err) {
        console.error("Metrics failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);
  /* --- LOGIC SHIELD END --- */

  const handlePurge = async () => {
    if (!confirm("ARE YOU SURE? This will permanently delete all study nodes. This action is irreversible.")) return;
    try {
      const res = await fetch("/api/metrics", { method: "DELETE" });
      const data = await res.json();
      alert(`System Reset Complete. Purged ${data.count} nodes.`);
      setMetrics(prev => ({ ...prev, topics_archived: 0 }));
    } catch (e) {
      alert("Reset failed.");
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>gshield</span>
           <span className="font-label text-white font-bold text-[10px] tracking-[0.2em] uppercase">Ground Control</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1 bg-surface-container rounded-full text-[8px] font-label text-on-surface-variant font-bold uppercase tracking-widest border border-white/5">
            Governor Protocol Active
          </div>
          {metrics.total_focus_minutes > 0 && (
            <div className={`text-[7px] font-black tracking-[0.3em] uppercase ${getNeuralResilienceStatus(metrics.total_focus_minutes).color}`}>
              Neural Status: {getNeuralResilienceStatus(metrics.total_focus_minutes).label}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* AI Power (Quota) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Daily AI Power</span>
            </div>
            <span className={`text-xs font-headline font-bold ${metrics.remaining_quota < 5 ? 'text-red-400' : 'text-white'}`}>
              {metrics.remaining_quota}/20
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden p-[1px]">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                metrics.remaining_quota < 5 ? 'bg-red-500' : 'bg-primary'
              }`} 
              style={{ width: `${(metrics.remaining_quota / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container-low rounded-2xl border border-white/5">
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Topics</p>
            <p className="text-xl font-headline font-bold text-white">{metrics.topics_archived}</p>
          </div>
          <div className="p-4 bg-surface-container-low rounded-2xl border border-white/5">
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Savings</p>
            <p className="text-xl font-headline font-bold text-tertiary">₹{metrics.money_saved}</p>
          </div>
        </div>

        <button 
          onClick={handlePurge}
          className="w-full py-4 bg-transparent border border-red-500/10 hover:border-red-500/30 rounded-2xl text-[9px] font-bold tracking-[0.4em] text-red-500/40 hover:text-red-500 transition-all uppercase"
        >
          Reset Library
        </button>
      </div>
    </div>
  );
}
