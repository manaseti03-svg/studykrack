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
  span?: 1 | 2 | 3; // For grid column spans
}

export default function BentoCard({ 
  children, 
  header, 
  className = "", 
  span = 1 
}: BentoCardProps) {
  const spanStyles = {
    1: "md:col-span-4",
    2: "md:col-span-8",
    3: "md:col-span-12"
  };

  return (
    <GlassPanel className={`${spanStyles[span]} ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-headline font-extrabold text-white uppercase tracking-tight">{header.title}</h3>
          {header.subtitle && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{header.subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${header.iconColor || 'text-secondary'}`}>
          <Icon name={header.icon} className="text-2xl" />
        </div>
      </div>
      
      {children}
    </GlassPanel>
  );
}
