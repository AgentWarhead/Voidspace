'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CategoryWithStats } from '@/types';

interface GitHubActivityChartProps {
  categories: CategoryWithStats[];
  githubStarsByCategory: { name: string; stars: number }[];
}

export function GitHubActivityChart({ githubStarsByCategory }: GitHubActivityChartProps) {
  const data = githubStarsByCategory.slice(0, 10);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted text-sm">
        No GitHub data available yet. Run a sync to populate.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#666', fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fill: '#666', fontSize: 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((value: any) => [Number(value ?? 0).toLocaleString(), 'Stars']) as any}
        />
        <Bar dataKey="stars" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={index === 0 ? '#00EC97' : 'rgba(0,236,151,0.4)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
