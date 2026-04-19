"use client";
import React from "react";
import Leaderboard from "@/components/Leaderboard";

export default function CommunityPage() {
  return (
    <div className="min-h-[500px] md:min-h-[800px] animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Cloud Backup & Friends */}
        <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-[32px] border border-white/5 text-center">
          <div className="ai-orb w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-6 md:mb-8">
            <span className="material-symbols-outlined text-3xl md:text-4xl text-on-primary">groups</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Cloud Backup</h2>
          <p className="text-on-surface-variant max-w-xs md:max-w-md mx-auto text-sm md:text-base mb-8">
            Saving your notes and making them easy to share with your friends across the platform...
          </p>
          <div className="px-6 md:px-8 py-2 md:py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-label font-bold text-[8px] md:text-[10px] tracking-[0.4em] uppercase">
            Phase 2: Coming Soon
          </div>
        </div>

        {/* Right Side: The Competition Engine */}
        <div className="glass-panel p-8 rounded-[32px] border border-white/5">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
