'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-hot-toast';
import GlassPanel from '@/components/ui/GlassPanel';
import ScholarisButton from '@/components/ui/ScholarisButton';
import Icon from '@/components/ui/Icon';
import StatsTracker from '@/components/dashboard/StatsTracker';

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
    <div className="space-y-12 animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-black tracking-tight text-white uppercase italic">The Ledger</h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-[0.4em]">Integrated Academic Analytics</p>
        </div>
        <div className="glass-panel px-8 py-3 rounded-full border-white/5 flex items-center gap-4">
           <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#44d8f1]"></div>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest uppercase italic">Live Ledger</span>
        </div>
      </header>

      {/* Analytical Bento Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GlassPanel className="p-10 flex flex-col items-center justify-center text-center">
           <StatsTracker 
             label="Cumulative GPA"
             value={gpa}
             subtext="/ 10.0"
             progress={Number(gpa) / 10}
             size="lg"
           />
        </GlassPanel>

        <GlassPanel className="md:col-span-2 p-10 flex flex-col justify-between" hoverable={true}>
           <div>
             <h3 className="text-2xl font-headline font-bold text-white mb-2 uppercase tracking-tighter italic">Aggregated Credit Score</h3>
             <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest opacity-60">Verified Records Units</p>
           </div>
           <div className="flex items-end gap-2 mt-8">
             <span className="text-8xl font-headline font-black text-secondary leading-none">{totalScoreValue}</span>
             <span className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-4">Units</span>
           </div>
           <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full" />
        </GlassPanel>
      </section>

      {/* Logging Agency */}
      <GlassPanel className="p-8 group hover:bg-slate-900/60" hoverable={false} animate={false}>
        <form onSubmit={addRecord} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              <Icon name="history_edu" className="text-xl" />
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject / Domain"
              className="w-full bg-surface-container-lowest/30 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-on-surface placeholder:text-outline outline-none focus:border-primary/40 focus:bg-white/5 transition-all font-body"
            />
          </div>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Score"
            className="bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 text-on-surface outline-none focus:border-primary/30 transition-all font-body text-center font-bold"
          />
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Max"
            className="bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 text-on-surface outline-none focus:border-primary/30 transition-all font-body text-center font-bold"
          />
          <ScholarisButton type="submit" variant="primary" className="md:col-span-4 italic">
            Log Entry
          </ScholarisButton>
        </form>
      </GlassPanel>

      {/* Numerical Archive */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-24 text-center">
             <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : records.length === 0 ? (
          <GlassPanel className="p-20 text-center border-dashed border-2 border-white/5 bg-transparent" hoverable={false}>
            <p className="text-on-surface-variant font-headline text-xl italic opacity-50 uppercase tracking-widest">No audit units found.</p>
          </GlassPanel>
        ) : (
          records.map((record) => (
            <GlassPanel key={record.id} className="flex flex-col md:flex-row justify-between items-center p-10 group border-white/5">
              <div className="flex items-center gap-10 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-headline font-black text-2xl animate-breathing">
                  {Math.round((record.score/record.total)*100)}%
                </div>
                <div>
                  <h4 className="text-2xl font-headline font-bold text-white uppercase italic">{record.subject}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">{new Date(record.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 opacity-60">Audit Trail</div>
                  <div className="text-2xl font-headline font-black text-white">{record.score} <span className="text-slate-600 text-lg">/</span> {record.total}</div>
                </div>
                <ScholarisButton 
                  onClick={() => deleteRecord(record.id)}
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
