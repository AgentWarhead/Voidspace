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

// NEAR RPC helpers
const NEAR_RPC_URLS: Record<string, string> = {
  mainnet: 'https://rpc.mainnet.near.org',
  testnet: 'https://rpc.testnet.near.org',
};

// Internal method names to filter out from WASM exports
const INTERNAL_METHODS = new Set([
  'memory', '__data_end', '__heap_base', '__indirect_function_table',
  '_start', '__wasm_call_ctors', 'allocate', 'deallocate',
  'register_len', 'read_register', 'current_account_id',
  'signer_account_id', 'signer_account_pk', 'predecessor_account_id',
  'input', 'block_index', 'block_timestamp', 'epoch_height',
  'storage_usage', 'account_balance', 'account_locked_balance',
  'attached_deposit', 'prepaid_gas', 'used_gas', 'random_seed',
  'sha256', 'keccak256', 'keccak512', 'ripemd160', 'ecrecover',
  'value_return', 'panic', 'panic_utf8', 'log', 'log_utf8',
  'promise_create', 'promise_then', 'promise_and', 'promise_batch_create',
  'promise_batch_then', 'promise_batch_action_create_account',
  'promise_batch_action_deploy_contract', 'promise_batch_action_function_call',
  'promise_batch_action_function_call_weight',
  'promise_batch_action_transfer', 'promise_batch_action_stake',
  'promise_batch_action_add_key_with_full_access',
  'promise_batch_action_add_key_with_function_call',
  'promise_batch_action_delete_key', 'promise_batch_action_delete_account',
  'promise_results_count', 'promise_result', 'promise_return',
  'storage_write', 'storage_read', 'storage_remove', 'storage_has_key',
  'validator_stake', 'validator_total_stake', 'alt_bn128_g1_multiexp',
  'alt_bn128_g1_sum', 'alt_bn128_pairing_check',
]);

// View method heuristics — names that typically indicate read-only methods
const VIEW_METHOD_PREFIXES = ['get_', 'view_', 'is_', 'has_', 'check_', 'ft_balance_of', 'ft_total_supply', 'ft_metadata', 'nft_token', 'nft_tokens', 'nft_supply', 'nft_metadata', 'storage_balance_of'];

