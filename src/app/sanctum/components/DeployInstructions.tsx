'use client';

import { useState } from 'react';
// @ts-ignore
import { Rocket, ChevronDown, ChevronUp, Copy, Check, HelpCircle } from 'lucide-react';

interface DeployInstructionsProps {
  contractName?: string;
  category?: string;
  code: string;
}

interface Step {
  id: string;
  label: string;
  command: string;
  description: string;
  explanation: string;
  section: 'prerequisites' | 'deploy';
}

export function DeployInstructions({ contractName = 'my-contract', code }: DeployInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedHelp, setExpandedHelp] = useState<Set<string>>(new Set());

  const safeName = contractName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const crateName = safeName.replace(/-/g, '_');

  const steps: Step[] = [
    {
      id: 'rust',
      label: 'Rust installed',
      command: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh",
      description: 'Install the Rust toolchain',
      explanation: 'Rust is the programming language used for NEAR smart contracts. This installs rustc (compiler), cargo (package manager), and rustup (toolchain manager).',
      section: 'prerequisites',
    },
    {
      id: 'wasm',
      label: 'WASM target added',
      command: 'rustup target add wasm32-unknown-unknown',
      description: 'Add WebAssembly compilation target',
      explanation: 'NEAR contracts compile to WebAssembly (WASM). This adds the WASM target so Rust can cross-compile your contract to run on the NEAR Virtual Machine.',
      section: 'prerequisites',
    },
    {
      id: 'cli',
      label: 'NEAR CLI installed',
      command: 'npm install -g near-cli-rs',
      description: 'Install the NEAR command-line interface',
      explanation: 'NEAR CLI lets you interact with the NEAR blockchain from your terminal — deploy contracts, call methods, manage accounts, and more.',
      section: 'prerequisites',
    },
    {
      id: 'account',
      label: 'Testnet account created',
      command: 'near account create-account fund-later use-auto-generation save-to-folder ~/.near-credentials/implicit',
      description: 'Create a testnet account',
      explanation: 'You need a NEAR testnet account to deploy your contract. This creates an implicit account (based on a keypair) that you can fund from the testnet faucet.',
      section: 'prerequisites',
    },
    {
      id: 'build',
      label: 'Build contract',
      command: `RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release`,
      description: 'Compile your contract to WASM',
      explanation: 'This compiles your Rust code to an optimized WebAssembly binary. The -C link-arg=-s flag strips debug symbols to reduce file size. Release mode enables all optimizations.',
      section: 'deploy',
    },
    {
      id: 'deploy',
      label: 'Deploy to testnet',
      command: `near contract deploy ${safeName}.testnet use-file ./target/wasm32-unknown-unknown/release/${crateName}.wasm without-init-call network-config testnet sign-with-keychain send`,
      description: 'Upload your contract to NEAR testnet',
      explanation: 'This deploys your compiled WASM to the NEAR testnet. The contract will be accessible at the account ID you specify. You can view it on NEAR Explorer after deployment.',
      section: 'deploy',
    },
    {
      id: 'init',
      label: 'Initialize contract',
      command: `near contract call-function as-transaction ${safeName}.testnet new json-args '{}' prepaid-gas '30 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send`,
      description: 'Call the init function',
      explanation: "Most NEAR contracts have a `new()` initialization function that sets up the contract's state. This must be called once after deployment before the contract can be used.",
      section: 'deploy',
    },
  ];

  const toggleCheck = (id: string) => {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleHelp = (id: string) => {
    setExpandedHelp(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyCommand = async (id: string, command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const progress = checkedSteps.size / steps.length;
  const prereqs = steps.filter(s => s.section === 'prerequisites');
  const deploySteps = steps.filter(s => s.section === 'deploy');

  if (!code) return null;

  return (
    <div className="bg-void-darker/50 border border-void-purple/20 rounded-xl overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-void-purple/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-near-green to-emerald-500 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">Deploy Your Contract</h3>
            <p className="text-xs text-gray-500">
              {checkedSteps.size}/{steps.length} steps completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-24 h-1.5 bg-void-black/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-near-green rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-void-purple/20">
          {/* Prerequisites */}
          <div className="px-4 py-3 bg-void-black/20">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Prerequisites</h4>
            <div className="space-y-2">
              {prereqs.map(step => (
                <StepItem
                  key={step.id}
                  step={step}
                  isChecked={checkedSteps.has(step.id)}
                  isCopied={copiedId === step.id}
                  isHelpOpen={expandedHelp.has(step.id)}
                  onToggleCheck={() => toggleCheck(step.id)}
                  onCopy={() => copyCommand(step.id, step.command)}
                  onToggleHelp={() => toggleHelp(step.id)}
                />
              ))}
            </div>
          </div>

          {/* Build & Deploy */}
          <div className="px-4 py-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Build & Deploy</h4>
            <div className="space-y-2">
              {deploySteps.map(step => (
                <StepItem
                  key={step.id}
                  step={step}
                  isChecked={checkedSteps.has(step.id)}
                  isCopied={copiedId === step.id}
                  isHelpOpen={expandedHelp.has(step.id)}
                  onToggleCheck={() => toggleCheck(step.id)}
                  onCopy={() => copyCommand(step.id, step.command)}
                  onToggleHelp={() => toggleHelp(step.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepItem({
  step,
  isChecked,
  isCopied,
  isHelpOpen,
  onToggleCheck,
  onCopy,
  onToggleHelp,
}: {
  step: Step;
  isChecked: boolean;
  isCopied: boolean;
  isHelpOpen: boolean;
  onToggleCheck: () => void;
  onCopy: () => void;
  onToggleHelp: () => void;
}) {
  return (
    <div className={`rounded-lg border transition-colors ${
      isChecked
        ? 'bg-near-green/5 border-near-green/20'
        : 'bg-void-black/30 border-void-purple/10'
    }`}>
      <div className="flex items-start gap-3 p-3">
        {/* Checkbox */}
        <button
          onClick={onToggleCheck}
          className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            isChecked
              ? 'bg-near-green border-near-green text-white'
              : 'border-gray-600 hover:border-near-green/50'
          }`}
        >
          {isChecked && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-sm font-medium ${isChecked ? 'text-near-green line-through' : 'text-white'}`}>
              {step.label}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={onToggleHelp}
                className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                title="What's this?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCopy}
                className="p-1 text-gray-500 hover:text-near-green transition-colors"
                title="Copy command"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-near-green" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Command */}
          <code className="text-xs text-gray-400 font-mono block mt-1 truncate">
            $ {step.command}
          </code>

          {/* Help explanation */}
          {isHelpOpen && (
            <div className="mt-2 p-2 bg-void-black/50 rounded-lg border border-void-purple/10">
              <p className="text-xs text-gray-400 leading-relaxed">{step.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
