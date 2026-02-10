'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Shield, TrendingUp, Activity, Wallet, AlertTriangle, CheckCircle, Network, RotateCcw, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { cn } from '@/lib/utils';

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
}

interface VoidLensResult {
  address: string;
  walletData: WalletData;
  analysis: ReputationAnalysis;
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
  
  const stageTimeouts = useRef<NodeJS.Timeout[]>([]);
  const scoreAnimationRef = useRef<number | null>(null);

  // Initialize loading stages
  const initializeLoadingStages = (): LoadingStage[] => [
    { id: 'fetch', label: 'Fetching on-chain data...', duration: 1000, completed: false },
    { id: 'analyze', label: 'Analyzing transaction patterns...', duration: 1500, completed: false },
    { id: 'generate', label: 'Generating reputation report...', duration: 1500, completed: false }
  ];

  // Clear all stage timeouts
  const clearStageTimeouts = () => {
    stageTimeouts.current.forEach(timeout => clearTimeout(timeout));
    stageTimeouts.current = [];
  };

  // Set address from initialAddress prop if provided
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  // Start loading stage progression
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

  // Animate score counting up
  const animateScore = (targetScore: number) => {
    setShowScoreAnimation(true);
    setAnimatedScore(0);
    
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds
    
    const updateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(targetScore * easedProgress);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        scoreAnimationRef.current = requestAnimationFrame(updateScore);
      }
    };
    
    scoreAnimationRef.current = requestAnimationFrame(updateScore);
  };

  // Get error message based on type
  const getErrorMessage = (type: ErrorType, message: string) => {
    switch (type) {
      case 'validation':
        return 'Please enter a valid NEAR wallet address';
      case 'not-found':
        return 'Wallet not found. Please check the address and try again.';
      case 'rate-limit':
        return 'Too many requests. Please wait a moment and try again.';
      case 'server-error':
        return 'Our servers are experiencing issues. Please try again in a few minutes.';
      case 'network-error':
        return 'Network connection error. Please check your internet and try again.';
      default:
        return message || 'An unexpected error occurred';
    }
  };

  // Classify error type
  const classifyError = (error: Error, status?: number): ErrorType => {
    if (status === 404) return 'not-found';
    if (status === 429) return 'rate-limit';
    if (status && status >= 500) return 'server-error';
    if (error.message.includes('fetch') || error.message.includes('network')) return 'network-error';
    return 'server-error';
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes === 0) return 'just now';
    if (minutes === 1) return '1m ago';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearStageTimeouts();
      if (scoreAnimationRef.current) {
        cancelAnimationFrame(scoreAnimationRef.current);
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!address.trim()) {
      setError('Please enter a NEAR wallet address');
      setErrorType('validation');
      return;
    }

    setLoading(true);
    setError('');
    setErrorType(null);
    setResult(null);
    setShowScoreAnimation(false);
    
    // Start multi-step loading animation
    startLoadingStages();

    try {
      const response = await fetch('/api/void-lens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: address.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || 'Failed to analyze wallet');
        const errorType = classifyError(error, response.status);
        setErrorType(errorType);
        throw error;
      }

      const data = await response.json();
      
      // Add analysis timestamp
      const resultWithTimestamp = {
        ...data,
        analysisTimestamp: Date.now()
      };
      
      // Complete all loading stages immediately
      clearStageTimeouts();
      setLoadingStages(prev => prev.map(stage => ({ ...stage, completed: true })));
      
      setResult(resultWithTimestamp);
      
      // Start score animation after a brief delay
      setTimeout(() => {
        animateScore(data.analysis.score);
      }, 300);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error.message);
      if (!errorType) {
        setErrorType(classifyError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'text-near-green border-near-green bg-near-green/10';
      case 'MEDIUM':
        return 'text-warning border-warning bg-warning/10';
      case 'HIGH':
        return 'text-error border-error bg-error/10';
      default:
        return 'text-text-secondary border-border bg-surface';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return <CheckCircle className="w-4 h-4" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-near-green';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance) || 0;
    if (num === 0) return '0 NEAR';
    if (num < 0.01) return '<0.01 NEAR';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M NEAR`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K NEAR`;
    return `${num.toFixed(2)} NEAR`;
  };

  // Generate radar chart SVG
  const generateRadarChart = (scores: { ageScore: number; activityScore: number; diversityScore: number; balanceScore: number }) => {
    const size = 250;
    const center = size / 2;
    const maxRadius = center - 40;
    
    const axes = [
      { label: 'Age', angle: 0, score: scores.ageScore },
      { label: 'Activity', angle: 90, score: scores.activityScore },
      { label: 'Diversity', angle: 180, score: scores.diversityScore },
      { label: 'Balance', angle: 270, score: scores.balanceScore }
    ];

    // Convert polar coordinates to cartesian
    const polarToCartesian = (angle: number, radius: number) => ({
      x: center + radius * Math.cos((angle - 90) * Math.PI / 180),
      y: center + radius * Math.sin((angle - 90) * Math.PI / 180)
    });

    // Generate grid circles
    const gridCircles = [25, 50, 75, 100].map(percent => {
      const radius = (percent / 100) * maxRadius;
      return (
        <circle
          key={percent}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      );
    });

    // Generate axis lines
    const axisLines = axes.map(axis => {
      const end = polarToCartesian(axis.angle, maxRadius);
      return (
        <line
          key={axis.label}
          x1={center}
          y1={center}
          x2={end.x}
          y2={end.y}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
      );
    });

    // Generate score polygon
    const scorePoints = axes.map(axis => {
      const radius = (axis.score / 100) * maxRadius;
      return polarToCartesian(axis.angle, radius);
    });

    const scorePolygonPath = scorePoints.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    // Generate labels
    const labels = axes.map(axis => {
      const labelRadius = maxRadius + 20;
      const pos = polarToCartesian(axis.angle, labelRadius);
      return (
        <text
          key={axis.label}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255, 255, 255, 0.8)"
          fontSize="12"
          fontWeight="500"
        >
          {axis.label}
        </text>
      );
    });

    // Generate score labels
    const scoreLabels = axes.map(axis => {
      const scoreRadius = (axis.score / 100) * maxRadius;
      const pos = polarToCartesian(axis.angle, scoreRadius + 15);
      return (
        <text
          key={`score-${axis.label}`}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#10B981"
          fontSize="10"
          fontWeight="600"
        >
          {axis.score}
        </text>
      );
    });

    return (
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {gridCircles}
          {axisLines}
          <path
            d={scorePolygonPath}
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10B981"
            strokeWidth="2"
          />
          {labels}
          {scoreLabels}
        </svg>
      </div>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-near-green/20 flex items-center justify-center">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-near-green" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Void Lens</h1>
        </div>
        <p className="text-text-secondary text-sm sm:text-lg max-w-2xl mx-auto px-4">
          Advanced NEAR wallet reputation scoring powered by blockchain analytics and AI
        </p>
      </div>

      {/* Search Interface */}
      <Card className="max-w-2xl mx-auto" padding="lg">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Enter NEAR wallet address (e.g., alice.near)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
          </div>

          {/* Example Wallets */}
          <div className="space-y-2">
            <p className="text-xs text-text-muted">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {['root.near', 'zavodil.near', 'chadoh.near'].map((example) => (
                <button
                  key={example}
                  onClick={() => {
                    setAddress(example);
                    setTimeout(() => handleAnalyze(), 100);
                  }}
                  className="text-xs px-2 py-1 bg-surface border border-border rounded-full hover:border-near-green/30 cursor-pointer transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={loading || !address.trim()}
            className="w-full"
            variant="primary"
          >
            {!loading ? (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Analyze Reputation
              </div>
            ) : null}
          </Button>
          
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
          
          {/* Improved Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-error/10 border border-error/20 animate-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-error text-sm font-medium mb-2">
                    {errorType ? getErrorMessage(errorType, error) : error}
                  </p>
                  <Button
                    onClick={handleAnalyze}
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
      </Card>

      {/* Results */}
      {result && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Score Card */}
            <Card className="lg:col-span-2" variant="glass" glow hover>
              <div className="text-center mb-6">
                <div className={cn(
                  "text-5xl sm:text-6xl font-bold mb-2 transition-transform duration-300",
                  getScoreColor(result.analysis.score),
                  showScoreAnimation ? "scale-105" : "scale-100"
                )}>
                  {showScoreAnimation ? animatedScore : result.analysis.score}
                </div>
                <div className="text-text-secondary text-sm sm:text-base">Reputation Score</div>
                
                <div className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium mt-3",
                  getRiskColor(result.analysis.riskLevel)
                )}>
                  {getRiskIcon(result.analysis.riskLevel)}
                  {result.analysis.riskLevel} RISK
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Activity Summary</h3>
                  <p className="text-text-secondary">{result.analysis.activitySummary}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Score Breakdown</h3>
                  {generateRadarChart(result.analysis.details)}
                </div>
              </div>
            </Card>

            {/* Wallet Info */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Overview
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-text-muted">Address</div>
                    <div className="text-text-primary font-mono text-sm break-all">
                      {result.walletData.account}
                    </div>
                    {/* Freshness Indicator */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                      <span>
                        Analyzed {result.analysisTimestamp ? formatTimeAgo(result.analysisTimestamp) : 'recently'}
                      </span>
                      <span>·</span>
                      <button
                        onClick={() => {
                          setAddress(result.walletData.account);
                          setTimeout(() => handleAnalyze(), 100);
                        }}
                        className="inline-flex items-center gap-1 text-near-green hover:text-near-green/80 transition-colors"
                        disabled={loading}
                      >
                        <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
                        Refresh
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Balance</div>
                    <div className="text-text-primary font-semibold">
                      {formatBalance(result.walletData.balance)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Total Transactions</div>
                    <div className="text-text-primary font-semibold">
                      {result.walletData.stats.total_transactions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Token Holdings</div>
                    <div className="text-text-primary font-semibold">
                      {result.walletData.tokens.length} tokens
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-text-muted">First Transaction</div>
                    <div className="text-text-primary">
                      {formatDate(result.walletData.stats.first_transaction)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Last Transaction</div>
                    <div className="text-text-primary">
                      {formatDate(result.walletData.stats.last_transaction)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Analysis Time</div>
                    <div className="text-text-primary">
                      {formatDate(result.timestamp)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Key Insights */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {result.analysis.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface-hover">
                  <div className="w-2 h-2 rounded-full bg-near-green mt-2 flex-shrink-0" />
                  <p className="text-text-secondary text-sm">{insight}</p>
                </div>
              ))}
            </div>
            
            {/* View in Constellation Button */}
            <div className="flex justify-center">
              <a 
                href={`/observatory?tool=constellation&address=${result.address}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
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