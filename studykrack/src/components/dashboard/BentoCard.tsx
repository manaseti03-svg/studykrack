'use client';

import { ReactNode } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import Icon from '@/components/ui/Icon';

/**
 * BentoCard: High-level layout component for dashboard sections.
 * Features: Unified title headers and Material Icon integration.
 */
interface BentoCardProps {
  children: ReactNode;
  header: {
    title: string;
    subtitle?: string;
    icon: string;
    iconColor?: string;
  };
  className?: string;
  span?: 4 | 8 | 12; // Grid column spans based on 12-column parent
}

export default function BentoCard({ 
  children, 
  header, 
  className = "", 
  span = 4 
}: BentoCardProps) {
  const spanStyles = {
    4: "md:col-span-4",
    8: "md:col-span-8",
    12: "md:col-span-12"
  };

  return (
    <GlassPanel className={`${spanStyles[span]} !p-0 ${className} group/bento overflow-hidden`}>
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1.5">
            <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight group-hover/bento:text-secondary transition-colors">{header.title}</h3>
            {header.subtitle && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{header.subtitle}</p>}
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 flex items-center justify-center transition-all duration-500 group-hover/bento:scale-110 group-hover/bento:border-secondary/30 ${header.iconColor || 'text-secondary'}`}>
            <Icon name={header.icon} className="text-2xl" />
          </div>
        </div>
        
        <div className="flex-1">
          {children}
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full opacity-0 group-hover/bento:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 left-4 w-1 h-8 bg-gradient-to-t from-secondary/40 to-transparent rounded-full opacity-40" />
    </GlassPanel>
  );
}
