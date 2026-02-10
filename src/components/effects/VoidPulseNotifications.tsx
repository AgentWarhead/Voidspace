'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, TrendingUp, Users, Eye, Zap, X } from 'lucide-react';

interface VoidEvent {
  id: string;
  type: 'void-detected' | 'void-filling' | 'gap-spike' | 'builders-researching' | 'hot-void';
  message: string;
  category: string;
  categorySlug: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES = [
  { name: 'DeFi', slug: 'defi' },
  { name: 'NFTs & Digital Art', slug: 'nfts' },
  { name: 'DAOs & Governance', slug: 'daos' },
  { name: 'Gaming & Metaverse', slug: 'gaming' },
  { name: 'Infrastructure', slug: 'infrastructure' },
  { name: 'Social & Creator Economy', slug: 'social' },
  { name: 'Developer Tools', slug: 'dev-tools' },
  { name: 'Wallets & Identity', slug: 'wallets' },
  { name: 'Data & Analytics', slug: 'data-analytics' },
  { name: 'DEX & Trading', slug: 'dex-trading' },
  { name: 'Privacy', slug: 'privacy' },
  { name: 'Bridges & Cross-Chain', slug: 'bridges' },
  { name: 'AI & Agents', slug: 'ai-agents' },
  { name: 'Staking & Rewards', slug: 'staking-rewards' },
];

const OPPORTUNITY_TITLES = [
  'AI-powered yield optimizer',
  'Cross-chain bridge aggregator',
  'DAO treasury dashboard',
  'NFT rarity analyzer',
  'P2P gaming platform',
  'Privacy-first social network',
  'Developer code auditor',
  'Multi-chain wallet connector',
  'On-chain analytics dashboard',
  'Automated market maker',
  'Reputation system',
  'Decentralized storage layer',
  'Governance voting tool',
  'Creator monetization platform',
  'Smart contract debugger',
];

const generateRandomEvent = (): VoidEvent => {
  const eventTypes = [
    {
      type: 'void-detected' as const,
      templates: [
        '🔴 New void detected: {category} just lost its last active builder',
        '🔴 Critical void: {category} ecosystem activity dropped 40%',
        '🔴 Builder exodus: {category} projects going inactive',
      ],
      icon: <Activity className="w-3 h-3" />,
      color: '#FF4757',
    },
    {
      type: 'void-filling' as const,
      templates: [
        '🟢 Void filling: A new project launched in {category}',
        '🟢 Gap closing: Fresh deployment detected in {category}',
        '🟢 Builder activity: New commits in {category} space',
      ],
      icon: <TrendingUp className="w-3 h-3" />,
      color: '#00EC97',
    },
    {
      type: 'gap-spike' as const,
      templates: [
        '⚡ Gap score spike: {category} jumped +{score} points',
        '⚡ Opportunity surge: {category} demand up {percent}%',
        '⚡ Market shift: {category} void score climbing',
      ],
      icon: <Zap className="w-3 h-3" />,
      color: '#00D4FF',
    },
    {
      type: 'builders-researching' as const,
      templates: [
        '👀 {count} builders are researching {opportunity}',
        '👀 Growing interest: {count} devs exploring {opportunity}',
        '👀 Research spike: {opportunity} getting attention',
      ],
      icon: <Eye className="w-3 h-3" />,
      color: '#FFA502',
    },
    {
      type: 'hot-void' as const,
      templates: [
        '🔥 Hot void: {category} demand up {percent}% this week',
        '🔥 Trending gap: {category} becoming high-priority',
        '🔥 Builder magnet: {category} attracting new teams',
      ],
      icon: <Users className="w-3 h-3" />,
      color: '#9D4EDD',
    },
  ];

  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const template = eventType.templates[Math.floor(Math.random() * eventType.templates.length)];
  const opportunity = OPPORTUNITY_TITLES[Math.floor(Math.random() * OPPORTUNITY_TITLES.length)];

  const message = template
    .replace('{category}', category.name)
    .replace('{opportunity}', opportunity)
    .replace('{score}', String(Math.floor(Math.random() * 20) + 5))
    .replace('{percent}', String(Math.floor(Math.random() * 30) + 15))
    .replace('{count}', String(Math.floor(Math.random() * 8) + 3));

  return {
    id: `${Date.now()}-${Math.random()}`,
    type: eventType.type,
    message,
    category: category.name,
    categorySlug: category.slug,
    icon: eventType.icon,
    color: eventType.color,
  };
};

export function VoidPulseNotifications() {
  const [currentEvent, setCurrentEvent] = useState<VoidEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const generateEvent = () => {
      if (currentEvent) return; // Don't generate if one is already showing

      const event = generateRandomEvent();
      setCurrentEvent(event);
      setIsVisible(true);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentEvent(null);
        }, 300); // Wait for exit animation
      }, 5000);
    };

    // Generate first event after 10-20 seconds
    const initialDelay = Math.random() * 10000 + 10000;
    const initialTimer = setTimeout(generateEvent, initialDelay);

    // Then generate events every 30-60 seconds
    const interval = setInterval(() => {
      const delay = Math.random() * 30000 + 30000; // 30-60 seconds
      setTimeout(generateEvent, delay);
    }, 60000); // Check every minute

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [currentEvent]);

  const handleClick = () => {
    if (!currentEvent) return;

    // Navigate to the category page or opportunities page
    if (currentEvent.type === 'builders-researching') {
      router.push('/opportunities');
    } else {
      router.push(`/categories/${currentEvent.categorySlug}`);
    }

    // Dismiss the toast
    setIsVisible(false);
    setTimeout(() => {
      setCurrentEvent(null);
    }, 300);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      setCurrentEvent(null);
    }, 300);
  };

  if (!currentEvent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className="pointer-events-auto"
          >
            <div
              onClick={handleClick}
              className="group relative w-80 bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-surface-hover hover:border-border-hover transition-all duration-200 hover:shadow-glow-sm"
            >
              {/* Pulse dot indicator */}
              <div className="absolute -top-1 -left-1">
                <div className="relative flex h-3 w-3">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-near-green opacity-75" />
                  <div className="relative inline-flex rounded-full h-3 w-3 bg-near-green" />
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-border-hover transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3 text-text-muted" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="flex items-center justify-center w-6 h-6 rounded-full"
                  style={{ backgroundColor: `${currentEvent.color}20`, color: currentEvent.color }}
                >
                  {currentEvent.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-near-green">LIVE</span>
                  <span className="text-xs text-text-muted">Just now</span>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-text-primary leading-relaxed">
                {currentEvent.message}
              </p>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Click to explore →
                </span>
                <div className="w-2 h-2 rounded-full bg-near-green animate-pulse" />
              </div>

              {/* Subtle border animation */}
              <div className="absolute inset-0 rounded-lg border border-near-green/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}