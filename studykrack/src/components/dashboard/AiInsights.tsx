"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { analyzeStudyData } from "@/app/actions/ai-analyze";

interface AiInsightsProps {
  tasks: any[];
  grades: any[];
}

export default function AiInsights({ tasks, grades }: AiInsightsProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeStudyData(tasks, grades);
      if (result.success) {
        setInsight(result.analysis || "No insights available at the moment.");
      } else {
        setError(result.error || "Failed to analyze study data.");
      }
    } catch (err) {
      setError("An unexpected error occurred during nexus synchronization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl transition-all hover:shadow-2xl hover:shadow-indigo-500/20">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} className="text-white" />
      </div>

      <div className="relative flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Smart Study Insights</h3>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-full transition-all border border-white/20 backdrop-blur-sm cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">{loading ? 'Analyzing...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="flex-grow">
          {insight ? (
            <p className="text-white/90 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
              {insight}
            </p>
          ) : error ? (
            <div className="flex items-start space-x-3 text-red-100 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
              <Sparkles className="text-white/20 w-10 h-10 animate-pulse" />
              <p className="text-white/60 italic text-sm max-w-[200px]">
                Click refresh to generate personalized academic coaching using Gemini 1.5 Flash.
              </p>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-auto">
          <div className="text-[10px] uppercase tracking-widest text-white/50 font-black">
            Powered by Gemini AI v1.5
          </div>
          <div className="text-[10px] text-white/30 italic">
            Senior Architect Engine
          </div>
        </div>
      </div>
    </div>
  );
}
