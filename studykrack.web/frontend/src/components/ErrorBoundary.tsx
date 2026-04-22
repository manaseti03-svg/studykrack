"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-3xl border border-red-500/20 rounded-[40px] p-10 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <AlertCircle className="text-red-500 w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-headline font-bold text-white uppercase italic tracking-tight">AI Tutor is resting</h1>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                The connection took a quick break. We're re-establishing the neural bridge now.
              </p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
            >
              <RefreshCw className="w-4 h-4" /> RE-SYNC NOW
            </button>
            
            <p className="text-[8px] font-label text-zinc-700 font-bold uppercase tracking-[0.4em]">Error Protocol: StudyKrack v2.0</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
