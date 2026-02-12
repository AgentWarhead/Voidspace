'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image, ExternalLink, CheckCircle, Tag, Palette, ShoppingBag } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BuildingAnNftContractProps {
  isActive: boolean;
  onToggle: () => void;
}

const BuildingAnNftContract: React.FC<BuildingAnNftContractProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building an NFT Contract</h3>
            <p className="text-text-muted text-sm">Implement NEP-171 NFTs with minting, royalties, and marketplace integration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">75 min</Badge>
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
                  <Image className="w-5 h-5 text-pink-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'NEP-171: Implement the full Non-Fungible Token standard from scratch',
                    'Minting, transferring, and burning NFTs with proper access control',
                    'NEP-199: Royalty payouts for secondary sales on marketplaces',
                    'Marketplace integration patterns using nft_approve and nft_transfer_call',
                    'Token metadata (NEP-177) and enumeration (NEP-181) for discoverability',
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
                    <Image className="w-5 h-5 text-pink-400" />
                    NEP-171: Core NFT Contract
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEP-171 defines the core NFT interface on NEAR. Unlike ERC-721, NEAR NFTs use the efficient transfer-and-call pattern and have built-in metadata support:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Core NFT contract structure'}</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">NftContract</span> {'{'}</div>
                    <div>    owner_id: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    tokens_per_owner: LookupMap&lt;AccountId, UnorderedSet&lt;TokenId&gt;&gt;,</div>
                    <div>    tokens_by_id: LookupMap&lt;TokenId, Token&gt;,</div>
                    <div>    token_metadata_by_id: UnorderedMap&lt;TokenId, TokenMetadata&gt;,</div>
                    <div>    metadata: LazyOption&lt;NFTContractMetadata&gt;,</div>
                    <div>{'}'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-pink-500/20 bg-pink-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-pink-400 font-semibold">Key concept:</span> NEAR NFTs store owner-to-token mappings using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">LookupMap</code> for O(1) ownership checks. The <code className="text-purple-400 bg-purple-500/10 px-1 rounded">UnorderedSet</code> per owner enables enumeration of all tokens owned by an account.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Minting and Metadata
                  </h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[payable]</span></div>
                    <div><span className="text-purple-400">pub fn</span> <span className="text-near-green">nft_mint</span>(</div>
                    <div>    &amp;<span className="text-purple-400">mut</span> self,</div>
                    <div>    token_id: TokenId,</div>
                    <div>    metadata: TokenMetadata,</div>
                    <div>    receiver_id: AccountId,</div>
                    <div>) {'{'}</div>
                    <div>    <span className="text-text-muted">// Verify deposit covers storage costs</span></div>
                    <div>    <span className="text-purple-400">let</span> initial_storage = env::storage_usage();</div>
                    <div>    <span className="text-text-muted">// Create token, update mappings</span></div>
                    <div>    <span className="text-purple-400">let</span> token = Token {'{'} owner_id: receiver_id.clone() {'}'};</div>
                    <div>    self.tokens_by_id.insert(&amp;token_id, &amp;token);</div>
                    <div>    self.token_metadata_by_id.insert(&amp;token_id, &amp;metadata);</div>
                    <div>    <span className="text-text-muted">// Refund unused deposit</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-400" />
                    NEP-199: Royalties
                  </h4>
                  <p className="text-text-secondary mb-3">
                    NEP-199 standardizes royalty payouts for NFT secondary sales. Marketplaces like Mintbase and Paras query royalty info before processing sales:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Payout</span> {'{'}</div>
                    <div>    <span className="text-purple-400">pub</span> payout: HashMap&lt;AccountId, U128&gt;,</div>
                    <div>{'}'}</div>
                    <div className="mt-2"><span className="text-text-muted">{'// Marketplace calls this before completing a sale'}</span></div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_payout</span>(&amp;self, token_id: TokenId, balance: U128, max_len_payout: u32) -&gt; Payout;</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">nft_transfer_payout</span>(&amp;<span className="text-purple-400">mut</span> self, receiver_id: AccountId, token_id: TokenId, approval_id: u64, memo: Option&lt;String&gt;, balance: U128, max_len_payout: u32) -&gt; Payout;</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    Royalties are typically 5-10%. The payout map splits the sale price between the seller, creator, and any other beneficiaries.
                  </p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-400" />
                    Marketplace Integration
                  </h4>
                  <p className="text-text-secondary mb-3">
                    To list NFTs on marketplaces like Mintbase or Paras, use the approval system (NEP-178):
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-col gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">1.</span> Owner calls <code className="text-purple-400">nft_approve</code> to approve the marketplace contract</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">2.</span> Marketplace calls <code className="text-purple-400">nft_on_approve</code> to create a listing</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">3.</span> Buyer purchases → marketplace calls <code className="text-purple-400">nft_transfer_payout</code></div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">4.</span> NFT transfers to buyer, payout splits to seller + creator royalties</div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Build a Basic NFT Contract</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement NEP-171 with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_mint</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_transfer</code>, and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_token</code>. Deploy to testnet and mint your first NFT with metadata.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Add Royalties</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement NEP-199 royalty payouts. Set a 10% royalty for the creator and verify the payout map splits correctly for a simulated sale.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Implement Enumeration</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Add NEP-181 enumeration methods: <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_tokens</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_supply_for_owner</code>, and <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_tokens_for_owner</code>.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 These methods are essential for wallets and marketplaces to display NFT collections.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Marketplace Approval Flow</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Build the NEP-178 approval system. Approve a mock marketplace contract, then simulate the full purchase flow with <code className="text-purple-400 bg-purple-500/10 px-1 rounded">nft_transfer_payout</code>.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEP-171 NFT Core Standard', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/Core', desc: 'Official NFT core standard specification' },
                  { title: 'NEP-177 NFT Metadata', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/Metadata', desc: 'Token and contract metadata standard' },
                  { title: 'NEP-178 Approval Management', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/ApprovalManagement', desc: 'Marketplace approval system' },
                  { title: 'NEP-181 Enumeration', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/Enumeration', desc: 'Token enumeration for wallets and UIs' },
                  { title: 'NEP-199 Royalties', url: 'https://nomicon.io/Standards/Tokens/NonFungibleToken/Payout', desc: 'Royalty payout standard for secondary sales' },
                  { title: 'NFT Zero to Hero Tutorial', url: 'https://docs.near.org/tutorials/nfts/introduction', desc: 'Complete NFT tutorial from NEAR docs' },
                  { title: 'NFT Reference Implementation', url: 'https://github.com/near-examples/NFT', desc: 'Official NFT example code on GitHub' },
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

export default BuildingAnNftContract;
