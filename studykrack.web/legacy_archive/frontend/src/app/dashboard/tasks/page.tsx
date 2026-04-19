'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-hot-toast';
import GlassPanel from '@/components/ui/GlassPanel';
import ScholarisButton from '@/components/ui/ScholarisButton';
import Icon from '@/components/ui/Icon';

import StudyService, { TaskNode } from '@/services/studyService';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Research');

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const data = await StudyService.fetchTasks(user.uid);
      setTasks(data);
    } catch (err) {
      toast.error('Archive synchronization failed.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask || !user) return;

    try {
      await StudyService.upsertTask({
        user_id: user.uid,
        title: newTask,
        category,
        completed: false
      });
      setNewTask('');
      fetchTasks();
      toast.success('Unit Logged.');
    } catch (err) {
      toast.error('Archival failed.');
    }
  };

  const toggleTask = async (task: TaskNode) => {
    try {
      await StudyService.upsertTask({
        ...task,
        completed: !task.completed
      });
      fetchTasks();
      toast.success(!task.completed ? 'Refinement Verified.' : 'Status Reset.');
    } catch (err) {
      toast.error('Status override failed.');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await StudyService.deleteTask(id);
      fetchTasks();
      toast.success('Unit Redacted.');
    } catch (err) {
      toast.error('De-serialization failed.');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-black tracking-tight text-white uppercase italic">Research Archive</h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.4em]">High-Viscosity Task Synthesis</p>
        </div>
        <div className="glass-panel px-8 py-3 rounded-full border-white/5 flex items-center gap-4">
           <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#44d8f1]"></div>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest uppercase italic">Archive Synced</span>
        </div>
      </header>

      {/* Entry Logger */}
      <GlassPanel className="p-8 group hover:bg-slate-900/60" hoverable={false} animate={false}>
        <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-12 lg:col-span-7 relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              <Icon name="history_edu" className="text-xl" />
            </span>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Initialize new research unit..."
              className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body"
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="md:col-span-6 lg:col-span-3 bg-surface-container-lowest/30 border border-white/5 rounded-2xl px-6 py-4 text-on-surface outline-none focus:border-primary/30 transition-all font-body text-xs font-bold uppercase tracking-widest"
          >
            {['Research', 'Academics', 'System', 'Focus'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ScholarisButton type="submit" variant="primary" className="md:col-span-6 lg:col-span-2">
            Log
          </ScholarisButton>
        </form>
      </GlassPanel>

      {/* Numerical Listing */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-24 text-center">
             <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tasks.length === 0 ? (
          <GlassPanel className="p-20 text-center border-dashed border-2 border-white/5 bg-transparent" hoverable={false}>
            <p className="text-on-surface-variant font-headline text-xl italic opacity-50 uppercase tracking-widest">No terminal entries found.</p>
          </GlassPanel>
        ) : (
          tasks.map((task, i) => (
            <GlassPanel key={task.id} className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 group border-white/5">
              <div className="flex items-center gap-8 w-full md:w-auto">
                <div 
                  onClick={() => toggleTask(task)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    task.completed 
                      ? 'bg-secondary/20 shadow-inner' 
                      : 'bg-surface-container-highest/50 border border-white/5 hover:border-secondary'
                  }`}
                >
                  <Icon 
                    name={task.completed ? 'verified' : 'circle'} 
                    className={`text-2xl ${task.completed ? 'text-secondary' : 'text-slate-600'}`} 
                  />
                </div>
                <div className="space-y-1">
                  <h3 className={`text-2xl font-headline font-bold transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{task.category}</span>
                     <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                <ScholarisButton 
                  onClick={() => task.id && deleteTask(task.id)}
                  variant="error"
                  className="w-12 h-12 !p-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon name="delete_sweep" />
                </ScholarisButton>
              </div>
            </GlassPanel>
          ))
        )}
      </div>
    </div>
  );
}
