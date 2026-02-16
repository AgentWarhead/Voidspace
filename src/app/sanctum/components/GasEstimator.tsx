'use client';

import { useState, useMemo } from 'react';
import { Zap, TrendingDown, AlertTriangle } from 'lucide-react';

interface GasEstimatorProps {
  code: string;
  network?: 'testnet' | 'mainnet';
}

interface GasEstimate {
  deploy: bigint;
  avgCall: bigint;
  maxCall: bigint;
  storage: bigint;
  optimizations: Optimization[];
}

interface Optimization {
  id: string;
  title: string;
  description: string;
  savings: string;
  severity: 'low' | 'medium' | 'high';
  line?: number;
}

const NEAR_PER_TGAS = 0.0001; // 1 TGas = 0.0001 NEAR
const NEAR_PRICE_USD = 5.50; // Approximate, should fetch live

export function GasEstimator({ code, network = 'testnet' }: GasEstimatorProps) {
  const [showOptimizations, setShowOptimizations] = useState(false);

  const estimate = useMemo(() => {
    if (!code) return null;
    return analyzeGas(code);
  }, [code]);

  if (!code) {
    return (
      <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Zap className="w-5 h-5" />
          <span>Write some code to see gas estimates</span>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  const deployNear = Number(estimate.deploy) / 1e12 * NEAR_PER_TGAS * 1000;
  const avgCallNear = Number(estimate.avgCall) / 1e12 * NEAR_PER_TGAS * 1000;

  return (
    <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-void-purple/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Gas Estimator</h3>
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
            {network}
          </span>
        </div>
        {estimate.optimizations.length > 0 && (
          <button
            onClick={() => setShowOptimizations(!showOptimizations)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-3 h-3" />
            {estimate.optimizations.length} suggestions
          </button>
        )}
      </div>

      {/* Gas Breakdown */}
      <div className="p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <GasCard
          label="Deploy Cost"
          tgas={estimate.deploy}
          near={deployNear}
          icon="🚀"
        />
        <GasCard
          label="Avg Call"
          tgas={estimate.avgCall}
          near={avgCallNear}
          icon="⚡"
        />
        <GasCard
          label="Max Call"
          tgas={estimate.maxCall}
          near={Number(estimate.maxCall) / 1e12 * NEAR_PER_TGAS * 1000}
          icon="🔥"
        />
        <GasCard
          label="Storage"
          tgas={estimate.storage}
          near={Number(estimate.storage) / 1e12 * NEAR_PER_TGAS * 1000}
          icon="💾"
        />
      </div>

      {/* Optimizations */}
      {showOptimizations && estimate.optimizations.length > 0 && (
        <div className="border-t border-void-purple/20 p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            Gas Optimization Suggestions
          </h4>
          {estimate.optimizations.map((opt) => (
            <div
              key={opt.id}
              className={`p-3 rounded-lg border ${
                opt.severity === 'high'
                  ? 'bg-red-500/10 border-red-500/30'
                  : opt.severity === 'medium'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-sm font-medium text-white">{opt.title}</h5>
                  <p className="text-xs text-gray-400 mt-1">{opt.description}</p>
                </div>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                  {opt.savings}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 bg-void-black/30 text-xs text-gray-500 flex items-center justify-between">
        <span>Estimates based on code analysis • Actual costs may vary</span>
        <span>NEAR ≈ ${NEAR_PRICE_USD}</span>
      </div>
    </div>
  );
}

interface GasCardProps {
  label: string;
  tgas: bigint;
  near: number;
  icon: string;
}

function GasCard({ label, tgas, near, icon }: GasCardProps) {
  const tgasNum = Number(tgas) / 1e12;
  
  return (
    <div className="bg-void-black/30 rounded-lg p-2 sm:p-3">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
        <span className="text-sm sm:text-base">{icon}</span>
        <span className="text-[10px] sm:text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-base sm:text-lg font-bold text-white">
        {tgasNum.toFixed(1)} <span className="text-[10px] sm:text-xs text-gray-500">TGas</span>
      </div>
      <div className="text-[10px] sm:text-xs text-void-cyan">
        ~{near.toFixed(4)} NEAR
      </div>
    </div>
  );
}

// Analyze code and estimate gas
function analyzeGas(code: string): GasEstimate {
  const lines = code.split('\n').length;
  const functions = (code.match(/pub fn/g) || []).length;
  const structs = (code.match(/pub struct/g) || []).length;
  const storageOps = (code.match(/env::storage|self\./g) || []).length;
  const loops = (code.match(/for |while |loop /g) || []).length;
  const crossContract = (code.match(/Promise|ext_|cross_contract/g) || []).length;

  // Base deploy cost (in gas units, not TGas)
  let deploy = BigInt(lines * 1e9); // ~1 TGas per 1000 lines base
  deploy += BigInt(structs * 5e10); // structs add complexity
  deploy += BigInt(functions * 2e10); // functions add cost

  // Average call cost
  let avgCall = BigInt(5e12); // 5 TGas base
  avgCall += BigInt(storageOps * 1e12); // storage ops are expensive
  avgCall += BigInt(loops * 2e12); // loops can be expensive

  // Max call (worst case)
  let maxCall = avgCall * BigInt(3);
  maxCall += BigInt(crossContract * 10e12); // cross-contract calls are very expensive

  // Storage cost
  const storage = BigInt(structs * 1e12 + storageOps * 5e11);

  // Generate optimizations
  const optimizations: Optimization[] = [];

  if (loops > 2) {
    optimizations.push({
      id: 'loops',
      title: 'Multiple Loops Detected',
      description: 'Consider using iterators or combining loops to reduce gas costs.',
      savings: '~10-30% on calls',
      severity: 'medium',
    });
  }

  if (storageOps > 5) {
    optimizations.push({
      id: 'storage',
      title: 'Heavy Storage Usage',
      description: 'Batch storage operations where possible. Consider using LookupMap instead of UnorderedMap for large datasets.',
      savings: '~20-50% on storage',
      severity: 'high',
    });
  }

  if (code.includes('String') && !code.includes('&str')) {
    optimizations.push({
      id: 'strings',
      title: 'String Allocations',
      description: 'Use &str references instead of String where possible to reduce allocations.',
      savings: '~5-15% on calls',
      severity: 'low',
    });
  }

  if (crossContract > 0 && !code.includes('callback')) {
    optimizations.push({
      id: 'callbacks',
      title: 'Cross-Contract Without Callbacks',
      description: 'Cross-contract calls should handle callbacks for reliability.',
      savings: 'Reliability improvement',
      severity: 'medium',
    });
  }

  if (code.includes('Vec<') && code.includes('push')) {
    optimizations.push({
      id: 'vec',
      title: 'Dynamic Vec Growth',
      description: 'Pre-allocate Vec capacity with Vec::with_capacity() if size is known.',
      savings: '~5-10% on calls',
      severity: 'low',
    });
  }

  return {
    deploy,
    avgCall,
    maxCall,
    storage,
    optimizations,
  };
}

// Compact version for header
export function GasEstimatorCompact({ code }: { code: string }) {
  const estimate = useMemo(() => {
    if (!code) return null;
    return analyzeGas(code);
  }, [code]);

  if (!estimate) return null;

  const avgTgas = (Number(estimate.avgCall) / 1e12).toFixed(1);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
      <Zap className="w-3 h-3 text-amber-400" />
      <span className="text-xs text-amber-400">~{avgTgas} TGas/call</span>
    </div>
  );
}
