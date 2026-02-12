'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, User, Bot } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ─── Mock Conversation ────────────────────────────────────── */

const CONVERSATION = [
  {
    role: 'user' as const,
    text: 'I want to build a DEX on NEAR',
  },
  {
    role: 'sanctum' as const,
    text: `Great choice! Here's your architecture:

**Smart Contract (Rust):** AMM pool using the constant product formula (x·y=k). You'll implement NEP-141 token deposits, LP token minting, and swap execution — all in ~400 lines of Rust.

**Frontend:** Next.js + wallet-selector for seamless wallet integration. Real-time price feeds from your pool state.

**Key NEAR advantage:** With storage staking, your users pay ~0.01 NEAR per token registration instead of gas-heavy approvals. I can generate the full contract scaffold now.`,
  },
  {
    role: 'user' as const,
    text: 'Generate it!',
  },
  {
    role: 'sanctum' as const,
    text: `Done! I've created a project with:
• \`contract/src/lib.rs\` — AMM pool with swap, add_liquidity, remove_liquidity
• \`contract/src/token.rs\` — NEP-141 LP token implementation
• \`tests/\` — Integration tests with near-workspaces
• \`frontend/\` — Next.js app with wallet connection

Ready to deploy to testnet? Click "Deploy" and I'll walk you through it.`,
  },
];

/* ─── Typing Effect ────────────────────────────────────────── */

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    setDone(false);

    const interval = setInterval(() => {
      indexRef.current += 1;
      const nextChunk = text.slice(0, indexRef.current);
      setDisplayedText(nextChunk);
      if (indexRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, 12);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  // Simple markdown-like rendering
  const renderText = (t: string) => {
    return t.split('\n').map((line, i) => {
      // Bold
      const boldProcessed = line.replace(/\*\*(.+?)\*\*/g, '|||BOLD|||$1|||/BOLD|||');
      // Code
      const codeProcessed = boldProcessed.replace(/`(.+?)`/g, '|||CODE|||$1|||/CODE|||');
      // Bullet
      const isBullet = line.startsWith('• ');

      const parts = codeProcessed.split('|||');
      const elements = parts.map((part, j) => {
        if (part.startsWith('BOLD|||')) return <strong key={j} className="text-text-primary">{part.replace('BOLD|||', '')}</strong>;
        if (part === '/BOLD') return null;
        if (part.startsWith('CODE|||')) return <code key={j} className="text-near-green bg-near-green/10 px-1 py-0.5 rounded text-[11px]">{part.replace('CODE|||', '')}</code>;
        if (part === '/CODE') return null;
        return <span key={j}>{part}</span>;
      });

      return (
        <div key={i} className={cn(isBullet ? 'pl-2' : '', i > 0 ? 'mt-1' : '')}>
          {elements}
        </div>
      );
    });
  };

  return (
    <div className="text-sm text-text-secondary leading-relaxed">
      {renderText(displayedText)}
      {!done && <span className="inline-block w-1.5 h-4 bg-near-green/70 ml-0.5 animate-pulse" />}
    </div>
  );
}

/* ─── Chat Message ─────────────────────────────────────────── */

function ChatMessage({
  role,
  text,
  index,
  isVisible,
  onTypingComplete,
}: {
  role: 'user' | 'sanctum';
  text: string;
  index: number;
  isVisible: boolean;
  onTypingComplete?: () => void;
}) {
  if (!isVisible) return null;

  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-near-green/15 border border-near-green/30 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-near-green" />
        </div>
      )}
      <div className={cn(
        'rounded-xl p-3 max-w-[85%]',
        isUser
          ? 'bg-accent-cyan/10 border border-accent-cyan/20 text-text-primary text-sm'
          : 'bg-surface/80 border border-border/50'
      )}>
        {isUser ? (
          <span className="text-sm">{text}</span>
        ) : (
          <TypewriterText text={text} onComplete={onTypingComplete} />
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-accent-cyan" />
        </div>
      )}
    </motion.div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export function SanctumPreview() {
  const [visibleMessages, setVisibleMessages] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showNext = () => {
    if (visibleMessages < CONVERSATION.length) {
      setVisibleMessages(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  return (
    <ScrollReveal>
      <div id="sanctum-preview">
        <SectionHeader title="Build with Sanctum AI" badge="AI ASSISTANT" />
        <Card variant="glass" padding="none" className="overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-surface/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            <div className="flex items-center gap-2 ml-3">
              <Sparkles className="w-3.5 h-3.5 text-near-green" />
              <span className="text-xs font-mono text-text-muted">Sanctum — AI Build Assistant</span>
            </div>
          </div>

          {/* Chat area */}
          <div ref={scrollRef} className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {CONVERSATION.map((msg, i) => (
              <ChatMessage
                key={i}
                role={msg.role}
                text={msg.text}
                index={i}
                isVisible={i < visibleMessages}
                onTypingComplete={i === visibleMessages - 1 ? showNext : undefined}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="px-4 py-4 border-t border-border/50 bg-surface/30 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              Start free with $2.50 in credits · Upgrade for unlimited building
            </p>
            <div className="flex items-center gap-2">
              <Link href="/sanctum">
                <Button variant="primary" size="sm" className="group">
                  Try Sanctum <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="text-text-muted hover:text-near-green">
                  See Plans <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </ScrollReveal>
  );
}
