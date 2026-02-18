'use client';

import { useState, useCallback, useMemo } from 'react';
// @ts-ignore
import { Play, Square, RotateCcw, Terminal, CheckCircle, XCircle, Clock, Zap, Eye, ArrowRight, ChevronDown, ChevronUp, Cpu, Wifi } from 'lucide-react';
import { parsePublicMethods, type ParsedMethod } from './DownloadContract';

interface SimulationSandboxProps {
  code: string;
  category?: string;
  onClose: () => void;
}

interface SimulationResult {
  success: boolean;
  output: string;
  gasUsed: string;
  logs: string[];
  duration: number;
  stateChanges: Record<string, unknown>;
}

interface TestCase {
  id: string;
  name: string;
  method: string;
  args: string;
  caller: string;
  deposit: string;
  expected?: string;
  result?: SimulationResult;
  status: 'pending' | 'running' | 'passed' | 'failed';
}

// ─── Extended method type with mutability ───────────────────────────────────
interface MethodWithMutability {
  name: string;
  isMutating: boolean; // &mut self
  isView: boolean;     // &self (read-only)
  paramDefs: { name: string; type: string }[];
  returnType: string;
  isInit: boolean;
  isPayable: boolean;
  isPrivate: boolean;
  attributes: string[];
}

/** Parse pub fn methods AND detect &self vs &mut self mutability */
function parseMethodsWithMutability(code: string): MethodWithMutability[] {
  const methods: MethodWithMutability[] = [];
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Match multi-line-safe pub fn
    const fnMatch = line.match(/pub\s+fn\s+(\w+)\s*\(([^)]*)\)(?:\s*->\s*(.+?))?\s*\{?$/);
    if (!fnMatch) continue;

    const [, name, paramsStr, returnType] = fnMatch;

    // Detect mutability
    const isMutating = paramsStr.includes('&mut self');
    const isView = paramsStr.includes('&self') && !isMutating;

    // Collect attributes above this line
    const attributes: string[] = [];
    for (let j = i - 1; j >= Math.max(0, i - 6); j--) {
      const attrLine = lines[j].trim();
      if (attrLine.startsWith('#[')) {
        attributes.push(attrLine);
      } else if (attrLine === '' || attrLine.startsWith('//') || attrLine.startsWith('///')) {
        continue;
      } else {
        break;
      }
    }

    // Parse params — skip &self / &mut self, split name:type
    const paramDefs = paramsStr
      .split(',')
      .map(p => p.trim())
      .filter(p => p && !p.includes('&self') && !p.includes('&mut self') && p !== '')
      .map(p => {
        const colonIdx = p.indexOf(':');
        if (colonIdx === -1) return { name: p, type: 'String' };
        return {
          name: p.slice(0, colonIdx).trim(),
          type: p.slice(colonIdx + 1).trim(),
        };
      });

    methods.push({
      name,
      isMutating,
      isView,
      paramDefs,
      returnType: returnType?.trim() || 'void',
      isInit: attributes.some(a => a.includes('init')),
      isPayable: attributes.some(a => a.includes('payable')),
      isPrivate: attributes.some(a => a.includes('private')),
      attributes,
    });
  }

  return methods;
}

// ─── Transaction log entry ───────────────────────────────────────────────────
interface TxLogEntry {
  id: string;
  timestamp: string;
  method: string;
  params: Record<string, string>;
  gas?: string;
  deposit?: string;
  isMutating: boolean;
  result: {
    success: boolean;
    output: string;
    gasUsed: string;
    duration: number;
  };
}

