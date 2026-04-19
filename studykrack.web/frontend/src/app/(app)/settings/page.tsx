"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
import { 
  User, 
  Settings as SettingsIcon, 
  Zap, 
  Grid, 
  Edit2, 
  Check, 
  X, 
  Trash2, 
  Loader2,
  TrendingUp,
  CreditCard
} from "lucide-react";

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState<"identity" | "matrix" | "billing">("identity");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Edit states
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editSgpa, setEditSgpa] = useState(false);
  const [newSgpa, setNewSgpa] = useState("");
  const [editSemester, setEditSemester] = useState(false);
  const [newSemester, setNewSemester] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;
      
      const unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setNewName(data.name || "");
          setNewSgpa(data.goal_sgpa || "8.5");
          setNewSemester(data.semester || "AIML Semester 2");
        }
        setLoading(false);
      });

      return () => unsubscribeProfile();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleUpdate = async (field: string, value: any) => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        [field]: value,
        updated_at: serverTimestamp()
      });
      setEditName(false);
      setEditSgpa(false);
      setEditSemester(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const updateMatrixEntry = async (index: number, field: string, value: string) => {
    if (!profile || !auth.currentUser) return;
    const newTimetable = [...profile.active_semester.timetable];
    newTimetable[index] = { ...newTimetable[index], [field]: value };
    
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      "active_semester.timetable": newTimetable
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-[600px] animate-in fade-in duration-700 space-y-8">
      
      {/* Navigation Tabs */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-3xl">
         {[
           { id: 'identity', label: 'Identity', icon: User },
           { id: 'matrix', label: 'Academic Matrix', icon: Grid },
           { id: 'billing', label: 'Fuel & Billing', icon: Zap }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-zinc-500 hover:text-white'}`}
           >
             <tab.icon className="w-4 h-4" />
             {tab.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tab Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'identity' && (
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 space-y-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
               
               <div className="space-y-10">
                  {/* Name Section */}
                  <div className="flex justify-between items-center group">
                     <div>
                        <p className="text-[10px] font-label font-bold text-zinc-500 uppercase tracking-widest mb-1">Full Name</p>
                        {editName ? (
                          <div className="flex gap-2">
                             <input 
                               value={newName} 
                               onChange={(e) => setNewName(e.target.value)}
                               className="bg-white/5 border border-white/10 rounded-lg px-4 py-1 text-white font-headline font-bold text-2xl outline-none focus:border-primary/50"
                             />
                             <button onClick={() => handleUpdate('name', newName)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Check className="w-5 h-5" /></button>
                             <button onClick={() => setEditName(false)} className="p-2 text-zinc-500 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
                          </div>
                        ) : (
                          <h3 className="text-3xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
                            {profile?.name || "Anonymous Student"}
                            <button onClick={() => setEditName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-600 hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                          </h3>
                        )}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Semester Section */}
                      <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group">
                         <p className="text-[10px] font-label font-bold text-zinc-500 uppercase tracking-widest mb-2">Current Semester</p>
                         {editSemester ? (
                           <div className="flex gap-2">
                              <input 
                                value={newSemester} 
                                onChange={(e) => setNewSemester(e.target.value)}
                                className="bg-transparent border-b border-white/20 text-white font-headline font-bold outline-none flex-1"
                              />
                              <button onClick={() => handleUpdate('semester', newSemester)} className="text-primary"><Check className="w-4 h-4" /></button>
                           </div>
                         ) : (
                           <p className="text-xl font-headline font-bold text-white flex items-center gap-3">
                             {profile?.semester || "Not Set"}
                             <button onClick={() => setEditSemester(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-600 hover:text-primary"><Edit2 className="w-3 h-3" /></button>
                           </p>
                         )}
                      </div>

                      {/* SGPA Section */}
                      <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group">
                         <p className="text-[10px] font-label font-bold text-secondary font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            Target SGPA
                         </p>
                         {editSgpa ? (
                           <div className="flex gap-2">
                              <input 
                                type="number" step="0.01" max="10"
                                value={newSgpa} 
                                onChange={(e) => setNewSgpa(e.target.value)}
                                className="bg-transparent border-b border-white/20 text-white font-headline font-bold outline-none w-20"
                              />
                              <button onClick={() => handleUpdate('goal_sgpa', newSgpa)} className="text-primary"><Check className="w-4 h-4" /></button>
                           </div>
                         ) : (
                           <p className="text-3xl font-headline font-black text-white flex items-center gap-3">
                             {profile?.goal_sgpa || "8.5"}
                             <button onClick={() => setEditSgpa(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-600 hover:text-secondary"><Edit2 className="w-3 h-3" /></button>
                           </p>
                         )}
                      </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-white italic">Neural Timetable</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Reconstructed from Gemini Vision</p>
                  </div>
                  <button onClick={() => handleUpdate('active_semester', null)} className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                    Reset Matrix
                  </button>
               </div>

               <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {profile?.active_semester?.timetable?.map((entry: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                       <input 
                         value={entry.day}
                         onChange={(e) => updateMatrixEntry(i, 'day', e.target.value)}
                         className="w-24 bg-transparent text-[10px] font-bold uppercase text-zinc-500 outline-none"
                       />
                       <input 
                         value={entry.time}
                         onChange={(e) => updateMatrixEntry(i, 'time', e.target.value)}
                         className="w-32 bg-transparent text-sm font-mono text-cyan-500 outline-none"
                       />
                       <input 
                         value={entry.subject}
                         onChange={(e) => updateMatrixEntry(i, 'subject', e.target.value)}
                         className="flex-1 bg-transparent text-sm font-black uppercase text-white outline-none"
                       />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-12 space-y-12">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-headline font-black text-white italic">₹19 Fuel Plan</h3>
                     <p className="text-zinc-500 font-medium">Clear Cloud Economy. No Debt Protocols.</p>
                  </div>
                  <div className="px-8 py-4 bg-tertiary/10 border border-tertiary/30 rounded-3xl text-center">
                     <p className="text-[10px] font-label font-bold text-tertiary uppercase tracking-widest mb-1">Active Power</p>
                     <p className="text-4xl font-headline font-black text-white">{profile?.fuel_balance || 0}/20</p>
                     <p className="text-[8px] font-label text-zinc-500 uppercase tracking-widest mt-2">INGESTIONS LEFT</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/20 space-y-6">
                     <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
                        <Zap className="text-secondary w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-headline font-bold text-white">Power Up Engine</h4>
                     <p className="text-sm text-zinc-400 leading-relaxed">
                        Refill your fuel tank with 20 high-priority ingestion tickets. Uses Gemini 1.5 Flash for zero-latency study.
                     </p>
                     <button className="w-full py-4 rounded-2xl bg-secondary text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" /> REFUEL FOR ₹19
                     </button>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6 opacity-50 grayscale">
                     <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Zap className="text-white w-6 h-6" />
                     </div>
                     <h4 className="text-xl font-headline font-bold text-white italic">Infinite Reactor</h4>
                     <p className="text-sm text-zinc-500 leading-relaxed">
                        Beta Access only. Unlock unlimited ingestion and Gemini 1.5 Pro deep reasoning for local research.
                     </p>
                     <button disabled className="w-full py-4 rounded-2xl bg-white/5 text-zinc-600 font-black uppercase tracking-widest text-[10px] cursor-not-allowed">
                        COMING SOON
                     </button>
                  </div>
               </div>
            </div>
          )}

        </div>

        {/* Right Column: Mini Stats Card */}
        <div className="lg:col-span-4">
           <div className="bg-[#0a0a15] rounded-[40px] border border-white/5 p-8 space-y-8 sticky top-8">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mb-4 flex items-center justify-center relative overflow-hidden group">
                    <span className="material-symbols-outlined text-4xl text-zinc-500 group-hover:text-primary transition-colors">fingerprint</span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                 </div>
                 <p className="text-[10px] font-label font-bold text-primary uppercase tracking-[0.4em] mb-1">Authenticated ID</p>
                 <p className="text-xs font-mono text-zinc-600 truncate w-full">{auth.currentUser?.uid}</p>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Logic Tier</span>
                    <span className="text-xs font-black text-white italic">Standard Flash</span>
                 </div>
                 <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account Status</span>
                    <span className="text-[10px] font-black text-tertiary uppercase flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                       Active
                    </span>
                 </div>
              </div>

              <button 
                onClick={() => auth.signOut()}
                className="w-full py-4 rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 transition-all">
                Terminate Session
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
