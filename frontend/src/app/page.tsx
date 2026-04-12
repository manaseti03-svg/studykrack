"use client"
import { useState, useEffect } from "react";
import { Sparkles, Terminal, Upload, Loader2 } from "lucide-react";
import SearchRadar from "@/components/SearchRadar";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("General Study");
  const [forgeStatus, setForgeStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: "offline" }));
  }, []);

  const handleForge = async () => {
    if (!file) return;
    setForgeStatus("uploading");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject_name", subject);

    try {
      const response = await fetch("http://localhost:8000/forge/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setForgeStatus("success");
        setFile(null);
      } else {
        setForgeStatus("error");
      }
    } catch (err) {
      console.error(err);
      setForgeStatus("error");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-[#05050a] text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1e3f_0%,_#05050a_70%)] opacity-40 pointer-events-none"></div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        
        {/* Navigation / Header */}
        <div className="w-full flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
               <Sparkles className="text-black w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              STUDY<span className="text-cyan-400">KRACK</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[10px] font-black tracking-widest bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-xl hover:bg-cyan-600 hover:text-black transition-all">
              GO TO DASHBOARD
            </Link>
            <div className={`text-[10px] font-mono px-3 py-1 rounded-full border ${health?.status?.includes('healthy') ? 'border-cyan-500/30 text-cyan-400' : 'border-red-500/30 text-red-400'}`}>
              SYSTEM STATUS: {health?.status?.toUpperCase() || "OFFLINE"}
            </div>
          </div>
        </div>

        {/* Pulse Radar Component */}
        <div className="w-full mb-24">
           <div className="text-center mb-10">
              <h2 className="text-5xl font-black mb-4 tracking-tight">The Pulse Radar.</h2>
              <p className="text-zinc-500 font-medium uppercase text-xs tracking-[0.5em]">Day 3: Semantic Discovery Engine</p>
           </div>
           <SearchRadar />
        </div>

        {/* Note Forge (Day 2 Component) */}
        <div className="w-full max-w-2xl pt-12 border-t border-white/5">
            <div className="p-8 border border-white/5 bg-white/[0.01] rounded-3xl backdrop-blur-3xl">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-zinc-600 flex items-center">
                <Terminal className="w-4 h-4 mr-2" /> Study Upload
              </h2>
              <div className="flex items-center space-x-4">
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500/30 text-sm"
                  placeholder="Subject..."
                />
                <div className="relative">
                  <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <button className={`px-4 py-3 rounded-xl border border-dashed transition-all font-bold text-[10px] ${file ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'border-zinc-700 text-zinc-500'}`}>
                    {file ? "FILE LOADED" : "ADD PDF"}
                  </button>
                </div>
                <button 
                  onClick={handleForge}
                  disabled={!file || forgeStatus === 'uploading'}
                  className="bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 text-[10px] uppercase shadow-xl"
                >
                  {forgeStatus === 'uploading' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Forge"}
                </button>
              </div>
              {forgeStatus === "success" && <p className="mt-4 text-[10px] text-cyan-400 font-bold animate-pulse">NOTE INFUSED INTO LIBRARY.</p>}
            </div>
        </div>

      </div>
    </main>
  );
}
