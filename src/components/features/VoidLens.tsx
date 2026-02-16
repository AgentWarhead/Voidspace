'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
// @ts-ignore
import { Search, Shield, TrendingUp, TrendingDown, Activity, Wallet, AlertTriangle, CheckCircle, Network, RotateCcw, RefreshCw, Key, Lock, Zap, Coins, BarChart3, Clock, Globe, Layers, DollarSign, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useAchievementContext } from '@/contexts/AchievementContext';
import { useWallet } from '@/hooks/useWallet';

interface ReputationAnalysis {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  activitySummary: string;
  keyInsights: string[];
  details: {
    ageScore: number;
    activityScore: number;
    diversityScore: number;
    balanceScore: number;
    securityScore: number;
    defiScore: number;
  };
  securityProfile: {
    fullAccessKeys: number;
    functionCallKeys: number;
    riskFlags: string[];
  };
  defiActivity: {
    topProtocols: Array<{ name: string; interactions: number; category: string }>;
    hasStaking: boolean;
    stakedAmount: string;
    nftCount: number;
  };
  activityPattern: {
    avgTxPerDay: number;
    mostActiveDay: string;
    sendReceiveRatio: number;
    recentActivity: 'active' | 'moderate' | 'dormant';
  };
  walletAge: {
    days: number;
    created: string;
    label: string;
  };
}

interface WalletData {
  account: string;
  balance: string;
  transactions: Array<Record<string, unknown>>;
  tokens: Array<Record<string, unknown>>;
  stats: {
    total_transactions: number;
    first_transaction: string | null;
    last_transaction: string | null;
  };
  nftCount: number;
  storageUsage: number;
  accessKeys: {
    fullAccess: number;
    functionCall: number;
  };
}

interface PortfolioHolding {
  symbol: string;
  name: string;
  contractAddress: string;
  balance: number;
  price: number;
  usdValue: number;
  priceChange24h: number;
  category: string;
  imageUrl?: string;
}

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  topHolding: { symbol: string; usdValue: number } | null;
  holdings: PortfolioHolding[];
  diversification: {
    defi: number;
    stablecoin: number;
    meme: number;
    infrastructure: number;
    other: number;
  };
  diversificationLabel: string;
}

interface VoidLensResult {
  address: string;
  walletData: WalletData;
  analysis: ReputationAnalysis;
  portfolio?: PortfolioData | null;
  timestamp: string;
  analysisTimestamp?: number;
}

interface LoadingStage {
  id: string;
  label: string;
  duration: number;
  completed: boolean;
}

type ErrorType = 'validation' | 'not-found' | 'rate-limit' | 'server-error' | 'network-error';

interface VoidLensProps {
  initialAddress?: string;
}

const EXAMPLE_WALLETS = [
  'alex.near',
  'mob.near',
  'root.near',
  'aurora.near',
  'v2.ref-finance.near',
  'nearweek.near',
];

