'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

type GradePoint = {
  subject: string;
  percentage: number;
  score: number;
  total: number;
};

type ScoreTrendChartProps = {
  data: GradePoint[];
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: GradePoint }[]; label?: string }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-100">
        <p className="font-semibold text-slate-800 text-sm">{label}</p>
        <p className="text-indigo-600 text-sm font-medium">{item.percentage.toFixed(1)}%</p>
        <p className="text-slate-400 text-xs">{item.score} / {item.total} pts</p>
      </div>
    );
  }
  return null;
};

export default function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No grade data yet. Add grades in Academics to see trends.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="subject"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="percentage"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#scoreGradient)"
          dot={{ fill: '#6366f1', strokeWidth: 2, stroke: '#fff', r: 4 }}
          activeDot={{ fill: '#6366f1', strokeWidth: 2, stroke: '#fff', r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
