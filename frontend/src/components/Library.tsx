"use client"
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Library() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, "knowledge_vault"), orderBy("timestamp", "desc"));
    if (activeSubject) {
      q = query(collection(db, "knowledge_vault"), where("subject_code", "==", activeSubject), orderBy("timestamp", "desc"));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNodes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeSubject]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
             <span className="font-label text-on-surface-variant font-bold text-[10px] tracking-[0.4em] uppercase">My Learning Library</span>
          </div>
          <h2 className="text-5xl font-headline font-bold text-white tracking-tight">My Vault</h2>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-surface-container rounded-2xl px-8 py-4 border border-white/5 flex flex-col items-center justify-center">
            <span className="text-2xl font-headline font-bold text-white">{nodes.length}</span>
            <span className="text-[8px] font-label text-on-surface-variant font-bold uppercase tracking-widest mt-1">Saved Notes</span>
          </div>
          <div className="bg-surface-container rounded-2xl px-8 py-4 border border-white/5 flex flex-col items-center justify-center">
            <span className="text-2xl font-headline font-bold text-tertiary">
              {nodes.filter(n => n.status === "Mastered").length}
            </span>
            <span className="text-[8px] font-label text-on-surface-variant font-bold uppercase tracking-widest mt-1">Learned</span>
          </div>
        </div>
      </section>

      {/* Subject Lockers - Semester 2 Initialization */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Mathematics for AIML", code: "MAT201", color: "primary", icon: "functions" },
          { title: "Data Structures & Algorithms", code: "DSA202", color: "secondary", icon: "account_tree" },
          { title: "Digital Logic & Design", code: "DLD203", color: "tertiary", icon: "memory" },
          { title: "Python for Data Science", code: "PDS204", color: "primary", icon: "terminal" },
          { title: "Communicative English", code: "ENG205", color: "secondary", icon: "chat_bubble" }
        ].map((cat, i) => (
          <div 
            key={i} 
            onClick={() => setActiveSubject(activeSubject === cat.code ? null : cat.code)}
            className={`glass-panel p-6 rounded-[24px] group hover:scale-[1.05] transition-all duration-300 cursor-pointer overflow-hidden relative border 
              ${activeSubject === cat.code ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-white/5'}`}
          >
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className={`p-4 rounded-xl bg-surface-container text-${cat.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <div>
                <h3 className="text-[10px] font-headline font-bold text-white leading-tight mb-1">{cat.title}</h3>
                <p className="text-[8px] font-label text-on-surface-variant font-bold uppercase tracking-widest">{cat.code}</p>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-${cat.color}/20`}></div>
          </div>
        ))}
      </section>

      {/* Recent Activity / Detailed List */}
      <section className="glass-panel rounded-[40px] p-10 mt-12 overflow-hidden relative">
        <div className="ambient-glow absolute inset-0 opacity-10"></div>
        <div className="relative z-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Recent Saves</h3>
              <button className="font-label text-primary font-bold text-[10px] tracking-widest uppercase hover:underline">View All</button>
           </div>

           <div className="space-y-6">
             {loading ? (
                <div className="text-center py-20 animate-pulse">
                  <span className="material-symbols-outlined text-zinc-700 text-4xl mb-4">refresh</span>
                  <p className="text-[10px] font-label text-zinc-600 font-bold uppercase tracking-widest">Loading your notes...</p>
                </div>
             ) : nodes.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl group hover:border-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-zinc-700 text-5xl mb-4 group-hover:text-primary/40 transition-colors">database_upload</span>
                  <h4 className="text-lg font-headline font-bold text-zinc-500 mb-2">YOUR VAULT IS READY FOR NEW NOTES</h4>
                  <p className="text-[9px] font-label text-zinc-600 font-bold uppercase tracking-[0.3em]">LET'S SCORE HIGH GRADES!</p>
                </div>
             ) : nodes.map((node, i) => (
               <div key={i} className="flex items-center justify-between p-6 bg-surface-container-low rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-white">{node.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[8px] font-label text-zinc-500 font-bold uppercase tracking-widest">Saved on {new Date(node.timestamp?.seconds * 1000).toLocaleDateString()}</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
                        <span className="text-[8px] font-label text-primary font-bold uppercase tracking-widest">{node.tag || "Important Note"}</span>
                      </div>
                    </div>
                 </div>
                 <button className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">download</button>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Decorative Action */}
      <div className="flex justify-center pt-8">
        <button className="px-12 py-5 bg-white text-on-surface-container-lowest rounded-full font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-2xl">
          Review Learned Notes
        </button>
      </div>
    </div>
  );
}
