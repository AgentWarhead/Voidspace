'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2, Wallet,
  Shield, Smartphone, Globe, Key, AlertTriangle,
  ExternalLink, Lock,
} from 'lucide-react';

// ─── Wallet Comparison ─────────────────────────────────────────────────────────

function WalletComparison() {
  const [activeWallet, setActiveWallet] = useState(0);

  const wallets = [
    {
      name: 'Meteor Wallet',
      emoji: '☄️',
      type: 'Browser Extension',
      difficulty: 'Easy',
      platforms: ['Chrome', 'Firefox', 'Brave'],
      pros: ['Sleek UI', 'Multi-account support', 'Built-in staking', 'NFT gallery'],
      cons: ['Desktop only'],
      url: 'https://meteorwallet.app',
      recommended: true,
      steps: [
        'Visit meteorwallet.app and install the extension',
        'Click "Create New Wallet"',
        'Choose a secure passphrase (12 words)',
        'Write down your seed phrase on paper — NEVER digitally',
        'Confirm your seed phrase',
        'Choose your account name (e.g., yourname.near)',
        'You\'re in! Your wallet is ready.',
      ],
    },
    {
      name: 'MyNearWallet',
      emoji: '🌐',
      type: 'Web-Based',
      difficulty: 'Easy',
      platforms: ['Any browser'],
      pros: ['No install needed', 'Works on any device', 'Simple interface', 'Ledger support'],
      cons: ['Less features than extensions'],
      url: 'https://app.mynearwallet.com',
      recommended: false,
      steps: [
        'Go to app.mynearwallet.com',
        'Click "Create Account"',
        'Choose your account name (yourname.near)',
        'Select email or seed phrase recovery',
        'Secure your recovery method',
        'Fund your account (optional for testnet)',
        'Done! Explore your dashboard.',
      ],
    },
    {
      name: 'HERE Wallet',
      emoji: '📱',
      type: 'Mobile App',
      difficulty: 'Easy',
      platforms: ['iOS', 'Android'],
      pros: ['Mobile-first', 'Built-in DEX', 'Staking', 'Hot storage score'],
      cons: ['Mobile only'],
      url: 'https://herewallet.app',
      recommended: false,
      steps: [
        'Download HERE Wallet from App Store / Play Store',
        'Open the app and tap "Create Wallet"',
        'Set up biometric auth (Face ID / Fingerprint)',
        'Write down your seed phrase securely',
        'Choose your NEAR account name',
        'Enable notifications for transaction alerts',
        'Start exploring NEAR from your phone!',
      ],
    },
  ];

  const active = wallets[activeWallet];

  return (
    <div className="space-y-6">
      {/* Wallet selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {wallets.map((w, i) => (
          <button
            key={w.name}
            onClick={() => setActiveWallet(i)}
            className={cn(
              'p-4 rounded-xl border text-left transition-all',
              activeWallet === i
                ? 'bg-gradient-to-br from-amber-500/15 to-orange-500/15 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{w.emoji}</span>
              <span className={cn('font-bold text-sm', activeWallet === i ? 'text-near-green' : 'text-text-primary')}>
                {w.name}
              </span>
              {w.recommended && (
                <span className="text-[9px] bg-near-green/20 text-near-green px-1.5 py-0.5 rounded-full font-bold">
                  REC
                </span>
              )}
            </div>
            <div className="text-xs text-text-muted">{w.type}</div>
          </button>
        ))}
      </div>

      {/* Active wallet detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWallet}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <span>{active.emoji}</span> {active.name}
                </h3>
                <p className="text-sm text-text-muted">{active.type} • {active.difficulty}</p>
              </div>
              <a href={active.url} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3 h-3" />}>
                  Visit
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-near-green" /> Pros
                </h4>
                <ul className="space-y-1">
                  {active.pros.map((p) => (
                    <li key={p} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="text-near-green">+</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Cons
                </h4>
                <ul className="space-y-1">
                  {active.cons.map((c) => (
                    <li key={c} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="text-orange-400">-</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Steps */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">
                📋 Setup Steps
              </h4>
              <div className="space-y-2">
                {active.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border"
                  >
                    <span className="text-near-green font-mono text-xs font-bold mt-0.5 w-5 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-text-secondary">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Network Toggle ────────────────────────────────────────────────────────────

function NetworkToggle() {
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');

  return (
    <Card variant="default" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-text-primary">🌐 Testnet vs Mainnet</h4>
        <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setNetwork('testnet')}
            className={cn(
              'px-4 py-2 text-xs font-medium transition-all',
              network === 'testnet' ? 'bg-near-green/20 text-near-green' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Testnet
          </button>
          <button
            onClick={() => setNetwork('mainnet')}
            className={cn(
              'px-4 py-2 text-xs font-medium transition-all',
              network === 'mainnet' ? 'bg-near-green/20 text-near-green' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Mainnet
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={network}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {network === 'testnet' ? (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">
                <span className="text-near-green font-medium">Start here.</span> Testnet
                is a practice environment with free tokens. Nothing is real money.
              </p>
              <ul className="space-y-1 text-sm text-text-muted">
                <li>• Free test NEAR from the faucet</li>
                <li>• Same features as mainnet</li>
                <li>• Safe to experiment and make mistakes</li>
                <li>• Account names end in <code className="text-near-green">.testnet</code></li>
              </ul>
              <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
                <p className="text-xs text-near-green">
                  💡 Pro tip: Get free testnet NEAR at <span className="font-mono">near-faucet.io</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">
                <span className="text-orange-400 font-medium">Real money.</span> Mainnet
                uses real NEAR tokens with real value.
              </p>
              <ul className="space-y-1 text-sm text-text-muted">
                <li>• Real tokens with real value</li>
                <li>• Permanent, irreversible transactions</li>
                <li>• Production dApps live here</li>
                <li>• Account names end in <code className="text-near-green">.near</code></li>
              </ul>
              <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15">
                <p className="text-xs text-orange-400">
                  ⚠️ Only use mainnet when you&apos;re confident. Practice on testnet first.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

// ─── Security Checklist ────────────────────────────────────────────────────────

function SecurityChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const items = [
    { icon: Key, text: 'I wrote my seed phrase on paper (not digitally)' },
    { icon: Lock, text: 'I stored it in a secure, private location' },
    { icon: Shield, text: 'I never share my seed phrase with anyone — EVER' },
    { icon: AlertTriangle, text: 'I understand: if I lose my seed phrase, I lose my funds' },
    { icon: Globe, text: 'I know the difference between testnet and mainnet' },
    { icon: Smartphone, text: 'I enabled 2FA / biometric auth if available' },
  ];

  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <Card variant="glass" padding="lg" className="border-near-green/20">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-text-primary flex items-center gap-2">
          <Shield className="w-5 h-5 text-near-green" />
          Security Checklist
        </h4>
        <span className={cn(
          'text-xs font-mono px-2 py-1 rounded-full',
          completedCount === items.length ? 'bg-near-green/20 text-near-green' : 'bg-surface text-text-muted'
        )}>
          {completedCount}/{items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => setChecked({ ...checked, [i]: !checked[i] })}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all',
                checked[i]
                  ? 'bg-near-green/5 border-near-green/20'
                  : 'bg-surface border-border hover:border-border-hover'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                checked[i] ? 'border-near-green bg-near-green' : 'border-border'
              )}>
                {checked[i] && <CheckCircle2 className="w-3 h-3 text-background" />}
              </div>
              <Icon className={cn('w-4 h-4 flex-shrink-0', checked[i] ? 'text-near-green' : 'text-text-muted')} />
              <span className={cn('text-sm', checked[i] ? 'text-text-primary' : 'text-text-secondary')}>
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
      {completedCount === items.length && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/20 shadow-sm shadow-amber-500/10"
        >
          <p className="text-sm text-near-green font-medium">
            🎉 You&apos;re security-savvy! You&apos;re ready to use your wallet safely.
          </p>
        </motion.div>
      )}
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function CreateAWallet() {
  return (
    <Container size="md">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 3 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            10 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Create a Wallet
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Your wallet is your <span className="text-near-green font-medium">passport to the decentralized world</span>.
            Let&apos;s get you one in the next 5 minutes.
          </p>
        </div>
      </ScrollReveal>

      {/* What is a wallet? */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm">
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">What is a Wallet?</h2>
          </div>
          <p className="text-text-secondary leading-relaxed mb-4">
            A crypto wallet isn&apos;t like your physical wallet. It doesn&apos;t actually &ldquo;hold&rdquo;
            your tokens — those live on the blockchain. Your wallet holds your <span className="text-near-green font-medium">keys</span> —
            the cryptographic proof that you own those tokens.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-border">
              <h4 className="font-bold text-text-primary text-sm mb-1">🔑 Private Key</h4>
              <p className="text-xs text-text-muted">Your password. Never share it. It proves you own your account.</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border">
              <h4 className="font-bold text-text-primary text-sm mb-1">🏠 Public Key</h4>
              <p className="text-xs text-text-muted">Your address. Share freely. Others use it to send you tokens.</p>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      {/* Wallet Comparison */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">
            🏦 Choose Your Wallet
          </h3>
          <p className="text-sm text-text-muted mb-6">
            Three great options. Pick the one that fits your style.
          </p>
          <WalletComparison />
        </div>
      </ScrollReveal>

      {/* Network Toggle */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <NetworkToggle />
        </div>
      </ScrollReveal>

      {/* Seed Phrase Warning */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <Card variant="default" padding="lg" className="border-orange-500/30 bg-orange-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-orange-400 mb-2">The Golden Rule of Crypto</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Your <span className="font-medium text-text-primary">seed phrase</span> (also called
                  recovery phrase) is the master key to your wallet. If someone gets it, they own
                  everything in your wallet. If you lose it, your funds are gone forever.
                </p>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>🚫 <span className="font-medium">Never</span> type it into a website</li>
                  <li>🚫 <span className="font-medium">Never</span> screenshot it</li>
                  <li>🚫 <span className="font-medium">Never</span> store it in notes/cloud</li>
                  <li>✅ Write it on paper. Store in a safe.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </ScrollReveal>

      {/* Security Checklist */}
      <ScrollReveal delay={0.3}>
        <div className="mb-12">
          <SecurityChecklist />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.35}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'A wallet holds your keys — the proof of ownership — not your actual tokens.',
              'NEAR wallets use human-readable names (yourname.near) instead of hex addresses.',
              'Start on testnet to practice safely with free test tokens.',
              'Your seed phrase is sacred — write it down, store it safely, never share it.',
              'Multiple wallet options exist: Meteor (desktop), MyNearWallet (web), HERE (mobile).',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      {/* Complete */}
      <ScrollReveal delay={0.4}>
      </ScrollReveal>
    </Container>
  );
}
