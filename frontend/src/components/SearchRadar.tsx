"use client"
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import VideoModal from "./VideoModal";

interface SearchRadarProps {
  onSelectNode?: (node: any) => void;
}

export default function SearchRadar({ onSelectNode }: SearchRadarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<"idle" | "searching" | "success" | "error">("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: "", title: "" });
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [userPlan, setUserPlan] = useState<"free" | "fuel">("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch("http://localhost:8000/health");
        setIsBackendOnline(res.ok);
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    
    const checkUserPlan = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/status");
        if (res.ok) {
          const data = await res.json();
          setUserPlan(data.subscription_status);
        }
      } catch (e) {}
    }

    checkConnection();
    checkUserPlan();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  /* --- LOGIC SHIELD START: DO NOT MODIFY --- */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setStatus("searching");
    
    try {
      // 1. Priority 1: Search the Knowledge Vault (Zero Cost)
      const { vaultPrioritySearch } = await import("@/lib/aiService");
      const vaultHits = await vaultPrioritySearch(query);
      
      if (vaultHits.length > 0) {
        console.log("[RADAR] Vault Hit! Serving from Permanent Memory.");
        setResults(vaultHits);
        setStatus("success");
        return;
      }

      // 2. Priority 2: Backend Search / AI Generation
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        if (response.status === 402 || response.status === 403) {
           setShowUpgradeModal(true);
           setStatus("idle");
           return;
        }
        const errText = await response.text();
        console.error(`Backend Error (${response.status}):`, errText);
        throw new Error(`Offline (${response.status})`);
      }

      const data = await response.json();
      
      // Task 2: Maintenance Interceptor
      if (data.status === "maintenance") {
        setResults(data.results || []);
        setStatus("error"); // Triggers the friendly "Connecting to Fortress" UI
        return;
      }

      setResults(data.results || []);
      if (data.results?.length > 0 && onSelectNode) {
        onSelectNode(data.results[0]);
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const updateMastery = async (nodeId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Mastered" ? "Archived" : "Mastered";
    try {
      const res = await fetch(`http://localhost:8000/node/status/${nodeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setResults(prev => prev.map(r => r.id === nodeId ? { ...r, status: newStatus } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };
  /* --- LOGIC SHIELD END --- */

  const openVideo = (video: any) => {
    setActiveVideo(video);
    setModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <VideoModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        videoUrl={activeVideo.url} 
        title={activeVideo.title} 
      />

      {/* Task 2: The 'Upgrade' Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#0a0a15]/90 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-amber-500 text-3xl">local_fire_department</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-white mb-3">Daily Limit Reached.</h3>
                <p className="text-zinc-400 mb-8 font-medium text-sm leading-relaxed">
                    Unlock 20 more High-Precision 14-Mark answers for just <span className="text-amber-400 font-bold">₹19</span>. Experience Priority Reasoning with the Fuel Plan.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => setShowUpgradeModal(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-colors">
                        Go Back
                    </button>
                    <button onClick={async () => {
                        await fetch("http://localhost:8000/api/user/upgrade", { method: "POST" });
                        setUserPlan("fuel");
                        setShowUpgradeModal(false);
                        // Optional: auto-retry search could be done here, but let's let user initiate again
                    }} className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform">
                        Pay ₹19
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Ambient Decorative Glows */}
      <div className="glow-accent-blue absolute -top-20 -left-20 w-[500px] h-[500px] pointer-events-none opacity-20"></div>

      {/* AI Hero Section */}
      <section className="flex flex-col items-center mb-16 px-6">
        <div className="relative mb-8">
          <div className="ai-orb w-24 h-24 rounded-full flex items-center justify-center relative z-10 p-4">
            <span className="material-symbols-outlined text-6xl text-[#00315d]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
        </div>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-tertiary success-indicator' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="font-label text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">
              {isBackendOnline ? 'AI Tutor Active' : 'AI Tutor Offline'}
            </span>
          </div>
          <h2 className="text-4xl font-headline font-bold tracking-tight leading-tight text-white">
            {query || "Neural Research"} <br/>
            <span className="text-on-surface-variant/60 font-light italic text-2xl">The Narrative Guide</span>
          </h2>
        </div>
      </section>

      {/* Search Input Section (Desktop version) */}
      <form onSubmit={handleSearch} className="hidden md:block relative group max-w-2xl mx-auto">
        <div className={`absolute -inset-1 bg-gradient-to-r ${userPlan === 'fuel' ? 'from-amber-500/40 to-yellow-500/10' : 'from-primary/20 to-transparent'} rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000`}></div>
        <div className="relative flex items-center bg-surface-container-highest rounded-xl p-4 shadow-2xl border border-white/5 backdrop-blur-3xl">
          <span className="material-symbols-outlined text-on-surface-variant px-2">search</span>
          <input 
            type="text" 
            placeholder={userPlan === 'fuel' ? "Turbo Search Neural Vault..." : "Search Neural Vault..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full text-lg placeholder:text-on-surface-variant/50 font-light text-white outline-none"
          />
          <button 
            type="submit"
            className={`px-6 py-2 rounded-lg font-label font-bold text-sm transition-opacity active:scale-95 duration-300 ${userPlan === 'fuel' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/20 hover:scale-105' : 'bg-primary-container text-on-primary-container hover:opacity-90'}`}
          >
            {status === "searching" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate"}
          </button>
        </div>
      </form>

      {/* Mobile Thumb-Access Search (Fixed Bottom) */}
      <div className="md:hidden fixed bottom-24 left-4 right-4 z-[110] animate-in slide-in-from-bottom-10 duration-500">
        <form onSubmit={handleSearch} className="relative group">
           <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-30"></div>
           <div className="relative flex items-center bg-[#0a0a15]/90 border border-white/10 rounded-2xl p-3 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <input 
                type="text" 
                placeholder="Ask Sentinel..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder:text-zinc-500 font-medium text-white outline-none px-2"
              />
              <button 
                type="submit"
                className="bg-primary text-on-primary p-2 rounded-xl transition-all active:scale-90"
              >
                {status === "searching" ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="material-symbols-outlined">bolt</span>}
              </button>
           </div>
        </form>
      </div>

      <div className="space-y-10 pb-20">
        {status === "searching" && (
           <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="ai-orb w-16 h-16 rounded-full animate-pulse flex items-center justify-center">
                 <span className="material-symbols-outlined text-on-primary text-2xl animate-spin">cyclone</span>
              </div>
              <p className="font-label text-xs font-bold text-primary uppercase tracking-[0.4em] animate-pulse">Sentinel is researching depths...</p>
           </div>
        )}

        {status === "error" && (
          <div className="p-12 glass-panel rounded-xl border border-primary/20 bg-primary/5 text-center animate-in fade-in zoom-in duration-500">
             <div className="ai-orb w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center opacity-50">
                <span className="material-symbols-outlined text-primary text-3xl animate-pulse">cloud_off</span>
             </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Connecting to Fortress Database...</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
              Neural sync in progress. Establishing secure handshake with Muni Manas identity vault.
            </p>
          </div>
        )}

        {status === "success" && results.map((result: any, i: number) => (
          <div key={i} className="bg-white/5 backdrop-blur-2xl rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden group border border-white/10">
            {/* 14-Mark Badge / Priority */}
            <div className="absolute -top-4 right-8 flex gap-2 z-10">
              {result.is_from_vault && (
                <div className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full font-label font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-lg success-indicator">
                  <span className="material-symbols-outlined text-lg">memory</span>
                  Stored in Memory
                </div>
              )}
              <div className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-label font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                {result.priority_level || "Core Concept"}
              </div>
            </div>

            <article className="space-y-8 text-on-surface/90 leading-relaxed">
              <div className="space-y-4 text-left">
                <h3 className="text-3xl font-headline font-bold tracking-tight text-white">{result.title}</h3>
                <p className="text-xl font-medium text-primary">"{result.concept_one_sentence || result.summary.slice(0, 100) + '...'}"</p>
              </div>

              <section className="space-y-4 text-left">
                <h4 className="text-2xl font-headline text-secondary font-semibold">Narrative Overview</h4>
                <p className="text-lg leading-relaxed text-zinc-300">{result.summary}</p>
              </section>

              {/* Visual Break / Asymmetric Bento Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border-l-4 border-primary text-left">
                  <span className="material-symbols-outlined text-primary mb-3">hub</span>
                  <h4 className="font-bold text-white mb-2">Atomic Knowledge</h4>
                  <ul className="text-sm text-on-surface-variant space-y-2">
                    {result.key_points?.slice(0, 3).map((kp: string, idx: number) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary">•</span> {kp}
                      </li>
                    ))}
                  </ul>
                </div>
                {result.exam_hack && (
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border-l-4 border-secondary text-left">
                    <span className="material-symbols-outlined text-secondary mb-3">lightbulb</span>
                    <h4 className="font-bold text-white mb-2">Exam Hack</h4>
                    <p className="text-sm text-on-surface-variant italic leading-relaxed">{result.exam_hack}</p>
                  </div>
                )}
              </div>


              {result.diagram_desc && (
                <div className="p-6 bg-amber-500/5 rounded-2xl border-2 border-dashed border-amber-500/30 relative group/diagram">
                  <div className="absolute -top-3 left-6 px-3 bg-[#050505] border border-amber-500/30 rounded-full flex items-center gap-2">
                    <span className="text-xs">✍️</span>
                    <span className="text-[10px] font-label text-amber-500 font-bold uppercase tracking-widest">EXAM DIAGRAM VISUALIZER</span>
                  </div>
                  <p className="text-sm text-zinc-300 italic leading-relaxed pt-2">{result.diagram_desc}</p>
                </div>
              )}

              {result.analogy && (
                <div className="p-6 bg-tertiary/10 rounded-xl border border-tertiary/20 flex gap-4 items-start text-left">
                  <span className="material-symbols-outlined text-tertiary">psychology</span>
                  <div>
                    <p className="text-sm font-bold text-tertiary uppercase tracking-widest mb-1">Tutor Insight (Analogy)</p>
                    <p className="text-on-surface text-zinc-300">{result.analogy}</p>
                  </div>
                </div>
              )}

              <footer className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => updateMastery(result.id, result.status || "Archived")}
                      className={`flex items-center gap-2 transition-colors font-label font-medium px-4 py-2 rounded-xl
                        ${result.status === "Mastered" ? 'text-tertiary bg-tertiary/10' : 'text-on-surface-variant hover:text-primary bg-white/5 hover:bg-white/10'}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: result.status === 'Mastered' ? "'FILL' 1" : "" }}>
                        {result.status === "Mastered" ? 'verified' : 'bookmark'}
                      </span>
                      {result.status === "Mastered" ? "NODE MASTERED" : "SAVE TO LIBRARY"}
                    </button>
                    
                    {result.video_resource?.url && (
                      <button 
                        onClick={() => openVideo(result.video_resource)}
                        className="p-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      >
                        <span className="material-symbols-outlined">play_circle</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] font-label text-zinc-500 font-bold uppercase tracking-widest px-4">
                    {result.footer || "Verified by StudyKrack 2.0 | Target: 8.5+ SGPA"}
                  </p>
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-container rounded-xl font-bold font-label active:scale-95 duration-300 shadow-xl">
                    Deep Dive Study
                  </button>
                </div>
              </footer>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
