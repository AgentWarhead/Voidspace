'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Shield,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Globe,
  Puzzle,
  ArrowRight,
  Sparkles,
  Copy,
  Terminal,
  Key,
  Lock,
  Eye,
  Zap,
  Star,
  Users,
  Check,
  CircleAlert,
  Fingerprint,
  BadgeCheck,
  Wallet,
} from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/* ─── Types ────────────────────────────────────────────────── */

type NetworkMode = 'testnet' | 'mainnet';

interface WalletStep {
  title: string;
  description: string;
  icon: React.ElementType;
  tip?: string;
  code?: string;
  codeLabel?: string;
  warning?: string;
  link?: { url: string; label: string };
}

interface WalletOption {
  id: string;
  name: string;
  icon: React.ElementType;
  tagline: string;
  description: string;
  recommended: boolean;
  url: string;
  type: string;
  features: string[];
  platforms: string[];
  bestFor: string;
  steps: WalletStep[];
}

/* ─── Wallet Data ──────────────────────────────────────────── */

const wallets: WalletOption[] = [
  {
    id: 'meteor',
    name: 'Meteor Wallet',
    icon: Puzzle,
    tagline: 'The Developer\'s Wallet',
    description: 'Browser extension with the smoothest dApp integration. Our top recommendation — transaction simulation, multi-account management, and built-in testnet toggle.',
    recommended: true,
    url: 'https://meteorwallet.app',
    type: 'Browser Extension',
    platforms: ['Chrome', 'Firefox', 'Brave', 'Edge'],
    bestFor: 'Developers & power users',
    features: [
      'Transaction simulation preview',
      'Built-in testnet/mainnet toggle',
      'Multi-account management',
      'Access key management UI',
      'Human-readable .near accounts',
      'dApp browser integration',
    ],
    steps: [
      {
        title: 'Install the Extension',
        description: 'Visit the Meteor Wallet website and click "Add to Chrome" (or your browser). The extension installs in seconds.',
        icon: Puzzle,
        link: { url: 'https://meteorwallet.app', label: 'Get Meteor Wallet' },
        tip: 'Pin the extension to your browser toolbar for quick access.',
      },
      {
        title: 'Create Your Account',
        description: 'Click "Create New Account" and choose a human-readable .near name. This is your identity across the NEAR ecosystem — choose wisely! Short names (under 32 chars) cost a tiny storage deposit (~0.1 NEAR).',
        icon: BadgeCheck,
        tip: 'You can create subaccounts like app.yourname.near later for free.',
      },
      {
        title: 'Secure Your Seed Phrase',
        description: 'Write down your 12-word recovery phrase on PAPER. Store it somewhere safe and offline. This is the ONLY way to recover your account.',
        icon: Key,
        warning: 'Never share your seed phrase. Never screenshot it. Never store it in a notes app, cloud storage, or text file. If someone gets it, they own your funds.',
      },
      {
        title: 'Switch to Testnet',
        description: 'In Meteor Wallet settings, toggle to "Testnet" mode. This connects you to the free test network where you can experiment safely.',
        icon: Zap,
        tip: 'Testnet and mainnet are completely separate. Tokens on one have zero value on the other.',
      },
      {
        title: 'Get Free Test NEAR',
        description: 'Visit the NEAR faucet to claim free testnet tokens. You\'ll get up to 200 test NEAR — enough for thousands of transactions and dozens of contract deployments.',
        icon: Sparkles,
        link: { url: 'https://near-faucet.io', label: 'NEAR Testnet Faucet' },
        code: '# Or use the CLI:\nnear tokens your-name.testnet \\\n  send-near faucet.testnet 10 NEAR \\\n  network-config testnet',
        codeLabel: 'CLI Alternative',
      },
    ],
  },
  {
    id: 'mynearwallet',
    name: 'MyNearWallet',
    icon: Globe,
    tagline: 'Zero Install, Instant Access',
    description: 'Web-based wallet — works in any browser with zero installation. Create an account instantly. Great for beginners and perfect if you can\'t install extensions.',
    recommended: false,
    url: 'https://mynearwallet.com',
    type: 'Web Wallet',
    platforms: ['Any Browser', 'Mobile Web', 'Desktop'],
    bestFor: 'Beginners & quick setup',
    features: [
      'No installation required',
      'Works on any device with a browser',
      'Built-in staking support',
      'Ledger hardware wallet compatible',
      'Clean transaction history view',
      'Token & NFT gallery',
    ],
    steps: [
      {
        title: 'Visit MyNearWallet',
        description: 'Go to mynearwallet.com in your browser. No downloads or installations needed — everything runs in the browser.',
        icon: Globe,
        link: { url: 'https://mynearwallet.com', label: 'Open MyNearWallet' },
      },
      {
        title: 'Create Your Account',
        description: 'Click "Create Account" and pick your .near name. The web interface walks you through each step clearly.',
        icon: BadgeCheck,
        tip: 'MyNearWallet also supports importing existing accounts via seed phrase.',
      },
      {
        title: 'Save Your Recovery Phrase',
        description: 'Write down the 12-word seed phrase. MyNearWallet will quiz you to confirm you saved it correctly.',
        icon: Key,
        warning: 'Your seed phrase is your master key. Lose it + lose wallet access = funds gone forever. No exceptions.',
      },
      {
        title: 'Switch to Testnet',
        description: 'Navigate to testnet.mynearwallet.com for the testnet version. It\'s a separate interface for the test network.',
        icon: Zap,
        link: { url: 'https://testnet.mynearwallet.com', label: 'MyNearWallet Testnet' },
      },
      {
        title: 'Claim Testnet Tokens',
        description: 'Use the NEAR faucet to fund your testnet account. You\'re ready to start experimenting!',
        icon: Sparkles,
        link: { url: 'https://near-faucet.io', label: 'NEAR Testnet Faucet' },
      },
    ],
  },
  {
    id: 'here',
    name: 'HERE Wallet',
    icon: Smartphone,
    tagline: 'Crypto on the Go',
    description: 'Beautiful mobile-first wallet with native iOS & Android apps. Built-in DeFi features, staking rewards, and biometric security. Perfect for managing NEAR from your phone.',
    recommended: false,
    url: 'https://herewallet.app',
    type: 'Mobile App',
    platforms: ['iOS', 'Android'],
    bestFor: 'Mobile users & DeFi',
    features: [
      'Native iOS & Android apps',
      'Built-in staking rewards',
      'Biometric authentication (Face ID / fingerprint)',
      'Push notifications for transactions',
      'NFT gallery & management',
      'In-app token swaps',
    ],
    steps: [
      {
        title: 'Download the App',
        description: 'Get HERE Wallet from the App Store (iOS) or Google Play (Android). It\'s a native app with a polished, intuitive interface.',
        icon: Smartphone,
        link: { url: 'https://herewallet.app', label: 'Download HERE Wallet' },
      },
      {
        title: 'Create Your Account',
        description: 'Open the app and tap "Create Account." Choose your .near name and set up biometric authentication for quick access.',
        icon: Fingerprint,
        tip: 'Enable biometrics (Face ID / fingerprint) for fast, secure access without typing passwords.',
      },
      {
        title: 'Backup Your Seed Phrase',
        description: 'The app will show your 12-word recovery phrase. Write it down on paper and store it safely offline.',
        icon: Key,
        warning: 'Even with biometrics, your seed phrase is the ultimate backup. Without it, a lost/broken phone means lost funds.',
      },
      {
        title: 'Switch to Testnet',
        description: 'In the app settings, switch to testnet mode to experiment safely with test tokens.',
        icon: Zap,
      },
      {
        title: 'Fund & Explore',
        description: 'Get testnet tokens from the faucet, then explore the built-in DeFi features — staking, swaps, and more.',
        icon: Sparkles,
        link: { url: 'https://near-faucet.io', label: 'NEAR Testnet Faucet' },
      },
    ],
  },
];

