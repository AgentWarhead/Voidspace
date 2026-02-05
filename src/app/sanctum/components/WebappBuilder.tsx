'use client';

import { useState, useMemo } from 'react';
import { Globe, Download, Rocket, Code2, Wallet, Layers, Check, Copy } from 'lucide-react';

interface WebappBuilderProps {
  code: string;
  contractName?: string;
  deployedAddress?: string;
  onClose: () => void;
}

interface ContractMethod {
  name: string;
  isView: boolean;
  args: string[];
  returnType?: string;
}

export function WebappBuilder({ code, contractName = 'my-contract', deployedAddress, onClose }: WebappBuilderProps) {
  const [step, setStep] = useState<'preview' | 'customize' | 'download'>('preview');
  const [appName, setAppName] = useState(contractName);
  const [includeWallet, setIncludeWallet] = useState(true);
  const [includeUI, setIncludeUI] = useState(true);
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [copied, setCopied] = useState(false);

  // Extract methods from contract code
  const methods = useMemo(() => extractMethods(code), [code]);
  const viewMethods = methods.filter(m => m.isView);
  const changeMethods = methods.filter(m => !m.isView);

  const handleDownload = () => {
    const projectScript = generateProject({
      appName,
      contractName,
      contractAddress: deployedAddress || `${contractName}.testnet`,
      methods,
      network,
      includeWallet,
      includeUI,
    });

    const blob = new Blob([projectScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName}-webapp.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStep('download');
  };

  const copyCommand = async () => {
    await navigator.clipboard.writeText(`bash ${appName}-webapp.sh && cd ${appName} && npm run dev`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-void-darker border border-void-purple/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-void-purple/20 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-void-purple/20 flex items-center justify-between bg-gradient-to-r from-void-purple/10 to-near-green/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-near-green to-cyan-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Webapp Builder</h3>
              <p className="text-sm text-gray-400">Generate a full Next.js app for your contract</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {step === 'preview' && (
            <div className="space-y-6">
              {/* What you'll get */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">What you&apos;ll get:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <FeatureCard
                    icon={<Layers className="w-5 h-5" />}
                    title="Next.js 14 App"
                    description="Modern React framework with App Router"
                  />
                  <FeatureCard
                    icon={<Wallet className="w-5 h-5" />}
                    title="Wallet Connection"
                    description="NEAR Wallet Selector pre-configured"
                  />
                  <FeatureCard
                    icon={<Code2 className="w-5 h-5" />}
                    title="Contract Interface"
                    description={`${methods.length} methods auto-generated`}
                  />
                  <FeatureCard
                    icon={<Rocket className="w-5 h-5" />}
                    title="Ready to Deploy"
                    description="Vercel-ready out of the box"
                  />
                </div>
              </div>

              {/* Detected Methods */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">
                  Detected Contract Methods ({methods.length})
                </h4>
                <div className="bg-void-black/50 rounded-xl border border-void-purple/20 p-4 max-h-[200px] overflow-auto">
                  {viewMethods.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-green-400 font-medium">VIEW METHODS</span>
                      <div className="mt-1 space-y-1">
                        {viewMethods.map(m => (
                          <div key={m.name} className="flex items-center gap-2 text-sm">
                            <span className="text-green-400">○</span>
                            <code className="text-gray-300">{m.name}</code>
                            <span className="text-gray-600">({m.args.join(', ') || 'no args'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {changeMethods.length > 0 && (
                    <div>
                      <span className="text-xs text-amber-400 font-medium">CHANGE METHODS</span>
                      <div className="mt-1 space-y-1">
                        {changeMethods.map(m => (
                          <div key={m.name} className="flex items-center gap-2 text-sm">
                            <span className="text-amber-400">●</span>
                            <code className="text-gray-300">{m.name}</code>
                            <span className="text-gray-600">({m.args.join(', ') || 'no args'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {methods.length === 0 && (
                    <div className="text-gray-500 text-sm">
                      No public methods detected. The generated app will include basic contract interaction.
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Stack */}
              <div className="bg-gradient-to-r from-near-green/10 to-void-purple/10 rounded-xl p-4 border border-near-green/20">
                <h4 className="text-sm font-medium text-white mb-2">Generated Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'near-api-js', '@near-wallet-selector/core', 'Vercel-ready'].map(tech => (
                    <span key={tech} className="px-2 py-1 bg-void-black/50 text-xs text-gray-300 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'customize' && (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">App Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="w-full bg-void-black/50 border border-void-purple/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-near-green/50"
                  placeholder="my-near-app"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Network</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNetwork('testnet')}
                    className={`flex-1 py-3 rounded-lg border transition-colors ${
                      network === 'testnet'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-amber-500/30'
                    }`}
                  >
                    Testnet
                  </button>
                  <button
                    onClick={() => setNetwork('mainnet')}
                    className={`flex-1 py-3 rounded-lg border transition-colors ${
                      network === 'mainnet'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-void-black/30 border-void-purple/20 text-gray-400 hover:border-green-500/30'
                    }`}
                  >
                    Mainnet
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm text-gray-400">Include</label>
                <label className="flex items-center gap-3 p-3 bg-void-black/30 rounded-lg border border-void-purple/20 cursor-pointer hover:border-void-purple/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeWallet}
                    onChange={(e) => setIncludeWallet(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-white">Wallet Connection</span>
                    <p className="text-xs text-gray-500">NEAR Wallet Selector with multiple wallet support</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-void-black/30 rounded-lg border border-void-purple/20 cursor-pointer hover:border-void-purple/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeUI}
                    onChange={(e) => setIncludeUI(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-white">Auto-generated UI</span>
                    <p className="text-xs text-gray-500">Form components for each contract method</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 'download' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Download Started!</h3>
              <p className="text-gray-400 mb-6">Your webapp project is being downloaded.</p>

              <div className="bg-void-black/50 rounded-xl p-4 text-left max-w-md mx-auto">
                <p className="text-sm text-gray-400 mb-2">Run these commands:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-void-black rounded-lg px-3 py-2 text-sm text-near-green font-mono">
                    bash {appName}-webapp.sh && cd {appName} && npm run dev
                  </code>
                  <button
                    onClick={copyCommand}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>Your app will be available at <code className="text-void-cyan">http://localhost:3000</code></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-void-purple/20 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {step === 'preview' && 'Preview what will be generated'}
            {step === 'customize' && 'Configure your webapp'}
            {step === 'download' && 'Project downloaded successfully'}
          </div>
          <div className="flex gap-2">
            {step === 'preview' && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('customize')}
                  className="px-6 py-2 bg-void-purple/20 hover:bg-void-purple/30 text-white rounded-lg transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-near-green hover:bg-near-green/90 text-black font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Now
                </button>
              </>
            )}
            {step === 'customize' && (
              <>
                <button
                  onClick={() => setStep('preview')}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-near-green hover:bg-near-green/90 text-black font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate & Download
                </button>
              </>
            )}
            {step === 'download' && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-void-purple/20 hover:bg-void-purple/30 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-void-black/30 rounded-xl p-4 border border-void-purple/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-near-green">{icon}</div>
        <span className="font-medium text-white">{title}</span>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

// Extract public methods from Rust contract code
function extractMethods(code: string): ContractMethod[] {
  const methods: ContractMethod[] = [];
  
  // Match pub fn declarations
  const fnRegex = /pub fn (\w+)\s*\(\s*(?:&(?:mut\s+)?self)?(?:,?\s*)?([^)]*)\)/g;
  let match;
  
  while ((match = fnRegex.exec(code)) !== null) {
    const name = match[1];
    const argsStr = match[2].trim();
    
    // Skip init/new methods
    if (name === 'new' || name === 'init') continue;
    
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
    
    // Determine if view method (no &mut self, no state changes)
    const isView = !code.slice(Math.max(0, match.index - 50), match.index + match[0].length + 200)
      .includes('&mut self');
    
    methods.push({ name, isView, args });
  }
  
  return methods;
}

interface ProjectConfig {
  appName: string;
  contractName: string;
  contractAddress: string;
  methods: ContractMethod[];
  network: 'testnet' | 'mainnet';
  includeWallet: boolean;
  includeUI: boolean;
}

// Generate the full project as a shell script
function generateProject(config: ProjectConfig): string {
  const { appName, contractName, contractAddress, methods, network, includeWallet, includeUI } = config;

  const viewMethods = methods.filter(m => m.isView);
  const changeMethods = methods.filter(m => !m.isView);

  // Package.json
  const packageJson = `{
  "name": "${appName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "near-api-js": "^4.0.0"${includeWallet ? `,
    "@near-wallet-selector/core": "^8.9.0",
    "@near-wallet-selector/my-near-wallet": "^8.9.0",
    "@near-wallet-selector/modal-ui": "^8.9.0"` : ''}
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}`;

  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'near-green': '#00EC97',
      },
    },
  },
  plugins: [],
}`;

  // Contract service
  const contractService = `import { connect, keyStores, Contract } from 'near-api-js';

const CONTRACT_ID = '${contractAddress}';
const NETWORK = '${network}';

const config = {
  networkId: NETWORK,
  keyStore: typeof window !== 'undefined' ? new keyStores.BrowserLocalStorageKeyStore() : new keyStores.InMemoryKeyStore(),
  nodeUrl: NETWORK === 'mainnet' ? 'https://rpc.mainnet.near.org' : 'https://rpc.testnet.near.org',
  walletUrl: NETWORK === 'mainnet' ? 'https://wallet.near.org' : 'https://wallet.testnet.near.org',
  helperUrl: NETWORK === 'mainnet' ? 'https://helper.mainnet.near.org' : 'https://helper.testnet.near.org',
};

export async function getContract(account: any) {
  return new Contract(account, CONTRACT_ID, {
    viewMethods: [${viewMethods.map(m => `'${m.name}'`).join(', ')}],
    changeMethods: [${changeMethods.map(m => `'${m.name}'`).join(', ')}],
  });
}

export async function initNear() {
  const near = await connect(config);
  return near;
}

export { CONTRACT_ID, NETWORK };
`;

  // Main page component
  const mainPage = `'use client';

import { useState, useEffect } from 'react';
import { initNear, getContract, CONTRACT_ID, NETWORK } from '@/lib/contract';
${includeWallet ? `import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';` : ''}

export default function Home() {
  const [account, setAccount] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    initApp();
  }, []);

  async function initApp() {
    try {
      ${includeWallet ? `const selector = await setupWalletSelector({
        network: NETWORK,
        modules: [setupMyNearWallet()],
      });
      
      const state = selector.store.getState();
      if (state.accounts.length > 0) {
        const wallet = await selector.wallet();
        const accounts = await wallet.getAccounts();
        setAccount(accounts[0]);
      }` : `const near = await initNear();
      const account = await near.account('guest');
      setAccount(account);`}
    } catch (err) {
      console.error('Failed to init:', err);
    } finally {
      setLoading(false);
    }
  }

  ${includeWallet ? `async function connectWallet() {
    const selector = await setupWalletSelector({
      network: NETWORK,
      modules: [setupMyNearWallet()],
    });
    const wallet = await selector.wallet('my-near-wallet');
    await wallet.signIn({ contractId: CONTRACT_ID });
  }

  async function disconnectWallet() {
    const selector = await setupWalletSelector({
      network: NETWORK,
      modules: [setupMyNearWallet()],
    });
    const wallet = await selector.wallet();
    await wallet.signOut();
    setAccount(null);
  }` : ''}

  ${methods.map(m => `
  async function call_${m.name}(${m.args.map(a => `${a}: string`).join(', ')}) {
    if (!account) return;
    try {
      const near = await initNear();
      const acc = await near.account(account.accountId);
      const contract = await getContract(acc);
      const result = await (contract as any).${m.name}(${m.args.length > 0 ? `{ ${m.args.join(', ')} }` : ''});
      setResults(prev => ({ ...prev, ${m.name}: result }));
      return result;
    } catch (err) {
      console.error('Error calling ${m.name}:', err);
    }
  }`).join('\n')}

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold">${appName}</h1>
            <p className="text-gray-400">Powered by NEAR Protocol</p>
          </div>
          ${includeWallet ? `<div>
            {account ? (
              <div className="flex items-center gap-4">
                <span className="text-near-green">{account.accountId}</span>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-near-green text-black font-medium rounded-lg hover:bg-near-green/90 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>` : ''}
        </header>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Contract Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Contract ID:</span>
              <code className="ml-2 text-near-green">{CONTRACT_ID}</code>
            </div>
            <div>
              <span className="text-gray-400">Network:</span>
              <span className="ml-2">{NETWORK}</span>
            </div>
          </div>
        </div>

        ${includeUI ? `<div className="space-y-6">
          ${viewMethods.length > 0 ? `<section>
            <h2 className="text-xl font-semibold mb-4 text-green-400">View Methods</h2>
            <div className="grid gap-4">
              ${viewMethods.map(m => `<MethodCard
                name="${m.name}"
                args={[${m.args.map(a => `'${a}'`).join(', ')}]}
                onCall={call_${m.name}}
                result={results.${m.name}}
                isView
              />`).join('\n              ')}
            </div>
          </section>` : ''}
          
          ${changeMethods.length > 0 ? `<section>
            <h2 className="text-xl font-semibold mb-4 text-amber-400">Change Methods</h2>
            <div className="grid gap-4">
              ${changeMethods.map(m => `<MethodCard
                name="${m.name}"
                args={[${m.args.map(a => `'${a}'`).join(', ')}]}
                onCall={call_${m.name}}
                result={results.${m.name}}
                disabled={!account}
              />`).join('\n              ')}
            </div>
          </section>` : ''}
        </div>` : ''}
      </div>
    </main>
  );
}

${includeUI ? `function MethodCard({ 
  name, 
  args, 
  onCall, 
  result, 
  isView = false,
  disabled = false 
}: { 
  name: string; 
  args: string[]; 
  onCall: (...args: string[]) => Promise<any>;
  result?: any;
  isView?: boolean;
  disabled?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onCall(...args.map(a => values[a] || ''));
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <code className="text-lg font-mono">{name}</code>
        <span className={\`text-xs px-2 py-1 rounded \${isView ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}\`}>
          {isView ? 'view' : 'change'}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        {args.map(arg => (
          <input
            key={arg}
            type="text"
            placeholder={arg}
            value={values[arg] || ''}
            onChange={(e) => setValues(prev => ({ ...prev, [arg]: e.target.value }))}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-near-green"
          />
        ))}
        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full py-2 bg-near-green text-black font-medium rounded-lg hover:bg-near-green/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Calling...' : \`Call \${name}\`}
        </button>
      </form>
      {result !== undefined && (
        <div className="mt-3 p-2 bg-gray-900 rounded text-sm">
          <span className="text-gray-400">Result: </span>
          <code className="text-near-green">{JSON.stringify(result)}</code>
        </div>
      )}
    </div>
  );
}` : ''}
`;

  // Generate shell script
  return `#!/bin/bash
# 🔮 Generated by Voidspace Sanctum
# Webapp for: ${contractName}

set -e

APP_NAME="${appName}"

echo "🚀 Creating NEAR webapp: $APP_NAME"

# Create project structure
mkdir -p "$APP_NAME/src/app"
mkdir -p "$APP_NAME/src/lib"

# package.json
cat > "$APP_NAME/package.json" << 'PACKAGE_EOF'
${packageJson}
PACKAGE_EOF

# tailwind.config.js
cat > "$APP_NAME/tailwind.config.js" << 'TAILWIND_EOF'
${tailwindConfig}
TAILWIND_EOF

# postcss.config.js
cat > "$APP_NAME/postcss.config.js" << 'POSTCSS_EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS_EOF

# tsconfig.json
cat > "$APP_NAME/tsconfig.json" << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSCONFIG_EOF

# next.config.js
cat > "$APP_NAME/next.config.js" << 'NEXTCONFIG_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
NEXTCONFIG_EOF

# src/app/globals.css
cat > "$APP_NAME/src/app/globals.css" << 'CSS_EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS_EOF

# src/app/layout.tsx
cat > "$APP_NAME/src/app/layout.tsx" << 'LAYOUT_EOF'
import './globals.css'
export const metadata = { title: '${appName}', description: 'A NEAR dApp' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
LAYOUT_EOF

# src/lib/contract.ts
cat > "$APP_NAME/src/lib/contract.ts" << 'CONTRACT_EOF'
${contractService}
CONTRACT_EOF

# src/app/page.tsx
cat > "$APP_NAME/src/app/page.tsx" << 'PAGE_EOF'
${mainPage}
PAGE_EOF

echo ""
echo "✅ Webapp created successfully!"
echo ""
echo "Next steps:"
echo "  cd $APP_NAME"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "🔮 Built with Voidspace Sanctum - https://voidspace.io"
`;
}
