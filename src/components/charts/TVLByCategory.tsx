'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import type { CategoryWithStats } from '@/types';

interface TVLByCategoryProps {
  categories: CategoryWithStats[];
}

const COLORS = ['#00EC97', '#00D4FF', '#9D4EDD', '#FFA502', '#FF4757', '#3B82F6', '#F59E0B'];

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { name: string; value: number; tvl: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
      <p className="font-medium text-text-primary text-sm">{data.name}</p>
      <p className="text-xs text-text-muted mt-1">
        TVL: <span className="text-near-green">{formatCurrency(data.tvl)}</span>
      </p>
    </div>
  );
}

export function TVLByCategory({ categories }: TVLByCategoryProps) {
  const totalTVL = categories.reduce((sum, c) => sum + c.totalTVL, 0);

  const data = categories
    .filter((c) => c.totalTVL > 0)
    .map((c) => ({
      name: c.name,
      value: c.totalTVL,
      tvl: c.totalTVL,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-text-muted text-sm">
        No TVL data available
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs text-text-muted">Total TVL</p>
          <p className="text-lg font-bold text-text-primary">{formatCurrency(totalTVL)}</p>
        </div>
      </div>
    </div>
  );
}
