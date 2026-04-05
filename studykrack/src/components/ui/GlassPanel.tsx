'use client';

import { ReactNode } from 'react';

/**
 * GlassPanel: The core Scholaris 2.0 container.
 * Features: High-viscosity translucency, hardware-accelerated transitions, and subtle hover lifts.
 */
interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  animate?: boolean;
}

export default function GlassPanel({ 
  children, 
  className = "", 
  hoverable = true,
  animate = true
}: GlassPanelProps) {
  const baseStyles = "glass-panel p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden backdrop-blur-3xl bg-slate-900/40";
  const hoverStyles = hoverable ? "hover:-translate-y-1 hover:bg-white/5 transition-all duration-500 cursor-pointer" : "";
  const animationStyles = animate ? "animate-scale-in" : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${animationStyles} ${className}`}>
      {/* Gloss reflection top highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-30 shadow-[0_0_10px_#44d8f1]" aria-hidden="true" />
      
      {children}
    </div>
  );
}
