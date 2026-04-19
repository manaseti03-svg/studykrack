'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Send, Loader2, User, Bot, Sparkles } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import ScholarisButton from '../ui/ScholarisButton';
import ThoughtBubble from './ThoughtBubble';
import KnowledgeNodeCloud from './KnowledgeNodeCloud';
import { Message } from '@/lib/firestore-service';

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  onSendMessage: (content: string) => void;
}

export default function ChatWindow({ messages, loading, onSendMessage }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 space-y-12 no-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
            <Sparkles className="w-12 h-12 text-secondary" />
            <div className="space-y-2">
              <h3 className="font-headline text-3xl font-black text-white uppercase italic">Neural Nexus Active</h3>
              <p className="max-w-xs text-xs font-bold uppercase tracking-widest">Awaiting cognitive mission initialization...</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div 
            key={msg.id || idx} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}
          >
            <div className={`flex items-center gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                msg.role === 'user' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/10 border-secondary/20 text-secondary'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {msg.role === 'user' ? 'Scholar' : 'Neural Link'}
              </span>
            </div>

            <GlassPanel 
              className={`max-w-[85%] p-6 ${
                msg.role === 'user' 
                ? 'bg-slate-800/20 border-white/5 rounded-tr-none' 
                : 'bg-secondary/5 border-secondary/10 rounded-tl-none'
              }`}
            >
              <div className="prose prose-invert prose-sm max-w-none prose-headings:font-headline prose-headings:italic prose-headings:tracking-tight">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>

              {msg.role === 'assistant' && (
                <>
                  <ThoughtBubble thought={msg.thoughtProcess || ''} />
                  <KnowledgeNodeCloud nodes={msg.nodesExtracted || []} />
                  
                  {msg.metadata?.suggestions && msg.metadata.suggestions.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cognitive Vectors:</p>
                      <div className="flex flex-col gap-2">
                        {msg.metadata.suggestions.map((s, i) => (
                          <button 
                            key={i}
                            onClick={() => onSendMessage(s)}
                            className="text-left text-xs text-secondary hover:text-white transition-colors flex items-center gap-2 group"
                          >
                            <span className="w-1 h-1 rounded-full bg-secondary group-hover:scale-150 transition-transform" />
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </GlassPanel>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center gap-4 text-secondary animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Synthesizing High-Viscosity Model...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/50 to-primary/50 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject mission query or academic paradox..."
              className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-secondary/50 transition-all placeholder:text-slate-600 font-body"
              disabled={loading}
            />
          </div>
          <ScholarisButton 
            disabled={loading || !input.trim()}
            className="!rounded-2xl !px-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </ScholarisButton>
        </form>
      </div>
    </div>
  );
}
