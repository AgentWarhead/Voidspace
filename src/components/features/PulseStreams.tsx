'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Filter, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface TransactionData {
  hash: string;
  block_height: number;
  block_timestamp: string;
  signer_id: string;
  receiver_id: string;
  action_kind: string;
  args: Record<string, unknown>;
  deposit: string;
  gas: string;
  method_name?: string;
  status: 'SUCCESS' | 'FAILURE';
}

interface StreamFilters {
  txType: string;
  minAmount: number;
  accounts: string[];
  includeContracts: boolean;
}

interface PulseStreamsResponse {
  transactions: TransactionData[];
  count: number;
  timestamp: string;
  hasNew?: boolean;
}

const TX_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'functioncall', label: 'Function Calls' },
  { value: 'createaccount', label: 'Account Creation' },
  { value: 'deploycontract', label: 'Deploy Contract' },
  { value: 'stake', label: 'Staking' },
];

export function PulseStreams() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({ total: 0, filtered: 0 });
  
  const [filters, setFilters] = useState<StreamFilters>({
    txType: 'all',
    minAmount: 0,
    accounts: [],
    includeContracts: true
  });
  
  const [tempFilters, setTempFilters] = useState<StreamFilters>(filters);
  const [accountInput, setAccountInput] = useState('');

  const fetchTransactions = useCallback(async (polling = false) => {
    try {
      const params = new URLSearchParams();
      if (filters.txType !== 'all') params.set('txType', filters.txType);
      if (filters.minAmount > 0) params.set('minAmount', filters.minAmount.toString());
      if (filters.accounts.length > 0) params.set('accounts', filters.accounts.join(','));
      params.set('includeContracts', filters.includeContracts.toString());

      let response;
      if (polling && lastTimestamp) {
        // Use POST endpoint for polling with lastTimestamp
        response = await fetch('/api/pulse-streams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastTimestamp, filters })
        });
      } else {
        // Use GET endpoint for initial load
        response = await fetch(`/api/pulse-streams?${params}`);
      }

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data: PulseStreamsResponse = await response.json();
      
      if (polling) {
        if (data.hasNew && data.transactions.length > 0) {
          setTransactions(prev => [...data.transactions, ...prev].slice(0, 100));
        }
      } else {
        setTransactions(data.transactions);
      }
      
      setStats({ total: data.count, filtered: data.transactions.length });
      setLastTimestamp(data.timestamp);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [filters, lastTimestamp]);

  // Initial load
  useEffect(() => {
    fetchTransactions();
  }, [filters, fetchTransactions]);

  // Polling effect for real-time updates
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      fetchTransactions(true);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [isStreaming, fetchTransactions]);

  const handleStartStreaming = () => {
    setIsStreaming(true);
    fetchTransactions(); // Fresh start
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
    setTransactions([]); // Clear existing transactions
  };

  const addAccount = () => {
    if (accountInput.trim() && !tempFilters.accounts.includes(accountInput.trim())) {
      setTempFilters(prev => ({
        ...prev,
        accounts: [...prev.accounts, accountInput.trim()]
      }));
      setAccountInput('');
    }
  };

  const removeAccount = (account: string) => {
    setTempFilters(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a !== account)
    }));
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount) || 0;
    if (num === 0) return '0 NEAR';
    if (num < 0.001) return '<0.001 NEAR';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M NEAR`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K NEAR`;
    return `${num.toFixed(3)} NEAR`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getActionIcon = (actionKind: string) => {
    switch (actionKind.toLowerCase()) {
      case 'transfer':
        return <ArrowRight className="w-4 h-4" />;
      case 'functioncall':
        return <Zap className="w-4 h-4" />;
      case 'stake':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionKind: string) => {
    switch (actionKind.toLowerCase()) {
      case 'transfer':
        return 'text-near-green bg-near-green/10 border-near-green/20';
      case 'functioncall':
        return 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20';
      case 'stake':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-text-secondary bg-surface-hover border-border';
    }
  };

  const truncateAddress = (address: string, length = 12) => {
    if (address.length <= length) return address;
    return `${address.slice(0, length)}...`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-accent-cyan" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Pulse Streams</h1>
            <p className="text-text-secondary text-sm sm:text-base">Real-time NEAR blockchain transaction feed</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant={showFilters ? "secondary" : "ghost"}
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
          >
            <Filter className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          
          <Button
            variant={isStreaming ? "secondary" : "primary"}
            onClick={isStreaming ? handleStopStreaming : handleStartStreaming}
            size="sm"
            className={cn(
              "transition-all",
              isStreaming && "animate-pulse-glow"
            )}
          >
            {isStreaming ? (
              <><Pause className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Stop Stream</span></>
            ) : (
              <><Play className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Start Stream</span></>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-2" padding="sm">
        <div className="flex items-center flex-wrap gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full",
              isStreaming ? "bg-near-green animate-pulse" : "bg-text-muted"
            )} />
            <span className="text-xs sm:text-sm text-text-secondary">
              {isStreaming ? 'Live' : 'Paused'}
            </span>
          </div>
          
          <div className="text-xs sm:text-sm text-text-secondary">
            <span className="font-medium">{transactions.length}</span> txns
          </div>
          
          <div className="text-xs sm:text-sm text-text-secondary hidden sm:block">
            Updated: {lastTimestamp ? formatTime(lastTimestamp) : 'Never'}
          </div>
        </div>
        
        <div className="text-xs text-text-muted">
          Updates every 5s
        </div>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="space-y-4" padding="lg">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Stream Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Transaction Type</label>
              <select
                value={tempFilters.txType}
                onChange={(e) => setTempFilters(prev => ({ ...prev, txType: e.target.value }))}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary"
              >
                {TX_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-2">Min Amount (NEAR)</label>
              <Input
                type="number"
                value={tempFilters.minAmount}
                onChange={(e) => setTempFilters(prev => ({ 
                  ...prev, 
                  minAmount: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
            
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempFilters.includeContracts}
                  onChange={(e) => setTempFilters(prev => ({ 
                    ...prev, 
                    includeContracts: e.target.checked 
                  }))}
                  className="w-4 h-4"
                />
                <span className="text-sm text-text-secondary">Include contracts</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-text-secondary mb-2">Specific Accounts</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                placeholder="Enter account ID (e.g., alice.near)"
                onKeyPress={(e) => e.key === 'Enter' && addAccount()}
              />
              <Button onClick={addAccount} size="sm">Add</Button>
            </div>
            
            {tempFilters.accounts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tempFilters.accounts.map(account => (
                  <Badge 
                    key={account} 
                    variant="glass"
                    className="cursor-pointer hover:bg-error/20 hover:text-error"
                    onClick={() => removeAccount(account)}
                  >
                    {account} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button onClick={applyFilters} variant="primary">Apply Filters</Button>
            <Button 
              onClick={() => {
                setTempFilters({
                  txType: 'all',
                  minAmount: 0,
                  accounts: [],
                  includeContracts: true
                });
              }}
              variant="secondary"
            >
              Reset
            </Button>
          </div>
        </Card>
      )}

      {/* Transaction Stream */}
      <Card padding="none" className="overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-text-primary">Transaction Feed</h3>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary mb-2">No transactions found</p>
              <p className="text-text-muted text-sm">
                {isStreaming ? 'Waiting for new transactions...' : 'Start streaming to see real-time data'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {transactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-surface-hover transition-colors border-b border-border last:border-b-0"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium",
                        getActionColor(tx.action_kind)
                      )}>
                        {getActionIcon(tx.action_kind)}
                        {tx.action_kind}
                      </div>
                      <div className="flex items-center gap-2">
                        {parseFloat(tx.deposit) > 0 && (
                          <span className="text-xs font-medium text-text-primary">
                            {formatAmount(tx.deposit)}
                          </span>
                        )}
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          tx.status === 'SUCCESS' ? 'bg-near-green' : 'bg-error'
                        )} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-mono text-text-secondary truncate max-w-[120px]">
                        {truncateAddress(tx.signer_id, 10)}
                      </span>
                      <ArrowRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                      <span className="font-mono text-text-secondary truncate max-w-[120px]">
                        {truncateAddress(tx.receiver_id, 10)}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {formatTime(tx.block_timestamp)} • Block #{tx.block_height.toLocaleString()}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn(
                        "flex items-center gap-2 px-2 py-1 rounded-md border text-xs font-medium",
                        getActionColor(tx.action_kind)
                      )}>
                        {getActionIcon(tx.action_kind)}
                        {tx.action_kind}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-mono text-sm text-text-secondary truncate">
                          {truncateAddress(tx.signer_id)}
                        </span>
                        <ArrowRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                        <span className="font-mono text-sm text-text-secondary truncate">
                          {truncateAddress(tx.receiver_id)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {parseFloat(tx.deposit) > 0 && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-text-primary">
                            {formatAmount(tx.deposit)}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-right">
                        <div className="text-xs text-text-muted">
                          {formatTime(tx.block_timestamp)}
                        </div>
                        <div className="text-xs text-text-muted">
                          Block #{tx.block_height.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        tx.status === 'SUCCESS' ? 'bg-near-green' : 'bg-error'
                      )} />
                    </div>
                  </div>
                  
                  {tx.method_name && (
                    <div className="mt-2 text-xs text-text-muted">
                      Method: <span className="font-mono">{tx.method_name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}