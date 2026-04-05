'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-hot-toast';

type GradeRecord = {
  id: string;
  subject: string;
  score: number;
  total: number;
  created_at: string;
};

export default function AcademicsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('');

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('grade_records')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });

    if (error) toast.error('Ledger access denied.');
    else setRecords(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !score || !total || !user) return;

    const { data, error } = await supabase
      .from('grade_records')
      .insert([{
        subject,
        score: Number(score),
        total: Number(total),
        user_id: user.uid
      }])
      .select();

    if (error) toast.error('Audit failed.');
    else {
      setRecords([data[0], ...records]);
      setSubject('');
      setScore('');
      setTotal('');
      toast.success('Result authenticated.');
    }
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase.from('grade_records').delete().eq('id', id);
    if (error) toast.error('De-serialization failed.');
    else {
      setRecords(records.filter(r => r.id !== id));
      toast.success('Record redacted.');
    }
  };

  const calculateGPA = () => {
    if (records.length === 0) return '0.00';
    const totalPercentage = records.reduce((acc, r) => acc + (r.score / r.total), 0);
    return ((totalPercentage / records.length) * 10).toFixed(2);
  };

  const gpa = calculateGPA();
  const totalScoreValue = records.reduce((acc, r) => acc + r.score, 0);

  return (
    <div className="space-y-12 animate-fade-in text-on-surface">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface uppercase">The Ledger</h1>
          <p className="text-on-surface-variant font-medium text-lg">Statistical quantification of your academic trajectory.</p>
        </div>
        <div className="glass-panel px-8 py-3 rounded-full border-white/5 flex items-center gap-4">
           <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#44d8f1]"></div>
           <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-indigo-300">Live Analytics</span>
        </div>
      </header>

      {/* Analytical Overview Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 flex flex-col items-center text-center gap-4 hover:shadow-2xl transition-all">
           <div className="relative w-32 h-32">
             <svg className="w-full h-full -rotate-90">
               <circle className="text-surface-container-highest" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
               <circle className="text-secondary" cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * (Number(gpa)/10))} strokeWidth="8" strokeLinecap="round"></circle>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-headline font-black text-white">{gpa}</span>
               <span className="text-[8px] font-bold text-slate-500 uppercase">Scale 10.0</span>
             </div>
           </div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">Cumulative GPA</h3>
        </div>

        <div className="md:col-span-2 glass-panel p-10 rounded-[2.5rem] border-white/5 flex flex-col justify-between hover:bg-white/5 transition-all">
           <div>
             <h3 className="text-2xl font-headline font-bold text-white mb-2">Total Credit Score</h3>
             <p className="text-on-surface-variant text-sm">Aggregated raw score across all verified records.</p>
           </div>
           <div className="flex items-end gap-2 mt-8">
             <span className="text-6xl font-headline font-black text-secondary leading-none">{totalScoreValue}</span>
             <span className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-2">Units</span>
           </div>
        </div>
      </section>

      {/* Logging Agency */}
      <section className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-slate-900/40">
        <form onSubmit={addRecord} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">history_edu</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject / Domain"
              className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 transition-all font-body"
            />
          </div>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Score"
            className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 transition-all font-body text-center"
          />
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Max"
            className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-2xl py-4 px-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 transition-all font-body text-center"
          />
          <button 
            type="submit"
            className="md:col-span-4 py-4 bg-gradient-to-r from-primary-container to-secondary-container text-white rounded-2xl font-bold font-headline text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/10"
          >
            Authenticate Result
          </button>
        </form>
      </section>

      {/* Numerical Archive */}
      <section className="space-y-6">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="glass-panel p-20 rounded-[2.5rem] text-center border-white/5 border-dashed border-2">
            <p className="text-on-surface-variant font-headline text-xl">No audit trails found.</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record.id} className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-all">
              <div className="flex items-center gap-8 w-full md:w-auto mb-6 md:mb-0">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-headline font-bold text-2xl">
                  {Math.round((record.score/record.total)*100)}%
                </div>
                <div>
                  <h4 className="text-2xl font-headline font-bold text-white">{record.subject}</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Score Allocation</div>
                  <div className="text-2xl font-headline font-black text-white">{record.score} <span className="text-slate-600 text-lg">/</span> {record.total}</div>
                </div>
                <button 
                  onClick={() => deleteRecord(record.id)}
                  className="w-12 h-12 rounded-2xl bg-surface-container-highest/50 flex items-center justify-center text-outline hover:bg-error/20 hover:text-error transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined">delete_sweep</span>
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
