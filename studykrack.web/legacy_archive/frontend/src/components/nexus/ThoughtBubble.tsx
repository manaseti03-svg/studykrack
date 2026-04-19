'use client';

import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';

interface ThoughtBubbleProps {
  thought: string;
}

export default function ThoughtBubble({ thought }: ThoughtBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thought) return null;

  return (
    <div className="my-4 animate-fade-in">
      <GlassPanel 
        className={`overflow-hidden transition-all duration-500 border-secondary/20 bg-secondary/5 ${
          isExpanded ? 'max-h-[500px]' : 'max-h-12'
        }`}
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-secondary"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Processing Trace</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <div className="px-4 pb-4">
          <p className="text-xs text-slate-400 font-mono leading-relaxed italic border-l-2 border-secondary/30 pl-4 py-2">
            {thought}
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}
