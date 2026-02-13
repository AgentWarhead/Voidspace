'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Boxes, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StructsEnumsProps {
  isActive: boolean;
  onToggle: () => void;
}

const StructsEnums: React.FC<StructsEnumsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Structs & Enums</h3>
            <p className="text-text-muted text-sm">Model your contract state with custom data types</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Beginner</Badge>
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
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Defining structs — named fields, tuple structs, unit structs',
                    'impl blocks — methods and associated functions',
                    'Enums with data — variants that carry payloads',
                    'Pattern matching with match — exhaustive, safe branching',
                    'Modeling contract state with #[near(contract_state)]',
                    'Using enums for contract actions and status tracking',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-blue-500/20 bg-blue-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-blue-400 font-semibold">Why this matters:</span> Every NEAR smart contract is a struct. Your contract state, method parameters, and return types all use structs and enums. Mastering these is non-negotiable.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-blue-400" />
                    Structs: Your Contract State
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A struct groups related data together. In NEAR, your contract state is always a struct decorated with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">#[near(contract_state)]</code>.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Define your contract state'}</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Marketplace</span> {'{'}</div>
                    <div>    owner: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    listings: <span className="text-cyan-400">Vec</span>&lt;<span className="text-cyan-400">Listing</span>&gt;,</div>
                    <div>    total_sales: <span className="text-cyan-400">u128</span>,</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// Implement methods'}</div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">Marketplace</span> {'{'}</div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">new</span>(owner: <span className="text-cyan-400">AccountId</span>) -&gt; <span className="text-cyan-400">Self</span> {'{'}</div>
                    <div>        <span className="text-cyan-400">Self</span> {'{'} owner, listings: <span className="text-near-green">Vec::new</span>(), total_sales: 0 {'}'}</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">🔀</span> Enums & Pattern Matching
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Enums represent a value that can be one of several variants. Unlike other languages, Rust enums can carry data. Combined with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">match</code>, they provide exhaustive, safe branching.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">enum</span> <span className="text-cyan-400">ListingStatus</span> {'{'}</div>
                    <div>    Active {'{'} price: <span className="text-cyan-400">u128</span> {'}'},</div>
                    <div>    Sold {'{'} buyer: <span className="text-cyan-400">AccountId</span>, price: <span className="text-cyan-400">u128</span> {'}'},</div>
                    <div>    Cancelled,</div>
                    <div>{'}'}</div>
                    <div className="mt-3"><span className="text-purple-400">fn</span> <span className="text-near-green">describe</span>(status: <span className="text-cyan-400">ListingStatus</span>) -&gt; <span className="text-cyan-400">String</span> {'{'}</div>
                    <div>    <span className="text-purple-400">match</span> status {'{'}</div>
                    <div>        <span className="text-cyan-400">ListingStatus</span>::Active {'{'} price {'}'} =&gt;</div>
                    <div>            <span className="text-near-green">format!</span>(<span className="text-yellow-300">&quot;For sale: {} yoctoNEAR&quot;</span>, price),</div>
                    <div>        <span className="text-cyan-400">ListingStatus</span>::Sold {'{'} buyer, .. {'}'} =&gt;</div>
                    <div>            <span className="text-near-green">format!</span>(<span className="text-yellow-300">&quot;Sold to {}&quot;</span>, buyer),</div>
                    <div>        <span className="text-cyan-400">ListingStatus</span>::Cancelled =&gt;</div>
                    <div>            <span className="text-yellow-300">&quot;Cancelled&quot;</span>.<span className="text-near-green">to_string</span>(),</div>
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
                  { title: 'Model a Token Contract', desc: 'Define a struct for fungible token state with owner, total_supply, and balances', difficulty: 'Easy' },
                  { title: 'Enum-Driven Actions', desc: 'Create an enum for contract actions (Transfer, Mint, Burn) and handle each with match', difficulty: 'Medium' },
                  { title: 'Nested Structs', desc: 'Build a proposal struct containing voter data and status enum', difficulty: 'Medium' },
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
                  { title: 'The Rust Book — Structs', url: 'https://doc.rust-lang.org/book/ch05-00-structs.html', desc: 'Defining and using structs' },
                  { title: 'The Rust Book — Enums', url: 'https://doc.rust-lang.org/book/ch06-00-enums.html', desc: 'Enums, match, and if let patterns' },
                  { title: 'NEAR Contract Structure', url: 'https://docs.near.org/sdk/rust/contract-structure/near-bindgen', desc: 'How NEAR uses structs for contract state' },
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

export default StructsEnums;
