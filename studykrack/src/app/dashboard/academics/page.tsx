'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

type GradeRecord = {
  id: string;
  subject: string;
  score: number;
  total: number;
  user_id: string;
};

export default function AcademicsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('grade_records')
      .select('*')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false });
    if (!error && data) setRecords(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !score || !total || !user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('grade_records')
      .insert([{ subject, score: Number(score), total: Number(total), user_id: user.uid }])
      .select()
      .single();
    if (!error && data) setRecords([data, ...records]);
    setSubject('');
    setScore('');
    setTotal('');
    setSaving(false);
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase.from('grade_records').delete().eq('id', id);
    if (!error) setRecords(records.filter(r => r.id !== id));
  };

  const totalScore = records.reduce((acc, curr) => acc + curr.score, 0);
  const totalMax = records.reduce((acc, curr) => acc + curr.total, 0);
  const percentage = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(2) : 0;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Academic Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
          <h3 className="text-slate-500 font-medium mb-2">Overall Average</h3>
          <p className="text-5xl font-bold text-indigo-600">{percentage}%</p>
          <p className="text-sm text-slate-400 mt-2">{totalScore} / {totalMax} pts</p>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-4">Add Grade Record</h2>
          <form onSubmit={addRecord} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-xs text-slate-500 mb-1">Score</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={score}
                onChange={e => setScore(e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-xs text-slate-500 mb-1">Total</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={total}
                onChange={e => setTotal(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 h-[42px] flex items-center justify-center disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-4 font-medium text-slate-600">
          <div className="col-span-2">Subject</div>
          <div>Score</div>
          <div className="text-right">Action</div>
        </div>
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No grades added yet.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {records.map(record => (
              <li key={record.id} className="p-4 grid grid-cols-4 items-center hover:bg-slate-50 transition">
                <div className="col-span-2 font-medium text-slate-800">{record.subject}</div>
                <div className="text-slate-600">
                  {record.score} / {record.total}{' '}
                  <span className="text-sm text-slate-400 ml-2">({((record.score / record.total) * 100).toFixed(1)}%)</span>
                </div>
                <div className="text-right">
                  <button onClick={() => deleteRecord(record.id)} className="text-slate-400 hover:text-red-500 transition p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
