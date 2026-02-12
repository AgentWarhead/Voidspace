'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, ExternalLink, CheckCircle, Droplets, ArrowLeftRight, Percent } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DefiContractPatternsProps {
  isActive: boolean;
  onToggle: () => void;
}

const DefiContractPatterns: React.FC<DefiContractPatternsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">DeFi Contract Patterns</h3>
            <p className="text-text-muted text-sm">AMM mechanics, liquidity pools, and swap contract architecture</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">80 min</Badge>
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
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'AMM (Automated Market Maker) fundamentals and how DEXes work without order books',
                    'The constant product formula (x * y = k) and its implications for pricing',
                    'Liquidity pool contract architecture on NEAR using NEP-141 tokens',
                    'Implementing swap, add_liquidity, and remove_liquidity functions',
                    'Fee collection, LP token distribution, and impermanent loss concepts',
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
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    How AMMs Work
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Traditional exchanges use order books. AMMs replace this with a mathematical formula that determines prices based on token reserves. Ref Finance, NEAR&apos;s largest DEX, uses this model:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Constant product formula'}</div>
                    <div><span className="text-near-green">x * y = k</span></div>
                    <div className="mt-2 text-text-muted">{'// Where:'}</div>
                    <div>{'// x = reserve of token A'}</div>
                    <div>{'// y = reserve of token B'}</div>
                    <div>{'// k = constant (invariant)'}</div>
                    <div className="mt-2 text-text-muted">{'// Price of token A in terms of token B:'}</div>
                    <div><span className="text-near-green">price_A = reserve_B / reserve_A</span></div>
                    <div className="mt-2 text-text-muted">{'// After a swap of dx tokens A:'}</div>
                    <div><span className="text-near-green">dy = (y * dx) / (x + dx)</span>  <span className="text-text-muted">{'// amount of token B received'}</span></div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-green-500/20 bg-green-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-green-400 font-semibold">Key concept:</span> The larger the trade relative to the pool, the worse the price (slippage). This is by design — it protects liquidity providers and ensures the pool never runs dry.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                    Liquidity Pool Architecture
                  </h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">LiquidityPool</span> {'{'}</div>
                    <div>    owner_id: <span className="text-cyan-400">AccountId</span>,</div>
                    <div>    token_a: <span className="text-cyan-400">AccountId</span>,      <span className="text-text-muted">{'// NEP-141 token A contract'}</span></div>
                    <div>    token_b: <span className="text-cyan-400">AccountId</span>,      <span className="text-text-muted">{'// NEP-141 token B contract'}</span></div>
                    <div>    reserve_a: <span className="text-cyan-400">u128</span>,          <span className="text-text-muted">{'// Current reserve of token A'}</span></div>
                    <div>    reserve_b: <span className="text-cyan-400">u128</span>,          <span className="text-text-muted">{'// Current reserve of token B'}</span></div>
                    <div>    total_shares: <span className="text-cyan-400">u128</span>,       <span className="text-text-muted">{'// Total LP shares issued'}</span></div>
                    <div>    shares: LookupMap&lt;AccountId, <span className="text-cyan-400">u128</span>&gt;, <span className="text-text-muted">{'// LP shares per account'}</span></div>
                    <div>    fee_numerator: <span className="text-cyan-400">u128</span>,      <span className="text-text-muted">{'// e.g., 3 for 0.3% fee'}</span></div>
                    <div>{'}'}</div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    LP (Liquidity Provider) shares represent proportional ownership of the pool. When you add liquidity, you receive shares. When you remove, you burn shares to get tokens back.
                  </p>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
                    Swap Function
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Swaps use <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_transfer_call</code> — the user sends tokens to the pool and receives the other token:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Called by the pool when receiving tokens via ft_transfer_call'}</div>
                    <div><span className="text-purple-400">fn</span> <span className="text-near-green">ft_on_transfer</span>(&amp;<span className="text-purple-400">mut</span> self, sender_id: AccountId, amount: U128, msg: String) -&gt; PromiseOrValue&lt;U128&gt; {'{'}</div>
                    <div>    <span className="text-purple-400">let</span> token_in = env::predecessor_account_id();</div>
                    <div>    <span className="text-purple-400">let</span> amount_in = amount.0;</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Apply fee: amount_with_fee = amount_in * (1000 - fee) / 1000'}</span></div>
                    <div>    <span className="text-purple-400">let</span> amount_with_fee = amount_in * (1000 - self.fee_numerator) / 1000;</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Calculate output: dy = (reserve_out * dx) / (reserve_in + dx)'}</span></div>
                    <div>    <span className="text-purple-400">let</span> amount_out = (reserve_out * amount_with_fee) / (reserve_in + amount_with_fee);</div>
                    <div className="mt-2">    <span className="text-text-muted">{'// Update reserves, transfer token_out to sender'}</span></div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-amber-400" />
                    Fees and LP Rewards
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Fees (typically 0.3%) are collected on each swap and stay in the pool, increasing the value of LP shares over time:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">How LPs Earn</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Fees accumulate in pool reserves</li>
                        <li>• LP shares represent a % of the pool</li>
                        <li>• More swaps = more fees = higher share value</li>
                        <li>• Withdraw anytime by burning LP shares</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-amber-500/20">
                      <h5 className="font-semibold text-amber-400 text-sm mb-2">Impermanent Loss</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Price divergence reduces LP value vs holding</li>
                        <li>• &quot;Impermanent&quot; because it reverses if prices return</li>
                        <li>• Fee income must offset IL to be profitable</li>
                        <li>• Worse with volatile token pairs</li>
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
                    <h5 className="font-semibold text-text-primary">Build a Simple AMM</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a constant product AMM with two NEP-141 tokens. Implement <code className="text-purple-400 bg-purple-500/10 px-1 rounded">add_liquidity</code>, <code className="text-purple-400 bg-purple-500/10 px-1 rounded">remove_liquidity</code>, and the swap via <code className="text-purple-400 bg-purple-500/10 px-1 rounded">ft_on_transfer</code>.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Calculate Slippage</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Write a view method <code className="text-purple-400 bg-purple-500/10 px-1 rounded">get_return</code> that calculates expected output for a swap. Add a <code className="text-purple-400 bg-purple-500/10 px-1 rounded">min_amount_out</code> parameter to protect against slippage.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Add Fee Collection</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Implement a 0.3% swap fee. Verify that LP share value increases after multiple swaps by checking the ratio of reserves to total shares.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Ref Finance uses a similar fee model. Study their open-source contracts for production patterns.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Explore Ref Finance</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Query Ref Finance pools on mainnet using <code className="text-purple-400 bg-purple-500/10 px-1 rounded">near view v2.ref-finance.near get_pool {'{'}pool_id: 0{'}'}</code>. Analyze how real pools are structured.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'Ref Finance Contracts', url: 'https://github.com/ref-finance/ref-contracts', desc: 'Open-source AMM contracts powering Ref Finance' },
                  { title: 'Ref Finance App', url: 'https://app.ref.finance', desc: 'NEAR\'s largest DEX — swap, pool, and farm' },
                  { title: 'Uniswap v2 Whitepaper', url: 'https://uniswap.org/whitepaper.pdf', desc: 'The original constant product AMM design (applies to NEAR too)' },
                  { title: 'NEAR DeFi Tutorial', url: 'https://docs.near.org/tutorials/examples/xcc', desc: 'Cross-contract calls — essential for DeFi composability' },
                  { title: 'ft_transfer_call Pattern', url: 'https://nomicon.io/Standards/Tokens/FungibleToken/Core', desc: 'The token transfer pattern that powers DeFi on NEAR' },
                  { title: 'Impermanent Loss Calculator', url: 'https://dailydefi.org/tools/impermanent-loss-calculator/', desc: 'Visualize IL for different price scenarios' },
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

export default DefiContractPatterns;
