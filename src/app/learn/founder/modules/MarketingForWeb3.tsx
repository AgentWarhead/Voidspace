'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Megaphone,
  Users,
  FileText,
  Star,
  Gift,
  Palette,
  Shield,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface MarketingForWeb3Props {
  isActive: boolean;
  onToggle?: () => void;
}

const channels = [
  { name: 'Twitter/X', roi: 'High', effort: 'Medium', best: 'Narrative building, thought leadership', color: 'text-blue-400' },
  { name: 'Discord', roi: 'High', effort: 'High', best: 'Community depth, power users, governance', color: 'text-indigo-400' },
  { name: 'Telegram', roi: 'Medium', effort: 'Low', best: 'Announcements, quick updates, regional groups', color: 'text-cyan-400' },
  { name: 'YouTube', roi: 'High', effort: 'High', best: 'Education, tutorials, long-form content', color: 'text-red-400' },
  { name: 'Podcasts', roi: 'Medium', effort: 'Medium', best: 'Founder credibility, deep dives', color: 'text-purple-400' },
  { name: 'Paid Ads', roi: 'Low', effort: 'High', best: 'Retargeting only, broad awareness is wasteful', color: 'text-amber-400' },
  { name: 'KOL Deals', roi: 'Variable', effort: 'Medium', best: 'Token launches, major announcements', color: 'text-emerald-400' },
  { name: 'Quests (Galxe)', roi: 'Medium', effort: 'Low', best: 'User onboarding, testnet participation', color: 'text-pink-400' },
];

function ChannelGrid() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {channels.map((ch, i) => (
          <motion.div
            key={ch.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className={cn(
              'cursor-pointer border rounded-lg p-3 text-center transition-all',
              selected === i
                ? 'border-near-green/50 bg-near-green/5'
                : 'border-border hover:border-near-green/30 bg-black/20'
            )}
          >
            <span className={cn('text-sm font-semibold', ch.color)}>{ch.name}</span>
            <div className="flex justify-center gap-2 mt-1">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                ch.roi === 'High' ? 'bg-emerald-500/20 text-emerald-300'
                  : ch.roi === 'Medium' ? 'bg-amber-500/20 text-amber-300'
                    : ch.roi === 'Low' ? 'bg-red-500/20 text-red-300'
                      : 'bg-purple-500/20 text-purple-300'
              )}>
                ROI: {ch.roi}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-near-green/30 rounded-lg p-4 bg-near-green/5">
              <div className="flex items-center justify-between mb-2">
                <span className={cn('font-semibold', channels[selected].color)}>{channels[selected].name}</span>
                <div className="flex gap-2">
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-muted">ROI: {channels[selected].roi}</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-muted">Effort: {channels[selected].effort}</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary">Best for: {channels[selected].best}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-xs text-text-muted text-center">Click a channel to see ROI/effort analysis</p>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-near-green/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-text-muted" /></motion.div>
          </div>
          <p className="text-xs text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 2;
  const options = [
    'Ad platforms ban crypto content too aggressively',
    'Web3 users use ad blockers more than average',
    'Crypto-native users trust community signals over ads',
    'The cost per click is too high in crypto verticals',
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">Why do traditional paid ads often fail in Web3?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left p-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : revealed && i === selected && i !== correctAnswer
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : selected === i
                    ? 'border-near-green/50 bg-near-green/10 text-text-primary'
                    : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
            )}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'mt-4 p-3 rounded-lg border text-sm',
              selected === correctAnswer
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/5 text-amber-300'
            )}>
              {selected === correctAnswer ? (
                <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! Crypto-native users have been conditioned to distrust ads due to years of scams and rug pulls. They rely on community signals — what their trusted follows are talking about, what&apos;s being discussed in Discord, and what builders they respect are endorsing.</p>
              ) : (
                <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. While ad restrictions and costs are real issues, the fundamental problem is trust. Crypto-native users trust community signals — peer recommendations, builder endorsements, and organic discussion — far more than any advertisement.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MarketingForWeb3({ isActive, onToggle }: MarketingForWeb3Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['marketing-for-web3']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['marketing-for-web3'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Marketing for Web3</h3>
            <p className="text-text-muted text-sm">Build movements, not ad campaigns — Web3 marketing decoded</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 11 of 12</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20">Founder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-near-green/20 p-6 space-y-8">
          {/* The Big Idea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5"
          >
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Web3 marketing is more like politics than advertising — you&apos;re building a movement, not selling a product. 
              Your &quot;customers&quot; are voters who choose to support your vision with their capital, time, and reputation. 
              The best Web3 marketing doesn&apos;t feel like marketing at all — it feels like joining a cause.
            </p>
          </motion.div>

          {/* Interactive Channel Grid */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Channel Effectiveness Grid
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <ChannelGrid />
            </div>
          </div>

        </div>
      )}
    </Card>
  );
}
