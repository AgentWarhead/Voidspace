import { Layers, Activity, DollarSign, Target } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface CategoryStatsProps {
  totalProjects: number;
  activeProjects: number;
  totalTVL: number;
  gapScore: number;
}

export function CategoryStats({ totalProjects, activeProjects, totalTVL, gapScore }: CategoryStatsProps) {
  const stats = [
    { label: 'Total Projects', value: formatNumber(totalProjects), icon: Layers },
    { label: 'Active Projects', value: formatNumber(activeProjects), icon: Activity },
    { label: 'Combined TVL', value: formatCurrency(totalTVL), icon: DollarSign },
    { label: 'Gap Score', value: String(gapScore), icon: Target },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-near-green/10">
                <Icon className="w-4 h-4 text-near-green" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{stat.label}</p>
                <p className="text-lg font-bold text-text-primary">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
