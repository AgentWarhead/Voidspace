'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Coins, ExternalLink, CheckCircle, Image, Repeat, Layers } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TokenStandardsProps {
  isActive: boolean;
  onToggle: () => void;
}

const TokenStandards: React.FC<TokenStandardsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Token Standards</h3>
            <p className="text-text-muted text-sm">Build fungible tokens (NEP-141) and NFTs (NEP-171) on NEAR</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
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
                  <Coins className="w-5 h-5 text-amber-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEP-141: Fungible Token standard — the NEAR equivalent of ERC-20',
                    'NEP-171: Non-Fungible Token standard — NEAR\'s NFT standard',
                    'Token metadata, storage, and transfer mechanics',
                    'The ft_transfer_call pattern for DeFi composability',
                    'Implementing token standards using near-sdk macros',
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
                    <Coins className="w-5 h-5 text-amber-400" />
                    NEP-141: Fungible Tokens
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Fungible tokens (FTs) are interchangeable — like USDC, wNEAR, or any ERC-20 equivalent. NEP-141 defines the standard interface:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Core FT interface methods</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">ft_transfer</span>(&amp;<span className="text-purple-400">mut</span> self, receiver_id: AccountId, amount: U128, memo: Option&lt;String&gt;);</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">ft_transfer_call</span>(&amp;<span className="text-purple-400">mut</span> self, receiver_id: AccountId, amount: U128, memo: Option&lt;String&gt;, msg: String) -&gt; PromiseOrValue&lt;U128&gt;;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">ft_total_supply</span>(&amp;self) -&gt; U128;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">ft_balance_of</span>(&amp;self, account_id: AccountId) -&gt; U128;</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-amber-500/20 bg-amber-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-amber-400 font-semibold">Key concept:</span> <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_transfer_call</code> sends tokens AND calls a method on the receiver contract. This is how DEX swaps and lending deposits work — it&apos;s the backbone of DeFi composability on NEAR.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-green-400">🪙</span> Building a Fungible Token
                  </h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env, PanicOnDefault, AccountId{'}'};</div>
                    <div><span className="text-purple-400">use</span> near_sdk::json_types::U128;</div>
                    <div><span className="text-purple-400">use</span> near_sdk::store::LookupMap;</div>
                    <div className="mt-2"><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">#[derive(PanicOnDefault)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">FungibleToken</span> {'{'}</div>
                    <div>    owner_id: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    total_supply: <span className="text-cyan-400">u128</span>,</div>
                    <div>    balances: LookupMap&lt;AccountId, <span className="text-cyan-400">u128</span>&gt;,</div>
                    <div>{'}'}</div>
                    <div className="mt-2"><span className="text-purple-400">#[near]</span></div>
                    <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">FungibleToken</span> {'{'}</div>
                    <div>    <span className="text-purple-400">#[init]</span></div>
                    <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">new</span>(owner_id: AccountId, total_supply: U128) -&gt; Self {'{'}</div>
                    <div>        <span className="text-purple-400">let mut</span> ft = Self {'{'}</div>
                    <div>            owner_id: owner_id.clone(),</div>
                    <div>            total_supply: total_supply.0,</div>
                    <div>            balances: LookupMap::new(<span className="text-yellow-300">b&quot;b&quot;</span>),</div>
                    <div>        {'}'};</div>
                    <div>        ft.balances.insert(owner_id, total_supply.0);</div>
                    <div>        ft</div>
                    <div>    {'}'}</div>
                    <div className="mt-2">    <span className="text-purple-400">pub fn</span> <span className="text-near-green">ft_balance_of</span>(&amp;self, account_id: AccountId) -&gt; U128 {'{'}</div>
                    <div>        U128(self.balances.get(&amp;account_id).copied().unwrap_or(0))</div>
                    <div>    {'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Image className="w-5 h-5 text-pink-400" />
                    NEP-171: Non-Fungible Tokens
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NFTs are unique tokens — each has a distinct ID and metadata. NEP-171 is NEAR&apos;s NFT standard:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">// Core NFT interface</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_transfer</span>(&amp;<span className="text-purple-400">mut</span> self, receiver_id: AccountId, token_id: TokenId, ...);</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_transfer_call</span>(&amp;<span className="text-purple-400">mut</span> self, receiver_id: AccountId, token_id: TokenId, msg: String, ...) -&gt; PromiseOrValue&lt;bool&gt;;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_token</span>(&amp;self, token_id: TokenId) -&gt; Option&lt;Token&gt;;</div>
                    <div className="mt-3 text-text-muted">// Metadata (NEP-177)</div>
                    <div><span className="text-purple-400">struct</span> <span className="text-cyan-400">TokenMetadata</span> {'{'}</div>
                    <div>    title: Option&lt;String&gt;,        <span className="text-text-muted">// &quot;Cosmic Penguin #42&quot;</span></div>
                    <div>    description: Option&lt;String&gt;,  <span className="text-text-muted">// &quot;A rare cosmic penguin&quot;</span></div>
                    <div>    media: Option&lt;String&gt;,        <span className="text-text-muted">// IPFS/Arweave URL</span></div>
                    <div>    copies: Option&lt;<span className="text-cyan-400">u64</span>&gt;,        <span className="text-text-muted">// Number of copies</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Repeat className="w-5 h-5 text-cyan-400" />
                    The Transfer-and-Call Pattern
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEAR doesn&apos;t have &quot;approve-then-transfer&quot; like Ethereum. Instead, it uses a more efficient pattern:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-col gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">1.</span> User calls <code className="text-purple-400">ft_transfer_call</code> on the token contract</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">2.</span> Token contract transfers tokens to the receiver</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">3.</span> Token contract calls <code className="text-purple-400">ft_on_transfer</code> on the receiver</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">4.</span> Receiver processes the tokens and returns unused amount</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">5.</span> Token contract refunds any unused tokens to the sender</div>
                    </div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    This is a single transaction instead of Ethereum&apos;s two-step approve + transferFrom. Better UX, lower cost.
                  </p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    FT vs NFT Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-amber-500/20">
                      <h5 className="font-semibold text-amber-400 text-sm mb-2">Fungible Tokens (NEP-141)</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• All tokens are identical</li>
                        <li>• Divisible (decimals)</li>
                        <li>• Balance is a number (u128)</li>
                        <li>• Use case: currencies, rewards, governance</li>
                        <li>• Like ERC-20 on Ethereum</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-pink-500/20">
                      <h5 className="font-semibold text-pink-400 text-sm mb-2">Non-Fungible Tokens (NEP-171)</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Each token is unique</li>
                        <li>• Not divisible (whole units)</li>
                        <li>• Identified by token_id</li>
                        <li>• Use case: art, gaming, identity</li>
                        <li>• Like ERC-721 on Ethereum</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Create a Fungible Token</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Build a simple FT contract with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">new</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_transfer</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_balance_of</code>, and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_total_supply</code>. Deploy and test transfers between two accounts.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Mint an NFT</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Build a basic NFT contract with minting and transfer. Add metadata including a title, description, and media URL.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Implement ft_transfer_call</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add the transfer-and-call pattern to your FT. Create a receiver contract that implements <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_on_transfer</code>.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 This is the most important pattern for DeFi. Master it here.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Query Real Tokens</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Use the CLI to query mainnet tokens: check your wNEAR balance on <code className="text-purple-400 bg-purple-500/10 px-1 rounded">wrap.near</code>, read USDC metadata from <code className="text-purple-400 bg-purple-500/10 px-1 rounded">17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1</code>.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEP-141 Fungible Token', url: 'https://nomicon.io/Standards/Tokens/FungibleToken/Core', desc: 'FT standard specification' },
                  { title: 'NEP-171 NFT Standard', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/Core', desc: 'NFT standard specification' },
                  { title: 'FT Tutorial', url: 'https://docs.near.org/tutorials/fts/introduction', desc: 'Build a fungible token step by step' },
                  { title: 'NFT Tutorial', url: 'https://docs.near.org/tutorials/nfts/introduction', desc: 'Build an NFT contract step by step' },
                  { title: 'FT Example Code', url: 'https://github.com/near-examples/FT', desc: 'Official FT reference implementation' },
                  { title: 'NFT Example Code', url: 'https://github.com/near-examples/NFT', desc: 'Official NFT reference implementation' },
                  { title: 'NEP-177 NFT Metadata', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata', desc: 'NFT metadata standard' },
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

export default TokenStandards;
