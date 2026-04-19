"use client";
import React, { useState, useEffect } from "react";

export default function PlannerPage() {
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [sprintPlan, setSprintPlan] = useState<any[]>([]);

  useEffect(() => {
    // Generate Sprint Logic
    // "If Exam is in 13 days, assign 2 units per day and set 'Mock Test' for the final 3 days."
    const plan = [];
    const unitsPerDay = 2;

    for (let i = 1; i <= 7; i++) {
        if (i >= 5) {
            plan.push({
                day: i,
                title: "Mock Test",
                description: "Full syllabus review & practice.",
                status: "upcoming",
            });
        } else {
            plan.push({
                day: i,
                title: `Study Unit ${i*2 - 1} & ${i*2}`,
                description: `Focus on theoretical concepts and problem solving for units ${i*2 - 1} and ${i*2}.`,
                status: i === 1 ? "active" : "upcoming",
            });
        }
    }
    setSprintPlan(plan);
  }, [daysRemaining]);

  return (
    <div className="min-h-[500px] md:min-h-[800px] animate-in fade-in duration-700">
      <div className="glass-panel p-8 rounded-[32px] border border-white/5">
         <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
            <div>
              <h2 className="text-2xl font-headline font-bold text-white mb-2">7-Day Sprint</h2>
              <p className="text-on-surface-variant text-sm">Exam is in {daysRemaining} days. Auto-generated schedule based on your timeline.</p>
            </div>
            <div className="flex bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary font-bold text-xs uppercase tracking-widest items-center gap-2">
              <span className="material-symbols-outlined">bolt</span> Sprint Active
            </div>
         </div>

         <div className="space-y-4">
            {sprintPlan.map((sprint) => (
                <div key={sprint.day} className={`flex items-start gap-6 p-6 rounded-2xl border transition-all ${sprint.status === 'active' ? 'bg-white/5 border-primary/30 shadow-[0_0_15px_rgba(74,225,131,0.1)]' : 'bg-transparent border-white/5 hover:bg-white/[0.02]'}`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${sprint.status === 'active' ? 'bg-primary text-black border-primary' : 'bg-surface-container-highest text-zinc-500 border-white/10'}`}>
                      {sprint.day}
                   </div>
                   <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-1 ${sprint.title === 'Mock Test' ? 'text-secondary' : 'text-white'}`}>{sprint.title}</h3>
                      <p className="text-zinc-400 text-sm">{sprint.description}</p>
                   </div>
                   {sprint.status === 'active' && (
                     <button className="px-6 py-2 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                        Start
                     </button>
                   )}
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
