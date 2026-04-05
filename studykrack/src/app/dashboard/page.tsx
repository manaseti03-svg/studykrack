'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { CheckSquare, GraduationCap, TrendingUp, BarChart3 } from 'lucide-react';
import ScoreTrendChart from '@/components/charts/ScoreTrendChart';
import TaskPieChart from '@/components/charts/TaskPieChart';

type GradePoint = {
  subject: string;
  percentage: number;
  score: number;
  total: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [avgScore, setAvgScore] = useState<string>('—');
  const [gradeData, setGradeData] = useState<GradePoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [{ data: tasks }, { data: grades }] = await Promise.all([
      supabase.from('tasks').select('completed').eq('user_id', user.uid),
      supabase.from('grade_records').select('subject, score, total, created_at').eq('user_id', user.uid).order('created_at', { ascending: true }),
    ]);

    if (tasks) {
      setTotalTasks(tasks.length);
      setCompletedTasks(tasks.filter(t => t.completed).length);
    }

    if (grades && grades.length > 0) {
      const totalScore = grades.reduce((acc, g) => acc + g.score, 0);
      const totalMax = grades.reduce((acc, g) => acc + g.total, 0);
      setAvgScore(totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) + '%' : '—');

      setGradeData(
        grades.map(g => ({
          subject: g.subject,
          percentage: g.total > 0 ? (g.score / g.total) * 100 : 0,
          score: g.score,
          total: g.total,
        }))
      );
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const completionRate = totalTasks > 0
    ? ((completedTasks / totalTasks) * 100).toFixed(0) + '%'
    : '0%';

  const pendingTasks = totalTasks - completedTasks;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        Welcome back, {user?.displayName || user?.email?.split('@')[0]} 👋
      </h1>
      <p className="text-slate-500 mb-8">Here&apos;s your study progress at a glance.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-slate-500 font-medium">Total Tasks</h3>
          </div>
          <p className="text-4xl font-bold text-slate-800">{loading ? '...' : totalTasks}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-slate-500 font-medium">Completion Rate</h3>
          </div>
          <p className="text-4xl font-bold text-emerald-600">{loading ? '...' : completionRate}</p>
          <p className="text-sm text-slate-400 mt-1">{completedTasks} of {totalTasks} done</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <GraduationCap className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-slate-500 font-medium">Academic Average</h3>
          </div>
          <p className="text-4xl font-bold text-violet-600">{loading ? '...' : avgScore}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Trend — takes 2 cols */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Grade Trend</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
          ) : (
            <ScoreTrendChart data={gradeData} />
          )}
        </div>

        {/* Task Breakdown — 1 col */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Task Breakdown</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-48 text-slate-400">Loading...</div>
          ) : (
            <TaskPieChart completed={completedTasks} pending={pendingTasks} />
          )}
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/tasks" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">Task Manager</h3>
          </div>
          <p className="text-slate-500 text-sm">Add, complete, and track your study tasks.</p>
          <span className="text-indigo-600 text-sm font-medium mt-3 inline-block group-hover:underline">Go to Tasks →</span>
        </Link>

        <Link href="/dashboard/academics" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-violet-200 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-6 h-6 text-violet-600" />
            <h3 className="text-lg font-bold text-slate-800">Academic Tracker</h3>
          </div>
          <p className="text-slate-500 text-sm">Log grades and monitor your academic performance.</p>
          <span className="text-violet-600 text-sm font-medium mt-3 inline-block group-hover:underline">Go to Academics →</span>
        </Link>
      </div>
    </div>
  );
}
