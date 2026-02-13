'use client';

export interface NextStep {
  label: string;
  value: string;
  persona?: string;
}

interface NextStepsProps {
  steps: NextStep[];
  onSelect: (value: string) => void;
}

const STEP_ICONS: Record<string, string> = {
  security: '🛡️',
  audit: '🛡️',
  gas: '⛽',
  optimize: '⚡',
  performance: '⚡',
  frontend: '🖥️',
  webapp: '🌐',
  test: '🧪',
  deploy: '🚀',
  enhance: '✨',
  feature: '💡',
  default: '→',
};

function getIcon(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, icon] of Object.entries(STEP_ICONS)) {
    if (key !== 'default' && lower.includes(key)) return icon;
  }
  return STEP_ICONS.default;
}

export function NextSteps({ steps, onSelect }: NextStepsProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">🗺️</span>
        <span className="text-xs font-medium text-text-secondary">Next Steps</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(step.value)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-void-black/30 hover:bg-near-green/10 hover:border-near-green/30 transition-all text-sm group"
          >
            <span className="text-base">{getIcon(step.label)}</span>
            <span className="text-text-secondary group-hover:text-near-green transition-colors whitespace-nowrap">
              {step.label}
            </span>
            {step.persona && (
              <span className="text-[10px] text-text-muted bg-white/[0.05] px-1.5 py-0.5 rounded">
                {step.persona}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
