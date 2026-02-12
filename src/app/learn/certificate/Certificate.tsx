'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Lock,
  Share2,
  Copy,
  CheckCircle,
  Compass,
  Code2,
  Terminal,
  Flame,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GlowCard } from '@/components/effects/GlowCard';
import { GradientText } from '@/components/effects/GradientText';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Types & Config ───────────────────────────────────────── */

interface TrackCert {
  id: string;
  track: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  moduleCount: number;
  xpTotal: number;
  requiredModules: string[];
  gradient: string;
}

const STORAGE_KEY = 'voidspace-skill-progress';
const CERT_NAME_KEY = 'voidspace-cert-name';

// Module IDs for each track — must match SkillConstellation
const EXPLORER_MODULES = [
  'near-basics', 'wallet-setup', 'first-transaction', 'ecosystem-tour',
  'near-overview', 'key-technologies', 'defi-basics', 'governance',
  'community-nav', 'data-tools', 'explorer-capstone',
];

const BUILDER_MODULES = [
  'rust-fundamentals', 'smart-contracts-101', 'testing-basics',
  'build-token', 'build-dapp', 'nft-contracts', 'storage-patterns',
  'upgradeable-contracts', 'near-cli', 'frontend-integration', 'builder-capstone',
];

const HACKER_MODULES = [
  'security-fundamentals', 'advanced-rust', 'cross-contract', 'indexer-dev',
  'chain-signatures', 'intents-protocol', 'ai-agents', 'gas-optimization',
  'audit-practice', 'hacker-capstone',
];

const FOUNDER_MODULES = [
  'market-research', 'pitch-deck', 'tokenomics',
  'grant-application', 'founder-capstone',
];

const TRACK_CERTS: TrackCert[] = [
  {
    id: 'explorer',
    track: 'Explorer',
    title: 'NEAR Certified Explorer',
    subtitle: 'You understand the NEAR ecosystem',
    description: 'Demonstrated comprehensive knowledge of the NEAR Protocol ecosystem including wallets, DeFi, governance, and on-chain data tools.',
    icon: Compass,
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30',
    moduleCount: 11,
    xpTotal: 550,
    requiredModules: EXPLORER_MODULES,
    gradient: 'from-accent-cyan to-blue-500',
  },
  {
    id: 'builder',
    track: 'Builder',
    title: 'NEAR Certified Builder',
    subtitle: 'You can build and deploy smart contracts',
    description: 'Demonstrated ability to build, test, and deploy Rust smart contracts on NEAR Protocol with frontend integration.',
    icon: Code2,
    color: 'text-near-green',
    bg: 'bg-near-green/10',
    border: 'border-near-green/30',
    moduleCount: 11,
    xpTotal: 1100,
    requiredModules: BUILDER_MODULES,
    gradient: 'from-near-green to-emerald-500',
  },
  {
    id: 'hacker',
    track: 'Hacker',
    title: 'NEAR Certified Hacker',
    subtitle: "You've mastered advanced NEAR development",
    description: 'Mastered advanced NEAR development including security auditing, cross-contract calls, Chain Signatures, and AI agent integration.',
    icon: Terminal,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    moduleCount: 10,
    xpTotal: 1500,
    requiredModules: HACKER_MODULES,
    gradient: 'from-purple-400 to-violet-500',
  },
  {
    id: 'founder',
    track: 'Founder',
    title: 'NEAR Certified Founder',
    subtitle: 'You know how to launch a NEAR project',
    description: 'Demonstrated ability to research, plan, pitch, and fund a NEAR ecosystem project from concept to grant application.',
    icon: Flame,
    color: 'text-accent-orange',
    bg: 'bg-accent-orange/10',
    border: 'border-accent-orange/30',
    moduleCount: 5,
    xpTotal: 500,
    requiredModules: FOUNDER_MODULES,
    gradient: 'from-accent-orange to-red-500',
  },
  {
    id: 'legend',
    track: 'Legend',
    title: 'NEAR Legend',
    subtitle: 'Complete mastery of all NEAR tracks',
    description: 'Achieved total mastery of the NEAR Protocol ecosystem by completing all Explorer, Builder, Hacker, and Founder tracks.',
    icon: Crown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    moduleCount: 37,
    xpTotal: 3650,
    requiredModules: [...EXPLORER_MODULES, ...BUILDER_MODULES, ...HACKER_MODULES, ...FOUNDER_MODULES],
    gradient: 'from-yellow-400 to-amber-500',
  },
];

function loadProgress(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return new Set(JSON.parse(data));
  } catch { /* ignore */ }
  return new Set();
}

