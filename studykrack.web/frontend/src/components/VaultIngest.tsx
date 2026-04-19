"use client"
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Upload, FileText, FlaskConical, BookOpen, Check, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: "Class Notes", icon: BookOpen },
  { id: "Homework", icon: FileText },
  { id: "Lab Record", icon: FlaskConical },
  { id: "Observation", icon: FlaskConical },
  { id: "Assignment", icon: FileText }
];

export default function VaultIngest() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Class Notes");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().active_semester?.subjects) {
        setSubjects(snap.data().active_semester.subjects);
        setSelectedSubject(snap.data().active_semester.subjects[0] || "");
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !selectedSubject) return;
    setLoading(true);
    setStatus("idle");

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("subject_name", selectedSubject);
    formData.append("category", selectedCategory);

    try {
      const res = await fetch("http://localhost:8000/forge/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 lg:p-10 mb-12 relative overflow-hidden group transition-all">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Upload className="text-primary w-5 h-5" />
             </div>
             <h3 className="text-xl font-headline font-bold text-white uppercase italic tracking-tight">Vault Ingestion</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Categorize and index your academic material. StudyKrack will automatically tag and secure them in your Logic Vault.
          </p>
        </div>

        <div className="md:w-2/3 w-full space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-2">Target Subject</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:border-primary/40 transition-all outline-none"
              >
                {subjects.map(s => <option key={s} value={s} className="bg-[#0a0a15]">{s}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-2">Document Type</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                        ${selectedCategory === cat.id ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                    >
                      <Icon className="w-3 h-3" />
                      {cat.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <label className={`relative flex items-center justify-center w-full py-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all
              ${status === 'success' ? 'border-tertiary bg-tertiary/5' : 'border-white/10 hover:border-primary/20 hover:bg-white/5'}`}
            >
              <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} disabled={loading} />
              <div className="flex flex-col items-center gap-4">
                {loading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : status === 'success' ? (
                  <div className="flex flex-col items-center gap-2 text-tertiary">
                     <Check className="w-10 h-10" />
                     <span className="text-xs font-black uppercase tracking-[0.2em]">Matrix Updated</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-zinc-700" />
                    <div className="text-center">
                       <p className="text-sm font-bold text-white uppercase tracking-tight">Drop your PDF here</p>
                       <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">SECURE ENCRYPTED UPLOAD</p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
