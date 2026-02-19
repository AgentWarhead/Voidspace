'use client';

import { useState } from 'react';
import { Link2, Code2, ArrowRight, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ImportContractProps {
  onImport: (data: ImportedContract) => void;
  onCancel: () => void;
  /** Optional: called when user wants to start a chat with a prompt (e.g. Solidity conversion) */
  onStartChat?: (prompt: string) => void;
}

export interface ImportedContract {
  source: 'address' | 'code' | 'file' | 'solidity-convert';
  address?: string;
  code?: string;
  name: string;
  methods: ExtractedMethod[];
  network?: 'testnet' | 'mainnet';
  solidityCode?: string;
  conversionPrompt?: string;
}

export interface ExtractedMethod {
  name: string;
  isView: boolean;
  args: string[];
}

type ImportMode = 'address' | 'code' | 'file' | 'solidity';

// NEAR RPC helpers
const NEAR_RPC_URLS: Record<string, string> = {
  mainnet: 'https://rpc.mainnet.near.org',
  testnet: 'https://rpc.testnet.near.org',
};

// Internal method names to filter out from WASM exports
const INTERNAL_METHODS: Record<string, true> = {
  'memory': true, '__data_end': true, '__heap_base': true, '__indirect_function_table': true,
  '_start': true, '__wasm_call_ctors': true, 'allocate': true, 'deallocate': true,
  'register_len': true, 'read_register': true, 'current_account_id': true,
  'signer_account_id': true, 'signer_account_pk': true, 'predecessor_account_id': true,
  'input': true, 'block_index': true, 'block_timestamp': true, 'epoch_height': true,
  'storage_usage': true, 'account_balance': true, 'account_locked_balance': true,
  'attached_deposit': true, 'prepaid_gas': true, 'used_gas': true, 'random_seed': true,
  'sha256': true, 'keccak256': true, 'keccak512': true, 'ripemd160': true, 'ecrecover': true,
  'value_return': true, 'panic': true, 'panic_utf8': true, 'log': true, 'log_utf8': true,
  'promise_create': true, 'promise_then': true, 'promise_and': true, 'promise_batch_create': true,
  'promise_batch_then': true, 'promise_batch_action_create_account': true,
  'promise_batch_action_deploy_contract': true, 'promise_batch_action_function_call': true,
  'promise_batch_action_function_call_weight': true,
  'promise_batch_action_transfer': true, 'promise_batch_action_stake': true,
  'promise_batch_action_add_key_with_full_access': true,
  'promise_batch_action_add_key_with_function_call': true,
  'promise_batch_action_delete_key': true, 'promise_batch_action_delete_account': true,
  'promise_results_count': true, 'promise_result': true, 'promise_return': true,
  'storage_write': true, 'storage_read': true, 'storage_remove': true, 'storage_has_key': true,
  'validator_stake': true, 'validator_total_stake': true, 'alt_bn128_g1_multiexp': true,
  'alt_bn128_g1_sum': true, 'alt_bn128_pairing_check': true,
};

// View method heuristics — names that typically indicate read-only methods
const VIEW_METHOD_PREFIXES = ['get_', 'view_', 'is_', 'has_', 'check_', 'ft_balance_of', 'ft_total_supply', 'ft_metadata', 'nft_token', 'nft_tokens', 'nft_supply', 'nft_metadata', 'storage_balance_of'];

// Solidity → NEAR key differences guide
const SOLIDITY_NEAR_DIFFS = [
  { solidity: 'mapping(K => V)', near: 'LookupMap<K, V>', color: 'text-amber-400' },
  { solidity: 'msg.sender', near: 'env::predecessor_account_id()', color: 'text-cyan-400' },
  { solidity: 'payable', near: '#[payable]', color: 'text-green-400' },
  { solidity: 'require(cond)', near: 'assert!(cond)', color: 'text-purple-400' },
  { solidity: 'emit Event()', near: 'env::log_str()', color: 'text-pink-400' },
  { solidity: 'address', near: 'AccountId', color: 'text-blue-400' },
  { solidity: 'uint256', near: 'u128 / U128', color: 'text-orange-400' },
  { solidity: 'constructor()', near: '#[init] fn new()', color: 'text-near-green' },
];

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
    const methodNames: string[] = [];
    let currentStr = '';
    
    for (let i = 0; i < binaryStr.length; i++) {
      const charCode = binaryStr.charCodeAt(i);
      if ((charCode >= 97 && charCode <= 122) || // a-z
          (charCode >= 65 && charCode <= 90) ||  // A-Z
          (charCode >= 48 && charCode <= 57) ||  // 0-9
          charCode === 95) {                      // _
        currentStr += binaryStr[i];
      } else {
        if (currentStr.length >= 3 && currentStr.length <= 64) {
          if (/[a-z]/.test(currentStr) && !INTERNAL_METHODS[currentStr]) {
            methodNames.push(currentStr);
          }
        }
        currentStr = '';
      }
    }
    
    const unique = Array.from(new Set(methodNames));
    
    return unique.filter(name => {
      if (!/^[a-z_]/.test(name)) return false;
      if (!/^[a-z][a-z0-9_]*$/.test(name)) return false;
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
      args: [],
    }));
  } catch {
    return null;
  }
}

