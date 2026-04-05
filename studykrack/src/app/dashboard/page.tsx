'use client';

import { useAuth } from '@/providers/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Welcome, {user?.email?.split('@')[0]} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium mb-2">Total Tasks</h3>
          <p className="text-4xl font-bold text-slate-800">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium mb-2">Completed Tasks</h3>
          <p className="text-4xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-slate-500 font-medium mb-2">Completion Rate</h3>
          <p className="text-4xl font-bold text-emerald-600">0%</p>
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-4">Getting Started</h3>
        <p className="text-slate-600 mb-4">Welcome to your MVP dashboard. Since this is a hackathon build, you can navigate to Tasks and Academics from the sidebar to test out the features! Connect Supabase to see real data persistence.</p>
      </div>
    </div>
  );
}
