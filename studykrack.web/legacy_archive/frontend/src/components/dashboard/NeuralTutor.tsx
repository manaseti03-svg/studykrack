'use client';

import React, { useState, useEffect, useRef } from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import { Send, Zap, Trash2, Bot, User, Sparkles, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chatWithNeuralTutor } from '@/app/actions/ai-tutor';
import StudyService, { AcademicRecord } from '@/services/studyService';
import { useAuth } from '@/providers/AuthProvider';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function NeuralTutor() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [gradeRecords, setGradeRecords] = useState<AcademicRecord[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  useEffect(() => {
    if (user?.uid) {
      StudyService.fetchGrades(user.uid).then(setGradeRecords);
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input }]
    };

    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatWithNeuralTutor(currentInput);
      
      if (response.success && response.result) {
        let responseText = response.result.answer;
        
        // Add Source and Verified badge to the message text for rendering
        const sourceTag = `\n\n---\n**Source:** ${response.result.source} ${response.result.verified ? '✅ (Verified)' : ''}`;
        const resources = response.result.resources?.map((r: any) => `\n[🎥 ${r.name}](${r.url})`).join('') || '';
        
        const assistantMessage: ChatMessage = {
          role: 'model',
          parts: [{ text: responseText + sourceTag + resources }]
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || "Neural Link Interrupted.");
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: `⚠️ **Synthesis Error:** ${error.message || "Failed to connect to the Neural Network. Please ensure your Gemini API Key is configured."}` }]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <GlassPanel className="flex flex-col h-[600px] max-w-4xl mx-auto border-none shadow-2xl relative" hoverable={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-secondary/40 to-primary/40 rounded-xl shadow-[0_0_15px_rgba(68,216,241,0.2)]">
            <Bot className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Neural Tutor
            </h2>
            <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Scholaris 2.0 AI Synthesis</p>
          </div>
        </div>
        <button 
          onClick={clearHistory}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/30 hover:text-white/60 group"
          title="Clear memory"
        >
          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
            <div className="p-6 bg-white/5 rounded-full mb-4 animate-pulse">
              <Zap className="w-12 h-12 text-secondary" />
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed">
              I am your Socratic mentor. Ask a question about your subjects or academic progress.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-1 ring-white/10 ${
                msg.role === 'user' ? 'bg-primary/20' : 'bg-secondary/20'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white/80" /> : <Sparkles className="w-4 h-4 text-secondary" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-white/10 text-white/90 rounded-tr-none' 
                  : 'bg-white/5 border border-white/5 text-white/80 rounded-tl-none'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-secondary prose-strong:text-white prose-li:text-white/70">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.parts[0].text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[85%] animate-pulse">
              <div className="mt-1 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center ring-1 ring-white/10">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 italic flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce"></div>
                </div>
                Deep synthesizing...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500" />
          <div className="relative bg-black/40 rounded-2xl overflow-hidden backdrop-blur-xl border border-white/5 ring-1 ring-white/5 focus-within:ring-secondary/40 transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask the Scholaris Neural Tutor..."
              className="w-full bg-transparent p-4 pr-16 text-sm text-white/90 placeholder:text-white/30 resize-none outline-none min-h-[56px] max-h-32"
              rows={1}
            />
            <button
              onClick={toggleRecording}
              className={`absolute right-14 bottom-3 p-2 rounded-xl transition-all duration-300 ${
                isRecording 
                ? 'bg-red-500/20 text-red-500 animate-pulse ring-2 ring-red-500/50' 
                : 'text-white/30 hover:bg-white/5 hover:text-white/60'
              }`}
              title={isRecording ? "Listening..." : "Voice input"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-300 ${
                input.trim() && !loading 
                ? 'bg-secondary text-[#0a1120] shadow-[0_0_15px_rgba(68,216,241,0.5)] scale-100 hover:scale-110 active:scale-95' 
                : 'bg-white/5 text-white/20 scale-90 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 px-1">
          <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Zap className="w-2.5 h-2.5 text-secondary" />
            Gemini 1.5 Flash Enabled
          </p>
          <p className="text-[10px] text-white/30 font-medium">Shift + Enter for new line</p>
        </div>
      </div>
    </GlassPanel>
  );
}