export function ImportContract({ onImport, onCancel, onStartChat }: ImportContractProps) {
  const [mode, setMode] = useState<ImportMode>('address');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [solidityCode, setSolidityCode] = useState('');
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

  const handleSolidityConvert = () => {
    if (!solidityCode.trim()) {
      setError('Please paste your Solidity contract code');
      return;
    }

    const prompt = `I have this Solidity smart contract and I want to convert it to NEAR/Rust. Here's the Solidity code:\n\n\`\`\`solidity\n${solidityCode}\n\`\`\`\n\nPlease convert this to a NEAR smart contract using near-sdk-rs. Show me a side-by-side comparison explaining every key difference between the Solidity and Rust/NEAR versions.`;

    if (onStartChat) {
      onStartChat(prompt);
    } else {
      // Fallback: pass as a special import
      const result: ImportedContract = {
        source: 'solidity-convert',
        solidityCode,
        conversionPrompt: prompt,
        name: 'solidity-conversion',
        methods: [],
      };
      onImport(result);
    }
  };

  const analyzeContract = async () => {
    setIsAnalyzing(true);
    setError(null);
    setLoadingStatus('');

    try {
      if (mode === 'address') {
        const trimmedAddress = address.trim();
        if (!trimmedAddress || trimmedAddress.length < 2) {
          throw new Error('Please enter a valid NEAR contract address (e.g., contract.testnet)');
        }
        // Accept any valid NEAR account format: name.testnet, name.near, hexhash (implicit)
        const validFormat = trimmedAddress.includes('.') || /^[0-9a-f]{64}$/.test(trimmedAddress);
        if (!validFormat) {
          throw new Error('Please enter a valid NEAR contract address (e.g., contract.testnet or myapp.near)');
        }

        setLoadingStatus('Checking account on-chain...');
        const accountExists = await validateAccount(network, address);
        if (!accountExists) {
          throw new Error(`Account "${address}" not found on ${network}. Check the address and network.`);
        }

        setLoadingStatus('Looking for contract ABI...');
        let methods = await fetchContractAbi(network, address);
        
        if (!methods) {
          setLoadingStatus('No ABI found. Analyzing WASM binary for methods...');
          methods = await fetchContractMethodsFromWasm(network, address);
        }

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
    <div className="bg-void-darker border border-void-purple/30 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📤</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Import Your Contract</h2>
        <p className="text-gray-400">Bring your existing contract — analyze, extend, or convert it with Sanctum AI</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => { setMode('address'); setAnalysisResult(null); setError(null); }}
          className={`py-3 px-3 min-h-[44px] rounded-xl border transition-all flex items-center justify-center gap-1.5 text-sm ${
            mode === 'address'
              ? 'bg-void-purple/20 border-void-purple/50 text-white'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-void-purple/40'
          }`}
        >
          <Link2 className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Contract</span> Address
        </button>
        <button
          onClick={() => { setMode('code'); setAnalysisResult(null); setError(null); }}
          className={`py-3 px-3 min-h-[44px] rounded-xl border transition-all flex items-center justify-center gap-1.5 text-sm ${
            mode === 'code'
              ? 'bg-void-purple/20 border-void-purple/50 text-white'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-void-purple/40'
          }`}
        >
          <Code2 className="w-4 h-4 flex-shrink-0" />
          Paste <span className="hidden sm:inline">NEAR</span> Code
        </button>
        <label
          className={`py-3 px-3 min-h-[44px] rounded-xl border transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer ${
            mode === 'file'
              ? 'bg-void-purple/20 border-void-purple/50 text-white'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-void-purple/40'
          }`}
          onClick={() => setMode('file')}
        >
          <span>📁</span>
          Upload <span className="hidden sm:inline">File</span>
          <input
            type="file"
            accept=".rs,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <button
          onClick={() => { setMode('solidity'); setAnalysisResult(null); setError(null); }}
          className={`py-3 px-3 min-h-[44px] rounded-xl border transition-all flex items-center justify-center gap-1.5 text-sm ${
            mode === 'solidity'
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-amber-500/30'
          }`}
        >
          <span>🔄</span>
          <span className="hidden sm:inline">Convert from</span> Solidity
        </button>
      </div>

      {/* ── Address Input ── */}
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

      {/* ── Paste NEAR/Rust Code ── */}
      {(mode === 'code' || mode === 'file') && (
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            {mode === 'file' ? 'Uploaded Code' : 'Contract Code (Rust / NEAR)'}
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
            className="w-full h-48 sm:h-64 bg-void-black/50 border border-void-purple/20 rounded-xl px-3 sm:px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-void-purple/50 font-mono text-sm resize-none"
          />
          <p className="text-xs text-gray-500 mt-2">
            We&apos;ll analyze your code to extract public methods and generate matching UI components
          </p>
        </div>
      )}

      {/* ── Convert from Solidity ── */}
      {mode === 'solidity' && (
        <div className="space-y-4">
          {/* Header banner */}
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-sm font-medium text-amber-300">Solidity → NEAR Conversion</p>
              <p className="text-xs text-gray-400">Paste your Solidity contract and Sanctum will guide the conversion</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Solidity Contract Code</label>
            <textarea
              value={solidityCode}
              onChange={(e) => setSolidityCode(e.target.value)}
              placeholder="// Paste your Solidity contract here...

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyToken {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, 'Insufficient balance');
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}"
              className="w-full h-48 sm:h-56 bg-void-black/50 border border-amber-500/20 rounded-xl px-3 sm:px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-amber-500/40 font-mono text-sm resize-none"
            />
          </div>

          {/* Key differences guide */}
          <div className="bg-void-black/40 border border-void-purple/20 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>💡</span> Key Translation Guide
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOLIDITY_NEAR_DIFFS.map((diff, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <code className="text-gray-500 font-mono shrink-0">{diff.solidity}</code>
                  <span className="text-gray-600">→</span>
                  <code className={`font-mono ${diff.color} shrink-0`}>{diff.near}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Convert button */}
          <button
            onClick={handleSolidityConvert}
            disabled={!solidityCode.trim()}
            className="w-full py-3 min-h-[44px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Convert to NEAR — Start Conversation
          </button>

          <p className="text-xs text-gray-600 text-center">
            Sanctum will explain each conversion step and help you understand the differences
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

      {/* Actions — only show for non-solidity modes */}
      {mode !== 'solidity' && (
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <button
            onClick={onCancel}
            className="min-h-[44px] px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          {!analysisResult ? (
            <button
              onClick={analyzeContract}
              disabled={isAnalyzing || (mode === 'address' ? !address : !code)}
              className="flex-1 min-h-[44px] py-3 bg-void-purple hover:bg-void-purple/90 disabled:bg-void-purple/50 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="truncate">{loadingStatus || 'Analyzing...'}</span>
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
              className="flex-1 min-h-[44px] py-3 bg-near-green hover:bg-near-green/90 text-black font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span className="hidden sm:inline">Continue to Sanctum</span>
              <span className="sm:hidden">Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Cancel for solidity mode */}
      {mode === 'solidity' && (
        <div className="mt-3 text-center">
          <button
            onClick={onCancel}
            className="min-h-[44px] px-6 py-3 text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// Extract methods from Rust contract code
function extractMethods(code: string): ExtractedMethod[] {
  const methods: ExtractedMethod[] = [];
  
  const fnRegex = /pub fn (\w+)\s*\(\s*(?:&(?:mut\s+)?self)?(?:,?\s*)?([^)]*)\)/g;
  let match;
  
  while ((match = fnRegex.exec(code)) !== null) {
    const name = match[1];
    const argsStr = match[2].trim();
    
    if (name === 'new' || name === 'init' || name === 'default') continue;
    
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
  const structMatch = code.match(/#\[near_bindgen\]\s*(?:#\[.*?\]\s*)*(?:pub\s+)?struct\s+(\w+)/);
  if (structMatch) {
    return structMatch[1].toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
  }
  return null;
}