// Category-specific test scenarios
const CATEGORY_SCENARIOS: Record<string, { name: string; steps: { method: string; args: string; caller: string; deposit: string }[] }[]> = {
  defi: [
    {
      name: 'DeFi Flow: Deposit → Balance → Withdraw',
      steps: [
        { method: 'deposit', args: '{}', caller: 'alice.testnet', deposit: '5' },
        { method: 'get_balance', args: '{"account_id": "alice.testnet"}', caller: 'alice.testnet', deposit: '0' },
        { method: 'withdraw', args: '{"amount": "2000000000000000000000000"}', caller: 'alice.testnet', deposit: '0' },
      ],
    },
  ],
  nfts: [
    {
      name: 'NFT Flow: Mint → Owner → Transfer',
      steps: [
        { method: 'nft_mint', args: '{"token_id": "1", "receiver_id": "alice.testnet"}', caller: 'admin.testnet', deposit: '0.1' },
        { method: 'nft_token', args: '{"token_id": "1"}', caller: 'alice.testnet', deposit: '0' },
        { method: 'nft_transfer', args: '{"receiver_id": "bob.testnet", "token_id": "1"}', caller: 'alice.testnet', deposit: '0.000000000000000000000001' },
      ],
    },
  ],
  daos: [
    {
      name: 'DAO Flow: Propose → Vote → Execute',
      steps: [
        { method: 'create_proposal', args: '{"description": "Fund project X"}', caller: 'alice.testnet', deposit: '0.1' },
        { method: 'vote', args: '{"proposal_id": 0, "vote": true}', caller: 'bob.testnet', deposit: '0' },
        { method: 'execute_proposal', args: '{"proposal_id": 0}', caller: 'alice.testnet', deposit: '0' },
      ],
    },
  ],
  token: [
    {
      name: 'Token Flow: Mint → Transfer → Balance',
      steps: [
        { method: 'ft_mint', args: '{"receiver_id": "alice.testnet", "amount": "1000"}', caller: 'admin.testnet', deposit: '0' },
        { method: 'ft_transfer', args: '{"receiver_id": "bob.testnet", "amount": "100"}', caller: 'alice.testnet', deposit: '0.000000000000000000000001' },
        { method: 'ft_balance_of', args: '{"account_id": "bob.testnet"}', caller: 'bob.testnet', deposit: '0' },
      ],
    },
  ],
};

// ─── Main Component ──────────────────────────────────────────────────────────

