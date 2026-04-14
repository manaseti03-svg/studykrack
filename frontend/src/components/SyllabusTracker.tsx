"use client"
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function SyllabusTracker() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Stage 1: Real-time Cloud Sync with Firestore
    const q = query(collection(db, "knowledge_vault"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Simulate mapping units from knowledge_vault tags or just checking if they have content
      const units = [
        { id: 1, name: "Unit 1: Data Preprocessing", is_uploaded: false },
        { id: 2, name: "Unit 2: Linear Regression", is_uploaded: false },
        { id: 3, name: "Unit 3: Classification Trees", is_uploaded: false },
        { id: 4, name: "Unit 4: Neural Architecture", is_uploaded: false },
        { id: 5, name: "Unit 5: Generative Models", is_uploaded: false }
      ];

      // Very simple mock mapping: if there are documents targeting Unit 1 etc, light them up.
      // For now, if there's any document, we'll light up units progressively based on count
      const docsCount = snapshot.docs.length;
      for (let i = 0; i < units.length; i++) {
         if (docsCount > i * 2) {
             units[i].is_uploaded = true;
         }
      }

      setData(units);
    });

    return () => unsubscribe();
  }, []);

  const handleExport = async (subjectCode: string) => {
    try {
      const response = await fetch(`http://localhost:8000/export_pdf/${subjectCode}`);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${subjectCode}_Exam_Guide.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("No high-priority nodes found for this subject yet!");
    }
  };

  const processedCount = data.filter(u => u.is_uploaded).length;
  const totalCount = data.length || 5;
  const progressPercent = Math.round((processedCount / totalCount) * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-32 h-32 opal-glow opacity-20 -mr-10 -mt-10 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden inner-glow">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#050505] success-indicator">
              98
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Muni Manas</h3>
            <p className="font-label text-primary font-bold text-[10px] tracking-[0.4em] uppercase">Sree Rama Eng. College</p>
            <p className="font-label text-white/40 font-medium text-[9px] uppercase tracking-widest">AIML | Sem 2</p>
          </div>

          {/* Academic Profile Bento */}
          <div className="grid grid-cols-2 gap-4 w-full pt-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-left">
              <p className="font-label text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">Student ID</p>
              <p className="text-sm font-headline font-bold text-white uppercase">SK-2024-MM</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-left relative overflow-hidden group">
              <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <p className="font-label text-[8px] text-secondary font-bold uppercase tracking-widest mb-1 relative z-10">Target SGPA</p>
              <p className="text-sm font-headline font-bold text-white relative z-10">8.5+</p>
            </div>
          </div>

          {/* 5 Units tracker rows */}
          <div className="w-full space-y-6 pt-6 border-t border-white/5">
             <h4 className="font-label text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] text-left mb-4 flex justify-between">
                <span>AIML Syllabus Map</span>
                <span className="text-secondary">{processedCount}/{totalCount} Processed</span>
             </h4>
             <div className="space-y-3">
              {data.map((unit) => (
                <div key={unit.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${unit.is_uploaded ? 'border-tertiary bg-tertiary/20 text-tertiary shadow-[0_0_15px_rgba(74,225,131,0.4)]' : 'border-white/10 bg-black/20 text-white/20'}`}>
                    {unit.is_uploaded ? <span className="material-symbols-outlined text-sm">memory</span> : <span className="text-xs font-bold font-label">U{unit.id}</span>}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-bold text-sm tracking-tight ${unit.is_uploaded ? 'text-white' : 'text-zinc-600'}`}>{unit.name}</p>
                    <p className="text-[8px] font-label uppercase tracking-widest text-zinc-500">{unit.is_uploaded ? 'Indexed in Vault' : 'Awaiting PDF'}</p>
                  </div>
                </div>
              ))}
             </div>
          </div>
        </div>
      </div>

      {/* Task 2: The 8.5+ Mission Widget */}
      <div className="bg-[#050505] p-6 rounded-[32px] border border-secondary/20 relative overflow-hidden group shadow-[0_0_30px_rgba(255,171,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-colors"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="font-label text-xs text-secondary font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">flag</span>
               Mission Status
            </h4>
            <p className="font-headline font-bold text-white text-2xl">Target: 8.5+ SGPA</p>
          </div>
          
          <div className="relative w-16 h-16 flex items-center justify-center">
             <svg className="w-16 h-16 transform -rotate-90">
                <circle className="text-white/10" strokeWidth="4" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
                <circle className="text-secondary drop-shadow-[0_0_8px_rgba(255,171,0,0.8)] transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * progressPercent) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="28" cx="32" cy="32" />
             </svg>
             <span className="absolute font-bold text-xs text-white">{progressPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
