'use client';

import { useState } from 'react';
import { Search, Shield, TrendingUp, Activity, Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { Progress } from '@/components/ui/Progress';
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
}

export function VoidLens() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<VoidLensResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!address.trim()) {
      setError('Please enter a NEAR wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

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
        throw new Error(errorData.error || 'Failed to analyze wallet');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
              {['aurora.near', 'ref-finance.near', 'linear-protocol.near'].map((example) => (
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
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                Analyzing Wallet...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Analyze Reputation
              </div>
            )}
          </Button>
          
          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
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
                  "text-5xl sm:text-6xl font-bold mb-2",
                  getScoreColor(result.analysis.score)
                )}>
                  {result.analysis.score}
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
                  <div className="space-y-3">
                    {Object.entries(result.analysis.details).map(([key, score]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-text-secondary">
                            {key.replace('Score', '')}
                          </span>
                          <span className={getScoreColor(score)}>{score}/100</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.analysis.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface-hover">
                  <div className="w-2 h-2 rounded-full bg-near-green mt-2 flex-shrink-0" />
                  <p className="text-text-secondary text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}