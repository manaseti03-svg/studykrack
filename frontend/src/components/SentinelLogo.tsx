import React from 'react';

export default function SentinelLogo({ className = "w-16 h-16", showText = false }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative group">
        {/* Hexagonal Shield Wrapper */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-amber-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          {/* Hexagonal Shield (Fragmented) */}
          <path 
            d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" 
            fill="none" 
            stroke="url(#plasmaGradient)" 
            strokeWidth="2" 
            strokeDasharray="15 3"
            className="animate-[pulse_4s_ease-in-out_infinite]"
          />
          
          {/* Geometric 'K' spine with circuit nodes */}
          <path 
            d="M35 25 L35 75 M35 50 L65 25 M35 50 L65 75" 
            fill="none" 
            stroke="url(#plasmaGradient)" 
            strokeWidth="6" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Circuit nodes / Spinal column nodes */}
          <circle cx="35" cy="25" r="3" fill="#050505" stroke="url(#plasmaGradient)" strokeWidth="1.5" />
          <circle cx="35" cy="50" r="3" fill="#050505" stroke="url(#plasmaGradient)" strokeWidth="1.5" />
          <circle cx="35" cy="75" r="3" fill="#050505" stroke="url(#plasmaGradient)" strokeWidth="1.5" />
          
          <defs>
            <linearGradient id="plasmaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="text-center">
          <h1 className="text-xl font-headline font-black tracking-tighter text-white uppercase italic">
            StudyKrack <span className="text-cyan-400">v2.0</span>
          </h1>
          <p className="text-[8px] font-label text-amber-500 font-bold tracking-[0.4em] uppercase opacity-80 decoration-none">
            Total Academic Dominance
          </p>
        </div>
      )}
    </div>
  );
}
