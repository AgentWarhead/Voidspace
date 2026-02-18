'use client';

import { useState, useMemo } from 'react';
// @ts-ignore
import {
  Rocket, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft,
  Globe, FlaskConical, Wallet, ExternalLink, Loader2,
  Copy, Check, XCircle, Info, Zap, Shield,
} from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { parsePublicMethods } from './DownloadContract';
import { DeployCelebration } from './DeployCelebration';

interface DeployInstructionsProps {
  contractName?: string;
  category?: string;
  code: string;
  onDeploySuccess?: (result: { contractId: string; txHash: string; network: string }) => void;
}

type Network = 'testnet' | 'mainnet';
type DeployStage = 'idle' | 'deploying' | 'success' | 'error';

const DEPLOY_STEPS = [
  { id: 1, label: 'Checklist' },
  { id: 2, label: 'Network' },
  { id: 3, label: 'Wallet' },
  { id: 4, label: 'Deploy' },
];

const STATUS_MESSAGES = [
  'Validating contract code…',
  'Compiling to WebAssembly…',
  'Uploading to NEAR network…',
  'Verifying deployment…',
];

export function DeployInstructions({
  contractName = 'my-contract',
  category,
  code,
  onDeploySuccess,
}: DeployInstructionsProps) {
  const { isConnected, accountId, openModal } = useWallet();

  const [step, setStep] = useState(1);
  const [network, setNetwork] = useState<Network>('testnet');
  const [hasTestedOnTestnet, setHasTestedOnTestnet] = useState(false);
  const [stage, setStage] = useState<DeployStage>('idle');
  const [statusIdx, setStatusIdx] = useState(0);
  const [deployResult, setDeployResult] = useState<{
    contractId: string;
    txHash: string;
    network: string;
    explorerUrl: string;
  } | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Parse contract metadata
  const methods = useMemo(() => parsePublicMethods(code), [code]);
  const lineCount = useMemo(() => code.split('\n').filter(l => l.trim()).length, [code]);
  const methodCount = methods.length;
  const safeName = contractName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

  const canProceedStep1 = !!code;
  const canProceedStep2 = true; // network always selected
  const canProceedStep3 = isConnected;
  const canDeploy = isConnected && stage === 'idle';

  const handleDeploy = async () => {
    setStage('deploying');
    setDeployError(null);
    setStatusIdx(0);

    // Cycle through status messages
    const interval = setInterval(() => {
      setStatusIdx(prev => Math.min(prev + 1, STATUS_MESSAGES.length - 1));
    }, 700);

    try {
      const response = await fetch('/api/sanctum/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          projectName: safeName,
          category,
          network,
        }),
      });

      clearInterval(interval);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Deployment failed');
      }

      const explorerBase =
        network === 'testnet'
          ? 'https://testnet.nearblocks.io'
          : 'https://nearblocks.io';
      const explorerUrl = `${explorerBase}/txns/${data.transactionHash}`;

      const result = {
        contractId: data.contractId,
        txHash: data.transactionHash,
        network,
        explorerUrl,
      };

      setDeployResult(result);
      setStage('success');

      // Mark testnet deployed
      if (network === 'testnet') setHasTestedOnTestnet(true);

      // Trigger celebration
      setTimeout(() => setShowCelebration(true), 300);

      onDeploySuccess?.({ contractId: result.contractId, txHash: result.txHash, network });
    } catch (err) {
      clearInterval(interval);
      setDeployError(err instanceof Error ? err.message : 'Deployment failed');
      setStage('error');
    }
  };

  const reset = () => {
    setStage('idle');
    setDeployError(null);
    setDeployResult(null);
  };

  const copyHash = () => {
    if (!deployResult) return;
    navigator.clipboard.writeText(deployResult.txHash).catch(() => {});
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <>
      {/* Celebration overlay */}
      <DeployCelebration
        isVisible={showCelebration}
        contractId={deployResult?.contractId}
        network={deployResult?.network}
        explorerUrl={deployResult?.explorerUrl}
        onClose={() => setShowCelebration(false)}
      />

      <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl overflow-hidden">
        {/* Progress header */}
        <div className="px-4 py-3 border-b border-void-purple/20 bg-void-black/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-near-green to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Deploy Your Contract</h3>
              <p className="text-xs text-gray-500">Step {step} of {DEPLOY_STEPS.length}</p>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {DEPLOY_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.id
                        ? 'bg-near-green text-void-black'
                        : step === s.id
                        ? 'bg-void-purple text-white ring-2 ring-void-purple/30'
                        : 'bg-void-black/50 text-gray-600 border border-gray-700'
                    }`}
                  >
                    {step > s.id ? <Check className="w-3 h-3" /> : s.id}
                  </div>
                  <span className={`text-[9px] mt-0.5 font-medium ${step === s.id ? 'text-void-purple' : 'text-gray-600'}`}>
                    {s.label}
                  </span>
                </div>
                {i < DEPLOY_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mb-4 transition-colors ${step > s.id ? 'bg-near-green/50' : 'bg-gray-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-4">
          {/* ── STEP 1: Pre-deploy checklist ── */}
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Pre-Deploy Checklist</h4>

              {/* Contract summary */}
              <div className="bg-void-black/40 border border-void-purple/15 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-400 font-mono">
                  <span className="text-near-green font-semibold">{contractName}</span>
                  {' — '}
                  <span className="text-white">{lineCount}</span> lines,{' '}
                  <span className="text-white">{methodCount}</span> method{methodCount !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-2">
                {/* Code generated */}
                <ChecklistItem
                  status="ok"
                  label="Contract code generated"
                  detail="Your Rust smart contract is ready"
                />

                {/* Code review */}
                <ChecklistItem
                  status="warning"
                  label="Review your code"
                  detail="Check for logic errors before deploying"
                />

                {/* Tests */}
                <ChecklistItem
                  status="info"
                  label="Consider running tests first"
                  detail="Simulate contract calls in the Sandbox to catch bugs early"
                />

                {/* Audit */}
                <ChecklistItem
                  status="info"
                  label="Consider an audit for mainnet"
                  detail="For production contracts, a security audit is recommended"
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Choose target ── */}
          {step === 2 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Choose Deployment Target</h4>

              <div className="grid grid-cols-1 gap-3">
                <NetworkCard
                  id="testnet"
                  icon="🧪"
                  title="Testnet"
                  badge="Recommended"
                  description="Free to deploy. Perfect for testing. Can redeploy anytime."
                  selected={network === 'testnet'}
                  onSelect={() => setNetwork('testnet')}
                  badgeColor="bg-near-green/20 text-near-green border-near-green/30"
                />
                <NetworkCard
                  id="mainnet"
                  icon="🌐"
                  title="Mainnet"
                  description="Costs NEAR. This is permanent. Make sure you've tested first."
                  selected={network === 'mainnet'}
                  onSelect={() => setNetwork('mainnet')}
                  danger
                />
              </div>

              {/* Mainnet warning */}
              {network === 'mainnet' && !hasTestedOnTestnet && (
                <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">
                    We recommend testing on testnet first before deploying to mainnet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Connect wallet ── */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Connect Your Wallet</h4>
              <p className="text-xs text-gray-400">
                Your wallet is used to sign the deployment transaction.
              </p>

              {isConnected && accountId ? (
                <div className="flex items-center gap-3 p-4 bg-near-green/10 border border-near-green/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-near-green flex-shrink-0" />
                  <div>
                    <p className="text-xs text-near-green font-semibold">Wallet Connected</p>
                    <p className="text-sm text-white font-mono mt-0.5 break-all">{accountId}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-void-black/40 border border-gray-700 rounded-lg">
                    <Wallet className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <p className="text-sm text-gray-400">No wallet connected</p>
                  </div>
                  <button
                    onClick={openModal}
                    className="w-full py-3 bg-void-purple/20 hover:bg-void-purple/30 border border-void-purple/40 text-void-purple rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect NEAR Wallet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 4: Deploy ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">
                Deploy to {network === 'testnet' ? '🧪 Testnet' : '🌐 Mainnet'}
              </h4>

              {/* Summary */}
              <div className="bg-void-black/40 border border-void-purple/15 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract</span>
                  <span className="text-white font-mono">{contractName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Network</span>
                  <span className={network === 'testnet' ? 'text-near-green' : 'text-amber-400'}>
                    {network}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet</span>
                  <span className="text-white font-mono truncate max-w-[150px]">{accountId}</span>
                </div>
              </div>

              {/* Deploy button / loading / success / error */}
              {stage === 'idle' && (
                <button
                  onClick={handleDeploy}
                  disabled={!canDeploy}
                  className="w-full py-4 bg-near-green/20 hover:bg-near-green/30 disabled:opacity-50 border border-near-green/40 text-near-green rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-near-green/10"
                >
                  <Rocket className="w-5 h-5" />
                  Deploy to {network === 'testnet' ? 'Testnet' : 'Mainnet'}
                </button>
              )}

              {stage === 'deploying' && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-near-green/20 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-near-green/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-near-green animate-spin" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 animate-pulse">{STATUS_MESSAGES[statusIdx]}</p>
                </div>
              )}

              {stage === 'success' && deployResult && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-near-green/10 border border-near-green/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-near-green flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-near-green font-semibold">Deployed Successfully!</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{deployResult.contractId}</p>
                    </div>
                  </div>

                  {/* Tx hash */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2 bg-void-black/50 border border-void-purple/20 rounded-lg p-2.5">
                      <code className="text-xs text-gray-300 font-mono flex-1 truncate">
                        {deployResult.txHash}
                      </code>
                      <button
                        onClick={copyHash}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                      >
                        {copiedHash ? (
                          <Check className="w-3.5 h-3.5 text-near-green" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Explorer link */}
                  <a
                    href={deployResult.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-void-purple/20 hover:bg-void-purple/30 border border-void-purple/30 text-void-purple rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on NearBlocks
                  </a>

                  <button
                    onClick={() => setShowCelebration(true)}
                    className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm transition-colors"
                  >
                    🎉 Celebrate!
                  </button>
                </div>
              )}

              {stage === 'error' && (
                <div className="space-y-3">
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-red-400 font-semibold">Deployment Failed</p>
                      <p className="text-xs text-gray-400 mt-0.5">{deployError}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 p-3 bg-void-black/30 rounded-lg">
                    <p className="text-gray-400 font-medium">Suggestions:</p>
                    <p>• Make sure your wallet has enough NEAR for gas</p>
                    <p>• Check that your contract code compiles correctly</p>
                    <p>• Try deploying to testnet first</p>
                  </div>
                  <button
                    onClick={reset}
                    className="w-full py-2.5 bg-void-purple/20 hover:bg-void-purple/30 border border-void-purple/30 text-void-purple rounded-lg text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-4 pb-4 flex gap-2">
          {step > 1 && stage === 'idle' && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-void-black/40 hover:bg-void-black/60 border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < 4 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 3 && !canProceedStep3)
              }
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-void-purple/20 hover:bg-void-purple/30 disabled:opacity-50 border border-void-purple/40 text-void-purple rounded-lg text-sm font-semibold transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Sub-components ─── */

function ChecklistItem({
  status,
  label,
  detail,
}: {
  status: 'ok' | 'warning' | 'info';
  label: string;
  detail: string;
}) {
  const icon =
    status === 'ok' ? (
      <CheckCircle2 className="w-4 h-4 text-near-green flex-shrink-0" />
    ) : status === 'warning' ? (
      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
    ) : (
      <Info className="w-4 h-4 text-void-cyan flex-shrink-0" />
    );

  return (
    <div className="flex items-start gap-2.5 p-2.5 bg-void-black/30 border border-void-purple/10 rounded-lg">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

function NetworkCard({
  id,
  icon,
  title,
  badge,
  description,
  selected,
  onSelect,
  danger,
  badgeColor,
}: {
  id: string;
  icon: string;
  title: string;
  badge?: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  danger?: boolean;
  badgeColor?: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? danger
            ? 'border-amber-500/50 bg-amber-500/10'
            : 'border-near-green/50 bg-near-green/10'
          : 'border-void-purple/20 bg-void-black/30 hover:border-void-purple/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${selected ? (danger ? 'text-amber-400' : 'text-near-green') : 'text-white'}`}>
              {title}
            </span>
            {badge && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${badgeColor || 'bg-gray-700/50 text-gray-400 border-gray-600'}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${
          selected
            ? danger
              ? 'border-amber-500 bg-amber-500'
              : 'border-near-green bg-near-green'
            : 'border-gray-600'
        }`} />
      </div>
    </button>
  );
}
