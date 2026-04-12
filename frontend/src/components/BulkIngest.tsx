"use client"
import { useState } from "react";
import { ListPlus, Zap, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function BulkIngest() {
  const [input, setInput] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "success" | "throttled" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const handleBulk = async () => {
    if (!input || !subjectCode) return;
    const topics = input.split(",").map(t => t.trim()).filter(t => t.length > 0);
    if (topics.length === 0) return;

    setStatus("working");
    setProgress(0);

    try {
      // We call the bulk endpoint
      const response = await fetch("http://localhost:8000/bulk-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, subject_code: subjectCode }),
      });

      if (!response.ok) {
        const errData = await response.json();
        if (response.status === 429) {
          setStatus("throttled");
          return;
        }
        throw new Error("Bulk failure");
      }

      const result = await response.json();
      if (result.status === "success") {
        setStatus("success");
      } else if (result.status === "throttled") {
        setStatus("throttled");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="glass p-10 rounded-[48px] shadow-2xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-fuchsia-500/10 rounded-3xl">
          <ListPlus className="w-6 h-6 text-fuchsia-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Bulk Ingest</h2>
          <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">Mass Knowledge Synchronization</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4">Topic List (Separated by Comma)</p>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Backpropagation, CNN, LSTM..."
            className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-5 text-sm text-white outline-none focus:border-fuchsia-500/30 min-h-[140px] transition-all placeholder:text-zinc-700"
          />
        </div>

        <div>
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4">Subject Code</p>
          <input 
            type="text"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            placeholder="e.g. CS6001"
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-fuchsia-500/30 transition-all font-mono"
          />
        </div>

        {status === "working" && (
          <div className="space-y-4 pt-4">
             <div className="flex justify-between items-center text-[10px] font-black text-fuchsia-500 tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Sentinel Ingesting Syllabus...
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-fuchsia-500 animate-[pulse_1.5s_infinite] w-full"></div>
            </div>
          </div>
        )}

        <div className="min-h-[24px]">
          {status === "success" && (
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold animate-in fade-in slide-in-from-left-2 transition-all">
              <CheckCircle2 className="w-4 h-4" /> Syllabus fully merged with library.
            </div>
          )}

          {status === "throttled" && (
            <div className="flex items-center gap-3 text-amber-500 text-xs font-bold animate-in fade-in slide-in-from-left-2 transition-all">
              <Zap className="w-4 h-4" /> AI Power Limit reached. Partial nodes saved.
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-left-2 transition-all">
              <AlertCircle className="w-4 h-4" /> Neural link severed. Saving progress.
            </div>
          )}
        </div>

        <button 
          onClick={handleBulk}
          disabled={status === "working" || !input || !subjectCode}
          className="w-full bg-fuchsia-600 text-white py-6 rounded-[32px] font-black text-[11px] tracking-[0.4em] hover:bg-fuchsia-500 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale uppercase shadow-xl shadow-fuchsia-900/20"
        >
          {status === "working" ? "RESEARCHING..." : "START BULK INGEST"}
        </button>
      </div>
    </div>
  );
}
