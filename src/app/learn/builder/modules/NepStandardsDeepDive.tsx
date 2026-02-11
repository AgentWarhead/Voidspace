'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ExternalLink, CheckCircle, FileText, Scale, Plug } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NepStandardsDeepDiveProps {
  isActive: boolean;
  onToggle: () => void;
}

const NepStandardsDeepDive: React.FC<NepStandardsDeepDiveProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEP Standards Deep Dive</h3>
            <p className="text-text-muted text-sm">Master the NEAR Enhancement Proposals that power the ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
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
                  <Scale className="w-5 h-5 text-teal-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'What NEPs are and how the standards process works',
                    'NEP-145: Storage Management — how users pay for on-chain storage',
                    'NEP-148: FT Metadata — names, symbols, decimals, icons',
                    'NEP-178: NFT Approval Management — marketplace integration',
                    'NEP-297: Events — standard event logging for indexers',
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
                    <FileText className="w-5 h-5 text-teal-400" />
                    What are NEPs?
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR Enhancement Proposals (NEPs) are the standards that make NEAR contracts interoperable. Like Ethereum&apos;s ERCs, NEPs define interfaces that wallets, explorers, and other contracts rely on.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">🔵 Contract Standards</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>NEP-141 — Fungible Token Core</li>
                        <li>NEP-145 — Storage Management</li>
                        <li>NEP-148 — FT Metadata</li>
                        <li>NEP-171 — NFT Core</li>
                        <li>NEP-177 — NFT Metadata</li>
                        <li>NEP-178 — NFT Approval</li>
                        <li>NEP-181 — NFT Enumeration</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">🟢 Protocol Standards</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>NEP-245 — Multi Token</li>
                        <li>NEP-264 — Multi-Action</li>
                        <li>NEP-297 — Events</li>
                        <li>NEP-330 — Contract Metadata</li>
                        <li>NEP-366 — Meta Transactions</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">💾</span> NEP-145: Storage Management
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Defines how users register and pay for storage on your contract. Essential for any token contract.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Required methods</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">storage_deposit</span>(&amp;<span className="text-purple-400">mut</span> self, account_id: Option&lt;AccountId&gt;, registration_only: Option&lt;bool&gt;);</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">storage_withdraw</span>(&amp;<span className="text-purple-400">mut</span> self, amount: Option&lt;U128&gt;) -&gt; U128;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">storage_unregister</span>(&amp;<span className="text-purple-400">mut</span> self, force: Option&lt;bool&gt;) -&gt; bool;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">storage_balance_bounds</span>(&amp;self) -&gt; StorageBalanceBounds;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">storage_balance_of</span>(&amp;self, account_id: AccountId) -&gt; Option&lt;StorageBalance&gt;;</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-yellow-400 font-semibold">Why it matters:</span> Before a user can receive FTs, they must call <code className="text-purple-400 bg-purple-500/10 px-1 rounded">storage_deposit</code> on the token contract. This covers the cost of storing their balance entry on-chain.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-blue-400">📋</span> NEP-148: FT Metadata
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Defines how tokens describe themselves — name, symbol, decimals, and icon:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">struct</span> <span className="text-cyan-400">FungibleTokenMetadata</span> {'{'}</div>
                    <div>    spec: String,            <span className="text-text-muted">// &quot;ft-1.0.0&quot;</span></div>
                    <div>    name: String,             <span className="text-text-muted">// &quot;Wrapped NEAR&quot;</span></div>
                    <div>    symbol: String,           <span className="text-text-muted">// &quot;wNEAR&quot;</span></div>
                    <div>    icon: Option&lt;String&gt;,     <span className="text-text-muted">// data:image/svg+xml,...</span></div>
                    <div>    reference: Option&lt;String&gt;, <span className="text-text-muted">// Off-chain metadata URL</span></div>
                    <div>    decimals: u8,             <span className="text-text-muted">// 24 (1 NEAR = 10^24 yocto)</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Plug className="w-5 h-5 text-green-400" />
                    NEP-178: NFT Approval Management
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Allows NFT owners to approve other accounts (like marketplaces) to transfer their tokens:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Owner approves marketplace to transfer their NFT</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_approve</span>(</div>
                    <div>    &amp;<span className="text-purple-400">mut</span> self,</div>
                    <div>    token_id: TokenId,</div>
                    <div>    account_id: AccountId,</div>
                    <div>    msg: Option&lt;String&gt;,  <span className="text-text-muted">// Optional: triggers cross-contract call</span></div>
                    <div>);</div>
                    <div className="mt-2 text-text-muted">// Check if an account is approved</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_is_approved</span>(&amp;self, token_id: TokenId, approved_account_id: AccountId) -&gt; bool;</div>
                    <div className="mt-2 text-text-muted">// Revoke approval</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_revoke</span>(&amp;<span className="text-purple-400">mut</span> self, token_id: TokenId, account_id: AccountId);</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-purple-400">📡</span> NEP-297: Events
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Standard event format for indexers and explorers to track contract activity:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Emit a standard event log</div>
                    <div>env::log_str(&amp;format!(</div>
                    <div>    <span className="text-yellow-300">&quot;EVENT_JSON:{'{'}{'}'}&quot;</span>,</div>
                    <div>    json!({'{'}</div>
                    <div>        <span className="text-yellow-300">&quot;standard&quot;</span>: <span className="text-yellow-300">&quot;nep171&quot;</span>,</div>
                    <div>        <span className="text-yellow-300">&quot;version&quot;</span>: <span className="text-yellow-300">&quot;1.0.0&quot;</span>,</div>
                    <div>        <span className="text-yellow-300">&quot;event&quot;</span>: <span className="text-yellow-300">&quot;nft_mint&quot;</span>,</div>
                    <div>        <span className="text-yellow-300">&quot;data&quot;</span>: [{'{'}</div>
                    <div>            <span className="text-yellow-300">&quot;owner_id&quot;</span>: <span className="text-yellow-300">&quot;alice.near&quot;</span>,</div>
                    <div>            <span className="text-yellow-300">&quot;token_ids&quot;</span>: [<span className="text-yellow-300">&quot;1&quot;</span>],</div>
                    <div>        {'}'}]</div>
                    <div>    {'}'})</div>
                    <div>));</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    Indexers like NEAR Lake and The Graph watch for these EVENT_JSON logs to build queryable databases of on-chain activity.
                  </p>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Add Storage Management to Your FT</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement NEP-145 on your FT contract. Require users to call <code className="text-purple-400 bg-purple-500/10 px-1 rounded">storage_deposit</code> before they can receive tokens.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Add Metadata to Your Token</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement NEP-148 metadata with name, symbol, decimals, and an SVG icon. Verify it shows up correctly when queried.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Emit Standard Events</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add NEP-297 event logging to your token&apos;s mint, transfer, and burn operations. Check the logs appear in transaction receipts.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Read NEP Source</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Read the full NEP-141 specification on the NEAR Nomicon. Identify any methods you haven&apos;t implemented yet and add them.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR Nomicon', url: 'https://nomicon.io/', desc: 'All NEAR standards and specifications' },
                  { title: 'NEPs GitHub', url: 'https://github.com/near/NEPs', desc: 'Propose and discuss new standards' },
                  { title: 'NEP-145 Storage Management', url: 'https://nomicon.io/Standards/StorageManagement', desc: 'Storage deposit/withdraw standard' },
                  { title: 'NEP-148 FT Metadata', url: 'https://nomicon.io/Standards/Tokens/FungibleToken/Metadata', desc: 'Token metadata standard' },
                  { title: 'NEP-297 Events', url: 'https://nomicon.io/Standards/EventsFormat', desc: 'Standard event logging format' },
                  { title: 'NEP-330 Contract Metadata', url: 'https://nomicon.io/Standards/SourceMetadata', desc: 'Contract source code verification' },
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

export default NepStandardsDeepDive;
