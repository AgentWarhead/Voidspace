'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, ExternalLink, BookOpen } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ErrorHandlingProps {
  isActive: boolean;
  onToggle: () => void;
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Error Handling</h3>
            <p className="text-text-muted text-sm">Result, Option, and why panicking costs real money</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">25 min</Badge>
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
                  <BookOpen className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Option<T> — Rust\'s replacement for null',
                    'Result<T, E> — explicit success or failure',
                    'The ? operator — propagate errors elegantly',
                    'Custom error types for your contracts',
                    'When to panic! vs return Err in smart contracts',
                    'env::panic_str() — NEAR-specific error handling',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-yellow-500/20 bg-yellow-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-yellow-400 font-semibold">Why this matters:</span> In smart contracts, unhandled errors can burn gas and leave state in an inconsistent state. Rust forces you to handle every edge case — that&apos;s a feature, not a burden.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">❓</span> Option&lt;T&gt; — Goodbye Null
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rust has no null. Instead, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Option&lt;T&gt;</code> represents a value that might or might not exist.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">get_balance</span>(&amp;self, account: &amp;<span className="text-cyan-400">AccountId</span>) -&gt; <span className="text-cyan-400">Option</span>&lt;<span className="text-cyan-400">u128</span>&gt; {'{'}</div>
                    <div>    self.balances.<span className="text-near-green">get</span>(account) <span className="text-text-muted">{'// Returns Some(balance) or None'}</span></div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// Handle it explicitly'}</div>
                    <div><span className="text-purple-400">match</span> contract.<span className="text-near-green">get_balance</span>(&amp;account) {'{'}</div>
                    <div>    <span className="text-cyan-400">Some</span>(balance) =&gt; <span className="text-near-green">log!</span>(<span className="text-yellow-300">&quot;Balance: {}&quot;</span>, balance),</div>
                    <div>    <span className="text-cyan-400">None</span> =&gt; <span className="text-near-green">log!</span>(<span className="text-yellow-300">&quot;Account not found&quot;</span>),</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">{'// Or use unwrap_or for defaults'}</div>
                    <div><span className="text-purple-400">let</span> balance = contract.<span className="text-near-green">get_balance</span>(&amp;account).<span className="text-near-green">unwrap_or</span>(0);</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Result&lt;T, E&gt; & the ? Operator
                  </h4>
                  <p className="text-text-secondary mb-3">
                    <code className="text-purple-400 bg-purple-500/10 px-1 rounded">Result&lt;T, E&gt;</code> represents an operation that can succeed (<code className="text-near-green">Ok(T)</code>) or fail (<code className="text-red-400">Err(E)</code>). The <code className="text-purple-400 bg-purple-500/10 px-1 rounded">?</code> operator propagates errors up the call chain.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">transfer</span>(</div>
                    <div>    &amp;<span className="text-purple-400">mut self</span>,</div>
                    <div>    to: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    amount: <span className="text-cyan-400">u128</span>,</div>
                    <div>) -&gt; <span className="text-cyan-400">Result</span>&lt;(), <span className="text-cyan-400">String</span>&gt; {'{'}</div>
                    <div>    <span className="text-purple-400">let</span> sender = <span className="text-near-green">env::predecessor_account_id</span>();</div>
                    <div>    <span className="text-purple-400">let</span> balance = self.balances</div>
                    <div>        .<span className="text-near-green">get</span>(&amp;sender)</div>
                    <div>        .<span className="text-near-green">ok_or</span>(<span className="text-yellow-300">&quot;Account not found&quot;</span>.<span className="text-near-green">to_string</span>())?;</div>
                    <div className="mt-2">    <span className="text-purple-400">if</span> balance &lt; amount {'{'}</div>
                    <div>        <span className="text-purple-400">return</span> <span className="text-red-400">Err</span>(<span className="text-yellow-300">&quot;Insufficient balance&quot;</span>.<span className="text-near-green">to_string</span>());</div>
                    <div>    {'}'}</div>
                    <div>    <span className="text-near-green">Ok</span>(())</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-red-400">💥</span> Panicking in Contracts
                  </h4>
                  <p className="text-text-secondary mb-3">
                    In NEAR contracts, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">panic!</code> reverts the transaction but still burns gas. Use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">env::panic_str()</code> for clearer error messages, and prefer early validation to save gas.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// ❌ Avoid: unwrap() panics with unclear messages'}</div>
                    <div><span className="text-purple-400">let</span> balance = self.balances.<span className="text-near-green">get</span>(&amp;sender).<span className="text-red-400">unwrap</span>();</div>
                    <div className="mt-3 text-text-muted">{'// ✅ Better: explicit error with context'}</div>
                    <div><span className="text-purple-400">let</span> balance = self.balances.<span className="text-near-green">get</span>(&amp;sender)</div>
                    <div>    .<span className="text-near-green">unwrap_or_else</span>(|| <span className="text-near-green">env::panic_str</span>(<span className="text-yellow-300">&quot;Account not registered&quot;</span>));</div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Practice Exercises</h4>
                {[
                  { title: 'Option Unwrapping', desc: 'Safely handle a lookup that might return None using match and unwrap_or', difficulty: 'Easy' },
                  { title: 'Result Chain', desc: 'Chain multiple fallible operations using the ? operator', difficulty: 'Medium' },
                  { title: 'Custom Contract Errors', desc: 'Define a custom error enum and use it in a lending contract', difficulty: 'Medium' },
                ].map((exercise, i) => (
                  <Card key={i} variant="default" padding="md" className="border-border/50 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold text-text-primary">{exercise.title}</h5>
                        <p className="text-sm text-text-muted mt-1">{exercise.desc}</p>
                      </div>
                      <Badge className={cn(
                        exercise.difficulty === 'Easy' ? 'bg-near-green/10 text-near-green border-near-green/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
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
                  { title: 'The Rust Book — Error Handling', url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html', desc: 'Comprehensive guide to Result, Option, and panic' },
                  { title: 'Rust by Example — Error Handling', url: 'https://doc.rust-lang.org/rust-by-example/error.html', desc: 'Practical error handling patterns' },
                  { title: 'NEAR — Handling Errors', url: 'https://docs.near.org/sdk/rust/promises/error-handling', desc: 'Error handling in cross-contract calls' },
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

export default ErrorHandling;