async function nearRpcCall(network: string, method: string, params: Record<string, unknown>): Promise<unknown> {
  const rpcUrl = NEAR_RPC_URLS[network];
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method,
      params,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.status}`);
  }
  
  return response.json();
}

async function validateAccount(network: string, accountId: string): Promise<boolean> {
  try {
    const result = await nearRpcCall(network, 'query', {
      request_type: 'view_account',
      finality: 'final',
      account_id: accountId,
    }) as { result?: { code_hash?: string }; error?: unknown };
    
    if (result.error) return false;
    return !!result.result;
  } catch {
    return false;
  }
}

async function fetchContractAbi(network: string, accountId: string): Promise<ExtractedMethod[] | null> {
  try {
    const result = await nearRpcCall(network, 'query', {
      request_type: 'call_function',
      finality: 'final',
      account_id: accountId,
      method_name: '__contract_abi',
      args_base64: '',
    }) as { result?: { result?: number[] }; error?: unknown };
    
    if (result.error || !result.result?.result) return null;
    
    // Decode the result (array of bytes → string → JSON)
    const bytes = new Uint8Array(result.result.result);
    const text = new TextDecoder().decode(bytes);
    const abi = JSON.parse(text);
    
    const methods: ExtractedMethod[] = [];
    
    // ABI schema: body.functions[]
    const functions = abi?.body?.functions || abi?.functions || [];
    for (const fn of functions) {
      if (!fn.name) continue;
      const args = (fn.params?.args || fn.params || [])
        .map((a: { name?: string }) => a.name)
        .filter(Boolean) as string[];
      const isView = fn.kind === 'view' || fn.is_view === true;
      methods.push({ name: fn.name, isView, args });
    }
    
    return methods.length > 0 ? methods : null;
  } catch {
    return null;
  }
}

function extractMethodNamesFromWasm(base64Code: string): string[] {
  try {
    // Decode base64 to binary string
    const binaryStr = atob(base64Code);
    
    // Search for readable ASCII strings that look like method names
    // WASM exports contain method names as readable strings
    const methodNames: string[] = [];
    let currentStr = '';
    
    for (let i = 0; i < binaryStr.length; i++) {
      const charCode = binaryStr.charCodeAt(i);
      // Printable ASCII range for method names: letters, digits, underscore
      if ((charCode >= 97 && charCode <= 122) || // a-z
          (charCode >= 65 && charCode <= 90) ||  // A-Z
          (charCode >= 48 && charCode <= 57) ||  // 0-9
          charCode === 95) {                      // _
        currentStr += binaryStr[i];
      } else {
        if (currentStr.length >= 3 && currentStr.length <= 64) {
          // Filter: must contain at least one lowercase letter (not just constants)
          if (/[a-z]/.test(currentStr) && !INTERNAL_METHODS.has(currentStr)) {
            methodNames.push(currentStr);
          }
        }
        currentStr = '';
      }
    }
    
    // Deduplicate and filter for likely method names
    const unique = [...new Set(methodNames)];
    
    // Heuristic: keep names that look like Rust/NEAR method names
    return unique.filter(name => {
      // Must start with a letter or underscore
      if (!/^[a-z_]/.test(name)) return false;
      // Must be snake_case or simple name
      if (!/^[a-z][a-z0-9_]*$/.test(name)) return false;
      // Filter out likely internal strings
      if (name.startsWith('rust_') || name.startsWith('wasm_') || name.startsWith('alloc_')) return false;
      if (name === 'main' || name === 'abort' || name === 'handle_result') return false;
      return true;
    });
  } catch {
    return [];
  }
}

async function fetchContractMethodsFromWasm(network: string, accountId: string): Promise<ExtractedMethod[] | null> {
  try {
    const result = await nearRpcCall(network, 'query', {
      request_type: 'view_code',
      finality: 'final',
      account_id: accountId,
    }) as { result?: { code_base64?: string }; error?: unknown };
    
    if (result.error || !result.result?.code_base64) return null;
    
    const methodNames = extractMethodNamesFromWasm(result.result.code_base64);
    
    if (methodNames.length === 0) return null;
    
    return methodNames.map(name => ({
      name,
      isView: VIEW_METHOD_PREFIXES.some(prefix => name.startsWith(prefix)),
      args: [], // Can't determine args from WASM alone
    }));
  } catch {
    return null;
  }
}

export function ImportContract({ onImport, onCancel }: ImportContractProps) {
  const [mode, setMode] = useState<ImportMode>('address');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
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
    setLoadingStatus('');

    try {
      if (mode === 'address') {
        // Validate address format
        if (!address.includes('.near') && !address.includes('.testnet')) {
          throw new Error('Please enter a valid NEAR contract address (e.g., contract.testnet)');
        }

        // Step 1: Validate the account exists on-chain
        setLoadingStatus('Checking account on-chain...');
        const accountExists = await validateAccount(network, address);
        if (!accountExists) {
          throw new Error(`Account "${address}" not found on ${network}. Check the address and network.`);
        }

        // Step 2: Try to fetch ABI
        setLoadingStatus('Looking for contract ABI...');
        let methods = await fetchContractAbi(network, address);
        
        // Step 3: Fallback — extract from WASM binary
        if (!methods) {
          setLoadingStatus('No ABI found. Analyzing WASM binary for methods...');
          methods = await fetchContractMethodsFromWasm(network, address);
        }

        // Step 4: If all failed, show helpful message
        if (!methods || methods.length === 0) {
          throw new Error(
            "Couldn't auto-detect methods from on-chain data. This contract may not export ABI metadata. " +
            "Try pasting the contract source code instead for full analysis."
          );
        }

        const result: ImportedContract = {
          source: 'address',
          address,
          name: address.split('.')[0],
          network,
          methods,
        };

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
                {loadingStatus || 'Analyzing...'}
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
