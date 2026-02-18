'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sparkles,
  GraduationCap,
  Telescope,
  Search,
  Rocket,
  TrendingUp,
  Shield,
  Code2,
  Zap,
  X,
} from 'lucide-react';

interface NotificationCTA {
  id: string;
  category: 'sanctum' | 'learn' | 'explore' | 'tools' | 'pricing';
  headline: string;
  message: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  /** Pages where this notification should NOT appear */
  excludeOn?: string[];
}

/**
 * Smart CTA notifications that reflect actual Voidspace features.
 * Each one drives toward a specific page/conversion goal.
 * excludeOn prevents showing a CTA for the page the user is already on.
 */
const NOTIFICATIONS: Omit<NotificationCTA, 'id'>[] = [
  // === SANCTUM (Paid Product — Primary Conversion Target) ===
  {
    category: 'sanctum',
    headline: 'Sanctum AI Builder',
    message: 'Build smart contracts in plain English — zero Rust experience needed. Powered by Claude Sonnet 4.6 + Opus 4.6.',
    cta: 'Start Building Free →',
    href: '/sanctum',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: '#00EC97',
    excludeOn: ['/sanctum'],
  },
  {
    category: 'sanctum',
    headline: 'Ship Faster with AI',
    message: 'Describe your idea, get a production-ready NEAR smart contract. Templates for DeFi, NFTs, DAOs & more.',
    cta: 'Try Sanctum →',
    href: '/sanctum',
    icon: <Rocket className="w-3.5 h-3.5" />,
    color: '#00EC97',
    excludeOn: ['/sanctum'],
  },
  {
    category: 'sanctum',
    headline: 'AI Code Auditor',
    message: 'Paste any contract and get a brutally honest security review. Catch vulnerabilities before they cost you.',
    cta: 'Audit Your Code →',
    href: '/sanctum',
    icon: <Shield className="w-3.5 h-3.5" />,
    color: '#00D4FF',
    excludeOn: ['/sanctum'],
  },
  {
    category: 'sanctum',
    headline: 'Vibe-Code on NEAR',
    message: 'The only AI-powered development platform built specifically for the NEAR ecosystem.',
    cta: 'See What You Can Build →',
    href: '/sanctum',
    icon: <Code2 className="w-3.5 h-3.5" />,
    color: '#00EC97',
    excludeOn: ['/sanctum'],
  },

  // === LEARN (Free Education — Funnel to Sanctum) ===
  {
    category: 'learn',
    headline: '66 Learning Modules',
    message: 'From blockchain basics to advanced Rust — 4 tracks built for every skill level.',
    cta: 'Start Learning →',
    href: '/learn',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    color: '#9D4EDD',
    excludeOn: ['/learn'],
  },
  {
    category: 'learn',
    headline: 'Learn Rust for NEAR',
    message: 'Interactive curriculum designed for blockchain developers. Go from zero to deploying contracts.',
    cta: 'Explore Courses →',
    href: '/learn',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    color: '#9D4EDD',
    excludeOn: ['/learn'],
  },

  // === EXPLORE (Intelligence Tools — Free, Builds Trust) ===
  {
    category: 'explore',
    headline: 'NEAR Observatory',
    message: 'Real-time ecosystem intelligence. Track projects, analyze trends, find opportunities before anyone else.',
    cta: 'Explore Observatory →',
    href: '/observatory',
    icon: <Telescope className="w-3.5 h-3.5" />,
    color: '#FFA502',
    excludeOn: ['/observatory'],
  },
  {
    category: 'explore',
    headline: 'Ecosystem Voids',
    message: 'Discover gaps in the NEAR ecosystem — where demand exists but solutions don\'t. Your next big idea lives here.',
    cta: 'Find Opportunities →',
    href: '/opportunities',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: '#FF6B6B',
    excludeOn: ['/opportunities'],
  },

  // === TOOLS (Free Tools — Engagement) ===
  {
    category: 'tools',
    headline: 'Void Lens',
    message: 'Analyze any NEAR wallet instantly. Reputation scores, token balances, DeFi activity — all in one view.',
    cta: 'Try Void Lens →',
    href: '/void-lens',
    icon: <Search className="w-3.5 h-3.5" />,
    color: '#00D4FF',
    excludeOn: ['/void-lens'],
  },
  {
    category: 'tools',
    headline: 'Void Bubbles',
    message: 'Visualize the entire NEAR ecosystem as an interactive bubble map. See which projects are thriving.',
    cta: 'Launch Bubbles →',
    href: '/void-bubbles',
    icon: <Zap className="w-3.5 h-3.5" />,
    color: '#FF4757',
    excludeOn: ['/void-bubbles'],
  },

  // === PRICING (Direct Conversion) ===
  {
    category: 'pricing',
    headline: 'Start Free, Scale Up',
    message: 'Free tier includes intelligence tools & learning. Unlock unlimited AI building with Sanctum credits.',
    cta: 'View Plans →',
    href: '/pricing',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: '#00EC97',
    excludeOn: ['/pricing'],
  },
];

