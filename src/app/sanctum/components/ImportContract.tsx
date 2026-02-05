'use client';

import { useState } from 'react';
import { Link2, Code2, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportContractProps {
  onImport: (data: ImportedContract) => void;
  onCancel: () => void;
}

export interface ImportedContract {
  source: 'address' | 'code' | 'file';
  address?: string;
  code?: string;
  name: string;
  methods: ExtractedMethod[];
  network?: 'testnet' | 'mainnet';
}

export interface ExtractedMethod {
  name: string;
  isView: boolean;
  args: string[];
}

type ImportMode = 'address' | 'code' | 'file';

export function ImportContract({ onImport, onCancel }: ImportContractProps) {
  const [mode, setMode] = useState<ImportMode>('address');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ImportedContract | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      setMode('code');
    };
    reader.readAsText(file);
  };

  const analyzeContract = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      if (mode === 'address') {
        // Validate address format
        if (!address.includes('.near') && !address.includes('.testnet')) {
          throw new Error('Please enter a valid NEAR contract address (e.g., contract.testnet)');
        }

        // In production, we'd fetch the contract ABI from the chain
        // For now, we'll create a placeholder that prompts for code
        const result: ImportedContract = {
          source: 'address',
          address,
          name: address.split('.')[0],
          network,
          methods: [], // Would be populated from chain query
        };

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAnalysisResult(result);
        
      } else {
        // Analyze pasted/uploaded code
        if (!code.trim()) {
          throw new Error('Please paste or upload your contract code');
        }

        const methods = extractMethods(code);
        const contractName = extractContractName(code) || 'imported-contract';

        const result: ImportedContract = {
          source: mode === 'file' ? 'file' : 'code',
          code,
          name: contractName,
          methods,
        };

        // Simulate analysis
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalysisResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (analysisResult) {
      onImport(analysisResult);
    }
  };

  return (
    <div className="bg-void-darker border border-void-purple/30 rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📤</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Import Your Contract</h2>
        <p className="text-gray-400">Bring your existing contract and we&apos;ll build a webapp for it</p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('address'); setAnalysisResult(null); }}
          className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
            mode === 'address'
              ? 'bg-void-purple/20 border-void-purple/50 text-white'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-void-purple/40'
          }`}
        >
          <Link2 className="w-4 h-4" />
          Contract Address
        </button>
        <button
          onClick={() => { setMode('code'); setAnalysisResult(null); }}
          className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${
            mode === 'code'
              ? 'bg-void-purple/20 border-void-purple/50 text-white'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-void-purple/40'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Paste Code
        </button>
        <label
          className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'file'
              ? 'bg-void-purple/20 border-void-purple/50 text-white'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-void-purple/40'
          }`}
        >
          <span>📁</span>
          Upload File
          <input
            type="file"
            accept=".rs,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Input Area */}
      {mode === 'address' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Contract Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="mycontract.testnet"
              className="w-full bg-void-black/50 border border-void-purple/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-void-purple/50 font-mono"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Network</label>
            <div className="flex gap-2">
              <button
                onClick={() => setNetwork('testnet')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  network === 'testnet'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-void-black/30 border-void-purple/20 text-gray-400'
                }`}
              >
                Testnet
              </button>
              <button
                onClick={() => setNetwork('mainnet')}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  network === 'mainnet'
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-void-black/30 border-void-purple/20 text-gray-400'
                }`}
              >
                Mainnet
              </button>
            </div>
          </div>
        </div>
      )}

      {(mode === 'code' || mode === 'file') && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            {mode === 'file' ? 'Uploaded Code' : 'Contract Code (Rust)'}
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your Rust smart contract code here...

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    // ...
}"
            className="w-full h-64 bg-void-black/50 border border-void-purple/20 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-void-purple/50 font-mono text-sm resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            We&apos;ll analyze your code to extract public methods and generate matching UI components
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-medium">Contract analyzed successfully!</p>
              <p className="text-sm text-gray-400 mt-1">
                Found {analysisResult.methods.length} public methods
              </p>
            </div>
          </div>

          {analysisResult.methods.length > 0 && (
            <div className="bg-void-black/30 rounded-lg p-3 max-h-32 overflow-auto">
              <div className="space-y-1">
                {analysisResult.methods.slice(0, 10).map(m => (
                  <div key={m.name} className="flex items-center gap-2 text-sm">
                    <span className={m.isView ? 'text-green-400' : 'text-amber-400'}>
                      {m.isView ? '○' : '●'}
                    </span>
                    <code className="text-gray-300">{m.name}</code>
                    <span className="text-gray-600 text-xs">
                      ({m.args.join(', ') || 'no args'})
                    </span>
                  </div>
                ))}
                {analysisResult.methods.length > 10 && (
                  <p className="text-xs text-gray-500">
                    +{analysisResult.methods.length - 10} more methods
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        
        {!analysisResult ? (
          <button
            onClick={analyzeContract}
            disabled={isAnalyzing || (mode === 'address' ? !address : !code)}
            className="flex-1 py-3 bg-void-purple hover:bg-void-purple/90 disabled:bg-void-purple/50 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Contract
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="flex-1 py-3 bg-near-green hover:bg-near-green/90 text-black font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Continue to Webapp Builder
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Extract methods from Rust contract code
function extractMethods(code: string): ExtractedMethod[] {
  const methods: ExtractedMethod[] = [];
  
  // Match pub fn declarations
  const fnRegex = /pub fn (\w+)\s*\(\s*(?:&(?:mut\s+)?self)?(?:,?\s*)?([^)]*)\)/g;
  let match;
  
  while ((match = fnRegex.exec(code)) !== null) {
    const name = match[1];
    const argsStr = match[2].trim();
    
    // Skip init/new methods
    if (name === 'new' || name === 'init' || name === 'default') continue;
    
    // Parse arguments
    const args: string[] = [];
    if (argsStr) {
      const argParts = argsStr.split(',').map(a => a.trim()).filter(Boolean);
      for (const arg of argParts) {
        const argName = arg.split(':')[0].trim();
        if (argName && argName !== '&self' && argName !== '&mut self') {
          args.push(argName);
        }
      }
    }
    
    // Determine if view method (no &mut self)
    const contextStart = Math.max(0, match.index - 100);
    const contextEnd = match.index + match[0].length + 50;
    const context = code.slice(contextStart, contextEnd);
    const isView = !context.includes('&mut self');
    
    methods.push({ name, isView, args });
  }
  
  return methods;
}

// Try to extract contract name from code
function extractContractName(code: string): string | null {
  // Look for struct with #[near_bindgen]
  const structMatch = code.match(/#\[near_bindgen\]\s*(?:#\[.*?\]\s*)*(?:pub\s+)?struct\s+(\w+)/);
  if (structMatch) {
    return structMatch[1].toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
  }
  return null;
}
