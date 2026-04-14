"use client"
import { useState, useEffect } from "react";
import FocusTimer from "@/components/FocusTimer";
import SyllabusTracker from "@/components/SyllabusTracker";
import SearchRadar from "@/components/SearchRadar";
import Library from "@/components/Library";
import SafetyCard from "@/components/SafetyCard";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";


export default function DashboardPage() {
  /* --- LOGIC SHIELD START: DO NOT MODIFY --- */
  const [isFocused, setIsFocused] = useState(false);
  const [activeNode, setActiveNode] = useState<any>(null);
  /* --- LOGIC SHIELD END --- */

  const [activeTab, setActiveTab] = useState<"tutor" | "library" | "community">("tutor");
  const [hubStatus, setHubStatus] = useState<"loading" | "online" | "offline">("loading");
  const [vaultCount, setVaultCount] = useState(0);

  // Sentinel Mode & Exam Timer Tasks
  const [isOledMode, setIsOledMode] = useState(false);
  const [examCountdown, setExamCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Task 3: The 8.5+ Launch Message
    if (!localStorage.getItem('sk_welcomed')) {
      setShowWelcome(true);
      localStorage.setItem('sk_welcomed', 'true');
      setTimeout(() => setShowWelcome(false), 8000);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => setDeferredPrompt(null));
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    // 1. Sync Efficiency Meter with Vault count
    const q = query(collection(db, "knowledge_vault"));
    const unsubscribeVault = onSnapshot(q, (snapshot: any) => {
      setVaultCount(snapshot.docs.length);
    });

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

    // Calculate Countdown (Assuming Next Mid Term is 14 days away from start or just fixed date)
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 14); // Mock target: 14 days from now
    
    const updateCountdown = () => {
      const diff = examDate.getTime() - new Date().getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setExamCountdown({ days: d, hours: h, minutes: m });
    };

    checkHub();
    updateCountdown();
    const interval = setInterval(() => {
      checkHub();
      updateCountdown();
    }, 10000);
    return () => {
      unsubscribeVault();
      clearInterval(interval);
    };
  }, []);

  return (
    <main className={`min-h-screen ${isOledMode ? 'bg-[#000000]' : 'bg-[#050505]'} text-white selection:bg-primary/30 relative overflow-hidden ${isFocused ? 'cursor-none' : ''} transition-colors duration-1000`}>

      
      {/* Ambient background glows */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isOledMode ? 'opacity-10' : 'opacity-100'}`}>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className={`max-w-[1600px] mx-auto p-4 md:p-8 transition-all duration-1000 ${isFocused ? 'opacity-0 scale-95 pointer-events-none blur-3xl' : 'opacity-100 scale-100'}`}>
        
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-8 px-2 md:px-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="flex items-center gap-3 md:gap-4 group">
               <div className="ai-orb w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cyclone</span>
               </div>
               <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                 StudyKrack <span className="text-on-surface-variant font-light">2.0</span>
               </h1>
            </Link>
            
            {/* Mobile-only status pill */}
            <div className="md:hidden flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${hubStatus === 'online' ? 'bg-tertiary shadow-[0_0_8px_rgba(74,225,131,0.5)]' : 'bg-red-500'}`}></div>
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{hubStatus === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* Task 4: Exam Countdown Timer */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-2 backdrop-blur-md">
             <div className="flex items-center gap-2 text-primary animate-pulse">
                <span className="material-symbols-outlined text-xl">timer</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-label font-bold uppercase tracking-widest text-zinc-400">Mid-Term Inbound</span>
                <span className="text-base font-headline font-bold text-white tracking-widest">
                   {examCountdown.days}D : {examCountdown.hours.toString().padStart(2, '0')}H : {examCountdown.minutes.toString().padStart(2, '0')}M
                </span>
             </div>
          </div>

          <nav className="flex items-center gap-1 md:gap-2 bg-surface-container-highest/50 p-1 md:p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl overflow-x-auto max-w-full hide-scrollbar">
            {[
              { id: "tutor", label: "Tutor", icon: "psychology" },
              { id: "library", label: "Vault", icon: "inventory_2" },
              { id: "community", label: "Sync", icon: "hub" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-label font-bold text-[9px] md:text-[10px] tracking-widest uppercase transition-all whitespace-nowrap
                  ${activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
              >
                <span className="material-symbols-outlined text-base md:text-lg" style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tertiary/20 text-tertiary font-label font-bold text-[10px] tracking-widest uppercase border border-tertiary/30 hover:bg-tertiary/30 transition-all shadow-[0_0_15px_rgba(74,225,131,0.2)]">
                   <span className="material-symbols-outlined text-lg w-5 h-5 flex items-center justify-center">install_mobile</span>
                   Install StudyKrack
                </button>
              )}
              <button 
                onClick={() => setIsOledMode(!isOledMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label font-bold text-[10px] tracking-widest uppercase border transition-all ${isOledMode ? 'bg-white text-black border-white' : 'bg-surface-container-highest text-white border-white/5 hover:border-primary/20'}`}>
                 <span className="material-symbols-outlined text-lg">{isOledMode ? 'light_mode' : 'dark_mode'}</span>
                 Sentinel Mode
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest text-white font-label font-bold text-[10px] tracking-widest uppercase border border-white/5 hover:border-primary/20 transition-all">
                 <span className="material-symbols-outlined text-lg">settings</span>
                 Config
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-label text-zinc-500 font-bold uppercase tracking-widest">Efficiency Meter</span>
                  <span className="text-[8px] font-label text-secondary font-bold uppercase tracking-widest">8.5+ SGPA Target</span>
                </div>
                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,171,0,0.3)]" 
                    style={{ width: `${Math.min(100, (vaultCount / 5) * 10)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 relative group">
                <div className={`w-1.5 h-1.5 rounded-full ${hubStatus === 'online' ? 'bg-tertiary success-indicator shadow-[0_0_10px_rgba(74,225,131,0.5)]' : hubStatus === 'loading' ? 'bg-secondary animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-label text-on-surface-variant font-bold text-[8px] uppercase tracking-widest leading-none">
                  {hubStatus === 'online' ? 'STATUS: ONLINE & SYNCED' : `Neural Hub: ${hubStatus.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Main Content Area (Prioritized on mobile) */}
          <section className="order-1 lg:order-2 lg:col-span-9">
            <div className="min-h-[500px] md:min-h-[800px]">
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
                <div className="flex flex-col items-center justify-center py-20 md:py-40 glass-panel rounded-[32px] md:rounded-[64px] border border-white/5 text-center">
                   <div className="ai-orb w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6 md:mb-8">
                      <span className="material-symbols-outlined text-3xl md:text-4xl text-on-primary">groups</span>
                   </div>
                   <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Cloud Sync</h2>
                   <p className="text-on-surface-variant max-w-xs md:max-w-md mx-auto text-sm md:text-base px-6">Connecting neural networks across the platform. Establishing peer-to-peer sync...</p>
                   <div className="mt-8 px-6 md:px-8 py-2 md:py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-label font-bold text-[8px] md:text-[10px] tracking-[0.4em] uppercase">Phase 2: Upcoming</div>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar (Appears after content on mobile) */}
          <aside className="order-2 lg:order-1 lg:col-span-3 space-y-6 md:space-y-8">
            <SyllabusTracker />
            <SafetyCard />
          </aside>
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

      {/* Task 3: The 8.5+ Launch Message Toast */}
      {showWelcome && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-4 rounded-3xl shadow-[0_0_40px_rgba(74,225,131,0.2)] flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center border border-tertiary/30 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-tertiary">rocket_launch</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-label font-bold uppercase tracking-[0.3em] text-tertiary drop-shadow-[0_0_8px_rgba(74,225,131,0.8)]">StudyKrack 2.0 Active</span>
                 <span className="text-sm font-headline font-bold text-white tracking-wide">8.5+ SGPA Mission Initialized.</span>
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