export function SimulationSandbox({ code, category, onClose }: SimulationSandboxProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', name: 'Initialize Contract', method: 'new', args: '{}', caller: 'owner.testnet', deposit: '0', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['🔮 Simulation Sandbox ready...']);
  const [newMethod, setNewMethod] = useState('');
  const [newArgs, setNewArgs] = useState('{}');
  const [newCaller, setNewCaller] = useState('alice.testnet');
  const [newDeposit, setNewDeposit] = useState('0');
  const [contractState, setContractState] = useState<Record<string, unknown>>({});
  const [activeTab, setActiveTab] = useState<'methods' | 'tests' | 'state' | 'flow'>('methods');
  const [showMethodDetails, setShowMethodDetails] = useState(false);

  // Parse methods
  const parsedMethods = useMemo(() => parsePublicMethods(code), [code]);
  const methodsWithMutability = useMemo(() => parseMethodsWithMutability(code), [code]);
  const availableMethodNames = useMemo(() => {
    const names = parsedMethods.map(m => m.name);
    return names.length > 0 ? names : ['new', 'get_greeting', 'set_greeting'];
  }, [parsedMethods]);

  // Transaction log (for Methods tab)
  const [txLog, setTxLog] = useState<TxLogEntry[]>([]);

  // Category scenarios
  const scenarios = category ? CATEGORY_SCENARIOS[category] || [] : [];

  const addTestCase = () => {
    if (!newMethod) return;
    const newCase: TestCase = {
      id: Date.now().toString(),
      name: `Test ${newMethod}`,
      method: newMethod,
      args: newArgs || '{}',
      caller: newCaller,
      deposit: newDeposit,
      status: 'pending',
    };
    setTestCases([...testCases, newCase]);
    setNewMethod('');
    setNewArgs('{}');
  };

  const loadScenario = (scenario: typeof scenarios[0]) => {
    const newCases: TestCase[] = scenario.steps.map((step, i) => ({
      id: `scenario-${Date.now()}-${i}`,
      name: `${scenario.name} #${i + 1}: ${step.method}`,
      method: step.method,
      args: step.args,
      caller: step.caller,
      deposit: step.deposit,
      status: 'pending' as const,
    }));
    setTestCases(prev => [...prev, ...newCases]);
    setConsoleOutput(prev => [...prev, `📋 Loaded scenario: ${scenario.name} (${newCases.length} steps)`]);
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(t => t.id !== id));
  };

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, '▶️ Starting simulation...']);
    let currentState: Record<string, unknown> = {};

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      setTestCases(prev => prev.map(t =>
        t.id === tc.id ? { ...t, status: 'running' as const } : t
      ));

      setConsoleOutput(prev => [...prev, `\n📝 Running: ${tc.caller} → ${tc.method}(${tc.args})${tc.deposit !== '0' ? ` [${tc.deposit} NEAR]` : ''}`]);

      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 800));

      const result = simulateExecution(tc.method, tc.args, tc.caller, tc.deposit, code, currentState);
      currentState = { ...currentState, ...result.stateChanges };
      setContractState({ ...currentState });

      setConsoleOutput(prev => [
        ...prev,
        result.success ? `✅ ${tc.method} completed` : `❌ ${tc.method} failed`,
        `   Gas: ${result.gasUsed} | Caller: ${tc.caller}`,
        ...result.logs.map(log => `   📋 ${log}`),
      ]);

      setTestCases(prev => prev.map(t =>
        t.id === tc.id
          ? { ...t, status: result.success ? 'passed' : 'failed', result }
          : t
      ));
    }

    setConsoleOutput(prev => [...prev, '\n🏁 Simulation complete!']);
    setIsRunning(false);
  }, [testCases, code]);

  const resetSimulation = () => {
    setTestCases(testCases.map(t => ({ ...t, status: 'pending' as const, result: undefined })));
    setConsoleOutput(['🔮 Simulation Sandbox ready...']);
    setContractState({});
  };

  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const failedCount = testCases.filter(t => t.status === 'failed').length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-void-purple/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">Simulation Sandbox</h3>
              <p className="text-sm text-gray-400 hidden sm:block">Test your contract before deploying</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {passedCount > 0 && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                {passedCount} passed
              </span>
            )}
            {failedCount > 0 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                {failedCount} failed
              </span>
            )}
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Panel */}
          <div className="md:w-1/2 border-r border-void-purple/20 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-void-purple/20 bg-void-black/30 overflow-x-auto">
              <button
                onClick={() => setActiveTab('methods')}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'methods' ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                ⚡ Methods
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'tests' ? 'text-green-400 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🧪 Tests
              </button>
              <button
                onClick={() => setActiveTab('state')}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'state' ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                💾 State
              </button>
              <button
                onClick={() => setActiveTab('flow')}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'flow' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🔀 Flow
              </button>
            </div>

            {/* ── METHODS TAB ── */}
            {activeTab === 'methods' && (
              <MethodsTab
                methods={methodsWithMutability}
                code={code}
                txLog={txLog}
                setTxLog={setTxLog}
              />
            )}

            {/* ── TESTS TAB ── */}
            {activeTab === 'tests' && (
              <>
                {/* Add Test Case */}
                <div className="p-4 border-b border-void-purple/20 bg-void-black/30">
                  <div className="flex gap-2 mb-2">
                    <select
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value)}
                      className="flex-1 bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-void-purple/50"
                    >
                      <option value="">Select method...</option>
                      {availableMethodNames.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <button
                      onClick={addTestCase}
                      disabled={!newMethod}
                      className="px-4 py-2 bg-void-purple/20 hover:bg-void-purple/30 disabled:opacity-50 text-void-purple rounded-lg transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={newArgs}
                      onChange={(e) => setNewArgs(e.target.value)}
                      placeholder='{"key": "value"}'
                      className="col-span-1 bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                    />
                    <input
                      type="text"
                      value={newCaller}
                      onChange={(e) => setNewCaller(e.target.value)}
                      placeholder="caller.testnet"
                      className="bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                    />
                    <input
                      type="text"
                      value={newDeposit}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      placeholder="0 NEAR"
                      className="bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Smart Scenarios */}
                  {scenarios.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 block mb-1">Quick scenarios:</span>
                      <div className="flex flex-wrap gap-1">
                        {scenarios.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => loadScenario(s)}
                            className="px-2 py-1 bg-void-purple/10 hover:bg-void-purple/20 text-void-purple text-xs rounded-lg border border-void-purple/20 transition-colors"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Test Cases List */}
                <div className="flex-1 overflow-auto p-4 space-y-2">
                  {testCases.map((tc) => (
                    <div
                      key={tc.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        tc.status === 'passed'
                          ? 'bg-green-500/10 border-green-500/30'
                          : tc.status === 'failed'
                          ? 'bg-red-500/10 border-red-500/30'
                          : tc.status === 'running'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-void-black/30 border-void-purple/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tc.status === 'passed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {tc.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                          {tc.status === 'running' && <Clock className="w-4 h-4 text-amber-400 animate-spin" />}
                          {tc.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-600" />}
                          <span className="text-sm font-medium text-white">{tc.name}</span>
                        </div>
                        <button
                          onClick={() => removeTestCase(tc.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <code className="text-xs text-gray-400 font-mono mt-1 block overflow-x-auto">
                        {tc.caller} → {tc.method}({tc.args}){tc.deposit !== '0' ? ` [${tc.deposit} NEAR]` : ''}
                      </code>
                      {tc.result && (
                        <div className="mt-2 text-xs">
                          <span className="text-gray-500">Gas: </span>
                          <span className="text-void-cyan">{tc.result.gasUsed}</span>
                          <span className="text-gray-500 ml-2">Time: </span>
                          <span className="text-void-cyan">{tc.result.duration}ms</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {testCases.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Add test cases to simulate your contract
                    </div>
                  )}
                </div>

                {/* Run Controls */}
                <div className="p-4 border-t border-void-purple/20 flex gap-2 flex-shrink-0">
                  <button
                    onClick={runSimulation}
                    disabled={isRunning || testCases.length === 0}
                    className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Square className="w-4 h-4" /> Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Run All Tests
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetSimulation}
                    disabled={isRunning}
                    className="px-4 py-2 bg-void-purple/20 hover:bg-void-purple/30 disabled:opacity-50 text-void-purple rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* ── STATE TAB ── */}
            {activeTab === 'state' && (
              <div className="flex-1 overflow-auto p-4">
                <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Contract State
                </h4>
                {Object.keys(contractState).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Run a simulation to see contract state
                  </div>
                ) : (
                  <pre className="bg-void-black/50 border border-void-purple/20 rounded-lg p-4 text-xs text-gray-300 font-mono overflow-x-auto overflow-y-auto">
                    {JSON.stringify(contractState, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* ── FLOW TAB ── */}
            {activeTab === 'flow' && (
              <div className="flex-1 overflow-auto p-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-3">Transaction Flow</h4>
                {testCases.filter(t => t.result).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Run a simulation to see the flow
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCases.filter(t => t.result).map((tc, i) => (
                      <div key={tc.id} className="relative">
                        {i < testCases.filter(t => t.result).length - 1 && (
                          <div className="absolute left-6 top-full w-px h-4 bg-void-purple/30" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                            tc.result?.success
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            #{i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="bg-void-black/30 border border-void-purple/20 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm flex-wrap overflow-x-auto">
                                <span className="text-amber-400 font-mono truncate max-w-[120px]">{tc.caller}</span>
                                <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-near-green font-mono font-medium">{tc.method}()</span>
                                <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-cyan-400 font-mono">Contract</span>
                              </div>
                              {tc.deposit !== '0' && (
                                <div className="text-xs text-amber-400/70 mt-1">
                                  💰 Attached: {tc.deposit} NEAR
                                </div>
                              )}
                              {tc.result && (
                                <div className="mt-2 space-y-1">
                                  {tc.result.logs.map((log, li) => (
                                    <div key={li} className="text-xs text-gray-500 flex items-center gap-1">
                                      <span className="text-gray-600">├─</span> {log}
                                    </div>
                                  ))}
                                  <div className="text-xs text-gray-600 flex items-center gap-1">
                                    <Zap className="w-3 h-3" /> {tc.result.gasUsed}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel — Console + Method Signatures */}
          <div className="md:w-1/2 flex flex-col overflow-hidden">
            {/* Method signatures toggle */}
            <button
              onClick={() => setShowMethodDetails(!showMethodDetails)}
              className="px-4 py-2 border-b border-void-purple/20 bg-void-black/50 flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                {parsedMethods.length} Methods Detected
              </span>
              {showMethodDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMethodDetails && (
              <div className="max-h-48 overflow-auto border-b border-void-purple/20 bg-void-black/30 p-3 space-y-2">
                {parsedMethods.map((m) => (
                  <MethodSignature key={m.name} method={m} />
                ))}
                {parsedMethods.length === 0 && (
                  <p className="text-xs text-gray-500">No methods detected in code</p>
                )}
              </div>
            )}

            {/* Console */}
            <div className="px-4 py-2 border-b border-void-purple/20 bg-void-black/50 flex items-center gap-2 flex-shrink-0">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Console Output</span>
            </div>
            <div className="flex-1 overflow-auto bg-void-black/50 p-4 font-mono text-sm">
              {consoleOutput.map((line, i) => (
                <div key={i} className={`${
                  line.startsWith('✅') ? 'text-green-400' :
                  line.startsWith('❌') ? 'text-red-400' :
                  line.startsWith('▶️') || line.startsWith('🏁') ? 'text-amber-400' :
                  line.startsWith('   ') ? 'text-gray-500' :
                  'text-gray-300'
                }`}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Methods Tab ─────────────────────────────────────────────────────────────

function MethodsTab({
  methods,
  code,
  txLog,
  setTxLog,
}: {
  methods: MethodWithMutability[];
  code: string;
  txLog: TxLogEntry[];
  setTxLog: React.Dispatch<React.SetStateAction<TxLogEntry[]>>;
}) {
  const [showLog, setShowLog] = useState(false);

  if (methods.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <Cpu className="w-10 h-10 text-gray-600" />
        <p className="text-gray-500 text-sm">No public methods detected in your contract.</p>
        <p className="text-gray-600 text-xs">Make sure the contract uses <code className="font-mono">pub fn</code> declarations.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Testnet note */}
      <div className="px-4 py-2 bg-void-black/40 border-b border-void-purple/15 flex items-center gap-2">
        <Wifi className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <p className="text-xs text-amber-300/80">
          💡 Connect to testnet to make real contract calls
        </p>
      </div>

      {/* Method list */}
      <div className="flex-1 overflow-auto p-3 space-y-2">
        {methods.map(m => (
          <MethodCallCard key={m.name} method={m} code={code} setTxLog={setTxLog} />
        ))}
      </div>

      {/* Transaction log toggle */}
      <div className="border-t border-void-purple/20 flex-shrink-0">
        <button
          onClick={() => setShowLog(s => !s)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors bg-void-black/40"
        >
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Transaction Log
            {txLog.length > 0 && (
              <span className="bg-void-purple/30 text-void-purple px-1.5 py-0.5 rounded-full text-[10px]">
                {txLog.length}
              </span>
            )}
          </span>
          {showLog ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {showLog && (
          <div className="max-h-40 overflow-auto bg-void-black/60 p-3 space-y-1.5">
            {txLog.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-2">No calls yet — use the method cards above</p>
            ) : (
              [...txLog].reverse().map(entry => (
                <div
                  key={entry.id}
                  className={`text-xs font-mono p-2 rounded border ${
                    entry.result.success
                      ? 'bg-green-500/5 border-green-500/20 text-green-400'
                      : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}
                >
                  <span className="text-gray-500">[{entry.timestamp}]</span>{' '}
                  <span className={entry.isMutating ? 'text-green-400' : 'text-blue-400'}>
                    {entry.isMutating ? 'CALL' : 'VIEW'}
                  </span>{' '}
                  <span className="text-white">{entry.method}</span>
                  {Object.keys(entry.params).length > 0 && (
                    <span className="text-gray-400">({JSON.stringify(entry.params)})</span>
                  )}
                  {' → '}
                  <span>{entry.result.success ? '✅ ' + entry.result.output : '❌ ' + entry.result.output}</span>
                  <span className="text-gray-600 ml-2">~{entry.result.gasUsed}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Per-method call card ─────────────────────────────────────────────────────

function MethodCallCard({
  method,
  code,
  setTxLog,
}: {
  method: MethodWithMutability;
  code: string;
  setTxLog: React.Dispatch<React.SetStateAction<TxLogEntry[]>>;
}) {
  const [paramValues, setParamValues] = useState<Record<string, string>>(
    Object.fromEntries(method.paramDefs.map(p => [p.name, '']))
  );
  const [gas, setGas] = useState('30');
  const [deposit, setDeposit] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; output: string; gasUsed: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const isView = method.isView && !method.isMutating;

  const handleCall = async () => {
    setIsLoading(true);
    setLastResult(null);

    // Simulate async call
    await new Promise(r => setTimeout(r, 300 + Math.random() * 500));

    const hasMethod = code.includes(`fn ${method.name}`);
    const success = hasMethod || Math.random() > 0.2;

    const mockOutput = success
      ? isView
        ? generateViewOutput(method.name, paramValues)
        : `Transaction submitted. Method ${method.name} executed successfully.`
      : `Error: panicked at 'Method ${method.name} failed'`;

    const baseGas = method.isInit ? 15 : method.isPayable ? 12 : isView ? 3 : 8;
    const gasUsed = `${(baseGas + Math.random() * 4).toFixed(2)} TGas`;

    const result = { success, output: mockOutput, gasUsed };
    setLastResult(result);

    setTxLog(prev => [
      ...prev,
      {
        id: `${method.name}-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: method.name,
        params: paramValues,
        gas,
        deposit,
        isMutating: method.isMutating,
        result: { success, output: mockOutput, gasUsed, duration: 300 + Math.floor(Math.random() * 500) },
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className={`rounded-lg border transition-all ${
      isView
        ? 'border-blue-500/20 bg-blue-500/5'
        : 'border-green-500/20 bg-green-500/5'
    }`}>
      {/* Method header */}
      <button
        onClick={() => setIsExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* View / Call badge */}
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
            isView
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {isView ? 'VIEW' : 'CALL'}
          </span>

          <code className="text-sm font-mono font-semibold text-white truncate">
            {method.name}
          </code>

          {/* Attribute badges */}
          {method.isInit && (
            <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1 py-0.5 rounded border border-cyan-500/20 flex-shrink-0">
              #init
            </span>
          )}
          {method.isPayable && (
            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded border border-amber-500/20 flex-shrink-0">
              #payable
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {method.returnType !== 'void' && (
            <span className="text-[10px] text-gray-500 font-mono hidden sm:block">
              → {method.returnType.length > 20 ? method.returnType.slice(0, 20) + '…' : method.returnType}
            </span>
          )}
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
        </div>
      </button>

      {/* Expanded form */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {/* Parameter inputs */}
          {method.paramDefs.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Parameters</p>
              {method.paramDefs.map(param => (
                <div key={param.name} className="flex items-center gap-2">
                  <label className="text-xs text-gray-400 font-mono min-w-[80px] truncate flex-shrink-0">
                    {param.name}
                    <span className="text-gray-600 ml-1">:{param.type.length > 12 ? param.type.slice(0, 12) + '…' : param.type}</span>
                  </label>
                  <input
                    type="text"
                    value={paramValues[param.name] || ''}
                    onChange={e => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                    placeholder={getPlaceholder(param.type)}
                    className="flex-1 bg-void-black/60 border border-void-purple/20 rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-void-purple/50 font-mono"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 italic">No parameters</p>
          )}

          {/* Gas + deposit for change methods */}
          {method.isMutating && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Gas (TGas)</label>
                <input
                  type="number"
                  value={gas}
                  onChange={e => setGas(e.target.value)}
                  min="1"
                  max="300"
                  className="w-full bg-void-black/60 border border-void-purple/20 rounded px-2 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Deposit (NEAR)</label>
                <input
                  type="text"
                  value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  placeholder="0"
                  className="w-full bg-void-black/60 border border-void-purple/20 rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Call button */}
          <button
            onClick={handleCall}
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isView
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                {isView ? 'Querying…' : 'Executing…'}
              </>
            ) : isView ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                View
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Call
              </>
            )}
          </button>

          {/* Result */}
          {lastResult && (
            <div className={`p-2.5 rounded-lg border text-xs font-mono ${
              lastResult.success
                ? 'bg-green-500/5 border-green-500/20 text-green-300'
                : 'bg-red-500/5 border-red-500/20 text-red-300'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={lastResult.success ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  {lastResult.success ? '✅ Success' : '❌ Error'}
                </span>
                <span className="text-gray-500">{lastResult.gasUsed}</span>
              </div>
              <p className="text-gray-300 break-all">{lastResult.output}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPlaceholder(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('string') || t === 'accountid') return '"alice.testnet"';
  if (t.includes('u64') || t.includes('u128') || t.includes('i64') || t.includes('u32')) return '0';
  if (t.includes('bool')) return 'true';
  if (t.includes('vec')) return '[]';
  if (t.includes('option')) return 'null';
  return '""';
}

function generateViewOutput(methodName: string, params: Record<string, string>): string {
  const n = methodName.toLowerCase();
  if (n.includes('balance')) return '"1000000000000000000000000"';
  if (n.includes('owner') || n.includes('account')) return '"owner.testnet"';
  if (n.includes('total') || n.includes('count') || n.includes('supply')) return '42';
  if (n.includes('greeting') || n.includes('message')) return '"Hello from NEAR!"';
  if (n.includes('token') || n.includes('nft')) return '{"token_id":"1","owner_id":"alice.testnet"}';
  if (n.includes('proposal')) return '{"id":0,"status":"Active","votes":3}';
  if (n.includes('list') || n.includes('all')) return '["item1","item2","item3"]';
  if (n.includes('bool') || n.includes('is_') || n.includes('has_')) return 'true';
  return `"${methodName}_result"`;
}

function MethodSignature({ method }: { method: ParsedMethod }) {
  const badges = [];
  if (method.isInit) badges.push({ label: '#[init]', color: 'text-cyan-400 bg-cyan-500/20' });
  if (method.isPayable) badges.push({ label: '#[payable]', color: 'text-amber-400 bg-amber-500/20' });
  if (method.isPrivate) badges.push({ label: '#[private]', color: 'text-red-400 bg-red-500/20' });

  const baseGas = method.isInit ? 15 : method.isPayable ? 10 : 5;
  const paramGas = method.params.length * 0.5;
  const estimatedGas = (baseGas + paramGas).toFixed(1);

  return (
    <div className="bg-void-black/50 border border-void-purple/10 rounded-lg p-2">
      <div className="flex items-center gap-2 flex-wrap">
        <code className="text-sm font-mono text-near-green font-medium">{method.name}</code>
        {badges.map(b => (
          <span key={b.label} className={`px-1.5 py-0.5 text-[10px] rounded ${b.color}`}>
            {b.label}
          </span>
        ))}
        <span className="ml-auto text-[10px] text-amber-400 flex items-center gap-1">
          <Zap className="w-3 h-3" /> ~{estimatedGas} TGas
        </span>
      </div>
      {method.params.length > 0 && (
        <div className="mt-1 text-xs text-gray-500 font-mono">
          ({method.params.join(', ')})
        </div>
      )}
      {method.returnType !== 'void' && (
        <div className="mt-0.5 text-xs text-gray-600 font-mono">
          → {method.returnType}
        </div>
      )}
    </div>
  );
}

// ─── Mock simulation execution ────────────────────────────────────────────────

function simulateExecution(
  method: string,
  args: string,
  caller: string,
  deposit: string,
  code: string,
  currentState: Record<string, unknown>
): SimulationResult {
  const startTime = Date.now();
  const hasMethod = code.includes(`fn ${method}`);
  const success = hasMethod || Math.random() > 0.3;

  const baseGas = 5 + Math.random() * 10;
  const gasUsed = `${baseGas.toFixed(2)} TGas`;

  const logs: string[] = [];
  const stateChanges: Record<string, unknown> = {};

  if (method === 'new') {
    logs.push('Contract initialized');
    stateChanges['initialized'] = true;
    stateChanges['owner'] = caller;
  } else if (method.includes('deposit') || method.includes('stake')) {
    const amt = deposit !== '0' ? deposit : '1';
    logs.push(`Deposit: ${amt} NEAR from ${caller}`);
    logs.push('Event: "deposit" emitted');
    const prevDeposits = (currentState['deposits'] as Record<string, string>) || {};
    stateChanges['deposits'] = { ...prevDeposits, [caller]: `${amt} NEAR` };
    stateChanges['total_deposits'] = Object.keys({ ...prevDeposits, [caller]: amt }).length;
  } else if (method.includes('transfer') || method.includes('send')) {
    logs.push(`Transfer initiated by ${caller}`);
    logs.push('Event: "transfer" emitted');
  } else if (method.startsWith('get_') || method.startsWith('ft_balance') || method.includes('view') || method === 'nft_token') {
    logs.push(`View call from ${caller}`);
    logs.push('No state changes (view-only)');
  } else if (method.includes('mint')) {
    logs.push(`Mint called by ${caller}`);
    logs.push('Event: "mint" emitted');
    stateChanges['total_supply'] = ((currentState['total_supply'] as number) || 0) + 1;
  } else if (method.includes('vote')) {
    logs.push(`Vote cast by ${caller}`);
    stateChanges['votes'] = ((currentState['votes'] as number) || 0) + 1;
  } else {
    if (args !== '{}') {
      try {
        const parsed = JSON.parse(args);
        logs.push(`Args: ${Object.keys(parsed).join(', ')}`);
      } catch {
        logs.push('Invalid JSON args');
      }
    }
    logs.push(`Method ${method} executed`);
  }

  if (!success) {
    logs.push(`Error: Method ${method} execution failed`);
  }

  return {
    success,
    output: success ? 'Execution successful' : 'Execution failed',
    gasUsed,
    logs,
    duration: Date.now() - startTime + Math.floor(Math.random() * 500),
    stateChanges,
  };
}
