"use client"
import { useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Upload, Check, Trash2 } from 'lucide-react';

interface TimetableEntry {
  day: string;
  subject: string;
  time: string;
}

interface MatrixData {
  timetable: TimetableEntry[];
  subjects: string[];
  semester_id: string;
  semester_end_date: string;
}

export default function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<"upload" | "verify">("upload");
  const [loading, setLoading] = useState(false);
  const [matrix, setMatrix] = useState<MatrixData | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const res = await fetch("http://localhost:8000/vision/timetable", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Vision Analysis Failed");
      
      const data = await res.json();
      setMatrix(data);
      setStep("verify");
    } catch (err) {
      console.error(err);
      alert("Failed to read timetable. Please try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = (index: number, field: keyof TimetableEntry, value: string) => {
    if (!matrix) return;
    const newTimetable = [...matrix.timetable];
    newTimetable[index] = { ...newTimetable[index], [field]: value };
    setMatrix({ ...matrix, timetable: newTimetable });
  };

  const handleAddEntry = () => {
    if (!matrix) return;
    setMatrix({
      ...matrix,
      timetable: [...matrix.timetable, { day: "Monday", subject: "", time: "9:00 AM" }]
    });
  };

  const handleRemoveEntry = (index: number) => {
    if (!matrix) return;
    setMatrix({
      ...matrix,
      timetable: matrix.timetable.filter((_, i) => i !== index)
    });
  };

  const handleConfirm = async () => {
    if (!matrix || !auth.currentUser) return;
    setLoading(true);
    
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        active_semester: {
          ...matrix,
          is_active: true,
          updated_at: serverTimestamp()
        }
      }, { merge: true });
      
      onComplete();
    } catch (err) {
      console.error(err);
      alert("Failed to save matrix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

        {step === "upload" && (
          <div className="flex flex-col items-center text-center space-y-8 py-12">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Upload className="text-cyan-500 w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-headline font-bold text-white italic">The Academic Matrix</h2>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm">
                Upload a photo of your <span className="text-white font-bold italic">Timetable</span>. StudyKrack will reconstruct your semester using Gemini Vision.
              </p>
            </div>
            
            <label className="relative group cursor-pointer">
              <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" disabled={loading} />
              <div className="px-12 py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_20px_40px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>}
                {loading ? "INITIALIZING VISION..." : "UPLOAD TIMETABLE"}
              </div>
            </label>
            
            <p className="text-[9px] font-label font-bold text-zinc-600 uppercase tracking-widest">
                ZERO-TRUST SECURE INGESTION | BY MUNI MANAS
            </p>
          </div>
        )}

        {step === "verify" && matrix && (
          <div className="flex flex-col h-full">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-headline font-bold text-white italic">Human-in-the-Loop Verification</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Audit the AI extraction for 100% accuracy</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl">
                 <span className="text-[10px] font-black text-cyan-500 uppercase italic">Semester: {matrix.semester_id}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-8 space-y-4 pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-white/5">
                     <th className="py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Day</th>
                     <th className="py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Time</th>
                     <th className="py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Subject / Period</th>
                     <th className="py-4 px-2"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {matrix.timetable.map((entry, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2">
                        <select 
                          value={entry.day}
                          onChange={(e) => handleUpdateEntry(idx, "day", e.target.value)}
                          className="bg-transparent text-sm border-none focus:ring-0 text-white font-medium p-0"
                        >
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                            <option key={d} value={d} className="bg-[#0a0a15]">{d}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <input 
                          type="text" 
                          value={entry.time}
                          onChange={(e) => handleUpdateEntry(idx, "time", e.target.value)}
                          className="bg-transparent text-sm border-none focus:ring-0 text-cyan-500 font-mono p-0 w-24"
                        />
                      </td>
                      <td className="py-3 px-2">
                         <input 
                          type="text" 
                          value={entry.subject}
                          onChange={(e) => handleUpdateEntry(idx, "subject", e.target.value)}
                          className="bg-transparent text-sm border-none focus:ring-0 text-white font-black uppercase p-0 w-full"
                          placeholder="Subject Name"
                        />
                      </td>
                      <td className="py-3 px-2 text-right">
                         <button onClick={() => handleRemoveEntry(idx)} className="text-zinc-600 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button 
                onClick={handleAddEntry}
                className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-bold text-zinc-500 hover:border-cyan-500/30 hover:text-cyan-500 transition-all uppercase tracking-widest"
              >
                + Add Period
              </button>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/5">
               <button 
                 onClick={() => setStep("upload")}
                 className="flex-1 py-4 rounded-2xl bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
               >
                 Go Back
               </button>
               <button 
                 onClick={handleConfirm}
                 disabled={loading}
                 className="flex-1 py-4 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                 {loading ? "LOCKING MATRIX..." : "CONFIRM & LOCK MATRIX"}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
