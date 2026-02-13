'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CollectionsIteratorsProps {
  isActive: boolean;
  onToggle: () => void;
}

const CollectionsIterators: React.FC<CollectionsIteratorsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Collections & Iterators</h3>
            <p className="text-text-muted text-sm">Vec, HashMap, NEAR collections, and functional patterns</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">30 min</Badge>
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
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Vec<T> — dynamic arrays for ordered data',
                    'HashMap<K, V> — key-value stores for lookups',
                    'Iterators — .map(), .filter(), .fold() for functional data processing',
                    'NEAR collections — LookupMap, UnorderedMap, Vector',
                    'When to use standard vs NEAR collections (gas implications)',
                    'Pagination patterns for on-chain data',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-emerald-500/20 bg-emerald-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-emerald-400 font-semibold">Why this matters:</span> On-chain storage is expensive. Using the wrong collection can make your contract unusable at scale. NEAR&apos;s specialized collections (LookupMap, etc.) are optimized for blockchain storage — standard HashMap loads everything into memory.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    Standard Collections
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rust&apos;s standard library provides Vec (dynamic array), HashMap (key-value map), HashSet (unique values), and more.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Vec — ordered, growable array'}</div>
                    <div><span className="text-purple-400">let mut</span> names: <span className="text-cyan-400">Vec</span>&lt;<span className="text-cyan-400">String</span>&gt; = <span className="text-near-green">Vec::new</span>();</div>
                    <div>names.<span className="text-near-green">push</span>(<span className="text-yellow-300">&quot;alice.near&quot;</span>.<span className="text-near-green">to_string</span>());</div>
                    <div>names.<span className="text-near-green">push</span>(<span className="text-yellow-300">&quot;bob.near&quot;</span>.<span className="text-near-green">to_string</span>());</div>
                    <div className="mt-3 text-text-muted">{'// HashMap — key-value store'}</div>
                    <div><span className="text-purple-400">let mut</span> balances: <span className="text-cyan-400">HashMap</span>&lt;<span className="text-cyan-400">AccountId</span>, <span className="text-cyan-400">u128</span>&gt; = <span className="text-near-green">HashMap::new</span>();</div>
                    <div>balances.<span className="text-near-green">insert</span>(alice, 1_000_000);</div>
                    <div><span className="text-purple-400">let</span> bal = balances.<span className="text-near-green">get</span>(&amp;alice).<span className="text-near-green">unwrap_or</span>(&amp;0);</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">🔄</span> Iterators & Functional Patterns
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Iterators are Rust&apos;s way to process sequences of values lazily and efficiently. Chain operations like map, filter, and collect.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">let</span> amounts = <span className="text-near-green">vec!</span>[100, 200, 50, 300, 75];</div>
                    <div className="mt-2 text-text-muted">{'// Filter + map + collect'}</div>
                    <div><span className="text-purple-400">let</span> large: <span className="text-cyan-400">Vec</span>&lt;<span className="text-cyan-400">u128</span>&gt; = amounts.<span className="text-near-green">iter</span>()</div>
                    <div>    .<span className="text-near-green">filter</span>(|&&amp;x| x &gt; 100)</div>
                    <div>    .<span className="text-near-green">map</span>(|&amp;x| x * 2)</div>
                    <div>    .<span className="text-near-green">collect</span>();</div>
                    <div className="text-text-muted">{'// large = [400, 600]'}</div>
                    <div className="mt-3 text-text-muted">{'// Sum with fold'}</div>
                    <div><span className="text-purple-400">let</span> total: <span className="text-cyan-400">u128</span> = amounts.<span className="text-near-green">iter</span>().<span className="text-near-green">sum</span>();</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-near-green">⚡</span> NEAR Collections
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Standard collections load all data into memory. NEAR collections (<code className="text-purple-400 bg-purple-500/10 px-1 rounded">LookupMap</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">UnorderedMap</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Vector</code>) are trie-based and only load what you access — critical for gas efficiency.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">use</span> near_sdk::store::{'{'}<span className="text-cyan-400">LookupMap</span>, <span className="text-cyan-400">UnorderedMap</span>{'}'};</div>
                    <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Token</span> {'{'}</div>
                    <div>    <span className="text-text-muted">{'// ✅ NEAR collection — loads entries on demand'}</span></div>
                    <div>    balances: <span className="text-cyan-400">LookupMap</span>&lt;<span className="text-cyan-400">AccountId</span>, <span className="text-cyan-400">u128</span>&gt;,</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// ❌ Standard HashMap — loads ALL entries every call'}</span></div>
                    <div>    <span className="text-text-muted">{'// balances: HashMap<AccountId, u128>,'}</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Practice Exercises</h4>
                {[
                  { title: 'Iterator Chain', desc: 'Process a list of transactions using filter, map, and fold to compute totals', difficulty: 'Easy' },
                  { title: 'Migrate to NEAR Collections', desc: 'Refactor a contract from HashMap to LookupMap and measure gas savings', difficulty: 'Medium' },
                  { title: 'Paginated Queries', desc: 'Implement from_index and limit pagination for an on-chain list', difficulty: 'Medium' },
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
                  { title: 'The Rust Book — Collections', url: 'https://doc.rust-lang.org/book/ch08-00-common-collections.html', desc: 'Vec, String, and HashMap fundamentals' },
                  { title: 'NEAR SDK — Collections', url: 'https://docs.near.org/sdk/rust/contract-structure/collections', desc: 'LookupMap, UnorderedMap, Vector, and when to use each' },
                  { title: 'Rust by Example — Iterators', url: 'https://doc.rust-lang.org/rust-by-example/trait/iter.html', desc: 'Iterator patterns and functional programming in Rust' },
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

export default CollectionsIterators;