/* ─── Security Data ────────────────────────────────────────── */

const securityTips = [
  {
    icon: Key,
    title: 'Seed Phrase = Master Key',
    description: 'Write your 12-word recovery phrase on paper. Store it in a safe, fireproof location. Never type it into any website, app, or chat. Anyone with your seed phrase controls your funds.',
    priority: 'critical' as const,
  },
  {
    icon: AlertTriangle,
    title: 'Phishing Is Real',
    description: 'Bookmark official wallet URLs. Never click wallet links from DMs, emails, or social media. NEAR Foundation will never DM you first or ask for keys.',
    priority: 'critical' as const,
  },
  {
    icon: Lock,
    title: 'Use Function-Call Keys',
    description: 'When connecting to dApps, use function-call access keys (not full-access). This limits what the dApp can do — like OAuth permissions for blockchain.',
    priority: 'high' as const,
  },
  {
    icon: Shield,
    title: 'Hardware Wallets for Mainnet',
    description: 'For real money on mainnet, pair with a Ledger hardware wallet. MyNearWallet supports Ledger natively. Keep large amounts in cold storage.',
    priority: 'high' as const,
  },
  {
    icon: Eye,
    title: 'Review Before Signing',
    description: 'Always read what a transaction is doing before approving. Meteor Wallet shows simulation previews. If something looks wrong, reject it.',
    priority: 'medium' as const,
  },
  {
    icon: Users,
    title: 'Multisig for Teams',
    description: 'For team or DAO treasuries, use multisig accounts requiring multiple signatures. AstroDAO provides easy multisig setup on NEAR.',
    priority: 'medium' as const,
  },
];

