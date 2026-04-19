'use client';

import { Tag } from 'lucide-react';

interface KnowledgeNodeCloudProps {
  nodes: string[];
}

export default function KnowledgeNodeCloud({ nodes }: KnowledgeNodeCloudProps) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {nodes.map((node, index) => (
        <div 
          key={index}
          className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:border-secondary/50 hover:bg-secondary/10 transition-all cursor-pointer animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Tag className="w-3 h-3 text-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-wider">
            {node}
          </span>
        </div>
      ))}
    </div>
  );
}