function generateCertId(track: string, name: string): string {
  const raw = `${track}-${name}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `VS-${track.toUpperCase().slice(0, 3)}-${Math.abs(hash).toString(16).toUpperCase().slice(0, 8)}`;
}

/* ─── Certificate Card ─────────────────────────────────────── */

function CertificateCard({
  cert,
  isEarned,
  completedCount,
  userName,
}: {
  cert: TrackCert;
  isEarned: boolean;
  completedCount: number;
  userName: string;
}) {
  const [copied, setCopied] = useState(false);
  const Icon = cert.icon;
  const pct = Math.round((completedCount / cert.requiredModules.length) * 100);
  const certId = useMemo(() => isEarned ? generateCertId(cert.track, userName) : '', [isEarned, cert.track, userName]);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const shareText = `I earned the ${cert.title} certificate on @VoidSpaceNear! 🎉\n\nCompleted ${cert.moduleCount} modules and earned ${cert.xpTotal} XP.\n\nhttps://voidspace.io/learn/certificate`;

  const handleShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (!isEarned) {
    return (
      <Card variant="glass" padding="lg" className="relative overflow-hidden opacity-70">
        <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Lock className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm text-text-muted font-medium">{pct}% Complete</p>
            <p className="text-[10px] text-text-muted">{completedCount}/{cert.requiredModules.length} modules</p>
          </div>
        </div>
        <div className="space-y-4 blur-sm">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border', cert.bg, cert.border)}>
              <Icon className={cn('w-6 h-6', cert.color)} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{cert.title}</h3>
              <p className="text-xs text-text-muted">{cert.subtitle}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Certificate */}
        <div className={cn(
          'relative overflow-hidden rounded-xl border-2 p-8',
          cert.border,
          cert.id === 'legend' ? 'bg-gradient-to-br from-yellow-400/5 to-amber-500/5' : 'bg-surface/80'
        )}>
          {/* Decorative corner elements */}
          <div className={cn('absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-xl', cert.border)} />
          <div className={cn('absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 rounded-tr-xl', cert.border)} />
          <div className={cn('absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 rounded-bl-xl', cert.border)} />
          <div className={cn('absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-xl', cert.border)} />

          <div className="relative z-10 text-center space-y-4">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">Voidspace · NEAR Protocol</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                <GradientText>{cert.title}</GradientText>
              </h2>
              <p className={cn('text-sm', cert.color)}>{cert.subtitle}</p>
            </div>

            {/* Icon */}
            <motion.div
              className={cn('w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2', cert.bg, cert.border)}
              animate={cert.id === 'legend' ? {
                boxShadow: ['0 0 20px rgba(250,204,21,0.2)', '0 0 40px rgba(250,204,21,0.4)', '0 0 20px rgba(250,204,21,0.2)'],
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Icon className={cn('w-8 h-8', cert.color)} />
            </motion.div>

            {/* Recipient */}
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Awarded to</p>
              <p className="text-lg font-bold text-text-primary">{userName || 'NEAR Builder'}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary max-w-md mx-auto">{cert.description}</p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className={cn('text-xl font-bold font-mono', cert.color)}>{cert.moduleCount}</p>
                <p className="text-[10px] text-text-muted uppercase">Modules</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className={cn('text-xl font-bold font-mono', cert.color)}>{cert.xpTotal}</p>
                <p className="text-[10px] text-text-muted uppercase">XP Earned</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-sm font-medium text-text-primary">{today}</p>
                <p className="text-[10px] text-text-muted uppercase">Completed</p>
              </div>
            </div>

            {/* Certificate ID */}
            <p className="text-[10px] font-mono text-text-muted/50">Certificate ID: {certId}</p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/20 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" /> Share on X
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-border text-text-muted text-sm font-medium hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-near-green" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function Certificate() {
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setCompletedNodes(loadProgress());
    try {
      const saved = localStorage.getItem(CERT_NAME_KEY);
      if (saved) setUserName(saved);
    } catch { /* ignore */ }
  }, []);

  const handleNameChange = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem(CERT_NAME_KEY, name);
    } catch { /* ignore */ }
  };

  const earnedCount = TRACK_CERTS.filter(cert =>
    cert.requiredModules.every(m => completedNodes.has(m))
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          <GradientText>NEAR Certificates</GradientText>
        </h1>
        <p className="text-text-secondary text-sm">
          Complete a learning track to earn a shareable certificate. {earnedCount > 0 ? `You've earned ${earnedCount}!` : 'Start learning to unlock yours.'}
        </p>
      </div>

      {/* Name input */}
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-3">
          <label className="text-sm text-text-muted whitespace-nowrap">Your name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter your name or wallet address"
            className="flex-1 bg-surface/60 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-near-green/50"
          />
        </div>
      </Card>

      {/* Certificates */}
      <div className="space-y-6">
        {TRACK_CERTS.map((cert) => {
          const completedCount_local = cert.requiredModules.filter(m => completedNodes.has(m)).length;
          const isEarned = cert.requiredModules.every(m => completedNodes.has(m));

          return (
            <ScrollReveal key={cert.id}>
              <CertificateCard
                cert={cert}
                isEarned={isEarned}
                completedCount={completedCount_local}
                userName={userName}
              />
            </ScrollReveal>
          );
        })}
      </div>

      {/* Back to learning */}
      <div className="text-center">
        <Link href="/profile/skills">
          <Button variant="secondary" size="md" className="group">
            View Skill Constellation <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
