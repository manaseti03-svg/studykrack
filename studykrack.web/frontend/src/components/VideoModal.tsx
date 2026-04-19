"use client"
import { X, Play } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  if (!isOpen) return null;

  // Convert watch URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="glass w-full max-w-5xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-2xl">
              <Play className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
              <p className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase">Virtual Classroom Stream</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-2xl transition-all text-zinc-500 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="aspect-video bg-black relative group">
          <iframe 
            src={getEmbedUrl(videoUrl)} 
            className="w-full h-full"
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-6 bg-zinc-950/40 text-[9px] font-black tracking-[0.5em] text-zinc-600 uppercase text-center">
          Distraction-Locked Player Active
        </div>
      </div>
    </div>
  );
}
