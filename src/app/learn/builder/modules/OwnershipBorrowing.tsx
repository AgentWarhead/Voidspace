'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, CheckCircle, ExternalLink, BookOpen, Cpu, AlertTriangle } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OwnershipBorrowingProps {
  isActive: boolean;
  onToggle: () => void;
}

const OwnershipBorrowing: React.FC<OwnershipBorrowingProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Ownership & Borrowing</h3>
            <p className="text-text-muted text-sm">Rust&apos;s killer feature — memory safety without garbage collection</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Beginner</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">35 min</Badge>
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
                  <BookOpen className="w-5 h-5 text-red-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Ownership rules — every value has exactly one owner',
                    'Move semantics — what happens when you assign or pass values',
                    'Stack vs heap — where data lives and why it matters',
                    'Borrowing with & and &mut — reading vs writing references',
                    'Lifetimes — how Rust tracks reference validity',
                    'Why &self and &mut self matter for NEAR view vs change methods',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-red-500/20 bg-red-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-red-400 font-semibold">Why this matters:</span> Ownership is what makes Rust unique. The borrow checker prevents data races, use-after-free, and double-free bugs at compile time — critical for smart contracts holding real money.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-red-400" />
                    The Three Ownership Rules
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Every value in Rust follows three simple rules: (1) each value has exactly one owner, (2) when the owner goes out of scope the value is dropped, (3) there can only be one owner at a time.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Ownership moves — s1 is no longer valid after assignment'}</div>
                    <div><span className="text-purple-400">let</span> s1 = <span className="text-near-green">String::from</span>(<span className="text-yellow-300">&quot;hello&quot;</span>);</div>
                    <div><span className="text-purple-400">let</span> s2 = s1; <span className="text-text-muted">{'// s1 is MOVED to s2'}</span></div>
                    <div className="text-red-400">{'// println!("{}", s1); // ❌ ERROR: s1 was moved!'}</div>
                    <div className="mt-3 text-text-muted">{'// Clone creates a deep copy'}</div>
                    <div><span className="text-purple-400">let</span> s3 = <span className="text-near-green">String::from</span>(<span className="text-yellow-300">&quot;world&quot;</span>);</div>
                    <div><span className="text-purple-400">let</span> s4 = s3.<span className="text-near-green">clone</span>(); <span className="text-text-muted">{'// Both s3 and s4 are valid'}</span></div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-400" />
                    Borrowing: References Without Ownership
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Instead of taking ownership, you can <em>borrow</em> a value using references. Immutable references (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;</code>) allow reading, mutable references (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;mut</code>) allow writing.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Immutable borrow — can have many at once'}</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">get_length</span>(s: <span className="text-purple-400">&amp;</span><span className="text-cyan-400">String</span>) -&gt; <span className="text-cyan-400">usize</span> {'{'}</div>
                    <div>    s.<span className="text-near-green">len</span>() <span className="text-text-muted">{'// read-only access'}</span></div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// Mutable borrow — only one at a time'}</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">add_suffix</span>(s: <span className="text-purple-400">&amp;mut</span> <span className="text-cyan-400">String</span>) {'{'}</div>
                    <div>    s.<span className="text-near-green">push_str</span>(<span className="text-yellow-300">&quot;.near&quot;</span>);</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    In NEAR Contracts: &amp;self vs &amp;mut self
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR uses Rust&apos;s borrowing directly. View methods use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;self</code> (read-only, free to call). Change methods use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">&amp;mut self</code> (requires gas, modifies state).
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[near_bindgen]</span></div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Contract</span> {'{'}</div>
                    <div>    <span className="text-text-muted">{'// View method — read-only, no gas cost for caller'}</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">get_count</span>(<span className="text-purple-400">&amp;self</span>) -&gt; <span className="text-cyan-400">i32</span> {'{'}</div>
                    <div>        <span className="text-purple-400">self</span>.count</div>
                    <div>    {'}'}</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Change method — modifies state, costs gas'}</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">increment</span>(<span className="text-purple-400">&amp;mut self</span>) {'{'}</div>
                    <div>        <span className="text-purple-400">self</span>.count += 1;</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Practice Exercises</h4>
                {[
                  { title: 'Fix the Move Error', desc: 'Debug code where a value was used after being moved', difficulty: 'Easy' },
                  { title: 'Refactor to Borrowing', desc: 'Convert a function that takes ownership to use references instead', difficulty: 'Easy' },
                  { title: 'Mutable Reference Challenge', desc: 'Modify a struct through a mutable reference without violating borrow rules', difficulty: 'Medium' },
                  { title: 'Contract Method Signatures', desc: 'Design correct &self and &mut self methods for a NEAR contract', difficulty: 'Medium' },
                ].map((exercise, i) => (
                  <Card key={i} variant="default" padding="md" className="border-border/50 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-text-primary">{exercise.title}</h5>
                        <p className="text-sm text-text-muted mt-1">{exercise.desc}</p>
                      </div>
                      <Badge className={cn(
                        exercise.difficulty === 'Easy' ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      )}>{exercise.difficulty}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'The Rust Book — Ownership', url: 'https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html', desc: 'Official chapter on ownership, borrowing, and slices' },
                  { title: 'Rust by Example — Ownership', url: 'https://doc.rust-lang.org/rust-by-example/scope/move.html', desc: 'Interactive examples of move semantics' },
                  { title: 'NEAR SDK Docs', url: 'https://docs.near.org/sdk/rust/introduction', desc: 'How NEAR uses Rust ownership patterns' },
                ].map((resource, i) => (
                  <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                    <Card variant="default" padding="md" className="border-border/50 hover:border-near-green/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-text-primary flex items-center gap-2">
                            {resource.title}
                            <ExternalLink className="w-3 h-3 text-text-muted" />
                          </h5>
                          <p className="text-sm text-text-muted mt-1">{resource.desc}</p>
                        </div>
                      </div>
                    </Card>
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

export default OwnershipBorrowing;
