'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code, ExternalLink, CheckCircle, BookOpen, Cpu, Layers } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface RustFundamentalsProps {
  isActive: boolean;
  onToggle: () => void;
}

const RustFundamentals: React.FC<RustFundamentalsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Rust Fundamentals</h3>
            <p className="text-text-muted text-sm">Learn the Rust basics you need for smart contract development</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Beginner</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">45 min</Badge>
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
                  <BookOpen className="w-5 h-5 text-orange-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Variables, types, and ownership — Rust\'s core concepts',
                    'Structs, enums, and pattern matching for contract data models',
                    'Error handling with Result<T, E> and Option<T>',
                    'Collections: Vec, HashMap, and iterators',
                    'Traits and implementations — how NEAR SDK uses them',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-orange-500/20 bg-orange-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-orange-400 font-semibold">Note:</span> You don&apos;t need to master all of Rust. This module focuses on the 20% you&apos;ll use 80% of the time in NEAR contracts.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Ownership */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-orange-400" />
                    Ownership &amp; Borrowing
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rust&apos;s ownership system is what makes it safe without garbage collection. Every value has exactly one owner, and when the owner goes out of scope, the value is dropped.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Ownership moves — s1 is no longer valid after this'}</div>
                    <div><span className="text-purple-400">let</span> s1 = <span className="text-near-green">String::from</span>(<span className="text-yellow-300">&quot;hello&quot;</span>);</div>
                    <div><span className="text-purple-400">let</span> s2 = s1; <span className="text-text-muted">{'// s1 is moved to s2'}</span></div>
                    <div className="mt-3 text-text-muted">{'// Borrowing — read access without taking ownership'}</div>
                    <div><span className="text-purple-400">let</span> s3 = <span className="text-near-green">String::from</span>(<span className="text-yellow-300">&quot;world&quot;</span>);</div>
                    <div><span className="text-purple-400">let</span> len = calculate_length(<span className="text-purple-400">&amp;</span>s3); <span className="text-text-muted">{'// s3 is borrowed, not moved'}</span></div>
                    <div className="mt-3"><span className="text-purple-400">fn</span> <span className="text-near-green">calculate_length</span>(s: <span className="text-purple-400">&amp;</span>String) -&gt; <span className="text-cyan-400">usize</span> {'{'}</div>
                    <div>    s.len()</div>
                    <div>{'}'}</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    In NEAR contracts, you&apos;ll use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;self</code> for view methods and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;mut self</code> for change methods.
                  </p>
                </section>

                {/* Section 2: Types */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Types &amp; Structs
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rust is strongly typed. Structs are your primary way to define data models in NEAR contracts.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Basic types'}</div>
                    <div><span className="text-purple-400">let</span> amount: <span className="text-cyan-400">u128</span> = 1_000_000_000_000_000_000_000_000; <span className="text-text-muted">{'// 1 NEAR'}</span></div>
                    <div><span className="text-purple-400">let</span> name: <span className="text-cyan-400">String</span> = <span className="text-yellow-300">&quot;alice.near&quot;</span>.to_string();</div>
                    <div><span className="text-purple-400">let</span> is_active: <span className="text-cyan-400">bool</span> = <span className="text-purple-400">true</span>;</div>
                    <div className="mt-3 text-text-muted">{'// Struct — your contract state'}</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Counter</span> {'{'}</div>
                    <div>    count: <span className="text-cyan-400">i32</span>,</div>
                    <div>    owner: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                {/* Section 3: Enums & Match */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">🔀</span> Enums &amp; Pattern Matching
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Enums represent values that can be one of several variants. Combined with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">match</code>, they&apos;re incredibly powerful.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">enum</span> <span className="text-cyan-400">Status</span> {'{'}</div>
                    <div>    Active,</div>
                    <div>    Paused,</div>
                    <div>    Completed {'{'} result: <span className="text-cyan-400">String</span> {'}'},</div>
                    <div>{'}'}</div>
                    <div className="mt-3"><span className="text-purple-400">fn</span> <span className="text-near-green">handle_status</span>(status: <span className="text-cyan-400">Status</span>) {'{'}</div>
                    <div>    <span className="text-purple-400">match</span> status {'{'}</div>
                    <div>        Status::Active =&gt; log!(<span className="text-yellow-300">&quot;Running&quot;</span>),</div>
                    <div>        Status::Paused =&gt; log!(<span className="text-yellow-300">&quot;Paused&quot;</span>),</div>
                    <div>        Status::Completed {'{'} result {'}'} =&gt; log!(<span className="text-yellow-300">&quot;Done: {'{'}{'}'}&quot;</span>, result),</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                {/* Section 4: Error Handling */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-red-400">⚠️</span> Error Handling
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rust uses <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Result&lt;T, E&gt;</code> and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Option&lt;T&gt;</code> instead of exceptions. In NEAR contracts, you&apos;ll use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">require!</code> and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::panic_str()</code>.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Option — value might not exist'}</div>
                    <div><span className="text-purple-400">let</span> value: <span className="text-cyan-400">Option</span>&lt;<span className="text-cyan-400">u32</span>&gt; = Some(42);</div>
                    <div><span className="text-purple-400">let</span> missing: <span className="text-cyan-400">Option</span>&lt;<span className="text-cyan-400">u32</span>&gt; = None;</div>
                    <div className="mt-3 text-text-muted">{'// In NEAR contracts — assert conditions'}</div>
                    <div><span className="text-purple-400">require!</span>(</div>
                    <div>    env::predecessor_account_id() == self.owner,</div>
                    <div>    <span className="text-yellow-300">&quot;Only the owner can call this&quot;</span></div>
                    <div>);</div>
                  </div>
                </section>

                {/* Section 5: Collections */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-purple-400">📚</span> Collections &amp; Iterators
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Standard collections work in Rust, but NEAR has special persistent collections for on-chain storage:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Standard Rust'}</div>
                    <div><span className="text-purple-400">let</span> <span className="text-purple-400">mut</span> scores: Vec&lt;<span className="text-cyan-400">u32</span>&gt; = vec![10, 20, 30];</div>
                    <div>scores.push(40);</div>
                    <div><span className="text-purple-400">let</span> total: <span className="text-cyan-400">u32</span> = scores.iter().sum();</div>
                    <div className="mt-3 text-text-muted">{'// NEAR persistent collections (stored on-chain)'}</div>
                    <div><span className="text-purple-400">use</span> near_sdk::store::{'{'}LookupMap, Vector{'}'};</div>
                    <div className="mt-1"><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Registry</span> {'{'}</div>
                    <div>    balances: LookupMap&lt;AccountId, <span className="text-cyan-400">u128</span>&gt;,</div>
                    <div>    members: Vector&lt;AccountId&gt;,</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                {/* Section 6: Traits */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">🧩</span> Traits &amp; Implementations
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Traits define shared behavior. The NEAR SDK uses traits extensively — your contract implements methods via <code className="text-purple-400 bg-purple-500/10 px-1 rounded">#[near]</code> attribute macros.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[near]</span></div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Counter</span> {'{'}</div>
                    <div>    <span className="text-text-muted">{'// View method — reads state, costs no gas'}</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_count</span>(&amp;self) -&gt; <span className="text-cyan-400">i32</span> {'{'}</div>
                    <div>        self.count</div>
                    <div>    {'}'}</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Change method — modifies state, costs gas'}</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">increment</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                    <div>        self.count += 1;</div>
                    <div>        log!(<span className="text-yellow-300">&quot;Count: {'{'}{'}'}&quot;</span>, self.count);</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Ownership Playground</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a file <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ownership.rs</code> and experiment with ownership rules. Try to make the compiler complain, then fix it:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">main</span>() {'{'}</div>
                    <div>    <span className="text-purple-400">let</span> s = <span className="text-near-green">String::from</span>(<span className="text-yellow-300">&quot;hello&quot;</span>);</div>
                    <div>    <span className="text-purple-400">let</span> s2 = s;</div>
                    <div>    println!(<span className="text-yellow-300">&quot;{'{'}{'}'}&quot;</span>, s); <span className="text-text-muted">{'// ❌ Won&apos;t compile! Fix it.'}</span></div>
                    <div>{'}'}</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">💡 Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">.clone()</code> or borrowing to fix it.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Build a Token Balance Struct</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Define a struct with an account name and balance, then implement methods to deposit and withdraw:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">struct</span> <span className="text-cyan-400">Wallet</span> {'{'}</div>
                    <div>    owner: String,</div>
                    <div>    balance: <span className="text-cyan-400">u128</span>,</div>
                    <div>{'}'}</div>
                    <div className="text-text-muted mt-1">{'// Implement deposit(), withdraw(), and get_balance()'}</div>
                  </div>
                  <p className="text-text-muted text-xs mt-2">💡 Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;mut self</code> for deposit/withdraw, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;self</code> for get_balance.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Enum State Machine</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ProposalStatus</code> enum with variants: Pending, Approved, Rejected. Write a match expression that handles each variant.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 This pattern is used heavily in DAO contracts on NEAR.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Rustlings Exercises</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Install and work through the first 20 Rustlings exercises for hands-on Rust practice:
                  </p>
                  <div className="bg-black/40 rounded-lg p-3 font-mono text-sm text-text-secondary border border-border">
                    <div>cargo install rustlings</div>
                    <div>rustlings init</div>
                    <div>cd rustlings</div>
                    <div>rustlings</div>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'The Rust Book', url: 'https://doc.rust-lang.org/book/', desc: 'The official Rust tutorial — chapters 1-10 are most relevant' },
                  { title: 'Rust by Example', url: 'https://doc.rust-lang.org/rust-by-example/', desc: 'Learn Rust through annotated examples' },
                  { title: 'Rustlings', url: 'https://github.com/rust-lang/rustlings', desc: 'Small exercises to practice Rust fundamentals' },
                  { title: 'NEAR SDK Rust Docs', url: 'https://docs.rs/near-sdk/', desc: 'API reference for the NEAR Rust SDK' },
                  { title: 'Rust Playground', url: 'https://play.rust-lang.org/', desc: 'Test Rust code in your browser' },
                  { title: 'NEAR Rust Smart Contract Guide', url: 'https://docs.near.org/build/smart-contracts/anatomy', desc: 'How Rust maps to NEAR contracts' },
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

export default RustFundamentals;