/* ─── NEAR Account Model Data ──────────────────────────────── */

const accountFeatures = [
  { feature: 'Account Names', near: 'alice.near', other: '0x742d35Cc6634C0532925a3b...', nearWins: true },
  { feature: 'Access Keys', near: 'Multiple keys per account', other: 'One key per account', nearWins: true },
  { feature: 'Subaccounts', near: 'app.alice.near (unlimited, free)', other: 'Not supported', nearWins: true },
  { feature: 'Permission Model', near: 'Function-call restricted keys', other: 'All-or-nothing access', nearWins: true },
  { feature: 'Recovery Options', near: 'Seed phrase + multiple access keys', other: 'Seed phrase only', nearWins: true },
];

/* ─── Pro Tips Data ────────────────────────────────────────── */

const proTips = [
  {
    icon: Zap,
    title: 'Testnet First, Always',
    description: 'Develop and test on testnet. It\'s free, identical to mainnet, and you can break things without consequences. Only deploy to mainnet when you\'re confident.',
  },
  {
    icon: Users,
    title: 'Multiple Accounts Are Free',
    description: 'Create separate accounts for development, testing, and production. Subaccounts (app.you.near) are free and help organize your projects.',
  },
  {
    icon: Key,
    title: 'Rotate Your Keys',
    description: 'You can add and remove access keys from your account. If a key is compromised, remove it and add a new one — without changing your account or seed phrase.',
  },
  {
    icon: Shield,
    title: 'NEAR CLI Is Your Friend',
    description: 'Install the NEAR CLI for powerful command-line wallet management, contract deployment, and account inspection. Essential for developers.',
  },
];

