'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown, ChevronUp, BookOpen, Clock, CheckCircle2,
  Lightbulb, Zap, Globe, ArrowRight, Plug, Layout, Smartphone,
  Rocket,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FrontendIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

// ─── Interactive Visual: Data Flow Diagram ─────────────────────────────────────

const dataFlowSteps = [
  { id: 'ui', label: 'React UI', desc: 'User clicks button → triggers contract call', icon: '🖥️', color: 'from-blue-500/20 to-blue-500/10', border: 'border-blue-500/30' },
  { id: 'wallet', label: 'Wallet', desc: 'Wallet Selector signs the transaction', icon: '🔐', color: 'from-purple-500/20 to-purple-500/10', border: 'border-purple-500/30' },
  { id: 'rpc', label: 'RPC Node', desc: 'JSON-RPC sends tx to NEAR network', icon: '📡', color: 'from-cyan-500/20 to-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'contract', label: 'Contract', desc: 'WASM executes, state changes on-chain', icon: '📜', color: 'from-emerald-500/20 to-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'result', label: 'Result', desc: 'TX receipt returns → UI updates with new data', icon: '✅', color: 'from-green-500/20 to-green-500/10', border: 'border-green-500/30' },
];

function DataFlowDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="relative py-4">
      <div className="flex items-center justify-between gap-1">
        {dataFlowSteps.map((step, i) => (
          <React.Fragment key={step.id}>
            <motion.div
              className={cn(
                'flex-1 cursor-pointer rounded-lg border p-3 transition-all text-center',
                step.border,
                activeStep === i ? `bg-gradient-to-b ${step.color}` : 'bg-black/20'
              )}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
            >
              <div className="text-xl mb-1">{step.icon}</div>
              <div className="text-xs font-bold text-text-primary">{step.label}</div>
            </motion.div>
            {i < dataFlowSteps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-text-muted/40 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
      <AnimatePresence>
        {activeStep !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-black/30 rounded-lg p-3 border border-border">
              <code className="text-sm text-near-green font-mono">{dataFlowSteps[activeStep].desc}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted mt-4">
        👆 Click each stage to trace a transaction from UI to chain and back
      </p>
    </div>
  );
}

// ─── Concept Card ──────────────────────────────────────────────────────────────

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType;
  title: string;
  preview: string;
  details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card variant="glass" padding="md" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
          <p className="text-sm text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">
                  {details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

// ─── Mini Quiz ─────────────────────────────────────────────────────────────────

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 0;
  const options = [
    'View calls are free and don&apos;t require a wallet signature — they just read state',
    'You must attach NEAR tokens to every contract call, even view methods',
    'near-api-js can only be used with React — it doesn&apos;t work with Vue or vanilla JS',
    'The Wallet Selector only supports MyNearWallet — other wallets need custom code',
  ];
  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-near-green" />
        <h4 className="font-bold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-text-secondary mb-4">Which statement about frontend-to-NEAR interaction is correct?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : revealed && i === selected && i !== correctAnswer
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : selected === i
                    ? 'bg-surface-hover border-border-hover text-text-primary'
                    : 'bg-surface border-border text-text-secondary hover:border-border-hover'
            )}
          >
            <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-4 p-3 rounded-lg text-sm',
              selected === correctAnswer
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            )}
          >
            {selected === correctAnswer
              ? '✓ Correct! View calls read on-chain state without modifying it — they cost zero gas and don\'t need wallet approval. Only change methods (state mutations) require a signed transaction.'
              : '✗ Not quite. View calls are free read-only queries that don\'t require wallet signatures. near-api-js works with any JS framework, and Wallet Selector supports multiple wallets including Meteor, HERE, and Ledger.'}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

