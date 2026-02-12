'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Terminal, CheckCircle, ExternalLink, Settings, FolderOpen } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DevEnvironmentSetupProps {
  isActive: boolean;
  onToggle: () => void;
}

const DevEnvironmentSetup: React.FC<DevEnvironmentSetupProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      {/* Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Dev Environment Setup</h3>
            <p className="text-text-muted text-sm">Install tools, configure your workspace, and get ready to build</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Beginner</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">30 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isActive && (
        <div className="border-t border-purple-500/20 p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-border">
            {['overview', 'learn', 'practice', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  'px-4 py-2 font-medium transition-colors text-sm',
                  selectedTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {selectedTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Install Rust, Node.js, and the NEAR CLI toolchain',
                    'Set up VS Code with NEAR-specific extensions',
                    'Create your first NEAR project from a template',
                    'Understand the project file structure and Cargo.toml',
                    'Configure testnet accounts for development',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-near-green/20 bg-near-green/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-near-green font-semibold">Prerequisites:</span> Basic command line knowledge, a code editor, and completion of the Explorer track.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Rust */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-orange-400">🦀</span> Installing Rust
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR smart contracts are written in Rust (or JavaScript via the JS SDK, but Rust is the standard for production). Install Rust via <code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded text-sm">rustup</code>:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted mb-1"># Install Rust</div>
                    <div className="text-near-green">curl --proto &apos;=https&apos; --tlsv1.2 -sSf https://sh.rustup.rs | sh</div>
                    <div className="text-text-muted mt-3 mb-1"># Add the WASM target (required for NEAR contracts)</div>
                    <div className="text-near-green">rustup target add wasm32-unknown-unknown</div>
                    <div className="text-text-muted mt-3 mb-1"># Verify installation</div>
                    <div className="text-near-green">rustc --version</div>
                    <div className="text-text-muted"># → rustc 1.7x.x</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    The <code className="text-purple-400 bg-purple-500/10 px-1 rounded">wasm32-unknown-unknown</code> target compiles Rust to WebAssembly — the format NEAR runs on-chain.
                  </p>
                </section>

                {/* Section 2: Node.js */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">📦</span> Node.js &amp; npm
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The NEAR CLI and many frontend tools require Node.js. Install v18+ via nvm:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted mb-1"># Install nvm</div>
                    <div className="text-near-green">curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash</div>
                    <div className="text-text-muted mt-3 mb-1"># Install Node.js LTS</div>
                    <div className="text-near-green">nvm install --lts</div>
                    <div className="text-near-green">nvm use --lts</div>
                  </div>
                </section>

                {/* Section 3: NEAR CLI */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-400" />
                    NEAR CLI
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The NEAR CLI is your command-line interface for interacting with NEAR. There are two versions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary mb-1">near-cli-rs (Recommended)</h5>
                      <p className="text-sm text-text-secondary mb-2">Rust-based, faster, interactive prompts.</p>
                      <code className="text-near-green text-sm bg-black/30 px-2 py-1 rounded block">npm install -g near-cli-rs</code>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary mb-1">near-cli (Legacy)</h5>
                      <p className="text-sm text-text-secondary mb-2">JavaScript-based, widely documented.</p>
                      <code className="text-near-green text-sm bg-black/30 px-2 py-1 rounded block">npm install -g near-cli</code>
                    </Card>
                  </div>
                  <p className="text-text-muted text-sm">We recommend <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near-cli-rs</code> for its speed and interactive mode.</p>
                </section>

                {/* Section 4: VS Code */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-blue-400">💻</span> VS Code Extensions
                  </h4>
                  <p className="text-text-secondary mb-3">Install these VS Code extensions for a great NEAR development experience:</p>
                  <ul className="space-y-2 text-text-secondary text-sm">
                    <li className="flex items-center gap-2"><span className="text-near-green">→</span> <strong>rust-analyzer</strong> — Rust language support with autocomplete and inline errors</li>
                    <li className="flex items-center gap-2"><span className="text-near-green">→</span> <strong>Even Better TOML</strong> — Syntax highlighting for Cargo.toml</li>
                    <li className="flex items-center gap-2"><span className="text-near-green">→</span> <strong>CodeLLDB</strong> — Debugger for Rust</li>
                    <li className="flex items-center gap-2"><span className="text-near-green">→</span> <strong>Error Lens</strong> — Inline error messages</li>
                  </ul>
                </section>

                {/* Section 5: Project Scaffold */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-yellow-400" />
                    Creating Your First Project
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">cargo-near</code> to scaffold a new NEAR project:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted mb-1"># Install cargo-near</div>
                    <div className="text-near-green">cargo install cargo-near</div>
                    <div className="text-text-muted mt-3 mb-1"># Create a new project</div>
                    <div className="text-near-green">cargo near new my-first-contract</div>
                    <div className="text-near-green">cd my-first-contract</div>
                    <div className="text-text-muted mt-3 mb-1"># Project structure:</div>
                    <div className="text-text-secondary">├── Cargo.toml        <span className="text-text-muted"># Dependencies &amp; config</span></div>
                    <div className="text-text-secondary">├── src/</div>
                    <div className="text-text-secondary">│   └── lib.rs        <span className="text-text-muted"># Your contract code</span></div>
                    <div className="text-text-secondary">└── tests/</div>
                    <div className="text-text-secondary">    └── test.rs       <span className="text-text-muted"># Integration tests</span></div>
                  </div>
                </section>

                {/* Section 6: Testnet Account */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">🔑</span> Setting Up a Testnet Account
                  </h4>
                  <p className="text-text-secondary mb-3">
                    You need a testnet account for deploying and testing. Create one via the CLI:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted mb-1"># Create a testnet account (interactive)</div>
                    <div className="text-near-green">near account create-account fund-later use-auto-generation save-to-folder ~/.near-credentials/testnet</div>
                    <div className="text-text-muted mt-3 mb-1"># Or use the web wallet</div>
                    <div className="text-text-muted"># Visit: https://testnet.mynearwallet.com</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    Testnet NEAR tokens are free! You can request them from the faucet at <code className="text-purple-400 bg-purple-500/10 px-1 rounded">https://near-faucet.io</code>
                  </p>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                {/* Exercise 1 */}
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Verify Your Toolchain</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Run the following commands and confirm each returns a version number:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>rustc --version</div>
                    <div>cargo --version</div>
                    <div>node --version</div>
                    <div>near --version</div>
                    <div>rustup target list --installed | grep wasm32</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">
                    💡 If <code className="text-purple-400 bg-purple-500/10 px-1 rounded">wasm32-unknown-unknown</code> doesn&apos;t appear, run <code className="text-purple-400 bg-purple-500/10 px-1 rounded">rustup target add wasm32-unknown-unknown</code>.
                  </p>
                </Card>

                {/* Exercise 2 */}
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Scaffold a Project</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a new NEAR contract project and explore the generated files:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>cargo near new hello-near</div>
                    <div>cd hello-near</div>
                    <div>cat Cargo.toml</div>
                    <div>cat src/lib.rs</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">
                    💡 Read through <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Cargo.toml</code> — notice the <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near-sdk</code> dependency and the <code className="text-purple-400 bg-purple-500/10 px-1 rounded">crate-type = [&quot;cdylib&quot;]</code> setting.
                  </p>
                </Card>

                {/* Exercise 3 */}
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Build Your First Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Compile the template contract to WASM:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>cargo near build</div>
                    <div className="text-text-muted mt-1"># Output: target/near/hello_near.wasm</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">
                    💡 The .wasm file is your compiled smart contract — this is what gets deployed to NEAR.
                  </p>
                </Card>

                {/* Exercise 4 */}
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Create a Testnet Account</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a testnet account and fund it from the faucet. Verify it works:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>near account view-account-summary your-name.testnet network-config testnet now</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">
                    💡 You should see your account balance and storage usage.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR SDK Quickstart', url: 'https://docs.near.org/build/smart-contracts/quickstart', desc: 'Official getting-started guide' },
                  { title: 'Rust Installation', url: 'https://www.rust-lang.org/tools/install', desc: 'Official Rust installer' },
                  { title: 'NEAR CLI Documentation', url: 'https://docs.near.org/tools/near-cli', desc: 'Full CLI reference' },
                  { title: 'cargo-near GitHub', url: 'https://github.com/near/cargo-near', desc: 'Project scaffolding tool' },
                  { title: 'NEAR Testnet Faucet', url: 'https://near-faucet.io', desc: 'Get free testnet tokens' },
                  { title: 'NEAR Examples Repo', url: 'https://github.com/near-examples', desc: 'Official example contracts' },
                  { title: 'VS Code rust-analyzer', url: 'https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer', desc: 'Essential Rust extension' },
                ].map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-border hover:border-purple-500/30 transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-300 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-text-primary group-hover:text-purple-300">{link.title}</div>
                      <div className="text-xs text-text-muted">{link.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DevEnvironmentSetup;
