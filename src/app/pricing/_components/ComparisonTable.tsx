'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
import { GradientText } from '@/components/effects/GradientText';

type CellValue = boolean | string;

interface ComparisonRow {
  feature: string;
  shade: CellValue;
  specter: CellValue;
  legion: CellValue;
  leviathan: CellValue;
}

const rows: ComparisonRow[] = [
  { feature: 'AI Model', shade: 'Sonnet 4.6', specter: 'Sonnet 4.6 + Opus 4.6', legion: 'Sonnet 4.6 + Opus 4.6', leviathan: 'Sonnet 4.6 + Opus 4.6' },
  { feature: 'Monthly Credits', shade: '$2.50 once', specter: '$25/mo', legion: '$70/mo', leviathan: '$230/mo' },
  { feature: 'Active Projects', shade: '1', specter: '3', legion: 'Unlimited', leviathan: 'Unlimited' },
  { feature: 'Project Export', shade: false, specter: true, legion: true, leviathan: true },
  { feature: 'Roast Zone (Auditing)', shade: false, specter: true, legion: true, leviathan: true },
  { feature: 'Cloud Conversation History', shade: false, specter: true, legion: true, leviathan: true },
  { feature: 'Pair Programming', shade: false, specter: false, legion: false, leviathan: true },
  { feature: '66 Education Modules', shade: true, specter: true, legion: true, leviathan: true },
  { feature: 'Intelligence Tools', shade: true, specter: true, legion: true, leviathan: true },
  { feature: 'Top-Up Credits', shade: true, specter: true, legion: true, leviathan: true },
];

const tiers = [
  { key: 'shade', name: 'Shade', color: '#666666', price: 'Free' },
  { key: 'specter', name: 'Specter', color: '#00EC97', price: '$25/mo' },
  { key: 'legion', name: 'Legion', color: '#00D4FF', price: '$60/mo' },
  { key: 'leviathan', name: 'Leviathan', color: '#9D4EDD', price: '$200/mo' },
];

function Cell({ value, color }: { value: CellValue; color: string }) {
  if (typeof value === 'string') {
    return <span className="text-sm text-text-secondary">{value}</span>;
  }
  if (value === true) {
    return <Check className="w-4 h-4 mx-auto" style={{ color }} />;
  }
  return <Minus className="w-4 h-4 mx-auto text-white/10" />;
}

export function ComparisonTable() {
  return (
    <motion.div
      className="mt-0 mb-16 sm:mb-24"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-lg sm:text-xl font-bold text-center mb-2">
        Compare <GradientText as="span">every feature</GradientText>
      </h3>
      <p className="text-center text-text-muted text-sm mb-6 sm:mb-8">
        No hidden limits. What you see is what you get.
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm text-text-muted font-medium w-[220px]">Feature</th>
              {tiers.map((t) => (
                <th key={t.key} className="text-center py-3 px-4 min-w-[140px]">
                  <span className="text-sm font-bold" style={{ color: t.color }}>{t.name}</span>
                  <div className="text-xs text-text-muted mt-0.5">{t.price}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.feature} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                <td className="py-3 px-4 text-sm text-text-secondary">{row.feature}</td>
                {tiers.map((t) => (
                  <td key={t.key} className="py-3 px-4 text-center">
                    <Cell value={row[t.key as keyof ComparisonRow] as CellValue} color={t.color} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: simplified card view */}
      <div className="md:hidden space-y-2">
        {rows.map((row) => (
          <div key={row.feature} className="bg-surface border border-border rounded-lg px-4 py-3">
            <p className="text-sm font-medium mb-2">{row.feature}</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {tiers.map((t) => (
                <div key={t.key}>
                  <div className="text-[10px] font-medium mb-1" style={{ color: t.color }}>{t.name}</div>
                  <Cell value={row[t.key as keyof ComparisonRow] as CellValue} color={t.color} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
