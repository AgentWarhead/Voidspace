'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import {
  BookOpen, Clock, CheckCircle2, ChevronDown,
  Shield, AlertTriangle, Lock, Eye,
  Fingerprint, KeyRound, UserX, Bug,
  Fish, Gift, MessageSquareWarning, Smartphone,
} from 'lucide-react';

// ─── Threat Explorer ───────────────────────────────────────────────────────────

function ThreatExplorer() {
  const [activeThreat, setActiveThreat] = useState(0);

  const threats = [
    {
      icon: Fish,
      title: 'Phishing',
      emoji: '🎣',
      tagline: 'Fake websites that steal your credentials.',
      description: 'Phishing is the #1 threat in Web3. Scammers create fake versions of popular sites (wallets, DEXes, airdrops) that look identical to the real thing. When you connect your wallet and approve a transaction, you\'re actually granting the attacker access to your funds. Always verify URLs character by character.',
      signs: [
        'URL is slightly misspelled: "nearscan.io" instead of "nearblocks.io"',
        'DM from someone claiming to be "support" asking you to connect your wallet',
        'Pop-ups asking you to "verify" or "sync" your wallet',
        'Urgency tactics: "Your funds are at risk! Act now!"',
        'Links shared in Discord/Telegram DMs from strangers',
      ],
      prevention: 'Bookmark official sites. Never click wallet links from DMs. Always check the URL before connecting.',
    },
    {
      icon: Gift,
      title: 'Fake Airdrops',
      emoji: '🎁',
      tagline: 'Free tokens that cost you everything.',
      description: 'Scammers send unsolicited tokens to your wallet or advertise "free airdrops" on social media. When you try to swap or interact with these tokens, the malicious smart contract drains your real tokens. Never interact with tokens you didn\'t expect to receive.',
      signs: [
        'Random tokens appearing in your wallet that you didn\'t buy',
        'Social media posts promising free tokens if you "connect wallet"',
        'Websites asking you to "claim" tokens you never signed up for',
        'Airdrop requires you to send tokens first ("send 1 NEAR to receive 100 NEAR")',
        'Token names mimicking real projects with slight variations',
      ],
      prevention: 'Ignore unsolicited tokens. Only claim airdrops from official project announcements. Never send crypto to receive crypto.',
    },
    {
      icon: KeyRound,
      title: 'Seed Phrase Theft',
      emoji: '🔑',
      tagline: 'Your seed phrase = your entire wallet.',
      description: 'Your seed phrase (12 or 24 words) is the master key to your wallet. Anyone who has it can access all your funds from anywhere in the world. Scammers use fake support channels, phishing sites, and social engineering to trick you into revealing it. No legitimate service will EVER ask for your seed phrase.',
      signs: [
        '"Support" asking for your seed phrase to "fix" an issue',
        'Websites with a text field labeled "Enter seed phrase to verify"',
        'Browser extensions asking to "import" your phrase for backup',
        'Screenshots or photos of seed phrases shared accidentally',
        'Cloud storage of seed phrases (Google Drive, iCloud, email drafts)',
      ],
      prevention: 'Write your seed phrase on paper only. Store offline. Never type it into any website. No one legitimate will ever ask for it.',
    },
    {
      icon: UserX,
      title: 'Social Engineering',
      emoji: '🎭',
      tagline: 'Humans are the weakest link.',
      description: 'Social engineering exploits trust and urgency. Scammers impersonate project founders, support staff, or fellow community members. They build rapport over time, then strike — asking you to test a "new feature," review a "contract," or help with a "transaction." The attack targets YOU, not your software.',
      signs: [
        'Someone impersonating a project admin or founder in DMs',
        'Being asked to "test" a smart contract or dApp urgently',
        'Emotional manipulation: flattery, fake emergencies, fear of missing out',
        'Requests to screen share while your wallet is open',
        'Job offers that require you to download software or connect wallets',
      ],
      prevention: 'Verify identities through official channels. Never share screens with wallets open. If it feels rushed, stop.',
    },
  ];

  const threat = threats[activeThreat];
  const Icon = threat.icon;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {threats.map((t, i) => (
          <button
            key={t.title}
            onClick={() => setActiveThreat(i)}
            className={cn(
              'p-3 rounded-lg border text-center transition-all',
              activeThreat === i
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-surface border-border hover:border-border-hover'
            )}
          >
            <div className="text-xl mb-1">{t.emoji}</div>
            <div className={cn('text-xs font-medium', activeThreat === i ? 'text-red-400' : 'text-text-muted')}>
              {t.title}
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeThreat}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-red-400" />
              <h3 className="text-xl font-bold text-text-primary">{threat.title}</h3>
            </div>
            <p className="text-red-400 text-sm font-medium mb-3">{threat.tagline}</p>
            <p className="text-text-secondary leading-relaxed mb-4">{threat.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">⚠️ Warning Signs</h4>
              <div className="space-y-2">
                {threat.signs.map((sign, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <span className="text-red-400 font-mono text-xs font-bold mt-0.5">!</span>
                    {sign}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-near-green/5 border border-near-green/15">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-3.5 h-3.5 text-near-green" />
                <span className="text-xs font-bold text-near-green">Protection</span>
              </div>
              <p className="text-xs text-text-secondary">{threat.prevention}</p>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Safe Wallet Practices ─────────────────────────────────────────────────────

function SafeWalletPractices() {
  const practices = [
    {
      icon: Fingerprint,
      title: 'Use a Hardware Wallet',
      desc: 'Ledger and other hardware wallets keep your private keys offline. Even if your computer is compromised, your keys are safe. Use a hardware wallet for any significant holdings.',
      level: 'Essential',
    },
    {
      icon: Lock,
      title: 'Revoke Unused Approvals',
      desc: 'When you approve a dApp to spend tokens, that permission persists. Regularly review and revoke approvals you no longer need using wallet security tools.',
      level: 'Important',
    },
    {
      icon: Eye,
      title: 'Verify Before Signing',
      desc: 'Always read what you\'re signing. Check the contract address, the function being called, and the amounts. If a "simple mint" asks for unlimited token approval, that\'s a red flag.',
      level: 'Essential',
    },
    {
      icon: Smartphone,
      title: 'Use Separate Wallets',
      desc: 'Keep a "hot" wallet with small amounts for daily use and a "cold" wallet (hardware) for savings. Never connect your main holdings wallet to unknown dApps.',
      level: 'Important',
    },
    {
      icon: Bug,
      title: 'Verify Contract Source',
      desc: 'Before interacting with any contract, check if it\'s verified on NearBlocks. Look for audits, open-source code, and community trust signals.',
      level: 'Recommended',
    },
  ];

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">🛡️ Safe Wallet Practices</h3>
      </div>
      <div className="space-y-3">
        {practices.map((p) => {
          const PIcon = p.icon;
          return (
            <div key={p.title} className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-border">
              <PIcon className="w-4 h-4 text-near-green flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-primary text-sm">{p.title}</h4>
                  <span className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full font-bold',
                    p.level === 'Essential' ? 'bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 text-emerald-400' :
                    p.level === 'Important' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  )}>
                    {p.level}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Interactive: Spot the Phishing Attempt ────────────────────────────────────

function PhishingQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      scenario: 'You receive a DM on Discord: "Hey! I\'m from NEAR support. We noticed suspicious activity on your account. Please visit near-wallet-verify.com to secure your funds immediately."',
      options: ['Click the link — better safe than sorry', 'Ignore and report — NEAR support never DMs first'],
      correct: 1,
      explanation: 'Official support teams NEVER reach out via DM first. This is a classic phishing attempt. Report and block.',
    },
    {
      scenario: 'A website asks you to approve a transaction that says "approve unlimited NEAR spending" for a simple NFT mint.',
      options: ['Approve it — that\'s normal for NFT mints', 'Reject — an NFT mint should not need unlimited token approval'],
      correct: 1,
      explanation: 'An NFT mint should only request the exact mint price. Unlimited approval gives the contract access to all your NEAR.',
    },
    {
      scenario: 'You see a tweet from @NEARProtoco1 (with a "1" instead of "l") announcing a surprise airdrop. "Connect wallet to claim 500 NEAR!"',
      options: ['Claim it quickly before it runs out', 'Check the handle carefully — this is a fake account'],
      correct: 1,
      explanation: 'Scammers create lookalike accounts with subtle character swaps. Always verify the exact handle and check for verification.',
    },
    {
      scenario: 'Random tokens called "NEAR-BONUS" appeared in your wallet. A website says you can swap them for $500 USDC.',
      options: ['Swap them — free money!', 'Ignore — interacting with unknown tokens can drain your wallet'],
      correct: 1,
      explanation: 'Unsolicited tokens are often bait. The "swap" contract is designed to steal your real tokens when you approve the transaction.',
    },
    {
      scenario: 'Your friend (verified, real account) sends you a link saying "check out this new dApp" and the URL is ref-finance-app.com instead of app.ref.finance.',
      options: ['Trust your friend — they wouldn\'t send a scam', 'Verify the URL independently — your friend\'s account might be compromised'],
      correct: 1,
      explanation: 'Even trusted accounts can be compromised. Always verify URLs independently. The real Ref Finance is at app.ref.finance.',
    },
  ];

  const handleAnswer = (index: number) => {
    setSelected(index);
    if (index === questions[currentQ].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  if (finished) {
    return (
      <Card variant="default" padding="lg" className="border-near-green/20">
        <div className="text-center">
          <div className="text-4xl mb-3">{score === questions.length ? '🏆' : score >= 3 ? '👍' : '📚'}</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            {score === questions.length ? 'Perfect Score!' : score >= 3 ? 'Good Awareness!' : 'Keep Learning!'}
          </h3>
          <p className="text-text-secondary mb-4">
            You got <span className="text-near-green font-bold">{score}/{questions.length}</span> correct.
          </p>
          <p className="text-sm text-text-muted mb-4">
            {score === questions.length
              ? 'You have excellent scam detection skills. Stay vigilant — scammers constantly evolve their tactics.'
              : 'Review the threats above and remember: when in doubt, don\'t click. Verify everything independently.'}
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => { setCurrentQ(0); setSelected(null); setScore(0); setFinished(false); }}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const q = questions[currentQ];

  return (
    <Card variant="default" padding="lg" className="border-near-green/20">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareWarning className="w-5 h-5 text-near-green" />
        <h3 className="font-bold text-text-primary">🎯 Spot the Phishing Attempt</h3>
        <span className="text-xs text-text-muted ml-auto">{currentQ + 1}/{questions.length}</span>
      </div>

      <div className="p-4 rounded-lg bg-surface border border-border mb-4">
        <p className="text-sm text-text-secondary leading-relaxed">{q.scenario}</p>
      </div>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selected === null ? handleAnswer(i) : undefined}
            disabled={selected !== null}
            className={cn(
              'w-full p-3 rounded-lg border text-left text-sm transition-all',
              selected === null
                ? 'bg-surface border-border hover:border-near-green/30 hover:bg-near-green/5 cursor-pointer'
                : selected === i && i === q.correct
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : selected === i && i !== q.correct
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : i === q.correct
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-surface border-border text-text-muted'
            )}
          >
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-3 rounded-lg bg-near-green/5 border border-near-green/15 overflow-hidden"
          >
            <p className="text-xs text-near-green">{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Safety Glossary ───────────────────────────────────────────────────────────

function SafetyGlossary() {
  const [expandedTerm, setExpandedTerm] = useState<number | null>(null);

  const terms = [
    { term: 'Phishing', full: 'Phishing Attack', definition: 'A scam where attackers create fake websites or messages to trick you into revealing sensitive information or approving malicious transactions.' },
    { term: 'Seed Phrase', full: 'Recovery Seed Phrase', definition: 'A 12 or 24-word phrase that is the master key to your wallet. Anyone with your seed phrase has full access to all your funds.' },
    { term: 'Approval', full: 'Token Approval', definition: 'Permission you grant a smart contract to spend your tokens. Unlimited approvals are dangerous — they persist until manually revoked.' },
    { term: 'Rug Pull', full: 'Rug Pull Scam', definition: 'When project creators drain liquidity or funds and disappear. Common in unaudited DeFi projects and new token launches.' },
    { term: 'Cold Wallet', full: 'Cold Storage', definition: 'A wallet that\'s not connected to the internet (e.g., Ledger hardware wallet). The safest way to store significant holdings.' },
    { term: 'Drainer', full: 'Wallet Drainer', definition: 'Malicious smart contract designed to steal all tokens from your wallet when you approve a transaction. Often disguised as an NFT mint or airdrop claim.' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {terms.map((t, i) => (
        <GlowCard key={t.term} padding="md" onClick={() => setExpandedTerm(expandedTerm === i ? null : i)}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-near-green font-mono font-bold text-sm">{t.term}</span>
              <span className="text-xs text-text-muted">— {t.full}</span>
            </div>
            <motion.div animate={{ rotate: expandedTerm === i ? 180 : 0 }}>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </motion.div>
          </div>
          <AnimatePresence>
            {expandedTerm === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-xs text-text-secondary mt-2 pt-2 border-t border-border overflow-hidden"
              >
                {t.definition}
              </motion.p>
            )}
          </AnimatePresence>
        </GlowCard>
      ))}
    </div>
  );
}

// ─── Mark Complete ─────────────────────────────────────────────────────────────

function MarkComplete({ moduleSlug }: { moduleSlug: string }) {
  const [completed, setCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      return !!progress[moduleSlug];
    } catch { return false; }
  });

  const handleComplete = () => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-explorer-progress') || '{}');
      progress[moduleSlug] = true;
      localStorage.setItem('voidspace-explorer-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch { /* noop */ }
  };

  return (
    <div className="flex justify-center">
      <Button
        variant={completed ? 'secondary' : 'primary'}
        size="lg"
        onClick={handleComplete}
        leftIcon={completed ? <CheckCircle2 className="w-5 h-5" /> : undefined}
        className={completed ? 'border-near-green/30 text-near-green' : ''}
      >
        {completed ? 'Module Completed ✓' : 'Mark as Complete'}
      </Button>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function StayingSafeInWeb3() {
  return (
    <Container size="md">
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green mb-4">
            <BookOpen className="w-3 h-3" />
            Module 15 of 16
            <span className="text-text-muted">•</span>
            <Clock className="w-3 h-3" />
            15 min read
          </div>
          <GradientText as="h1" animated className="text-4xl md:text-5xl font-bold mb-4">
            Staying Safe in Web3
          </GradientText>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            <span className="text-near-green font-medium">Security first</span> — learn to identify scams,
            protect your wallet, and navigate Web3 without becoming a victim.
          </p>
        </div>
      </ScrollReveal>

      {/* Why Security Matters */}
      <ScrollReveal delay={0.1}>
        <Card variant="glass" padding="lg" className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Why Security Matters</h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-4">
            In Web3, <span className="text-red-400 font-medium">you are your own bank</span>. There&apos;s no
            customer support to call, no fraud department to reverse transactions, no insurance to cover losses.
            If you sign a malicious transaction or share your seed phrase, your funds are gone — permanently.
            Security isn&apos;t optional; it&apos;s survival.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { emoji: '⚠️', title: 'Irreversible', desc: 'Blockchain transactions cannot be reversed' },
              { emoji: '🎯', title: '$3.8B Lost', desc: 'Stolen in crypto scams in 2022 alone (Chainalysis)' },
              { emoji: '🛡️', title: 'You\'re the Target', desc: 'Scammers target users, not just protocols' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-lg bg-surface border border-border text-center">
                <div className="text-xl mb-1">{item.emoji}</div>
                <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                <p className="text-[10px] text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </ScrollReveal>

      {/* Threat Explorer */}
      <ScrollReveal delay={0.15}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-2">🚨 Common Threats</h3>
          <p className="text-sm text-text-muted mb-6">Click each threat to learn how to identify and avoid it.</p>
          <ThreatExplorer />
        </div>
      </ScrollReveal>

      {/* Safe Practices */}
      <ScrollReveal delay={0.2}>
        <div className="mb-12">
          <SafeWalletPractices />
        </div>
      </ScrollReveal>

      {/* Phishing Quiz */}
      <ScrollReveal delay={0.25}>
        <div className="mb-12">
          <PhishingQuiz />
        </div>
      </ScrollReveal>

      {/* Glossary */}
      <ScrollReveal delay={0.28}>
        <div className="mb-12">
          <h3 className="text-lg font-bold text-text-primary mb-4">📖 Security Glossary</h3>
          <SafetyGlossary />
        </div>
      </ScrollReveal>

      {/* Key Takeaways */}
      <ScrollReveal delay={0.3}>
        <Card variant="glass" padding="lg" className="mb-12 border-near-green/20">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-near-green" />
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {[
              'Phishing is the #1 threat — always verify URLs and never click links from DMs.',
              'Your seed phrase is sacred. Never type it into any website. No one legitimate will ask for it.',
              'Use a hardware wallet (Ledger) for significant holdings — it keeps keys offline.',
              'Separate wallets: "hot" wallet for daily use, "cold" wallet for savings.',
              'Read every transaction before signing. Unlimited approvals are a red flag.',
              'When in doubt, stop. Verify independently. Ask in official community channels.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="text-near-green mt-0.5 font-bold">→</span>
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <MarkComplete moduleSlug="staying-safe-in-web3" />
      </ScrollReveal>
    </Container>
  );
}
