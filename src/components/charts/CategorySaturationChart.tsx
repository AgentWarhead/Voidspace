'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CategoryWithStats } from '@/types';

interface CategorySaturationChartProps {
  categories: CategoryWithStats[];
}

function getBarColor(gapScore: number): string {
  if (gapScore >= 67) return '#00EC97';
  if (gapScore >= 34) return '#FFA502';
  return '#FF4757';
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { name: string; projects: number; gapScore: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
      <p className="font-medium text-text-primary text-sm">{data.name}</p>
      <p className="text-xs text-text-muted mt-1">
        Projects: <span className="text-text-primary">{data.projects}</span>
      </p>
      <p className="text-xs text-text-muted">
        Gap Score: <span style={{ color: getBarColor(data.gapScore) }}>{data.gapScore}</span>
      </p>
    </div>
  );
}

export function CategorySaturationChart({ categories }: CategorySaturationChartProps) {
  const data = categories.map((c) => ({
    name: c.name.replace(' & ', '\n& '),
    projects: c.projectCount,
    gapScore: c.gapScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#aaaaaa', fontSize: 11 }}
          axisLine={{ stroke: '#222222' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#aaaaaa', fontSize: 11 }}
          axisLine={{ stroke: '#222222' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="projects" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.gapScore)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
