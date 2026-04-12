"use client"
import { useState, useEffect } from "react";

export default function SyllabusTracker() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/syllabus");
        if (!res.ok) throw new Error("Backend offline");
        const json = await res.json();
        
        // Handle Maintenance Mode or Direct Array
        const syllabusData = json.status === "maintenance" ? json.data : (Array.isArray(json) ? json : []);
        setData(syllabusData);
      } catch (err) {
        console.error("Logic Shield: Syllabus fetch failed", err);
      }
    };
    fetchSyllabus();
    const interval = setInterval(fetchSyllabus, 30000);
    return () => clearInterval(interval);
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

  return (
    <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] shadow-2xl relative overflow-hidden border border-white/10">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 opal-glow opacity-20 -mr-10 -mt-10 rounded-full blur-3xl"></div>

      <div className="flex flex-col items-center text-center space-y-6">
        {/* User Identity Section */}
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
          <p className="font-label text-primary font-bold text-[10px] tracking-[0.4em] uppercase">Sree Rama Engineering College (Autonomous)</p>
          <p className="font-label text-white/40 font-medium text-[9px] uppercase tracking-widest">AI & Machine Learning (AIML) | 1st Year | 2nd Semester</p>
        </div>


        {/* Academic Profile Bento */}
        <div className="grid grid-cols-2 gap-4 w-full pt-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-left">
            <p className="font-label text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1">Student ID</p>
            <p className="text-sm font-headline font-bold text-white uppercase">SK-2024-MM</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 text-left">
            <p className="font-label text-[8px] text-tertiary font-bold uppercase tracking-widest mb-1">Target SGPA</p>
            <p className="text-sm font-headline font-bold text-white">7.27</p>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <p className="font-label text-[8px] text-primary font-bold uppercase tracking-widest mb-1">Consistency</p>
            <p className="text-xl font-headline font-bold text-white">84%</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <p className="font-label text-[8px] text-secondary font-bold uppercase tracking-widest mb-1">Mastery Index</p>
            <p className="text-xl font-headline font-bold text-white">
              {data.length > 0 ? `${Math.round(data.reduce((acc, curr) => acc + curr.percentage, 0) / data.length)}%` : '0%'}
            </p>
          </div>
        </div>


        {/* Syllabus Progress Rows */}
        <div className="w-full space-y-6 pt-6 border-t border-white/5">
           <h4 className="font-label text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] text-left mb-4">Live Syllabus Progress</h4>
           <div className="space-y-5">
            {data.length === 0 ? (
              <p className="text-zinc-700 text-[10px] font-bold tracking-[0.2em] uppercase p-4 border border-dashed border-white/5 rounded-2xl text-center">No nodes tracked.</p>
            ) : data.map((item, idx) => (
              <div key={idx} className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: item.percentage === 100 ? "'FILL' 1" : "" }}>
                      {item.percentage === 100 ? 'verified' : 'book'}
                    </span>
                    <span className="text-[10px] font-bold text-white tracking-tight">{item.subject}</span>
                  </div>
                  <button 
                    onClick={() => handleExport(item.subject)}
                    className="text-[9px] font-bold text-secondary hover:text-white transition-colors"
                  >
                    [ PDF ]
                  </button>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
           </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-4 bg-primary-container text-on-primary-container rounded-2xl font-bold font-label text-xs uppercase tracking-widest active:scale-95 duration-300 shadow-xl mt-4">
          Upgrade Academic Tier
        </button>
      </div>
    </div>
  );
}
