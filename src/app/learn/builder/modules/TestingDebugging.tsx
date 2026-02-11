'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TestTube, ExternalLink, CheckCircle, Bug, Play, FileSearch } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TestingDebuggingProps {
  isActive: boolean;
  onToggle: () => void;
}

const TestingDebugging: React.FC<TestingDebuggingProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Testing &amp; Debugging</h3>
            <p className="text-text-muted text-sm">Unit tests, integration tests, and sandbox testing with near-workspaces</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">50 min</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-purple-500/20 p-6">
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

          <div className="space-y-6">
            {selectedTab === 'overview' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-5 h-5 text-red-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Unit testing with #[cfg(test)] and the NEAR testing utilities',
                    'Integration testing with near-workspaces-rs (sandbox mode)',
                    'Debugging common errors: gas, storage, serialization, panics',
                    'Reading transaction logs and receipts for debugging',
                    'Best practices for test-driven smart contract development',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Play className="w-5 h-5 text-green-400" />
                    Unit Testing
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Unit tests run locally without a blockchain. Use them for pure logic testing:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[cfg(test)]</span></div>
                    <div><span className="text-purple-400">mod</span> tests {'{'}</div>
                    <div>    <span className="text-purple-400">use</span> super::*;</div>
                    <div>    <span className="text-purple-400">use</span> near_sdk::test_utils::VMContextBuilder;</div>
                    <div>    <span className="text-purple-400">use</span> near_sdk::testing_env;</div>
                    <div className="mt-2">    <span className="text-purple-400">#[test]</span></div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">test_default_greeting</span>() {'{'}</div>
                    <div>        <span className="text-purple-400">let</span> contract = Greeting::default();</div>
                    <div>        assert_eq!(contract.get_greeting(), <span className="text-yellow-300">&quot;Hello, NEAR!&quot;</span>);</div>
                    <div>    {'}'}</div>
                    <div className="mt-2">    <span className="text-purple-400">#[test]</span></div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">test_set_greeting</span>() {'{'}</div>
                    <div>        <span className="text-text-muted">{'// Set up test context'}</span></div>
                    <div>        <span className="text-purple-400">let</span> context = VMContextBuilder::new()</div>
                    <div>            .predecessor_account_id(<span className="text-yellow-300">&quot;alice.near&quot;</span>.parse().unwrap())</div>
                    <div>            .build();</div>
                    <div>        testing_env!(context);</div>
                    <div className="mt-2">        <span className="text-purple-400">let mut</span> contract = Greeting::default();</div>
                    <div>        contract.set_greeting(<span className="text-yellow-300">&quot;Hi Builder!&quot;</span>.to_string());</div>
                    <div>        assert_eq!(contract.get_greeting(), <span className="text-yellow-300">&quot;Hi Builder!&quot;</span>);</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border mt-3">
                    <div className="text-text-muted"># Run unit tests</div>
                    <div className="text-near-green">cargo test</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-purple-400" />
                    Integration Testing with near-workspaces
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Integration tests run against a real sandbox blockchain. They test your contract as it actually behaves on-chain:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// tests/sandbox.rs'}</div>
                    <div><span className="text-purple-400">use</span> near_workspaces::types::NearToken;</div>
                    <div><span className="text-purple-400">use</span> serde_json::json;</div>
                    <div className="mt-2"><span className="text-purple-400">#[tokio::test]</span></div>
                    <div><span className="text-purple-400">async fn</span> <span className="text-near-green">test_greeting_contract</span>() -&gt; anyhow::Result&lt;()&gt; {'{'}</div>
                    <div>    <span className="text-text-muted">{'// Spin up a local sandbox'}</span></div>
                    <div>    <span className="text-purple-400">let</span> sandbox = near_workspaces::sandbox().await?;</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Deploy the contract'}</span></div>
                    <div>    <span className="text-purple-400">let</span> wasm = std::fs::read(<span className="text-yellow-300">&quot;target/near/greeting.wasm&quot;</span>)?;</div>
                    <div>    <span className="text-purple-400">let</span> contract = sandbox.dev_deploy(&amp;wasm).await?;</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Create a test user'}</span></div>
                    <div>    <span className="text-purple-400">let</span> alice = sandbox.dev_create_account().await?;</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Call a change method'}</span></div>
                    <div>    alice.call(contract.id(), <span className="text-yellow-300">&quot;set_greeting&quot;</span>)</div>
                    <div>        .args_json(json!({'{&quot;greeting&quot;: &quot;Hello from test!&quot;}'}))</div>
                    <div>        .transact().await?.into_result()?;</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Call a view method'}</span></div>
                    <div>    <span className="text-purple-400">let</span> result: String = contract.view(<span className="text-yellow-300">&quot;get_greeting&quot;</span>)</div>
                    <div>        .await?.json()?;</div>
                    <div>    assert_eq!(result, <span className="text-yellow-300">&quot;Hello from test!&quot;</span>);</div>
                    <div className="mt-2">    Ok(())</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-400" />
                    Common Errors &amp; Fixes
                  </h4>
                  <div className="space-y-3">
                    {[
                      { error: 'Exceeded prepaid gas', fix: 'Increase prepaid-gas (default 30 Tgas). Complex operations may need 100-300 Tgas.' },
                      { error: 'Smart contract panicked: "Not enough balance"', fix: 'The account doesn\'t have enough NEAR. Check storage staking and balance.' },
                      { error: 'Cannot deserialize the contract state', fix: 'Contract state schema changed between deployments. Add migration logic or redeploy to a new account.' },
                      { error: 'MethodNotFound', fix: 'Method name is case-sensitive. Check spelling and that the method is pub.' },
                      { error: 'Borsh serialization error', fix: 'Method arguments don\'t match expected types. Check the JSON args match the Rust types.' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-red-500/10">
                        <div className="text-sm font-mono text-red-400 mb-1">{item.error}</div>
                        <div className="text-xs text-text-muted">
                          <span className="text-near-green font-semibold">Fix:</span> {item.fix}
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-cyan-400" />
                    Reading Transaction Logs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::log_str()</code> or the <code className="text-purple-400 bg-purple-500/10 px-1 rounded">log!</code> macro in your contract to emit debug info:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// In your contract'}</div>
                    <div>log!(<span className="text-yellow-300">&quot;Caller: {'{'}{'}'}, Amount: {'{'}{'}'}&quot;</span>, env::predecessor_account_id(), amount);</div>
                    <div className="mt-3 text-text-muted">{'// In your integration test — check logs'}</div>
                    <div><span className="text-purple-400">let</span> result = alice.call(contract.id(), <span className="text-yellow-300">&quot;my_method&quot;</span>)</div>
                    <div>    .transact().await?;</div>
                    <div>println!(<span className="text-yellow-300">&quot;Logs: {'{:?}'}&quot;</span>, result.logs());</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">🧪</span> Test-Driven Development Tips
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-near-green">1.</span> Write the test FIRST — define expected behavior before coding</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">2.</span> Test edge cases — zero amounts, empty strings, unauthorized callers</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">3.</span> Test failure modes — use <code className="text-purple-400">#[should_panic]</code> for expected panics</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">4.</span> Use unit tests for logic, integration tests for cross-contract calls</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">5.</span> Run tests on every change — <code className="text-purple-400">cargo test</code> is your best friend</li>
                    </ul>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Unit Test Your Greeting Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add unit tests for: default greeting, setting a new greeting, and verifying the greeting changes persist.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Write a Sandbox Test</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Set up near-workspaces and write an integration test that deploys your contract, calls methods from different accounts, and verifies results.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Add <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near-workspaces</code> and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">tokio</code> to <code className="text-purple-400 bg-purple-500/10 px-1 rounded">[dev-dependencies]</code> in Cargo.toml.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Test Access Control</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add an owner-only method to your contract. Write tests that verify: the owner CAN call it, and other accounts CANNOT (expect a panic).
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Debug a Failing Transaction</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Intentionally call your contract with wrong arguments. Find the error in the transaction receipt on NearBlocks and fix it.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Testing Guide', url: 'https://docs.near.org/build/smart-contracts/testing/introduction', desc: 'Official testing documentation' },
                  { title: 'near-workspaces-rs', url: 'https://github.com/near/near-workspaces-rs', desc: 'Rust integration testing framework' },
                  { title: 'near-workspaces-js', url: 'https://github.com/near/near-workspaces-js', desc: 'JavaScript integration testing alternative' },
                  { title: 'Unit Testing Guide', url: 'https://docs.near.org/build/smart-contracts/testing/unit-test', desc: 'How to write unit tests' },
                  { title: 'Sandbox Testing', url: 'https://docs.near.org/build/smart-contracts/testing/integration-test', desc: 'Full integration test walkthrough' },
                  { title: 'NEAR Examples with Tests', url: 'https://github.com/near-examples', desc: 'Real contracts with test suites' },
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

export default TestingDebugging;
