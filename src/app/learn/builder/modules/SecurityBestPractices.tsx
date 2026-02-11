'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, ExternalLink, CheckCircle, AlertTriangle, Lock, Eye } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface SecurityBestPracticesProps {
  isActive: boolean;
  onToggle: () => void;
}

const SecurityBestPractices: React.FC<SecurityBestPracticesProps> = ({ isActive, onToggle }) => {
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
            <h3 className="text-xl font-bold text-text-primary">Security Best Practices</h3>
            <p className="text-text-muted text-sm">Protect your contracts from common vulnerabilities and attacks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">60 min</Badge>
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
                  <Shield className="w-5 h-5 text-red-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Reentrancy attacks and how NEAR\'s async model affects them',
                    'Access control patterns — owner-only, role-based, allowlists',
                    'Integer overflow/underflow protection in Rust',
                    'Cross-contract call security — callback validation',
                    'Storage attacks and denial-of-service prevention',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-red-500/20 bg-red-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-red-400 font-semibold">⚠️ Critical module:</span> Security bugs in smart contracts can lead to permanent loss of funds. Every builder MUST understand these patterns before deploying to mainnet.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-400" />
                    Access Control
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Always verify who is calling your contract. Never trust input blindly.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// ✅ Owner-only check</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">assert_owner</span>(&amp;self) {'{'}</div>
                    <div>    require!(</div>
                    <div>        env::predecessor_account_id() == self.owner,</div>
                    <div>        <span className="text-yellow-300">&quot;Only the owner can call this method&quot;</span></div>
                    <div>    );</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// ✅ Self-only check (for callbacks)</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">assert_self</span>() {'{'}</div>
                    <div>    require!(</div>
                    <div>        env::predecessor_account_id() == env::current_account_id(),</div>
                    <div>        <span className="text-yellow-300">&quot;This method can only be called by the contract itself&quot;</span></div>
                    <div>    );</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// ❌ NEVER do this — anyone can call</div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">withdraw_all</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                    <div>    <span className="text-text-muted">// Missing access control! Anyone can drain funds</span></div>
                    <div>    Promise::new(env::predecessor_account_id()).transfer(self.balance);</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Reentrancy &amp; Callback Safety
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR&apos;s async execution model means cross-contract calls execute in the <strong>next block</strong>. State changes before the callback persist even if the callback fails.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// ❌ DANGEROUS — state changed before callback</div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">withdraw</span>(&amp;<span className="text-purple-400">mut</span> self, amount: U128) -&gt; Promise {'{'}</div>
                    <div>    self.balance -= amount.0; <span className="text-text-muted">// Changed BEFORE transfer completes</span></div>
                    <div>    Promise::new(env::predecessor_account_id()).transfer(NearToken::from_yoctonear(amount.0))</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// ✅ SAFE — use callback to confirm</div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">withdraw</span>(&amp;<span className="text-purple-400">mut</span> self, amount: U128) -&gt; Promise {'{'}</div>
                    <div>    <span className="text-purple-400">let</span> account = env::predecessor_account_id();</div>
                    <div>    self.pending_withdrawals.insert(&amp;account, &amp;amount.0);</div>
                    <div>    Promise::new(account.clone())</div>
                    <div>        .transfer(NearToken::from_yoctonear(amount.0))</div>
                    <div>        .then(Promise::new(env::current_account_id())</div>
                    <div>            .function_call(<span className="text-yellow-300">&quot;on_withdraw&quot;</span>.into(), ...))</div>
                    <div>{'}'}</div>
                    <div className="mt-2"><span className="text-purple-400">#[private]</span> <span className="text-text-muted">// Only callable by self</span></div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">on_withdraw</span>(&amp;<span className="text-purple-400">mut</span> self) {'{'}</div>
                    <div>    <span className="text-purple-400">if</span> env::promise_results_count() == 1 {'{'}</div>
                    <div>        <span className="text-text-muted">// Check if transfer succeeded</span></div>
                    <div>        <span className="text-purple-400">match</span> env::promise_result(0) {'{'}</div>
                    <div>            PromiseResult::Successful(_) =&gt; {'{'} <span className="text-text-muted">/* deduct balance */</span> {'}'}</div>
                    <div>            _ =&gt; {'{'} <span className="text-text-muted">/* revert pending withdrawal */</span> {'}'}</div>
                    <div>        {'}'}</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-blue-400">🔢</span> Integer Safety
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Rust panics on overflow in debug mode, but wraps in release mode. Always use checked arithmetic:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// ❌ Can overflow silently in release</div>
                    <div><span className="text-purple-400">let</span> total = balance + amount;</div>
                    <div className="mt-2 text-text-muted">// ✅ Safe — panics with a clear error</div>
                    <div><span className="text-purple-400">let</span> total = balance.checked_add(amount)</div>
                    <div>    .unwrap_or_else(|| env::panic_str(<span className="text-yellow-300">&quot;Balance overflow&quot;</span>));</div>
                    <div className="mt-2 text-text-muted">// ✅ Also safe</div>
                    <div><span className="text-purple-400">let</span> remaining = balance.checked_sub(amount)</div>
                    <div>    .unwrap_or_else(|| env::panic_str(<span className="text-yellow-300">&quot;Insufficient balance&quot;</span>));</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    Deposit &amp; Attachment Checks
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Always validate attached deposits. Mark payable methods explicitly:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Require exactly 1 yoctoNEAR (confirms user intent)</div>
                    <div><span className="text-purple-400">#[payable]</span></div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">ft_transfer</span>(&amp;<span className="text-purple-400">mut</span> self, ...) {'{'}</div>
                    <div>    require!(</div>
                    <div>        env::attached_deposit() == NearToken::from_yoctonear(1),</div>
                    <div>        <span className="text-yellow-300">&quot;Requires exactly 1 yoctoNEAR attached&quot;</span></div>
                    <div>    );</div>
                    <div>{'}'}</div>
                    <div className="mt-3 text-text-muted">// Require NO deposit (prevent accidental fund loss)</div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">get_greeting</span>(&amp;self) -&gt; String {'{'}</div>
                    <div>    <span className="text-text-muted">// View methods automatically reject deposits</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-red-400">🛡️</span> Security Checklist
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Every change method has access control checks</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Callback methods are marked <code className="text-purple-400">#[private]</code></li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> All arithmetic uses checked operations</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Attached deposits are validated</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Cross-contract callback results are checked</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Storage costs are covered by the caller</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> No unbounded iterations (gas limit attacks)</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Error messages don&apos;t leak sensitive info</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Full access key removed for locked contracts</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Contract has been tested with malicious inputs</li>
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
                    <h5 className="font-semibold text-text-primary">Audit Your Voting Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Review your voting dApp contract against the security checklist. Fix every vulnerability you find.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Break a Vulnerable Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Deploy a contract with an intentional vulnerability (missing access control on withdraw). Write a test that exploits it from an unauthorized account.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Implement Safe Callbacks</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add a withdrawal method that uses the safe callback pattern: reserve funds → transfer → confirm/rollback in callback.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Security Guidelines', url: 'https://docs.near.org/build/smart-contracts/security', desc: 'Official security best practices' },
                  { title: 'Smart Contract Audit Checklist', url: 'https://docs.near.org/build/smart-contracts/security/checklist', desc: 'Pre-deployment security checklist' },
                  { title: 'Common Vulnerabilities', url: 'https://docs.near.org/build/smart-contracts/security/vulnerabilities', desc: 'Known attack patterns on NEAR' },
                  { title: 'Callback Security', url: 'https://docs.near.org/build/smart-contracts/security/callbacks', desc: 'Safe cross-contract call patterns' },
                  { title: 'Blocksec NEAR Audits', url: 'https://github.com/nicechute/near-security-resources', desc: 'Security audit reports and findings' },
                  { title: 'Rust Safety Features', url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html', desc: 'How Rust prevents common bugs' },
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

export default SecurityBestPractices;