export function VoidLens({ initialAddress }: VoidLensProps = {}) {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<VoidLensResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [loadingStages, setLoadingStages] = useState<LoadingStage[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  
  const { trackStat, triggerCustom } = useAchievementContext();
  const { accountId } = useWallet();
  
  const stageTimeouts = useRef<NodeJS.Timeout[]>([]);
  const scoreAnimationRef = useRef<number | null>(null);

  const initializeLoadingStages = (): LoadingStage[] => [
    { id: 'fetch', label: 'Fetching on-chain data...', duration: 800, completed: false },
    { id: 'keys', label: 'Analyzing access keys & security...', duration: 800, completed: false },
    { id: 'defi', label: 'Scanning DeFi & NFT activity...', duration: 1000, completed: false },
    { id: 'analyze', label: 'Computing reputation scores...', duration: 1000, completed: false },
    { id: 'generate', label: 'Generating intelligence report...', duration: 1200, completed: false }
  ];

  const clearStageTimeouts = () => {
    stageTimeouts.current.forEach(timeout => clearTimeout(timeout));
    stageTimeouts.current = [];
  };

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const startLoadingStages = () => {
    const stages = initializeLoadingStages();
    setLoadingStages(stages);
    setCurrentStageIndex(0);
    clearStageTimeouts();
    
    let cumulativeDelay = 0;
    stages.forEach((stage, index) => {
      const timeout = setTimeout(() => {
        setLoadingStages(prev => 
          prev.map((s, i) => i === index ? { ...s, completed: true } : s)
        );
        if (index < stages.length - 1) {
          setCurrentStageIndex(index + 1);
        }
      }, cumulativeDelay + stage.duration);
      stageTimeouts.current.push(timeout);
      cumulativeDelay += stage.duration;
    });
  };

  const animateScore = (targetScore: number) => {
    setShowScoreAnimation(true);
    setAnimatedScore(0);
    const startTime = Date.now();
    const duration = 1500;
    
    const updateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(targetScore * easedProgress));
      if (progress < 1) {
        scoreAnimationRef.current = requestAnimationFrame(updateScore);
      }
    };
    scoreAnimationRef.current = requestAnimationFrame(updateScore);
  };

  const getErrorMessage = (type: ErrorType, message: string) => {
    switch (type) {
      case 'validation': return 'Please enter a valid NEAR wallet address';
      case 'not-found': return 'Wallet not found. Please check the address and try again.';
      case 'rate-limit': return 'Too many requests. Please wait a moment and try again.';
      case 'server-error': return 'Our servers are experiencing issues. Please try again in a few minutes.';
      case 'network-error': return 'Network connection error. Please check your internet and try again.';
      default: return message || 'An unexpected error occurred';
    }
  };

  const classifyError = (error: Error, status?: number): ErrorType => {
    if (status === 404) return 'not-found';
    if (status === 429) return 'rate-limit';
    if (status && status >= 500) return 'server-error';
    if (error.message.includes('fetch') || error.message.includes('network')) return 'network-error';
    return 'server-error';
  };

  const formatTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes === 0) return 'just now';
    if (minutes === 1) return '1m ago';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  useEffect(() => {
    return () => {
      clearStageTimeouts();
      if (scoreAnimationRef.current) cancelAnimationFrame(scoreAnimationRef.current);
    };
  }, []);

  const handleAnalyze = async (addressOverride?: string) => {
    const targetAddress = addressOverride || address;
    
    if (!targetAddress.trim()) {
      setError('Please enter a NEAR wallet address');
      setErrorType('validation');
      return;
    }

    // Update displayed address if override was passed
    if (addressOverride) {
      setAddress(addressOverride);
    }

    setLoading(true);
    setError('');
    setErrorType(null);
    setResult(null);
    setShowScoreAnimation(false);
    startLoadingStages();

    try {
      const response = await fetch('/api/void-lens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: targetAddress.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const err = new Error(errorData.error || 'Failed to analyze wallet');
        const errType = classifyError(err, response.status);
        setErrorType(errType);
        throw err;
      }

      const data = await response.json();
      const resultWithTimestamp = { ...data, analysisTimestamp: Date.now() };
      
      clearStageTimeouts();
      setLoadingStages(prev => prev.map(stage => ({ ...stage, completed: true })));
      setResult(resultWithTimestamp);
      
      // ── Achievement tracking ──
      trackStat('walletsAnalyzed');
      
      if (accountId && targetAddress.trim().toLowerCase() === accountId.toLowerCase()) {
        triggerCustom('own_wallet_analyzed');
      }
      
      const balance = parseFloat(data.walletData?.balance || '0');
      if (balance >= 10000) triggerCustom('whale_wallet_analyzed');
      if (balance === 0) triggerCustom('zero_balance_wallet');
      
      const defiInteractions = data.analysis?.defiActivity?.topProtocols?.reduce(
        (sum: number, p: { interactions: number }) => sum + (p?.interactions || 0), 0
      ) || 0;
      if (defiInteractions >= 10) triggerCustom('defi_heavy_wallet');
      // ── End achievement tracking ──
      
      setTimeout(() => {
        animateScore(data.analysis?.score || 0);
      }, 300);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error.message);
      if (!errorType) setErrorType(classifyError(error));
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'text-near-green border-near-green bg-near-green/10';
      case 'MEDIUM': return 'text-warning border-warning bg-warning/10';
      case 'HIGH': return 'text-error border-error bg-error/10';
      default: return 'text-text-secondary border-border bg-surface';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return <CheckCircle className="w-4 h-4" />;
      case 'MEDIUM': return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-near-green';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-near-green/20 to-near-green/5';
    if (score >= 40) return 'from-warning/20 to-warning/5';
    return 'from-error/20 to-error/5';
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance) || 0;
    if (num === 0) return '0 NEAR';
    if (num < 0.01) return '<0.01 NEAR';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M NEAR`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K NEAR`;
    return `${num.toFixed(2)} NEAR`;
  };

  const getRecentActivityBadge = (activity: string) => {
    switch (activity) {
      case 'active': return { label: 'Active', color: 'text-near-green bg-near-green/10 border-near-green/30' };
      case 'moderate': return { label: 'Moderate', color: 'text-warning bg-warning/10 border-warning/30' };
      case 'dormant': return { label: 'Dormant', color: 'text-error bg-error/10 border-error/30' };
      default: return { label: 'Unknown', color: 'text-text-muted bg-surface border-border' };
    }
  };

  // Generate 6-axis radar chart (hexagon)
  const generateRadarChart = (scores: {
    ageScore: number;
    activityScore: number;
    diversityScore: number;
    balanceScore: number;
    securityScore: number;
    defiScore: number;
  }) => {
    const size = 280;
    const center = size / 2;
    const maxRadius = center - 45;
    
    const axes = [
      { label: 'Age', angle: 0, score: scores.ageScore || 0 },
      { label: 'Activity', angle: 60, score: scores.activityScore || 0 },
      { label: 'DeFi', angle: 120, score: scores.defiScore || 0 },
      { label: 'Diversity', angle: 180, score: scores.diversityScore || 0 },
      { label: 'Security', angle: 240, score: scores.securityScore || 0 },
      { label: 'Balance', angle: 300, score: scores.balanceScore || 0 }
    ];

    const polarToCartesian = (angle: number, radius: number) => ({
      x: center + radius * Math.cos((angle - 90) * Math.PI / 180),
      y: center + radius * Math.sin((angle - 90) * Math.PI / 180)
    });

    // Hexagonal grid
    const gridLevels = [25, 50, 75, 100];
    const gridPolygons = gridLevels.map(percent => {
      const radius = (percent / 100) * maxRadius;
      const points = axes.map(a => polarToCartesian(a.angle, radius));
      const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
      return (
        <path key={percent} d={path} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      );
    });

    const axisLines = axes.map(axis => {
      const end = polarToCartesian(axis.angle, maxRadius);
      return (
        <line key={axis.label} x1={center} y1={center} x2={end.x} y2={end.y}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      );
    });

    const scorePoints = axes.map(axis => {
      const radius = (axis.score / 100) * maxRadius;
      return polarToCartesian(axis.angle, radius);
    });
    const scorePolygonPath = scorePoints.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z';

    const labels = axes.map(axis => {
      const pos = polarToCartesian(axis.angle, maxRadius + 25);
      return (
        <text key={axis.label} x={pos.x} y={pos.y}
          textAnchor="middle" dominantBaseline="central"
          fill="rgba(255,255,255,0.7)" fontSize="11" fontWeight="500">
          {axis.label}
        </text>
      );
    });

    const scoreLabels = axes.map(axis => {
      const radius = Math.max((axis.score / 100) * maxRadius, 15);
      const pos = polarToCartesian(axis.angle, radius + 14);
      return (
        <text key={`s-${axis.label}`} x={pos.x} y={pos.y}
          textAnchor="middle" dominantBaseline="central"
          fill="#10B981" fontSize="10" fontWeight="600">
          {axis.score}
        </text>
      );
    });

    return (
      <div className="flex justify-center w-full max-w-[280px] mx-auto">
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="max-w-[280px]">
          {gridPolygons}
          {axisLines}
          <path d={scorePolygonPath}
            fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth="2" />
          {scorePoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10B981" />
          ))}
          {labels}
          {scoreLabels}
        </svg>
      </div>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatStorage = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Score gauge arc for security/defi cards
  const ScoreGauge = ({ score, label, size = 60 }: { score: number; label: string; size?: number }) => {
    const radius = (size / 2) - 6;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
    
    return (
      <div className="flex flex-col items-center gap-1">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none"
            stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
          <circle cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        </svg>
        <div className="absolute flex items-center justify-center" style={{ width: size, height: size }}>
          <span className="text-sm font-bold" style={{ color }}>{score}</span>
        </div>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    );
  };

  // Send/Receive ratio bar
  const RatioBar = ({ sent, received }: { sent: number; received: number }) => {
    const total = sent + received;
    if (total === 0) return <div className="text-xs text-text-muted">No data</div>;
    const sentPct = Math.round((sent / total) * 100);
    const recvPct = 100 - sentPct;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-text-muted">
          <span>Sent ({sentPct}%)</span>
          <span>Received ({recvPct}%)</span>
        </div>
        <div className="h-2 rounded-full bg-surface-hover overflow-hidden flex">
          <div className="h-full bg-blue-500 rounded-l-full transition-all duration-700"
            style={{ width: `${sentPct}%` }} />
          <div className="h-full bg-purple-500 rounded-r-full transition-all duration-700"
            style={{ width: `${recvPct}%` }} />
        </div>
      </div>
    );
  };

  // Cursor-tracking glow for glassmorphism card
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div className="space-y-6">
      {/* Background Atmosphere */}
      <div className="relative">
        <div 
          className="absolute inset-0 -top-20 -bottom-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(0,236,151,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.04) 0%, transparent 50%)',
          }}
        />
        <GridPattern className="opacity-[0.07]" />

        {/* Header */}
        <div className="text-center relative z-10">
          {/* Animated Shield Icon */}
          <motion.div 
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <div className="relative">
              {/* Rotating glow ring */}
              <div className="absolute inset-[-6px] rounded-xl animate-[spin_4s_linear_infinite] opacity-60">
                <div className="w-full h-full rounded-xl bg-[conic-gradient(from_0deg,transparent,rgba(0,236,151,0.4),transparent,transparent)]" />
              </div>
              {/* Pulsing shield container */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-near-green/20 border border-near-green/30 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-near-green drop-shadow-[0_0_8px_rgba(0,236,151,0.5)]" />
              </div>
            </div>
          </motion.div>

          {/* Title with GradientText + FREE badge */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GradientText as="h1" animated className="text-2xl sm:text-3xl font-bold">
              Void Lens
            </GradientText>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-near-green/10 text-near-green border border-near-green/20 uppercase tracking-wider">
              Free
            </span>
          </motion.div>

          {/* Punchier Subtitle */}
          <motion.p 
            className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Know exactly who you're dealing with. AI reputation scoring that reads the blockchain so you don't have to.
          </motion.p>
        </div>

        {/* Glassmorphism Search Card */}
        <motion.div
          className="max-w-2xl mx-auto mt-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div
            ref={cardRef}
            className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl p-6 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-near-green/30 to-transparent" />
            
            {/* Cursor-tracking glow */}
            {isHovering && (
              <div
                className="absolute pointer-events-none w-[300px] h-[300px] rounded-full opacity-20 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(0,236,151,0.15) 0%, transparent 70%)',
                  left: mousePos.x - 150,
                  top: mousePos.y - 150,
                }}
              />
            )}

            <div className="relative z-10 space-y-4">
              {/* Enhanced Input Field */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  placeholder="Enter NEAR wallet address (e.g., alex.near)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:border-near-green/50 focus:shadow-[0_0_15px_rgba(0,236,151,0.15)]"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>

              {/* Example Wallets Upgrade */}
              <div className="space-y-2">
                <p className="text-xs text-text-muted">🐋 Notable Wallets:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {EXAMPLE_WALLETS.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleAnalyze(example)}
                      className="text-xs px-2.5 py-2 min-h-[44px] flex items-center bg-surface/50 border border-border rounded-full hover:border-near-green/40 hover:shadow-[0_0_10px_rgba(0,236,151,0.1)] hover:scale-105 active:scale-95 cursor-pointer transition-all duration-200"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* CTA Button Upgrade */}
              <button 
                onClick={() => handleAnalyze()}
                disabled={loading || !address.trim()}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]",
                  "bg-gradient-to-r from-near-green to-emerald-500 text-black",
                  "shadow-[0_0_20px_rgba(0,236,151,0.3)]",
                  "hover:shadow-[0_0_30px_rgba(0,236,151,0.5)] hover:brightness-110",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                  !loading && address.trim() && "animate-[ctaPulse_2s_ease-in-out_infinite]"
                )}
              >
                {!loading ? (
                  <>
                    <Shield className="w-4 h-4" />
                    Analyze Reputation
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Analyzing...
                  </div>
                )}
              </button>
              
              {/* Multi-Step Loading Progress */}
              {loading && (
                <div className="space-y-3 pt-2">
                  {loadingStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center w-5 h-5">
                        {stage.completed ? (
                          <CheckCircle className="w-4 h-4 text-near-green" />
                        ) : index === currentStageIndex ? (
                          <div className="animate-spin w-4 h-4 border-2 border-near-green/30 border-t-near-green rounded-full" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-text-muted/30" />
                        )}
                      </div>
                      <span className={cn(
                        "transition-colors",
                        stage.completed ? "text-near-green" : 
                        index === currentStageIndex ? "text-text-primary" : 
                        "text-text-muted"
                      )}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Error Display */}
              {error && (
                <div className="p-4 rounded-lg bg-error/10 border border-error/20 animate-in slide-in-from-top duration-300">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-error text-sm font-medium mb-2">
                        {errorType ? getErrorMessage(errorType, error) : error}
                      </p>
                      <Button
                        onClick={() => handleAnalyze()}
                        size="sm"
                        variant="ghost"
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Results */}
      {result && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* 1. Hero Score Card — Full Width */}
          <Card variant="glass" glow hover className={cn("relative overflow-hidden")}>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", getScoreGradient(result.analysis?.score || 0))} />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 min-w-0">
                  {/* Score Circle */}
                  <div className="relative">
                    <svg width="120" height="120" className="-rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle cx="60" cy="60" r="52" fill="none"
                        stroke={result.analysis?.score >= 70 ? '#10B981' : result.analysis?.score >= 40 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - (result.analysis?.score || 0) / 100)}`}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn("text-4xl font-bold", getScoreColor(result.analysis?.score || 0))}>
                        {showScoreAnimation ? animatedScore : (result.analysis?.score || 0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-1 break-all sm:break-normal">
                      {result.walletData?.account || result.address}
                    </h2>
                    <p className="text-text-secondary text-sm mb-3">{result.analysis?.activitySummary || ''}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium",
                        getRiskColor(result.analysis?.riskLevel || '')
                      )}>
                        {getRiskIcon(result.analysis?.riskLevel || '')}
                        {result.analysis?.riskLevel || 'UNKNOWN'} RISK
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {result.analysis?.walletAge?.label || 'Unknown'}
                      </span>
                      {result.analysis?.activityPattern && (
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium",
                          getRecentActivityBadge(result.analysis.activityPattern.recentActivity).color
                        )}>
                          <Zap className="w-3 h-3" />
                          {getRecentActivityBadge(result.analysis.activityPattern.recentActivity).label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Freshness + Refresh */}
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>Analyzed {result.analysisTimestamp ? formatTimeAgo(result.analysisTimestamp) : 'recently'}</span>
                  <button
                    onClick={() => handleAnalyze(result.walletData?.account || result.address)}
                    className="inline-flex items-center gap-1 text-near-green hover:text-near-green/80 transition-colors"
                    disabled={loading}
                  >
                    <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Portfolio Cards */}
          {result.portfolio && result.portfolio.holdings.length > 0 && (
            <>
              {/* Portfolio Valuation Card — Full Width */}
              <Card variant="glass" glow>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-near-green" />
                  Portfolio Valuation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-text-muted mb-1 uppercase tracking-wide">Total Value</div>
                    <div className="text-3xl font-bold text-text-primary">
                      ${result.portfolio.totalValue >= 1000000
                        ? `${(result.portfolio.totalValue / 1000000).toFixed(2)}M`
                        : result.portfolio.totalValue >= 1000
                        ? `${(result.portfolio.totalValue / 1000).toFixed(2)}K`
                        : result.portfolio.totalValue.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-text-muted mb-1 uppercase tracking-wide">24h Change</div>
                    <div className={cn(
                      "text-2xl font-bold flex items-center justify-center gap-1",
                      result.portfolio.totalChange24h >= 0 ? "text-near-green" : "text-error"
                    )}>
                      {result.portfolio.totalChange24h >= 0
                        ? <ArrowUpRight className="w-5 h-5" />
                        : <ArrowDownRight className="w-5 h-5" />}
                      {Math.abs(result.portfolio.totalChange24h).toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-text-muted mb-1 uppercase tracking-wide">Top Holding</div>
                    <div className="text-xl font-bold text-text-primary">
                      {result.portfolio.topHolding?.symbol || '—'}
                    </div>
                    <div className="text-sm text-text-secondary">
                      ${result.portfolio.topHolding?.usdValue?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Holdings Table — Full Width */}
              <Card>
                <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400 shrink-0" />
                  Token Holdings
                </h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full text-sm min-w-[480px]">
                    <thead>
                      <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wide">
                        <th className="text-left py-3 pr-4">Token</th>
                        <th className="text-right py-3 px-4">Balance</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Value</th>
                        <th className="text-right py-3 pl-4">24h</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.portfolio.holdings
                        .filter(h => h.usdValue > 0.01 || h.balance > 0)
                        .slice(0, 15)
                        .map((holding, i) => (
                        <tr key={holding.contractAddress || i} className="border-b border-border/50 hover:bg-surface-hover transition-colors">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-xs font-bold text-text-primary border border-border">
                                {holding.symbol?.slice(0, 2) || '?'}
                              </div>
                              <div>
                                <div className="font-medium text-text-primary">{holding.symbol}</div>
                                <div className="text-xs text-text-muted truncate max-w-[120px]">{holding.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-text-secondary font-mono text-xs">
                            {holding.balance >= 1000000
                              ? `${(holding.balance / 1000000).toFixed(2)}M`
                              : holding.balance >= 1000
                              ? `${(holding.balance / 1000).toFixed(2)}K`
                              : holding.balance >= 1
                              ? holding.balance.toFixed(2)
                              : holding.balance.toFixed(6)}
                          </td>
                          <td className="text-right py-3 px-4 text-text-secondary font-mono text-xs">
                            {holding.price > 0
                              ? holding.price >= 1
                                ? `$${holding.price.toFixed(2)}`
                                : `$${holding.price.toFixed(6)}`
                              : '—'}
                          </td>
                          <td className="text-right py-3 px-4 text-text-primary font-semibold font-mono text-xs">
                            {holding.usdValue > 0
                              ? `$${holding.usdValue >= 1000 
                                  ? holding.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })
                                  : holding.usdValue.toFixed(2)}`
                              : '—'}
                          </td>
                          <td className="text-right py-3 pl-4">
                            {holding.price > 0 ? (
                              <span className={cn(
                                "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                                holding.priceChange24h >= 0
                                  ? "text-near-green bg-near-green/10"
                                  : "text-error bg-error/10"
                              )}>
                                {holding.priceChange24h >= 0 ? '+' : ''}
                                {holding.priceChange24h.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-xs text-text-muted">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.portfolio.holdings.filter(h => h.usdValue > 0.01 || h.balance > 0).length === 0 && (
                    <p className="text-center text-text-muted text-sm py-6">No priced tokens found</p>
                  )}
                </div>
              </Card>

              {/* Diversification Analysis Card */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-400" />
                    Diversification
                  </h3>
                  <span className={cn(
                    "text-xs font-medium px-3 py-1 rounded-full border",
                    result.portfolio.diversificationLabel.includes('Concentrated')
                      ? "text-warning bg-warning/10 border-warning/30"
                      : result.portfolio.diversificationLabel.includes('Well')
                      ? "text-near-green bg-near-green/10 border-near-green/30"
                      : "text-blue-400 bg-blue-400/10 border-blue-400/30"
                  )}>
                    {result.portfolio.diversificationLabel}
                  </span>
                </div>

                {/* Category Bars */}
                <div className="space-y-3">
                  {([
                    { key: 'infrastructure' as const, label: 'Infrastructure', color: 'bg-blue-500' },
                    { key: 'defi' as const, label: 'DeFi', color: 'bg-purple-500' },
                    { key: 'stablecoin' as const, label: 'Stablecoins', color: 'bg-near-green' },
                    { key: 'meme' as const, label: 'Meme', color: 'bg-pink-500' },
                    { key: 'other' as const, label: 'Other', color: 'bg-gray-500' },
                  ] as const).filter(cat => (result.portfolio?.diversification?.[cat.key] || 0) > 0)
                    .map(cat => {
                      const pct = result.portfolio?.diversification?.[cat.key] || 0;
                      return (
                        <div key={cat.key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-text-secondary">{cat.label}</span>
                            <span className="text-sm font-semibold text-text-primary">{pct}%</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-surface-hover overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-700", cat.color)}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Token count by category */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  {result.portfolio.holdings.length > 0 && (
                    <span className="text-xs text-text-muted">
                      {result.portfolio.holdings.filter(h => h.price > 0).length} priced tokens
                      {' · '}
                      {result.portfolio.holdings.filter(h => h.price === 0).length} unpriced
                    </span>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* Cards Grid — 2x2 on desktop, single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 2. Security Profile Card */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                Security Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ScoreGauge score={result.analysis?.details?.securityScore || 0} label="Security" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <Key className="w-4 h-4 text-near-green" />
                      <span className="text-sm text-text-primary">
                        {result.analysis?.securityProfile?.fullAccessKeys ?? 0} Full Access
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Key className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-text-primary">
                        {result.analysis?.securityProfile?.functionCallKeys ?? 0} Function Call
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Risk Flags */}
                {(result.analysis?.securityProfile?.riskFlags?.length || 0) > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    {result.analysis?.securityProfile?.riskFlags?.map((flag, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{flag}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {(result.analysis?.securityProfile?.riskFlags?.length || 0) === 0 && (
                  <div className="flex items-center gap-2 text-xs text-near-green pt-2 border-t border-border">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>No security risks detected</span>
                  </div>
                )}
              </div>
            </Card>

            {/* 3. DeFi Activity Card */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                DeFi &amp; NFT Activity
              </h3>
              <div className="space-y-4">
                {/* Top Protocols */}
                {(result.analysis?.defiActivity?.topProtocols?.length || 0) > 0 ? (
                  <div className="space-y-2">
                    {result.analysis?.defiActivity?.topProtocols?.slice(0, 5).map((proto, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          <span className="text-sm text-text-primary">{proto.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-surface-hover text-text-muted">
                            {proto.category}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted">{proto.interactions} txs</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">No known DeFi protocol interactions detected.</p>
                )}
                
                {/* Staking + NFT row */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-text-primary">
                      {result.analysis?.defiActivity?.hasStaking 
                        ? `${result.analysis.defiActivity.stakedAmount} NEAR staked`
                        : 'No staking'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-text-primary">
                      {result.analysis?.defiActivity?.nftCount || 0} NFTs
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 4. Activity Pattern Card */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Activity Patterns
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-text-muted mb-1">Avg TX / Day</div>
                    <div className="text-lg font-semibold text-text-primary">
                      {result.analysis?.activityPattern?.avgTxPerDay?.toFixed(2) || '0'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted mb-1">Most Active Day</div>
                    <div className="text-lg font-semibold text-text-primary">
                      {result.analysis?.activityPattern?.mostActiveDay || 'Unknown'}
                    </div>
                  </div>
                </div>
                
                {/* Send/Receive Ratio */}
                <RatioBar 
                  sent={result.analysis?.activityPattern?.sendReceiveRatio 
                    ? Math.round(result.analysis.activityPattern.sendReceiveRatio * 100) : 50}
                  received={result.analysis?.activityPattern?.sendReceiveRatio 
                    ? Math.round(100) : 50}
                />
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-text-muted">Account Age</span>
                  <span className="text-sm text-text-primary font-medium">
                    {result.analysis?.walletAge?.days 
                      ? `${result.analysis.walletAge.days} days`
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">First Seen</span>
                  <span className="text-sm text-text-primary">
                    {formatDate(result.analysis?.walletAge?.created || null)}
                  </span>
                </div>
              </div>
            </Card>

            {/* 5. Wallet Overview Card */}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-near-green" />
                Wallet Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Balance</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatBalance(result.walletData?.balance || '0')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Total Transactions</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {(result.walletData?.stats?.total_transactions || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Token Holdings</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {result.walletData?.tokens?.length || 0} tokens
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">NFT Holdings</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {result.walletData?.nftCount || result.analysis?.defiActivity?.nftCount || 0} NFTs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Storage Used</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatStorage(result.walletData?.storageUsage || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-text-muted">Last Activity</span>
                  <span className="text-sm text-text-primary">
                    {formatDate(result.walletData?.stats?.last_transaction || null)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* 6. Radar Chart Card — Full Width */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-near-green" />
              Score Breakdown
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                {generateRadarChart(result.analysis?.details || {
                  ageScore: 0, activityScore: 0, diversityScore: 0,
                  balanceScore: 0, securityScore: 0, defiScore: 0
                })}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  { label: 'Age', score: result.analysis?.details?.ageScore || 0, icon: <Clock className="w-4 h-4" /> },
                  { label: 'Activity', score: result.analysis?.details?.activityScore || 0, icon: <Zap className="w-4 h-4" /> },
                  { label: 'Diversity', score: result.analysis?.details?.diversityScore || 0, icon: <Globe className="w-4 h-4" /> },
                  { label: 'Balance', score: result.analysis?.details?.balanceScore || 0, icon: <Coins className="w-4 h-4" /> },
                  { label: 'Security', score: result.analysis?.details?.securityScore || 0, icon: <Lock className="w-4 h-4" /> },
                  { label: 'DeFi', score: result.analysis?.details?.defiScore || 0, icon: <Layers className="w-4 h-4" /> },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 p-2 rounded-lg bg-surface-hover">
                    <span className="text-text-muted">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-xs text-text-muted">{item.label}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                          <div className="h-full rounded-full bg-near-green transition-all duration-700"
                            style={{ width: `${item.score}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-text-primary w-8 text-right">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 7. Key Insights Card — Full Width */}
          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-near-green" />
              Intelligence Report
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {(result.analysis?.keyInsights || []).map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface-hover">
                  <div className="w-2 h-2 rounded-full bg-near-green mt-2 flex-shrink-0" />
                  <p className="text-text-secondary text-sm">{insight}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <a 
                href={`/observatory?tool=constellation&address=${result.address}`}
                className="inline-flex items-center gap-2 px-4 py-3 min-h-[44px] bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 active:scale-[0.97] transition-all text-sm"
              >
                <Network className="w-4 h-4" />
                View in Constellation Map
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
