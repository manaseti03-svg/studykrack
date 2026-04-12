"use client"
import { useState, useEffect } from "react";
import FocusTimer from "@/components/FocusTimer";
import SyllabusTracker from "@/components/SyllabusTracker";
import SearchRadar from "@/components/SearchRadar";
import Library from "@/components/Library";
import SafetyCard from "@/components/SafetyCard";
import Link from "next/link";


export default function DashboardPage() {
  /* --- LOGIC SHIELD START: DO NOT MODIFY --- */
  const [isFocused, setIsFocused] = useState(false);
  const [activeNode, setActiveNode] = useState<any>(null);
  /* --- LOGIC SHIELD END --- */

  const [activeTab, setActiveTab] = useState<"tutor" | "library" | "community">("tutor");
  const [hubStatus, setHubStatus] = useState<"loading" | "online" | "offline">("loading");

  useEffect(() => {
    const checkHub = async () => {
      try {
        const res = await fetch("http://localhost:8000/health");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setHubStatus(data.embedding_engine === "online" ? "online" : "loading");
      } catch {
        setHubStatus("offline");
      }
    };
    checkHub();
    const interval = setInterval(checkHub, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={`min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden ${isFocused ? 'cursor-none' : ''}`}>

      
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className={`max-w-[1600px] mx-auto p-4 md:p-8 transition-all duration-1000 ${isFocused ? 'opacity-0 scale-95 pointer-events-none blur-3xl' : 'opacity-100 scale-100'}`}>
        
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="ai-orb w-12 h-12 rounded-full flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cyclone</span>
               </div>
               <h1 className="text-3xl font-headline font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                 StudyKrack <span className="text-on-surface-variant font-light">2.0</span>
               </h1>
            </Link>
          </div>

          <nav className="flex items-center gap-2 bg-surface-container-highest p-1.5 rounded-2xl border border-white/5">
            {[
              { id: "tutor", label: "AI Tutor", icon: "psychology" },
              { id: "library", label: "The Vault", icon: "inventory_2" },
              { id: "community", label: "Community", icon: "hub" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-label font-bold text-[10px] tracking-widest uppercase transition-all
                  ${activeTab === tab.id ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-white hover:bg-white/5'}`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col items-end gap-2">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface-container-highest text-white font-label font-bold text-[10px] tracking-widest uppercase border border-white/5 hover:border-primary/20 transition-all">
               <span className="material-symbols-outlined text-lg">settings</span>
               System Config
            </button>
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
               <div className={`w-1.5 h-1.5 rounded-full ${hubStatus === 'online' ? 'bg-tertiary success-indicator' : hubStatus === 'loading' ? 'bg-secondary animate-pulse' : 'bg-red-500'}`}></div>
               <span className="font-label text-on-surface-variant font-bold text-[8px] uppercase tracking-widest leading-none">
                 Neural Hub: {hubStatus.toUpperCase()}
               </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Identity Card */}
          <aside className="lg:col-span-3 space-y-8">
            <SyllabusTracker />
            <SafetyCard />
            
            <div className="glass-panel p-8 rounded-[40px] border border-white/5">

              <h4 className="font-label text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-6">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-2xl hover:bg-white/5 transition-colors group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">upload_file</span>
                  <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Ingest</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-2xl hover:bg-white/5 transition-colors group">
                  <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">auto_stories</span>
                  <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Flashcards</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9">
            <div className="min-h-[800px]">
              {activeTab === "tutor" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <SearchRadar onSelectNode={(node: any) => setActiveNode(node)} />
                </div>
              )}
              {activeTab === "library" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Library />
                </div>
              )}
              {activeTab === "community" && (
                <div className="flex flex-col items-center justify-center py-40 glass-panel rounded-[64px] border border-white/5 text-center">
                   <div className="ai-orb w-20 h-20 rounded-full flex items-center justify-center mb-8">
                      <span className="material-symbols-outlined text-4xl text-on-primary">groups</span>
                   </div>
                   <h2 className="text-3xl font-headline font-bold text-white mb-4">Community Hub</h2>
                   <p className="text-on-surface-variant max-w-md mx-auto">Connecting neural networks across the platform. Establishing peer-to-peer sync...</p>
                   <div className="mt-8 px-8 py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-label font-bold text-[10px] tracking-[0.4em] uppercase">Phase 2: Upcoming</div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center px-4">
          <p className="font-label text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">StudyKrack Stitch Core v2.0</p>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-tertiary success-indicator"></div>
             <span className="font-label text-[9px] text-tertiary font-bold uppercase tracking-widest">All Systems Nominal</span>
          </div>
        </footer>
      </div>

      {/* Floating Focus Timer */}
      <div className="fixed bottom-12 right-12 z-[100]">
        <FocusTimer onFocusChange={setIsFocused} activeNode={activeNode} />
      </div>
    </main>
  );
}
