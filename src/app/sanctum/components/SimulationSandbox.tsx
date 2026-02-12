'use client';

import { useState, useCallback } from 'react';
import { Play, Square, RotateCcw, Terminal, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SimulationSandboxProps {
  code: string;
  onClose: () => void;
}

interface SimulationResult {
  success: boolean;
  output: string;
  gasUsed: string;
  logs: string[];
  duration: number;
}

interface TestCase {
  id: string;
  name: string;
  method: string;
  args: string;
  expected?: string;
  result?: SimulationResult;
  status: 'pending' | 'running' | 'passed' | 'failed';
}

export function SimulationSandbox({ code, onClose }: SimulationSandboxProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', name: 'Initialize Contract', method: 'new', args: '{}', status: 'pending' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(['🔮 Simulation Sandbox ready...']);
  const [newMethod, setNewMethod] = useState('');
  const [newArgs, setNewArgs] = useState('{}');

  // Extract methods from code
  const availableMethods = extractMethods(code);

  const addTestCase = () => {
    if (!newMethod) return;
    const newCase: TestCase = {
      id: Date.now().toString(),
      name: `Test ${newMethod}`,
      method: newMethod,
      args: newArgs || '{}',
      status: 'pending',
    };
    setTestCases([...testCases, newCase]);
    setNewMethod('');
    setNewArgs('{}');
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(t => t.id !== id));
  };

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, '▶️ Starting simulation...']);

    // Simulate each test case
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      
      // Update status to running
      setTestCases(prev => prev.map(t => 
        t.id === tc.id ? { ...t, status: 'running' as const } : t
      ));
      
      setConsoleOutput(prev => [...prev, `\n📝 Running: ${tc.method}(${tc.args})`]);

      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Mock simulation result
      const result = simulateExecution(tc.method, tc.args, code);
      
      setConsoleOutput(prev => [
        ...prev,
        result.success ? `✅ ${tc.method} completed` : `❌ ${tc.method} failed`,
        `   Gas: ${result.gasUsed}`,
        ...result.logs.map(log => `   📋 ${log}`),
      ]);

      // Update test case with result
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
  };

  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const failedCount = testCases.filter(t => t.status === 'failed').length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20">
        {/* Header */}
        <div className="px-6 py-4 border-b border-void-purple/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Simulation Sandbox</h3>
              <p className="text-sm text-gray-400">Test your contract before deploying</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Test Cases Panel */}
          <div className="w-1/2 border-r border-void-purple/20 flex flex-col">
            {/* Add Test Case */}
            <div className="p-4 border-b border-void-purple/20 bg-void-black/30">
              <div className="flex gap-2 mb-2">
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="flex-1 bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-void-purple/50"
                >
                  <option value="">Select method...</option>
                  {availableMethods.map(m => (
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
              <input
                type="text"
                value={newArgs}
                onChange={(e) => setNewArgs(e.target.value)}
                placeholder='Arguments JSON: {"key": "value"}'
                className="w-full bg-void-black border border-void-purple/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-void-purple/50 font-mono"
              />
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
                  <code className="text-xs text-gray-400 font-mono mt-1 block">
                    {tc.method}({tc.args})
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
            <div className="p-4 border-t border-void-purple/20 flex gap-2">
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
          </div>

          {/* Console Output */}
          <div className="w-1/2 flex flex-col">
            <div className="px-4 py-2 border-b border-void-purple/20 bg-void-black/50 flex items-center gap-2">
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

// Extract method names from Rust code
function extractMethods(code: string): string[] {
  const methods: string[] = [];
  const regex = /pub fn (\w+)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    methods.push(match[1]);
  }
  return methods.length > 0 ? methods : ['new', 'get_greeting', 'set_greeting'];
}

// Mock simulation execution
function simulateExecution(method: string, args: string, code: string): SimulationResult {
  const startTime = Date.now();
  
  // Simulate success/failure based on method and code
  const hasMethod = code.includes(`fn ${method}`);
  const success = hasMethod || Math.random() > 0.3;
  
  // Generate mock gas usage
  const baseGas = 5 + Math.random() * 10;
  const gasUsed = `${baseGas.toFixed(2)} TGas`;
  
  // Generate logs
  const logs: string[] = [];
  if (method === 'new') {
    logs.push('Contract initialized');
  }
  if (args !== '{}') {
    try {
      const parsed = JSON.parse(args);
      logs.push(`Args: ${Object.keys(parsed).join(', ')}`);
    } catch {
      logs.push('Invalid JSON args');
    }
  }
  
  if (!success) {
    logs.push('Error: Method execution failed');
  }

  return {
    success,
    output: success ? 'Execution successful' : 'Execution failed',
    gasUsed,
    logs,
    duration: Date.now() - startTime + Math.floor(Math.random() * 500),
  };
}
