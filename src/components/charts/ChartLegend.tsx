interface LegendItem {
  type: 'gradient' | 'ring' | 'text';
  label: string;
  color?: string;
  gradient?: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 text-xs font-mono">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {item.type === 'gradient' ? (
            <div
              className="w-16 h-2.5 rounded-full shrink-0"
              style={{ background: item.gradient }}
            />
          ) : item.type === 'ring' ? (
            <span
              className="w-3 h-3 rounded-full border border-dashed shrink-0"
              style={{ borderColor: item.color }}
            />
          ) : null}
          <span className="text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
