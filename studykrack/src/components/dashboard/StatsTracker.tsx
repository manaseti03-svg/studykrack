'use client';

/**
 * StatsTracker: High-viscosity circular progress visualization.
 * Features: Customizable progress ratios, dynamic coloring, and centered metrics.
 */
interface StatsTrackerProps {
  label: string;
  value: string | number;
  subtext: string;
  progress: number; // 0 to 1
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatsTracker({
  label,
  value,
  subtext,
  progress,
  color = "text-secondary",
  size = "md"
}: StatsTrackerProps) {
  const sizes = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48"
  };

  const radius = { sm: 40, md: 58, lg: 85 }[size];
  const stroke = { sm: 4, md: 8, lg: 12 }[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress * circumference);

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        <svg className="w-full h-full -rotate-90">
          <circle 
            className="text-surface-container-highest/20" 
            cx="50%" cy="50%" r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth={stroke}
          />
          <circle 
            className={`transition-all duration-1000 ${color}`} 
            cx="50%" cy="50%" r={radius} 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth={stroke} 
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${size === 'lg' ? 'text-5xl' : 'text-3xl'} font-headline font-black text-white`}>{value}</span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{subtext}</span>
        </div>
      </div>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/60">{label}</h4>
    </div>
  );
}