export function VoidPulseNotifications() {
  const [currentNotification, setCurrentNotification] = useState<NotificationCTA | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shownIds, setShownIds] = useState<Set<number>>(new Set());
  const router = useRouter();
  const pathname = usePathname();

  // Check if mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pickNotification = useCallback((): NotificationCTA | null => {
    // Filter out notifications for the current page
    const eligible = NOTIFICATIONS
      .map((n, i) => ({ ...n, index: i }))
      .filter(n => {
        // Don't show if we're on an excluded page
        if (n.excludeOn?.some(p => pathname.startsWith(p))) return false;
        // Don't repeat until we've cycled through all
        if (shownIds.size < NOTIFICATIONS.length && shownIds.has(n.index)) return false;
        return true;
      });

    if (eligible.length === 0) {
      // Reset cycle
      setShownIds(new Set());
      return null;
    }

    // Weight Sanctum CTAs higher (50% chance) to drive conversions
    const sanctumItems = eligible.filter(n => n.category === 'sanctum' || n.category === 'pricing');
    const otherItems = eligible.filter(n => n.category !== 'sanctum' && n.category !== 'pricing');

    let picked;
    if (sanctumItems.length > 0 && (otherItems.length === 0 || Math.random() < 0.5)) {
      picked = sanctumItems[Math.floor(Math.random() * sanctumItems.length)];
    } else if (otherItems.length > 0) {
      picked = otherItems[Math.floor(Math.random() * otherItems.length)];
    } else {
      return null;
    }

    setShownIds(prev => new Set(prev).add(picked.index));

    return {
      id: `${Date.now()}-${picked.index}`,
      category: picked.category,
      headline: picked.headline,
      message: picked.message,
      cta: picked.cta,
      href: picked.href,
      icon: picked.icon,
      color: picked.color,
    };
  }, [pathname, shownIds]);

  useEffect(() => {
    if (isMobile) return;

    const showNotification = () => {
      if (currentNotification) return;

      const notification = pickNotification();
      if (!notification) return;

      setCurrentNotification(notification);
      setIsVisible(true);

      // Auto-dismiss after 5 seconds (enough time to read CTA)
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentNotification(null), 300);
      }, 5000);
    };

    // First notification after 20-30 seconds
    const initialDelay = Math.random() * 10000 + 20000;
    const initialTimer = setTimeout(showNotification, initialDelay);

    // Subsequent notifications every 60-120 seconds
    const interval = setInterval(() => {
      const delay = Math.random() * 30000 + 30000;
      setTimeout(showNotification, delay);
    }, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [currentNotification, isMobile, pickNotification]);

  const handleClick = () => {
    if (!currentNotification) return;
    router.push(currentNotification.href);
    setIsVisible(false);
    setTimeout(() => setCurrentNotification(null), 300);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => setCurrentNotification(null), 300);
  };

  if (!currentNotification || isMobile) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
              duration: 0.2,
            }}
            className="pointer-events-auto"
          >
            <div
              onClick={handleClick}
              className="group relative w-72 bg-surface/90 backdrop-blur-xl border border-border rounded-lg p-3.5 cursor-pointer hover:bg-surface-hover hover:border-border-hover transition-all duration-200 hover:shadow-glow-sm"
            >
              {/* Pulse dot indicator */}
              <div className="absolute -top-1 -left-1">
                <div className="relative flex h-3 w-3">
                  <div
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: currentNotification.color }}
                  />
                  <div
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: currentNotification.color }}
                  />
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
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: `${currentNotification.color}20`, color: currentNotification.color }}
                >
                  {currentNotification.icon}
                </div>
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: currentNotification.color }}
                >
                  {currentNotification.headline}
                </span>
              </div>

              {/* Message */}
              <p className="text-[11px] text-text-secondary leading-relaxed mb-2">
                {currentNotification.message}
              </p>

              {/* CTA Footer */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-medium transition-colors group-hover:brightness-125"
                  style={{ color: currentNotification.color }}
                >
                  {currentNotification.cta}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: currentNotification.color }}
                />
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ borderColor: `${currentNotification.color}30` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