/* ─── Copy Button Component ────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-near-green transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-near-green" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* ─── Code Block Component ─────────────────────────────────── */

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-background/80 border border-border border-b-0 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-text-muted" />
          <span className="text-[10px] font-mono text-text-muted">{label || 'Terminal'}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <div className="bg-background/80 border border-border rounded-b-lg p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-accent-cyan leading-relaxed">
          {code.split('\n').map((line, i) => (
            <div key={i}>
              {line.startsWith('#') ? (
                <span className="text-text-muted/50">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ─── Network Toggle ───────────────────────────────────────── */

function NetworkToggle({ mode, onChange }: { mode: NetworkMode; onChange: (m: NetworkMode) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border border-border w-fit">
        {(['testnet', 'mainnet'] as const).map(network => (
          <button
            key={network}
            onClick={() => onChange(network)}
            className={cn(
              'px-5 py-2.5 rounded-md text-xs font-mono font-semibold uppercase tracking-wider transition-all',
              mode === network
                ? network === 'testnet'
                  ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_12px_rgba(0,212,255,0.1)]'
                  : 'bg-near-green/20 text-near-green border border-near-green/30 shadow-[0_0_12px_rgba(0,236,151,0.1)]'
                : 'text-text-muted hover:text-text-secondary border border-transparent'
            )}
          >
            {network === 'testnet' ? '🧪 Testnet' : '🚀 Mainnet'}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-muted max-w-xl">
        {mode === 'testnet'
          ? 'Testnet is a free sandbox — same features as mainnet, but with fake tokens. Always develop here first. No money at risk.'
          : '⚠️ Mainnet uses real NEAR tokens with real value. Only switch when you\'re deploying to production or managing real assets.'}
      </p>
    </div>
  );
}

/* ─── Wallet Card with Expandable Steps ────────────────────── */

function WalletCard({
  wallet,
  isExpanded,
  onToggle,
}: {
  wallet: WalletOption;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const Icon = wallet.icon;

  return (
    <motion.div
      className={cn(
        'relative rounded-xl overflow-hidden',
        'bg-surface/60 backdrop-blur-xl border shadow-[0_4px_20px_rgba(0,0,0,0.2)]',
        wallet.recommended ? 'border-near-green/40' : 'border-border',
        isExpanded && 'border-near-green/30'
      )}
      layout
    >
      {/* Recommended top accent */}
      {wallet.recommended && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green to-transparent" />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(500px at 50% 0%, rgba(0,236,151,0.06), transparent 70%)' }}
          />
        </>
      )}

      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-3 rounded-xl border',
              wallet.recommended ? 'bg-near-green/10 border-near-green/30' : 'bg-surface-hover border-border'
            )}>
              <Icon className={cn('w-6 h-6', wallet.recommended ? 'text-near-green' : 'text-text-secondary')} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-text-primary text-base">{wallet.name}</h4>
                {wallet.recommended && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-near-green bg-near-green/10 px-2 py-0.5 rounded-full border border-near-green/30 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-near-green" /> RECOMMENDED
                  </span>
                )}
              </div>
              <span className="text-xs text-text-muted">{wallet.tagline} • {wallet.type}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-3">{wallet.description}</p>

        {/* Platforms + Best For */}
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <div className="flex flex-wrap gap-1.5">
            {wallet.platforms.map(p => (
              <span key={p} className="text-[10px] font-mono text-text-muted bg-surface px-2 py-0.5 rounded border border-border/50">
                {p}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-text-muted">•</span>
          <span className="text-[10px] text-accent-cyan font-medium">Best for: {wallet.bestFor}</span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
          {wallet.features.map(feature => (
            <div key={feature} className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-near-green flex-shrink-0" />
              <span className="text-[11px] text-text-muted">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Link href={wallet.url} target="_blank" className="flex-1">
            <Button
              variant={wallet.recommended ? 'primary' : 'secondary'}
              size="sm"
              className="w-full group"
            >
              {wallet.recommended ? 'Get Started' : 'Visit Site'}
              <ExternalLink className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-medium transition-all',
              isExpanded
                ? 'border-near-green/30 bg-near-green/10 text-near-green'
                : 'border-border bg-surface hover:bg-surface-hover text-text-muted hover:text-text-primary'
            )}
          >
            Setup Guide
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Expandable Step-by-Step Guide */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 px-5 py-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-near-green" />
                <h5 className="text-sm font-bold text-text-primary">Step-by-Step Setup</h5>
                <span className="text-[10px] text-text-muted ml-auto">{wallet.steps.length} steps</span>
              </div>

              {wallet.steps.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = activeStep === i;

                return (
                  <div key={i} className="relative">
                    {/* Connector line */}
                    {i < wallet.steps.length - 1 && (
                      <div className={cn(
                        'absolute left-[19px] top-12 bottom-0 w-[2px]',
                        i < activeStep ? 'bg-near-green/30' : 'border-l border-dashed border-border/30'
                      )} />
                    )}

                    <div className="flex gap-4">
                      {/* Step number */}
                      <motion.div
                        className={cn(
                          'relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all',
                          isActive
                            ? 'bg-near-green text-background shadow-[0_0_15px_rgba(0,236,151,0.3)]'
                            : i < activeStep
                            ? 'bg-near-green/20 text-near-green border border-near-green/30'
                            : 'bg-surface border border-border text-text-muted hover:border-near-green/30'
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveStep(i)}
                      >
                        {i < activeStep ? <Check className="w-4 h-4" /> : i + 1}
                      </motion.div>

                      {/* Step content */}
                      <div className="flex-1 pb-5">
                        <button
                          className="w-full text-left"
                          onClick={() => setActiveStep(isActive ? -1 : i)}
                        >
                          <div className="flex items-center gap-2">
                            <h6 className={cn(
                              'text-sm font-semibold transition-colors',
                              isActive ? 'text-text-primary' : 'text-text-secondary'
                            )}>
                              {step.title}
                            </h6>
                            <StepIcon className={cn('w-3.5 h-3.5', isActive ? 'text-near-green' : 'text-text-muted/40')} />
                          </div>
                        </button>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 space-y-3">
                                <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>

                                {/* Warning */}
                                {step.warning && (
                                  <div className="flex items-start gap-2.5 rounded-lg p-3 bg-red-500/5 border border-red-500/20">
                                    <CircleAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-400">⚠ Security Warning</span>
                                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{step.warning}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Code block */}
                                {step.code && (
                                  <CodeBlock code={step.code} label={step.codeLabel} />
                                )}

                                {/* Link */}
                                {step.link && (
                                  <Link
                                    href={step.link.url}
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs text-near-green hover:text-near-green/80 transition-colors font-medium"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {step.link.label}
                                  </Link>
                                )}

                                {/* Tip */}
                                {step.tip && (
                                  <div className="flex items-start gap-2 rounded-lg p-2.5 bg-near-green/5 border border-near-green/15">
                                    <Lightbulb className="w-3.5 h-3.5 text-near-green flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-text-secondary leading-relaxed">{step.tip}</p>
                                  </div>
                                )}

                                {/* Next step button */}
                                {i < wallet.steps.length - 1 && (
                                  <button
                                    onClick={() => setActiveStep(i + 1)}
                                    className="flex items-center gap-1.5 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors font-medium"
                                  >
                                    Next: {wallet.steps[i + 1].title}
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── NEAR Account Model Comparison ────────────────────────── */

function AccountModelComparison() {
  return (
    <GlowCard padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-4 h-4 text-near-green" />
        <h3 className="text-sm font-bold text-text-primary">Why NEAR Accounts Are Better</h3>
        <span className="text-[10px] text-text-muted ml-auto">vs Ethereum-style chains</span>
      </div>

      <div className="space-y-2">
        {accountFeatures.map((row, i) => (
          <motion.div
            key={row.feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className={cn('p-3 rounded-lg', i % 2 === 0 ? 'bg-surface/30' : '')}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-1.5">{row.feature}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-near-green mt-0.5 flex-shrink-0" />
                <span className="text-xs text-near-green font-medium">{row.near}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-xs text-text-muted truncate">{row.other}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlowCard>
  );
}

/* ─── Security Section ─────────────────────────────────────── */

function SecuritySection() {
  return (
    <div className="space-y-4">
      {/* Giant security warning */}
      <motion.div
        className="relative rounded-xl overflow-hidden p-6 border-2 border-red-500/30 bg-red-500/5"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-red-400 to-red-500" />
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Never Share Your Seed Phrase</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Your 12-word recovery phrase is the <span className="text-red-400 font-semibold">master key</span> to your funds.
              Anyone who has it can drain your account instantly from anywhere in the world.
              There is no customer support, no password reset, no &ldquo;forgot my phrase&rdquo; flow. Blockchain is final.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                '❌ Never share it with anyone — not even "support"',
                '❌ Never type it into a website or DM',
                '❌ Never screenshot or photograph it',
                '❌ Never store it in cloud notes or email',
                '✅ Write it on paper with pen',
                '✅ Store in a safe, fireproof location',
                '✅ Consider a metal backup plate',
                '✅ Tell a trusted person WHERE (not what)',
              ].map((item, i) => (
                <div key={i} className={cn(
                  'p-2 rounded',
                  item.startsWith('✅') ? 'bg-near-green/5 text-near-green/80' : 'bg-red-500/5 text-red-400/80'
                )}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security tips grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {securityTips.map((tip, i) => {
          const TipIcon = tip.icon;
          return (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Card variant="glass" padding="lg" className="h-full group relative overflow-hidden">
                {tip.priority === 'critical' && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent" />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <TipIcon className={cn(
                    'w-4 h-4',
                    tip.priority === 'critical' ? 'text-red-400' : tip.priority === 'high' ? 'text-yellow-400' : 'text-near-green'
                  )} />
                  <h4 className="text-sm font-bold text-text-primary">{tip.title}</h4>
                  {tip.priority === 'critical' && (
                    <span className="text-[8px] font-mono font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full border border-red-400/20 uppercase tracking-widest">
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{tip.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Wallet Ready Completion ──────────────────────────────── */

function WalletReadyCheck() {
  const [checked, setChecked] = useState(false);

  // Persist in localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('voidspace-wallet-ready');
    if (saved === 'true') setChecked(true);
  }, []);

  const handleToggle = () => {
    const next = !checked;
    setChecked(next);
    localStorage.setItem('voidspace-wallet-ready', String(next));
    // Also update skill tree progress
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-skill-progress') || '[]');
      const set = new Set(progress);
      if (next) {
        set.add('wallet-setup');
      } else {
        set.delete('wallet-setup');
      }
      localStorage.setItem('voidspace-skill-progress', JSON.stringify(Array.from(set)));
    } catch {}
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-xl overflow-hidden p-6 border transition-all duration-300',
        checked
          ? 'border-near-green/40 bg-near-green/5'
          : 'border-border bg-surface/60'
      )}
      whileHover={{ scale: 1.005 }}
    >
      {checked && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-near-green to-transparent" />
      )}

      <div className="flex items-center gap-5">
        <button
          onClick={handleToggle}
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center border-2 flex-shrink-0 transition-all',
            checked
              ? 'bg-near-green/20 border-near-green text-near-green shadow-[0_0_20px_rgba(0,236,151,0.2)]'
              : 'bg-surface border-border text-text-muted hover:border-near-green/30'
          )}
        >
          {checked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CheckCircle2 className="w-6 h-6" />
            </motion.div>
          ) : (
            <Wallet className="w-6 h-6" />
          )}
        </button>

        <div className="flex-1">
          <h3 className={cn(
            'text-lg font-bold transition-colors',
            checked ? 'text-near-green' : 'text-text-primary'
          )}>
            {checked ? '✅ Wallet Ready!' : 'Wallet Ready?'}
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            {checked
              ? 'Great job! Your progress has been saved. This skill is now marked complete in your skill tree.'
              : 'Once you\'ve set up your wallet and funded it with testnet NEAR, check this box to update your skill tree progress.'}
          </p>
        </div>

        {checked && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-near-green">+75 XP</span>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 10px rgba(0,236,151,0.2)',
                  '0 0 20px rgba(0,236,151,0.4)',
                  '0 0 10px rgba(0,236,151,0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-near-green/20 flex items-center justify-center"
            >
              <Star className="w-4 h-4 text-near-green fill-near-green" />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function WalletSetup() {
  const [network, setNetwork] = useState<NetworkMode>('testnet');
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);

  return (
    <section id="wallet-setup" className="py-12 space-y-8">
      <SectionHeader title="Set Up Your NEAR Wallet" badge="STEP 1 — START HERE" />

      <ScrollReveal>
        <div className="max-w-3xl space-y-3">
          <GradientText as="h2" animated className="text-xl md:text-2xl font-bold">
            From Zero to On-Chain in 10 Minutes
          </GradientText>
          <p className="text-text-secondary text-base leading-relaxed">
            Before you can build or explore NEAR, you need a wallet. It&apos;s{' '}
            <span className="text-near-green font-semibold">free, takes 10 minutes</span>, and gives
            you a human-readable <code className="text-near-green bg-near-green/10 px-1 py-0.5 rounded text-sm">yourname.near</code> address
            instead of a hex string. Pick a wallet below, follow the guide, and you&apos;re on-chain.
          </p>
        </div>
      </ScrollReveal>

      {/* Network Toggle */}
      <ScrollReveal delay={0.05}>
        <NetworkToggle mode={network} onChange={setNetwork} />
      </ScrollReveal>

      {/* NEAR Account Model */}
      <ScrollReveal delay={0.08}>
        <AccountModelComparison />
      </ScrollReveal>

      {/* Wallet Options */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-sm font-mono font-semibold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <Puzzle className="w-4 h-4 text-near-green" />
          Choose Your Wallet
          <span className="text-[10px] text-text-muted/50 ml-2">Click &ldquo;Setup Guide&rdquo; for step-by-step instructions</span>
        </h3>
        <div className="space-y-4">
          {wallets.map(wallet => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              isExpanded={expandedWallet === wallet.id}
              onToggle={() => setExpandedWallet(expandedWallet === wallet.id ? null : wallet.id)}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* Pro Tips */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-sm font-mono font-semibold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-near-green" />
          Pro Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proTips.map((tip, i) => {
            const TipIcon = tip.icon;
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <GlowCard padding="md" className="h-full">
                  <div className="flex items-start gap-3">
                    <TipIcon className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-text-primary mb-1">{tip.title}</h4>
                      <p className="text-xs text-text-muted leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Wallet Ready Checkbox */}
      <ScrollReveal delay={0.2}>
        <WalletReadyCheck />
      </ScrollReveal>

      {/* Security Section */}
      <ScrollReveal delay={0.25}>
        <h3 className="text-sm font-mono font-semibold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" />
          Security Essentials
          <span className="text-[10px] text-red-400/60 ml-2">Read this. Seriously.</span>
        </h3>
        <SecuritySection />
      </ScrollReveal>

      {/* Completion CTA */}
      <ScrollReveal delay={0.3}>
        <motion.div
          className="relative rounded-xl overflow-hidden"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-near-green/10 via-accent-cyan/5 to-near-green/10" />
          <div className="absolute inset-0 border border-near-green/30 rounded-xl" />
          <div className="relative z-10 p-8 text-center">
            <motion.div
              className="text-5xl mb-4"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🎉
            </motion.div>
            <p className="text-xl font-bold text-text-primary mb-2">
              Congratulations — you&apos;re a NEAR citizen!
            </p>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Your <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-xs">yourname.near</code> account
              is ready. Now mark this skill complete above and continue your journey through the skill tree.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <Link href="/opportunities">
                <Button variant="primary" size="lg" className="group">
                  Browse Opportunities
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/sanctum">
                <Button variant="secondary" size="lg">
                  <Sparkles className="w-4 h-4" />
                  Start Building
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </ScrollReveal>
    </section>
  );
}
