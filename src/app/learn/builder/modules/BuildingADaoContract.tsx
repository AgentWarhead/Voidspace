'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Vote, ExternalLink, CheckCircle, Shield, Landmark, Users } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BuildingADaoContractProps {
  isActive: boolean;
  onToggle: () => void;
}

const BuildingADaoContract: React.FC<BuildingADaoContractProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building a DAO Contract</h3>
            <p className="text-text-muted text-sm">Governance architecture with proposals, voting, and treasury management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-warning/10 text-warning border-warning/20">Intermediate</Badge>
          <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">70 min</Badge>
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
                  <Landmark className="w-5 h-5 text-blue-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Governance contract architecture: proposals, councils, and voting periods',
                    'Proposal types: transfers, function calls, policy changes, and bounties',
                    'Role-based permissions with configurable voting policies',
                    'Treasury management: tracking funds, approving payouts, multi-sig patterns',
                    'SputnikDAO v2 patterns — the most widely used DAO framework on NEAR',
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
                    <Landmark className="w-5 h-5 text-blue-400" />
                    DAO Contract Architecture
                  </h4>
                  <p className="text-text-secondary mb-3">
                    A DAO on NEAR is a smart contract that manages collective decision-making. SputnikDAO v2 is the standard — used by hundreds of DAOs in the NEAR ecosystem:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div className="text-text-muted">{'// Core DAO contract state'}</div>
                    <div><span className="text-purple-400">#[near(contract_state)]</span></div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">DaoContract</span> {'{'}</div>
                    <div>    policy: LazyOption&lt;Policy&gt;,</div>
                    <div>    proposals: Vector&lt;VersionedProposal&gt;,</div>
                    <div>    last_proposal_id: <span className="text-cyan-400">u64</span>,</div>
                    <div>    locked_amount: <span className="text-cyan-400">Balance</span>,</div>
                    <div>{'}'}</div>
                    <div className="mt-2 text-text-muted">{'// Policy defines roles and vote thresholds'}</div>
                    <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">Policy</span> {'{'}</div>
                    <div>    roles: Vec&lt;RolePermission&gt;,</div>
                    <div>    default_vote_policy: VotePolicy,</div>
                    <div>    proposal_bond: U128,</div>
                    <div>    proposal_period: U64,</div>
                    <div>{'}'}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Vote className="w-5 h-5 text-indigo-400" />
                    Proposals and Voting
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Proposals are the core unit of governance. Each proposal has a type, description, and voting period:
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border">
                    <div><span className="text-purple-400">pub enum</span> <span className="text-cyan-400">ProposalKind</span> {'{'}</div>
                    <div>    Transfer {'{'} token_id: AccountId, receiver_id: AccountId, amount: U128 {'}'},</div>
                    <div>    FunctionCall {'{'} receiver_id: AccountId, actions: Vec&lt;ActionCall&gt; {'}'},</div>
                    <div>    ChangePolicy {'{'} policy: Policy {'}'},</div>
                    <div>    AddMemberToRole {'{'} member_id: AccountId, role: String {'}'},</div>
                    <div>    RemoveMemberFromRole {'{'} member_id: AccountId, role: String {'}'},</div>
                    <div>    BountyDone {'{'} bounty_id: <span className="text-cyan-400">u64</span>, receiver_id: AccountId {'}'},</div>
                    <div>{'}'}</div>
                  </div>
                  <Card variant="default" padding="md" className="mt-3 border-blue-500/20 bg-blue-500/5">
                    <p className="text-sm text-text-secondary">
                      <span className="text-blue-400 font-semibold">Key concept:</span> Voting uses <code className="text-purple-400 bg-purple-500/10 px-1 rounded">act_proposal(id, action)</code> where action is Approve, Reject, or Remove. The proposal passes when the configured threshold (e.g., majority of council) is reached.
                    </p>
                  </Card>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Role-Based Permissions
                  </h4>
                  <p className="text-text-secondary mb-3">
                    SputnikDAO v2 supports flexible roles with granular permissions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">Council</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Named accounts (e.g., alice.near)</li>
                        <li>• Can create and vote on proposals</li>
                        <li>• Typically the core team or stewards</li>
                        <li>• Manage treasury and policy changes</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-indigo-500/20">
                      <h5 className="font-semibold text-indigo-400 text-sm mb-2">Community / Token Holders</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Group-based (anyone, token holders)</li>
                        <li>• Can submit proposals for council review</li>
                        <li>• Vote weight by token balance (optional)</li>
                        <li>• Limited permissions (no policy changes)</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Treasury Management
                  </h4>
                  <p className="text-text-secondary mb-3">
                    DAOs hold funds in the contract account. Transfer proposals require council approval:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <div className="flex flex-col gap-2 text-sm text-text-secondary">
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">1.</span> Member submits a Transfer proposal with amount + receiver</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">2.</span> Council members vote (Approve/Reject)</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">3.</span> When threshold is met, funds transfer automatically</div>
                      <div className="flex items-center gap-2"><span className="text-near-green font-mono">4.</span> Supports NEAR, FTs (NEP-141), and NFTs (NEP-171)</div>
                    </div>
                  </div>
                  <p className="text-text-muted text-sm mt-2">
                    The proposal bond (typically 0.1 NEAR) prevents spam and is refunded if the proposal passes.
                  </p>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Create a SputnikDAO</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Use the SputnikDAO factory on testnet to create a DAO: call <code className="text-purple-400 bg-purple-500/10 px-1 rounded">create</code> on <code className="text-purple-400 bg-purple-500/10 px-1 rounded">sputnik-dao.testnet</code> with your council config and policy.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Submit and Vote on Proposals</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a Transfer proposal to send testnet NEAR. Then use multiple accounts to vote on it and watch the automated execution.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Add a Custom Role</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Submit a ChangePolicy proposal to add a &quot;contributor&quot; role with permission to create Transfer proposals but not vote on policy changes.
                  </p>
                  <p className="text-text-muted text-xs mt-2">💡 Role-based access is what makes SputnikDAO v2 powerful — you can model any governance structure.</p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">4</div>
                    <h5 className="font-semibold text-text-primary">Build a Simple DAO from Scratch</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Write a minimal DAO contract in Rust with proposals, voting, and automatic execution. This helps you understand the internals before using SputnikDAO.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'SputnikDAO v2 Source Code', url: 'https://github.com/near-daos/sputnik-dao-contract', desc: 'Official SputnikDAO contract repository' },
                  { title: 'AstroDAO', url: 'https://astrodao.com', desc: 'Web interface for creating and managing NEAR DAOs' },
                  { title: 'DAO Tutorial', url: 'https://docs.near.org/tutorials/examples/dao', desc: 'Build a DAO on NEAR — official docs tutorial' },
                  { title: 'SputnikDAO Factory', url: 'https://nearblocks.io/address/sputnik-dao.near', desc: 'Mainnet DAO factory contract on NearBlocks' },
                  { title: 'NEAR Governance Forum', url: 'https://gov.near.org', desc: 'Community governance discussions and proposals' },
                  { title: 'DAO Best Practices', url: 'https://docs.near.org/concepts/web3/dao', desc: 'NEAR docs on DAO concepts and patterns' },
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

export default BuildingADaoContract;
