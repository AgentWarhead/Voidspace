'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ClipboardCheck, ExternalLink, CheckCircle, Rocket, Shield, Users, Megaphone } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface LaunchChecklistProps {
  isActive: boolean;
  onToggle: () => void;
}

const LaunchChecklist: React.FC<LaunchChecklistProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-near-green to-emerald-500 rounded-xl flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Launch Checklist</h3>
            <p className="text-text-muted text-sm">Everything you need before going live on mainnet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-error/10 text-error border-error/20">Advanced</Badge>
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
                  <Rocket className="w-5 h-5 text-near-green" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Complete pre-launch security and quality checklist',
                    'How to get a security audit and what to expect',
                    'Documentation, README, and developer onboarding',
                    'Community building and NEAR ecosystem integration',
                    'Post-launch monitoring, incident response, and maintenance',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-near-green/20 bg-near-green/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-near-green font-semibold">🎓 Final module!</span> If you&apos;ve completed every module in the Builder track, you&apos;re ready to ship. This checklist ensures you haven&apos;t missed anything critical.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Security Checklist
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> All methods have proper access control</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Callbacks are marked <code className="text-purple-400">#[private]</code></li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Arithmetic uses checked operations</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Attached deposits are validated on every payable method</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Storage costs are properly accounted for</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> No unbounded iterations in any method</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Cross-contract callback results are checked</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Contract has been tested with malicious/edge-case inputs</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">□</span> Consider getting a professional security audit for DeFi/high-value contracts</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-400" />
                    Code Quality Checklist
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> Unit tests cover all methods and edge cases</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> Integration tests with near-workspaces pass</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> Contract compiles with zero warnings</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> WASM binary is optimized (check size)</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> NEP standards are correctly implemented</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> Events (NEP-297) are emitted for all state changes</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> Error messages are clear and helpful</li>
                      <li className="flex items-start gap-2"><span className="text-blue-400">□</span> Migration path exists for future upgrades</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-green-400" />
                    Deployment Checklist
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> Deployed and tested on testnet first</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> Mainnet account created with proper naming</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> Contract initialized with correct parameters</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> Access keys reviewed — remove unnecessary full-access keys</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> Sufficient NEAR balance for storage</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> Frontend environment variables set for mainnet</li>
                      <li className="flex items-start gap-2"><span className="text-green-400">□</span> WASM hash verified on NearBlocks</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Documentation Checklist
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-purple-400">□</span> README with project description, setup, and usage</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">□</span> Contract API documentation (all methods, params, returns)</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">□</span> Architecture diagram showing components</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">□</span> Deployment instructions for contributors</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">□</span> NEP-330 contract source metadata configured</li>
                      <li className="flex items-start gap-2"><span className="text-purple-400">□</span> License file included</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-cyan-400" />
                    Community &amp; Ecosystem
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Launching isn&apos;t just code — it&apos;s about getting your dApp into users&apos; hands:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">📢 Get Noticed</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Submit to NEAR Discovery (near.org)</li>
                        <li>• Post on NEAR Forum (gov.near.org)</li>
                        <li>• Share on X/Twitter with #NEARProtocol</li>
                        <li>• Apply for NEAR Foundation grants</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md">
                      <h5 className="font-semibold text-text-primary text-sm mb-2">🤝 Build Community</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Create a Discord/Telegram for your project</li>
                        <li>• Write a launch blog post</li>
                        <li>• Engage with NEAR DevHub</li>
                        <li>• Present at NEAR meetups/hackathons</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">🔍</span> Post-Launch Monitoring
                  </h4>
                  <div className="bg-black/30 rounded-lg p-4 border border-border">
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-start gap-2"><span className="text-near-green">→</span> Monitor transactions on NearBlocks for errors</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">→</span> Set up alerts for unusual activity (large transfers, failed txns)</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">→</span> Track gas usage patterns — optimize hot paths</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">→</span> Monitor storage growth and account balance</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">→</span> Have an incident response plan (pause mechanism, emergency contacts)</li>
                      <li className="flex items-start gap-2"><span className="text-near-green">→</span> Plan your upgrade path — versioned state for future improvements</li>
                    </ul>
                  </div>
                </section>

                {/* Congratulations */}
                <Card variant="default" padding="lg" className="border-near-green/30 bg-near-green/5">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🎉</div>
                    <h4 className="text-xl font-bold text-near-green mb-2">Congratulations, Builder!</h4>
                    <p className="text-text-secondary max-w-lg mx-auto">
                      You&apos;ve completed the entire Builder track. You now have the knowledge to design, build, test, secure, and deploy production-quality smart contracts on NEAR Protocol. Go build something amazing!
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">1</div>
                    <h5 className="font-semibold text-text-primary">Run the Full Checklist</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Go through every checklist item above for your voting dApp. Check off each item. Fix anything that&apos;s missing.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                    <h5 className="font-semibold text-text-primary">Write Documentation</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Create a comprehensive README for your dApp. Include: overview, architecture, setup instructions, API reference, and deployment guide.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">3</div>
                    <h5 className="font-semibold text-text-primary">Deploy to Mainnet</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    If your checklist is complete and tests pass, deploy your dApp to mainnet! Verify on NearBlocks and share it with the community.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-near-green/20 bg-near-green/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-near-green/20 rounded-full flex items-center justify-center text-xs font-bold text-near-green">🏆</div>
                    <h5 className="font-semibold text-near-green">Final Challenge: Build Your Own Project</h5>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Come up with your own dApp idea and build it from scratch. Use everything you&apos;ve learned: contracts, frontend, tests, security, deployment. Ship it to mainnet.
                  </p>
                  <p className="text-text-muted text-xs mt-2">Ideas: NFT marketplace, DAO governance, DeFi vault, social platform, gaming contract, subscription service...</p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-3">
                {[
                  { title: 'NEAR DevHub', url: 'https://near.org/devhub.near/widget/app', desc: 'Developer community and funding' },
                  { title: 'NEAR Grants', url: 'https://near.org/ecosystem/grants', desc: 'Apply for project funding' },
                  { title: 'NEAR Forum', url: 'https://gov.near.org', desc: 'Governance and community discussion' },
                  { title: 'NEAR Discord', url: 'https://near.chat', desc: 'Real-time developer support' },
                  { title: 'Security Audit Firms', url: 'https://docs.near.org/build/smart-contracts/security/audits', desc: 'Get your contract audited' },
                  { title: 'NEAR Documentation', url: 'https://docs.near.org', desc: 'Complete NEAR developer docs' },
                  { title: 'NEAR Ecosystem', url: 'https://near.org/ecosystem', desc: 'Explore the NEAR ecosystem' },
                  { title: 'NearBlocks', url: 'https://nearblocks.io', desc: 'Block explorer for monitoring' },
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

export default LaunchChecklist;
