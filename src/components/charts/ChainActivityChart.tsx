'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChainStatsRecord } from '@/types';

interface ChainActivityChartProps {
  history: ChainStatsRecord[];
}

export function ChainActivityChart({ history }: ChainActivityChartProps) {
  if (history.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted text-sm">
        Not enough historical data yet. Chain stats are recorded each sync.
      </div>
    );
  }

  const data = history.map((record) => ({
    date: new Date(record.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    txns: record.total_transactions,
    accounts: record.total_accounts,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: '#666', fontSize: 10 }}
        />
        <YAxis
          tick={{ fill: '#666', fontSize: 10 }}
          tickFormatter={(v: number) => {
            if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
            if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
            if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
            return v.toString();
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
          /* eslint-disable @typescript-eslint/no-explicit-any */
          formatter={((value: any, name: any) => [
            Number(value ?? 0).toLocaleString(),
            name === 'txns' ? 'Transactions' : 'Accounts',
          ]) as any}
          /* eslint-enable @typescript-eslint/no-explicit-any */
        />
        <Line
          type="monotone"
          dataKey="txns"
          stroke="#00EC97"
          strokeWidth={2}
          dot={false}
          name="txns"
        />
        <Line
          type="monotone"
          dataKey="accounts"
          stroke="#00D4FF"
          strokeWidth={2}
          dot={false}
          name="accounts"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
