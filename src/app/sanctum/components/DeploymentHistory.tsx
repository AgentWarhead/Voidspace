'use client';

import { useState, useEffect } from 'react';
import { Clock, ExternalLink, Copy, Check, Trash2, Star, Share2 } from 'lucide-react';

export interface DeployedContract {
  id: string;
  name: string;
  category: string;
  deployedAt: string;
  network: 'testnet' | 'mainnet';
  contractAddress: string;
  txHash: string;
  code: string;
  starred?: boolean;
}

interface DeploymentHistoryProps {
  onRemix: (code: string, name: string) => void;
  onShare: (contract: DeployedContract) => void;
}

const STORAGE_KEY = 'voidspace_deployments';

export function DeploymentHistory({ onRemix, onShare }: DeploymentHistoryProps) {
  const [deployments, setDeployments] = useState<DeployedContract[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'starred' | 'mainnet' | 'testnet'>('all');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDeployments(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse deployments:', e);
      }
    }
  }, []);

  // Save to localStorage
  const saveDeployments = (updated: DeployedContract[]) => {
    setDeployments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const copyAddress = async (address: string, id: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStar = (id: string) => {
    const updated = deployments.map(d => 
      d.id === id ? { ...d, starred: !d.starred } : d
    );
    saveDeployments(updated);
  };

  const deleteDeployment = (id: string) => {
    const updated = deployments.filter(d => d.id !== id);
    saveDeployments(updated);
  };

  const filteredDeployments = deployments.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'starred') return d.starred;
    return d.network === filter;
  });

  const getExplorerUrl = (contract: DeployedContract) => {
    const base = contract.network === 'mainnet' 
      ? 'https://nearblocks.io' 
      : 'https://testnet.nearblocks.io';
    return `${base}/address/${contract.contractAddress}`;
  };

  if (deployments.length === 0) {
    return (
      <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl p-6 text-center">
        <Clock className="w-12 h-12 text-void-purple/40 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">No Deployments Yet</h3>
        <p className="text-gray-400 text-sm">
          Your deployed contracts will appear here. Start building to create your portfolio!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 border-b border-void-purple/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-void-purple flex-shrink-0" />
          <h3 className="font-semibold text-white text-sm sm:text-base">Deployment History</h3>
          <span className="px-2 py-0.5 bg-void-purple/20 text-void-purple text-xs rounded-full">
            {deployments.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-1 overflow-x-auto">
          {(['all', 'starred', 'testnet', 'mainnet'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 min-h-[44px] text-xs rounded-lg transition-colors flex-shrink-0 ${
                filter === f
                  ? 'bg-void-purple text-white'
                  : 'text-gray-400 hover:text-white hover:bg-void-purple/20'
              }`}
            >
              {f === 'starred' ? '⭐' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredDeployments.map((contract) => (
          <div
            key={contract.id}
            className="px-3 sm:px-4 py-3 border-b border-void-purple/10 hover:bg-void-purple/5 transition-colors group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm sm:text-base truncate">{contract.name}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    contract.network === 'mainnet'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {contract.network}
                  </span>
                  <span className="px-2 py-0.5 bg-void-purple/20 text-void-purple text-xs rounded-full">
                    {contract.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <code className="text-void-cyan text-xs truncate max-w-[150px] sm:max-w-[200px]">
                    {contract.contractAddress}
                  </code>
                  <button
                    onClick={() => copyAddress(contract.contractAddress, contract.id)}
                    className="p-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === contract.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Deployed {new Date(contract.deployedAt).toLocaleDateString()} at{' '}
                  {new Date(contract.deployedAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleStar(contract.id)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-void-purple/20 rounded-lg transition-colors"
                  title={contract.starred ? 'Unstar' : 'Star'}
                >
                  <Star className={`w-4 h-4 ${contract.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => onRemix(contract.code, contract.name)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-void-purple/20 rounded-lg transition-colors"
                  title="Remix"
                >
                  <span className="text-sm">🔄</span>
                </button>
                <button
                  onClick={() => onShare(contract)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-void-purple/20 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
                <a
                  href={getExplorerUrl(contract)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-void-purple/20 rounded-lg transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <button
                  onClick={() => deleteDeployment(contract.id)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-3 bg-void-black/30 flex items-center justify-between text-xs text-gray-500">
        <span>
          {deployments.filter(d => d.network === 'mainnet').length} mainnet •{' '}
          {deployments.filter(d => d.network === 'testnet').length} testnet
        </span>
        <span>
          {deployments.filter(d => d.starred).length} starred
        </span>
      </div>
    </div>
  );
}

// Helper to save a new deployment (call this after successful deploy)
export function saveDeployment(contract: Omit<DeployedContract, 'id' | 'deployedAt'>) {
  const stored = localStorage.getItem(STORAGE_KEY);
  const existing: DeployedContract[] = stored ? JSON.parse(stored) : [];
  
  const newDeployment: DeployedContract = {
    ...contract,
    id: `deploy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    deployedAt: new Date().toISOString(),
  };
  
  const updated = [newDeployment, ...existing].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  return newDeployment;
}
