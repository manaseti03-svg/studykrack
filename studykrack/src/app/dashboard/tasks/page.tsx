'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-hot-toast';

type Task = {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  user_id: string;
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('Synthesis');
  const [filter, setFilter] = useState('All');

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });

    if (error) toast.error('Failed to retrieve archive.');
    else setTasks(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        title: taskTitle, 
        category, 
        completed: false, 
        user_id: user.uid 
      }])
      .select();

    if (error) toast.error('Encryption failed.');
    else {
      setTasks([data[0], ...tasks]);
      setTaskTitle('');
      toast.success('Entry archived.');
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);

    if (error) toast.error('State sync failed.');
    else {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) toast.error('Removal failed.');
    else {
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Entry redacted.');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Completed') return t.completed;
    if (filter === 'Pending') return !t.completed;
    return true;
  });

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface uppercase">The Archive</h1>
          <p className="text-on-surface-variant font-medium text-lg">Synthesize your research goals into actionable fragments.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Completed'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === f ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-surface-container-highest/50 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Add Task Control Panel */}
      <section className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-slate-900/40">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">edit_note</span>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What knowledge are we seeking today?"
              className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-secondary/40 focus:ring-4 focus:ring-secondary/10 transition-all font-body"
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface-container-lowest/50 border border-white/10 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-secondary/40 transition-all font-headline font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            <option>Synthesis</option>
            <option>Research</option>
            <option>Revision</option>
            <option>Exam</option>
          </select>
          <button 
            type="submit"
            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold font-headline text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Archive Entry
          </button>
        </form>
      </section>

      {/* Task List Stage */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500 font-headline font-bold uppercase tracking-widest text-[10px]">Accessing Database...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-full glass-panel p-20 rounded-[2.5rem] text-center border-white/5 border-dashed border-2">
            <span className="material-symbols-outlined text-6xl text-outline mb-6">inventory_2</span>
            <p className="text-on-surface-variant font-headline text-xl">Archive is currently empty.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`glass-panel p-8 rounded-[2.5rem] border-white/5 group transition-all hover:translate-x-2 animate-scale-in origin-left ${task.completed ? 'opacity-50 grayscale' : 'hover:bg-white/5'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                  task.category === 'Synthesis' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                }`}>
                  {task.category}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="w-10 h-10 rounded-xl bg-surface-container-highest/50 flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">{task.completed ? 'undo' : 'check'}</span>
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="w-10 h-10 rounded-xl bg-surface-container-highest/50 flex items-center justify-center hover:bg-error/20 hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
              <h3 className={`text-xl font-headline font-bold text-on-surface leading-tight mb-4 ${task.completed ? 'line-through decoration-secondary' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-outline-variant uppercase tracking-widest">
                <span className="material-symbols-outlined text-xs">schedule</span>
                {task.completed ? 'Processed' : 'Sync Pending'}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
