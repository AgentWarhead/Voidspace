'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Puzzle, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TraitsGenericsProps {
  isActive: boolean;
  onToggle: () => void;
}

const TraitsGenerics: React.FC<TraitsGenericsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <Puzzle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Traits & Generics</h3>
            <p className="text-text-muted text-sm">Reusable interfaces, derive macros, and Borsh serialization</p>
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
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Defining traits — shared behavior across types',
                    'Implementing traits for your structs',
                    'Generics — write code that works with any type',
                    'Trait bounds — constrain generics to specific capabilities',
                    'Derive macros — #[derive(BorshSerialize, BorshDeserialize)]',
                    'How NEAR SDK uses traits for serialization and contract interfaces',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-purple-500/20 bg-purple-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-purple-400 font-semibold">Why this matters:</span> NEAR SDK relies heavily on traits. Your contract state needs BorshSerialize and BorshDeserialize. NEP standards are defined as traits. Understanding these is key to writing idiomatic NEAR contracts.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-purple-400" />
                    Defining & Implementing Traits
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A trait defines shared behavior. Think of it as an interface — any type that implements a trait guarantees it has certain methods.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Define a trait'}</div>
                    <div><span className="text-purple-400">trait</span> <span className="text-cyan-400">Transferable</span> {'{'}</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">transfer</span>(&amp;<span className="text-purple-400">mut self</span>, to: <span className="text-cyan-400">AccountId</span>, amount: <span className="text-cyan-400">u128</span>);</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">balance_of</span>(&amp;self, account: &amp;<span className="text-cyan-400">AccountId</span>) -&gt; <span className="text-cyan-400">u128</span>;</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// Implement it for your contract'}</div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Transferable</span> <span className="text-purple-400">for</span> <span className="text-cyan-400">TokenContract</span> {'{'}</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">transfer</span>(&amp;<span className="text-purple-400">mut self</span>, to: <span className="text-cyan-400">AccountId</span>, amount: <span className="text-cyan-400">u128</span>) {'{'}</div>
                    <div>        <span className="text-text-muted">{'// ... implementation'}</span></div>
                    <div>    {'}'}</div>
                    <div>    <span className="text-purple-400">fn</span> <span className="text-near-green">balance_of</span>(&amp;self, account: &amp;<span className="text-cyan-400">AccountId</span>) -&gt; <span className="text-cyan-400">u128</span> {'{'}</div>
                    <div>        *self.balances.<span className="text-near-green">get</span>(account).<span className="text-near-green">unwrap_or</span>(&amp;0)</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">🧬</span> Generics & Trait Bounds
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Generics let you write code that works with multiple types. Trait bounds constrain those types to ones that implement specific traits.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Generic function with trait bound'}</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">print_balance</span>&lt;T: <span className="text-cyan-400">Transferable</span>&gt;(contract: &amp;T, account: &amp;<span className="text-cyan-400">AccountId</span>) {'{'}</div>
                    <div>    <span className="text-near-green">log!</span>(<span className="text-yellow-300">&quot;Balance: {}&quot;</span>, contract.<span className="text-near-green">balance_of</span>(account));</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// where clause for complex bounds'}</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">process</span>&lt;T&gt;(item: T)</div>
                    <div><span className="text-purple-400">where</span></div>
                    <div>    T: <span className="text-cyan-400">BorshSerialize</span> + <span className="text-cyan-400">BorshDeserialize</span> + <span className="text-cyan-400">Clone</span>,</div>
                    <div>{'{'}</div>
                    <div>    <span className="text-text-muted">{'// T must implement all three traits'}</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">✨</span> Derive Macros & Borsh
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Derive macros auto-implement traits. NEAR uses Borsh (Binary Object Representation Serializer for Hashing) for efficient on-chain serialization.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[derive(BorshSerialize, BorshDeserialize, Clone, Debug)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Proposal</span> {'{'}</div>
                    <div>    id: <span className="text-cyan-400">u64</span>,</div>
                    <div>    proposer: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    description: <span className="text-cyan-400">String</span>,</div>
                    <div>    votes_for: <span className="text-cyan-400">u32</span>,</div>
                    <div>    votes_against: <span className="text-cyan-400">u32</span>,</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// Borsh serializes this efficiently for on-chain storage'}</div>
                    <div className="text-text-muted">{'// No JSON overhead — compact binary representation'}</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Practice Exercises</h4>
                {[
                  { title: 'Define a Token Trait', desc: 'Create a trait for fungible token operations and implement it', difficulty: 'Medium' },
                  { title: 'Generic Storage Helper', desc: 'Write a generic function that serializes any Borsh-compatible type', difficulty: 'Medium' },
                  { title: 'NEP-141 Interface', desc: 'Implement the fungible token standard as a trait with required methods', difficulty: 'Hard' },
                ].map((exercise, i) => (
                  <Card key={i} variant="default" padding="md" className="border-border/50 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-text-primary">{exercise.title}</h5>
                        <p className="text-sm text-text-muted mt-1">{exercise.desc}</p>
                      </div>
                      <Badge className={cn(
                        exercise.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
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
                  { title: 'The Rust Book — Traits', url: 'https://doc.rust-lang.org/book/ch10-02-traits.html', desc: 'Defining shared behavior with traits' },
                  { title: 'The Rust Book — Generics', url: 'https://doc.rust-lang.org/book/ch10-01-syntax.html', desc: 'Generic data types, functions, and methods' },
                  { title: 'Borsh Specification', url: 'https://borsh.io/', desc: 'The serialization format NEAR uses for on-chain state' },
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

export default TraitsGenerics;