const FrontendIntegration: React.FC<FrontendIntegrationProps> = ({ isActive, onToggle }) => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
    progress['frontend-integration'] = true;
    localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
    setCompleted(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      {/* ── Accordion Header ── */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Frontend Integration</h3>
            <p className="text-text-muted text-sm">Connect React/Next.js apps to NEAR with near-api-js and Wallet Selector</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {/* ── Expanded Content ── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-near-green/20 p-6 space-y-8">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-near-green/20 bg-near-green/5 text-xs text-near-green">
                <BookOpen className="w-3 h-3" />
                Module 13 of 27
                <span className="text-text-muted">•</span>
                <Clock className="w-3 h-3" />
                50 min read
              </div>

              {/* The Big Idea */}
              <Card variant="glass" padding="lg" className="border-near-green/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">The Big Idea</h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Think of frontend integration as building a <span className="text-near-green font-medium">remote control for your smart contract</span>.
                  The contract lives on the blockchain (the TV), and your React app is the <span className="text-near-green font-medium">remote</span>.
                  You need <span className="text-near-green font-medium">near-api-js</span> (the infrared signal) to communicate,
                  and <span className="text-near-green font-medium">Wallet Selector</span> (the batteries) to authorize actions.
                  View calls are like checking the channel — free. Change calls are like buying pay-per-view — costs gas.
                </p>
              </Card>

              {/* Interactive Visual */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-2">📡 Transaction Data Flow</h3>
                <p className="text-sm text-text-muted mb-4">Trace a user action from the React UI through the wallet to on-chain execution and back.</p>
                <DataFlowDiagram />
              </div>

              {/* Pro Tip: RPC Providers */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/5 border border-indigo-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-indigo-400 text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Pro Tip
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Don&apos;t rely on the default public RPC (https://rpc.mainnet.near.org) for production apps — it has
                  rate limits. Use Pagoda&apos;s RPC (free tier available), Lava Network, or dRPC for reliable mainnet
                  access. Set the RPC URL via NEXT_PUBLIC_RPC_URL environment variable so you can switch providers
                  without code changes. For view calls, consider using multiple RPC endpoints with fallback logic.
                </p>
              </div>

              {/* Concept Cards */}
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">🧩 Core Concepts</h3>
                <div className="grid grid-cols-1 gap-4">
                  <ConceptCard
                    icon={Plug}
                    title="near-api-js & Wallet Selector"
                    preview="Two libraries that connect your frontend to NEAR"
                    details="near-api-js handles RPC communication — sending transactions and reading state. Wallet Selector provides a modal UI where users pick their preferred wallet (MyNearWallet, Meteor, HERE, Ledger). Together they abstract away the complexity of key management and transaction signing. Install both with npm."
                  />
                  <ConceptCard
                    icon={Layout}
                    title="View vs Change Calls"
                    preview="Read state for free, or modify state and pay gas"
                    details="View calls use the RPC provider directly — they&apos;re free, instant, and don&apos;t need wallet approval. Use them for fetching balances, reading config, and polling state. Change calls require a wallet signature, cost gas (paid in NEAR), and may attach a deposit. Always show loading states for change calls since they take 1-2 seconds."
                  />
                  <ConceptCard
                    icon={Globe}
                    title="React Context Pattern"
                    preview="Share wallet state across your entire component tree"
                    details="Create a NearProvider context that initializes the Wallet Selector once and exposes the connector, accountId, and helper methods to all child components. This prevents re-initialization on navigation and keeps wallet state consistent. Use useContext(NearContext) in any component that needs to read the connected account or call contract methods."
                  />
                  <ConceptCard
                    icon={Smartphone}
                    title="Error Handling & UX"
                    preview="Gracefully handle rejected transactions and network errors"
                    details="Users reject transactions, wallets disconnect, RPCs go down. Wrap every change call in try/catch. Show loading spinners during transactions. Display human-readable errors, not raw JSON. After successful transactions, show the TX hash with a link to NearBlocks. Refresh displayed data after state changes — the UI should always reflect the latest on-chain state."
                  />
                  <ConceptCard
                    icon={Zap}
                    title="Environment Configuration"
                    preview="Switch between testnet and mainnet with env variables"
                    details="Use NEXT_PUBLIC_NETWORK_ID and NEXT_PUBLIC_CONTRACT_ID environment variables. Set testnet values in .env.development and mainnet values in .env.production. This lets the same codebase target different networks without code changes. Never hardcode contract IDs or network URLs — always read from environment."
                  />
                  <ConceptCard
                    icon={Rocket}
                    title="Meta-Transactions (NEP-366)"
                    preview="Let users interact with your dApp without owning NEAR for gas"
                    details="Meta-transactions (NEP-366) enable gasless experiences by letting a relayer pay gas on the user&apos;s behalf. The user signs an off-chain DelegateAction, the relayer wraps it in a SignedDelegateAction and submits it to the network. This is game-changing for onboarding Web2 users — they don&apos;t need to buy NEAR before trying your app. Wallet Selector supports meta-transactions natively. Combine with named accounts from a registrar for a fully seamless signup flow."
                  />
                </div>
              </div>

              {/* Real World Example: useContract Hook */}
              <Card variant="glass" padding="lg" className="border-cyan-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" /> Real World Example
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  A custom React hook that wraps common contract interactions with loading states and error handling.
                </p>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <pre className="whitespace-pre leading-relaxed">{`// hooks/useContract.ts
import { useWalletSelector } from "./WalletSelectorContext";

export function useContract(contractId: string) {
  const { selector, accountId } = useWalletSelector();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewMethod = async (method: string, args = {}) => {
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({
      url: network.nodeUrl,
    });
    const res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: btoa(JSON.stringify(args)),
      finality: "optimistic",
    });
    return JSON.parse(
      Buffer.from(res.result).toString()
    );
  };

  const callMethod = async (
    method: string,
    args = {},
    deposit = "0"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await selector.wallet();
      const result = await wallet.signAndSendTransaction({
        receiverId: contractId,
        actions: [{
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas: "30000000000000",
            deposit,
          },
        }],
      });
      return result;
    } catch (err: any) {
      setError(err.message ?? "Transaction failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { viewMethod, callMethod, loading, error };
}`}</pre>
                </div>
              </Card>

              {/* Code Example: Wallet Selector Provider Pattern */}
              <Card variant="glass" padding="lg" className="border-indigo-500/20">
                <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Plug className="w-5 h-5 text-indigo-400" /> Wallet Selector Provider Setup
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  Initialize the Wallet Selector once and share it across your app via React Context.
                </p>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-text-secondary border border-border overflow-x-auto">
                  <pre className="whitespace-pre leading-relaxed">{`// context/WalletSelectorContext.tsx
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";

const NearContext = createContext<WalletSelectorContextValue | null>(null);

export function NearProvider({ children }: { children: ReactNode }) {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    setupWalletSelector({
      network: process.env.NEXT_PUBLIC_NETWORK_ID ?? "testnet",
      modules: [
        setupMyNearWallet(),
        setupMeteorWallet(),
        setupHereWallet(),
      ],
    }).then((sel) => {
      setSelector(sel);
      const state = sel.store.getState();
      const acct = state.accounts?.[0]?.accountId ?? null;
      setAccountId(acct);
      // Subscribe to account changes
      sel.store.observable.subscribe((nextState) => {
        setAccountId(nextState.accounts?.[0]?.accountId ?? null);
      });
    });
  }, []);

  if (!selector) return null; // or a loading spinner

  return (
    <NearContext.Provider value={{ selector, accountId }}>
      {children}
    </NearContext.Provider>
  );
}

export const useWalletSelector = () => {
  const ctx = useContext(NearContext);
  if (!ctx) throw new Error("useWalletSelector must be inside NearProvider");
  return ctx;
};`}</pre>
                </div>
              </Card>

              {/* Security Gotcha */}
              <Card variant="default" padding="md" className="border-red-500/20 bg-red-500/5">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ Security Gotcha</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>• Never store private keys in frontend code — the wallet handles signing securely</li>
                  <li>• Validate all user input before sending to the contract — don&apos;t trust the frontend alone</li>
                  <li>• Always verify the contract ID in your environment — a typo sends funds to the wrong account</li>
                  <li>• Don&apos;t expose RPC API keys in client-side bundles — use environment variables on the server</li>
                </ul>
              </Card>

              {/* Mini Quiz */}
              <MiniQuiz />

              {/* Key Takeaways */}
              <Card variant="glass" padding="lg" className="border-emerald-500/20">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {[
                    'View calls are free reads — use them for displaying data. Change calls cost gas and need wallet approval.',
                    'Wallet Selector gives users choice — support multiple wallets with one integration.',
                    'Use React Context to share wallet state globally — initialize once, use everywhere.',
                    'Always handle errors gracefully and show transaction results with NearBlocks links.',
                    'Meta-transactions (NEP-366) remove the gas barrier — perfect for onboarding Web2 users.',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-near-green mt-0.5 font-bold">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Mark Complete */}
              <motion.button
                onClick={handleComplete}
                disabled={completed}
                whileHover={{ scale: completed ? 1 : 1.02 }}
                whileTap={{ scale: completed ? 1 : 0.98 }}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold text-sm transition-all',
                  completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-near-green/10 text-near-green border border-near-green/20 hover:bg-near-green/20'
                )}
              >
                {completed ? '✓ Module Completed' : '✓ Mark Module Complete'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default FrontendIntegration;
