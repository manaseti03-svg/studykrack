'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

type Task = {
  id: string;
  title: string;
  category?: string;
};

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    toast.success('Focus session complete! Great job!');
    
    if (user) {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, category')
        .eq('user_id', user.uid)
        .eq('completed', false)
        .limit(3);
        
      if (!error && data) {
        setSuggestedTasks(data);
      }
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setSuggestedTasks([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 w-full text-center relative overflow-hidden">
        {/* Background visual flair */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2 relative z-10">Focus Mode</h1>
        <p className="text-slate-500 mb-12 relative z-10">Stay productive with the Pomodoro technique</p>
        
        <div className="text-8xl font-black text-indigo-600 mb-12 tabular-nums tracking-tight relative z-10">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex items-center justify-center gap-6 relative z-10">
          <button 
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
              isActive 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-6 h-6" /> Pause
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" /> Start Focus
              </>
            )}
          </button>
          
          <button 
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Suggestions Section */}
      {suggestedTasks.length > 0 && (
        <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-700">Up Next: Incomplete Tasks</h3>
          </div>
          <div className="grid gap-3">
            {suggestedTasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition">
                <span className="font-medium text-slate-700">{task.title}</span>
                {task.category && (
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                    {task.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
