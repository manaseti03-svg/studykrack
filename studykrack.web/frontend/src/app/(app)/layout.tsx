"use client";
import React, { useState, useEffect } from "react";
import SideNav from "@/components/SideNav";
import FocusTimer from "@/components/FocusTimer";
import SyllabusTracker from "@/components/SyllabusTracker";
import SafetyCard from "@/components/SafetyCard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc, getDoc, setDoc, serverTimestamp, where } from "firebase/firestore";
import { useAcademicMatrix } from "@/hooks/useAcademicMatrix";

// Context to share `activeNode` with FocusTimer if needed, though for simplicity we export a shell
export const DashboardContext = React.createContext<{ setActiveNode: (node: any) => void }>({ setActiveNode: () => {} });

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeNode, setActiveNode] = useState<any>(null);
  const [hubStatus, setHubStatus] = useState<"loading" | "online" | "offline">("loading");
  const [vaultCount, setVaultCount] = useState(0);

  const [isOledMode, setIsOledMode] = useState(false);
  const [examCountdown, setExamCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSemester, setActiveSemester] = useState<any>(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const pathname = usePathname();

  useEffect(() => {
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
    
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    }
  };

  useAcademicMatrix();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Task 1: Profile Listener (Simple one for UI if needed, but matrix is handled by hook)
        const userRef = doc(db, "users", user.uid);
        const unsubscribeProfile = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
             setUserProfile(snap.data());
          }
        });

        // Task 2: Private Vault Listener (strictly filtered by owner_uid for security rules)
        const q = query(collection(db, "private_vault"), where("owner_uid", "==", user.uid));
        const unsubscribeVault = onSnapshot(q, (snapshot: any) => {
          setVaultCount(snapshot.docs.length);
        });

        return () => {
          unsubscribeProfile();
          unsubscribeVault();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const checkHub = async () => {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setHubStatus(data.embedding_engine === "online" ? "online" : "loading");
      } catch {
        setHubStatus("offline");
      }
    };

    // Fixed Target Exam Date to prevent the countdown from resetting on every page refresh
    const examDate = new Date("2026-06-15T09:00:00"); 
    
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
    return () => clearInterval(interval);
  }, []);

  // Title logic for header
  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard': return "Tutor";
      case '/vault': return "Vault";
      case '/planner': return "Planner";
      case '/community': return "Community";
      case '/profile': return "Profile";
      case '/settings': return "Settings";
      default: return "Tutor";
    }
  };

  return (
    <div className={`min-h-screen ${isOledMode ? 'bg-[#000000]' : 'bg-[#050505]'} text-white selection:bg-primary/30 relative overflow-hidden ${isFocused ? 'cursor-none' : ''} transition-colors duration-1000`}>
      <SideNav />

      {/* Ambient background glows */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isOledMode ? 'opacity-10' : 'opacity-100'}`}>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className={`pl-20 max-w-[1600px] mx-auto p-4 md:p-8 transition-all duration-1000 ${isFocused ? 'opacity-0 scale-95 pointer-events-none blur-3xl' : 'opacity-100 scale-100'}`}>
        
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 md:gap-8 px-2 md:px-4">
          <div className="flex items-center justify-between w-full md:w-auto">
             {/* Title instead of logo since SideNav has the logo */}
             <h2 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-widest uppercase">
                {getPageTitle()}
             </h2>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-2 backdrop-blur-md">
             <div className="flex items-center gap-2 text-primary animate-pulse">
                <span className="material-symbols-outlined text-xl">timer</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-label font-bold uppercase tracking-widest text-zinc-400">Exam Reminder</span>
                <span className="text-base font-headline font-bold text-white tracking-widest">
                   {examCountdown.days}D : {examCountdown.hours.toString().padStart(2, '0')}H : {examCountdown.minutes.toString().padStart(2, '0')}M
                </span>
             </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsOledMode(!isOledMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label font-bold text-[10px] tracking-widest uppercase border transition-all ${isOledMode ? 'bg-white text-black border-white' : 'bg-surface-container-highest text-white border-white/5 hover:border-primary/20'}`}>
                 <span className="material-symbols-outlined text-lg">{isOledMode ? 'light_mode' : 'dark_mode'}</span>
                 Dark Mode
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-label text-zinc-500 font-bold uppercase tracking-widest">Study Progress</span>
                  <span className="text-[8px] font-label text-secondary font-bold uppercase tracking-widest">Good Grades Goal</span>
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
                  {hubStatus === 'online' ? 'STATUS: READY & CONNECTED' : `Server: ${hubStatus.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <section className="order-1 lg:order-2 lg:col-span-9 animate-in fade-in duration-700">
            <DashboardContext.Provider value={{ setActiveNode }}>
              {children}
            </DashboardContext.Provider>
          </section>

          <aside className="order-2 lg:order-1 lg:col-span-3 space-y-6 md:space-y-8">
            <SyllabusTracker />
            <SafetyCard />
          </aside>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 flex justify-between items-center px-4">
          <p className="font-label text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">StudyKrack v2.0</p>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-tertiary success-indicator"></div>
             <span className="font-label text-[9px] text-tertiary font-bold uppercase tracking-widest">Everything is working fine!</span>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-12 right-12 z-[100]">
        <FocusTimer onFocusChange={setIsFocused} activeNode={activeNode} />
      </div>

      {showWelcome && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-4 rounded-3xl shadow-[0_0_40px_rgba(74,225,131,0.2)] flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center border border-tertiary/30 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-tertiary">rocket_launch</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-label font-bold uppercase tracking-[0.3em] text-tertiary drop-shadow-[0_0_8px_rgba(74,225,131,0.8)]">Welcome to StudyKrack 2.0</span>
                 <span className="text-sm font-headline font-bold text-white tracking-wide">Let's get good grades!</span>
              </div>
           </div>
        </div>
      )}



      {showTransitionModal && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="max-w-md w-full bg-[#0a0a15] border border-white/10 rounded-3xl p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                 <span className="material-symbols-outlined text-secondary text-3xl">event_repeat</span>
              </div>
              <div className="space-y-2">
                 <h2 className="text-xl font-headline font-bold text-white">New Semester Detected</h2>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                   Your current academic matrix has expired. To maintain zero-latency study support, please archive the old vault and upload your new Timetable.
                 </p>
              </div>
              <button 
                onClick={async () => {
                  if (!auth.currentUser) return;
                  const userRef = doc(db, "users", auth.currentUser.uid);
                  // Archive old vault logic: Here we move active_semester to past_semesters array
                  await setDoc(userRef, {
                    active_semester: null,
                    past_semesters: userProfile?.past_semesters ? [...userProfile.past_semesters, userProfile.active_semester] : [userProfile.active_semester]
                  }, { merge: true });
                  setShowTransitionModal(false);
                  setShowOnboarding(true);
                }}
                className="w-full py-4 rounded-xl bg-secondary text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
              >
                PROCEED TO SEMESTER UPGRADE
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
