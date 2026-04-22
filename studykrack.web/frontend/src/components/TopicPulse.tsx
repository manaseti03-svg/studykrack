"use client";
import { useState } from "react";
import { ListPlus, Zap, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { parseTopics } from "@/lib/utils";

/**
 * TopicPulse (Salvaged from BulkIngest)
 * High-density mass research module for Opal Glass UI.
 */
export default function TopicPulse() {
  const [input, setInput] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "success" | "throttled" | "error">("idle");

  const handleBulk = async () => {
    if (!input || !subjectCode) return;
    const topics = parseTopics(input);
    if (topics.length === 0) return;

    setStatus("working");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/bulk-ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, subject_code: subjectCode }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          setStatus("throttled");
          return;
        }
        throw new Error("Bulk failure");
      }

      const result = await response.json();
      if (result.status === "success") {
        setStatus("success");
        setInput("");
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
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 lg:p-10 relative overflow-hidden group transition-all">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                <Sparkles className="text-fuchsia-500 w-5 h-5" />
             </div>
             <h3 className="text-xl font-headline font-bold text-white uppercase italic tracking-tight">Topic Pulse</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Mass-research multiple topics simultaneously. Perfect for creating a complete subject overview from a syllabus list.
          </p>
        </div>

        <div className="md:w-2/3 w-full space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-2">Topic List (Separated by Comma)</label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Backpropagation, CNN, LSTM..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-fuchsia-500/30 min-h-[100px] transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-2">Target Subject Code</label>
              <input 
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="e.g. CS6001"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-fuchsia-500/30 transition-all font-mono"
              />
            </div>
          </div>

          {status === "working" && (
            <div className="space-y-4 pt-2">
               <div className="flex justify-between items-center text-[10px] font-black text-fuchsia-500 tracking-widest uppercase">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Neural Nodes Generating...
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-fuchsia-500 animate-[pulse_1.5s_infinite] w-full shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
              </div>
            </div>
          )}

          <div className="min-h-[20px]">
            {status === "success" && (
              <p className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" /> Syllabus fully merged
              </p>
            )}
            {status === "throttled" && (
              <p className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                <Zap className="w-4 h-4" /> AI Capacity Reached
              </p>
            )}
          </div>

          <button 
            onClick={handleBulk}
            disabled={status === "working" || !input || !subjectCode}
            className="w-full bg-fuchsia-600/10 border border-fuchsia-600/30 text-fuchsia-500 py-4 rounded-2xl font-black text-[10px] tracking-[0.4em] hover:bg-fuchsia-600 hover:text-white transition-all disabled:opacity-20 uppercase"
          >
            {status === "working" ? "Generating..." : "Ignite Pulse Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
