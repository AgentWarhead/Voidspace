'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, ExternalLink, CheckCircle, ShieldAlert, FileText, Globe, AlertTriangle, Gavel } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface LegalRegulatoryBasicsProps {
  isActive: boolean;
  onToggle: () => void;
}

const LegalRegulatoryBasics: React.FC<LegalRegulatoryBasicsProps> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card variant="glass" padding="none" className="border-purple-500/20">
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Legal &amp; Regulatory Basics</h3>
            <p className="text-text-muted text-sm">Token classification, KYC/AML, jurisdiction strategy, and when you need a lawyer</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20 shadow-sm shadow-emerald-500/10">Founder</Badge>
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
                  <Scale className="w-5 h-5 text-red-400" />
                  <h4 className="text-lg font-semibold text-text-primary">What You&apos;ll Learn</h4>
                </div>
                <ul className="space-y-3">
                  {[
                    'Token classification — utility vs security tokens and the Howey Test explained simply',
                    'KYC/AML basics every dApp builder needs to understand (even if you\'re "decentralized")',
                    'Jurisdiction considerations — US, EU (MiCA), and Singapore regulatory frameworks',
                    'Terms of service and privacy policies for dApps — what you need and why',
                    'When you actually need a lawyer and how to find crypto-native legal counsel',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-near-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Card variant="default" padding="md" className="mt-4 border-red-500/20 bg-red-500/5">
                  <p className="text-sm text-text-secondary">
                    <span className="text-red-400 font-semibold">⚠️ Disclaimer:</span> This module is educational — not legal advice. Regulations change rapidly and vary by jurisdiction. Always consult a qualified attorney for your specific situation. That said, understanding the basics will save you from costly mistakes.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-8">
                {/* Section 1: Token Classification */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    Token Classification: Utility vs Security
                  </h4>
                  <p className="text-text-secondary mb-3">
                    The single most important legal question for any token project: is your token a security? The US SEC uses the Howey Test to determine this.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-red-400 font-semibold mb-2">The Howey Test (SEC v. W.J. Howey Co., 1946)</div>
                    <p className="text-text-muted mb-3">A token is likely a security if ALL four are true:</p>
                    {[
                      { test: '1. Investment of Money', desc: 'Users pay money or crypto to acquire the token', risk: 'Almost always yes' },
                      { test: '2. Common Enterprise', desc: 'Buyers\' fortunes are tied to the project\'s success', risk: 'Usually yes for tokens' },
                      { test: '3. Expectation of Profits', desc: 'Buyers expect the token to increase in value', risk: 'The critical question' },
                      { test: '4. Efforts of Others', desc: 'Profits come from the founding team\'s work, not the buyer\'s', risk: 'Decentralization helps here' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-red-400 font-mono w-4 flex-shrink-0">{i + 1}.</span>
                        <div className="flex-1">
                          <span className="text-text-secondary font-semibold">{item.test}</span>
                          <span className="text-text-muted ml-2">— {item.desc}</span>
                          <span className="text-yellow-400 ml-2 font-mono text-[10px]">({item.risk})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">Utility Token Indicators</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Token has real utility within the protocol (governance, access, gas)</li>
                        <li>• Sold to users who will USE the token, not speculate</li>
                        <li>• No promises of price appreciation in marketing</li>
                        <li>• Protocol is sufficiently decentralized at launch</li>
                        <li>• Token is functional at time of sale</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">Security Red Flags</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Marketing focuses on price potential or ROI</li>
                        <li>• Token sold before product exists</li>
                        <li>• Centralized team controls most supply</li>
                        <li>• Revenue sharing or dividend-like features</li>
                        <li>• Buyback-and-burn marketed as price support</li>
                      </ul>
                    </Card>
                  </div>
                </section>

                {/* Section 2: KYC/AML */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    KYC/AML Basics
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Know Your Customer (KYC) and Anti-Money Laundering (AML) requirements apply to many crypto activities, even &quot;decentralized&quot; ones.
                  </p>
                  <div className="space-y-3">
                    {[
                      { scenario: 'Token Sale / ICO', kyc: 'Required', detail: 'Any public token sale needs KYC for participants. Use providers like Synaps, Sumsub, or Fractal ID.' },
                      { scenario: 'DEX (Fully Decentralized)', kyc: 'Generally Not Required', detail: 'Truly decentralized protocols with no admin keys typically don\'t need KYC. But the team may still face liability.' },
                      { scenario: 'NFT Marketplace', kyc: 'Depends', detail: 'Large-value transactions may trigger AML requirements. The EU\'s MiCA regulation may require KYC for NFT platforms.' },
                      { scenario: 'Fiat On/Off Ramp', kyc: 'Always Required', detail: 'Any fiat touchpoint requires full KYC/AML compliance. Partner with licensed providers like MoonPay or Transak.' },
                    ].map((item, i) => (
                      <Card key={i} variant="default" padding="md" className="border-orange-500/20">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-semibold text-orange-400 text-sm">{item.scenario}</h5>
                          <span className={cn(
                            'text-xs font-mono',
                            item.kyc === 'Required' ? 'text-red-400' : item.kyc === 'Generally Not Required' ? 'text-green-400' : 'text-yellow-400'
                          )}>{item.kyc}</span>
                        </div>
                        <p className="text-xs text-text-muted">{item.detail}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Section 3: Jurisdiction */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Jurisdiction Considerations
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Where you incorporate and operate matters enormously. Each jurisdiction has different rules for crypto projects.
                  </p>
                  <div className="space-y-3">
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">🇺🇸 United States</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Regulator:</strong> SEC (securities), CFTC (commodities), FinCEN (money transmission). <strong className="text-text-secondary">Status:</strong> Most aggressive enforcement globally. SEC has sued Ripple, Coinbase, and many token issuers. <strong className="text-text-secondary">Strategy:</strong> Many projects geo-block US users or use exemptions like Reg D (accredited investors only). Consult US counsel early.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">🇪🇺 European Union (MiCA)</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Framework:</strong> Markets in Crypto-Assets (MiCA) regulation — comprehensive crypto framework effective 2024. <strong className="text-text-secondary">Key rules:</strong> Whitepaper requirements for token issuance, stablecoin reserves, exchange licensing. <strong className="text-text-secondary">Strategy:</strong> MiCA provides legal clarity — good for compliant projects. Consider EU-friendly jurisdictions like Germany, France, or Portugal.
                      </p>
                    </Card>
                    <Card variant="default" padding="md" className="border-blue-500/20">
                      <h5 className="font-semibold text-blue-400 text-sm mb-2">🇸🇬 Singapore</h5>
                      <p className="text-xs text-text-muted">
                        <strong className="text-text-secondary">Regulator:</strong> Monetary Authority of Singapore (MAS). <strong className="text-text-secondary">Framework:</strong> Payment Services Act — clear licensing for digital token services. <strong className="text-text-secondary">Strategy:</strong> Popular with crypto foundations. Clear regulatory framework, but strict AML requirements. Many NEAR ecosystem projects (and the NEAR Foundation itself) have Singapore ties.
                      </p>
                    </Card>
                  </div>
                </section>

                {/* Section 4: Terms of Service */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Terms of Service for dApps
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Even &quot;decentralized&quot; protocols need legal terms. Your ToS protects you and sets expectations for users.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 text-xs border border-border space-y-3">
                    <div className="text-yellow-400 font-semibold mb-2">Essential ToS Components</div>
                    {[
                      { section: 'Eligibility', desc: 'Age requirements, geographic restrictions (geo-block sanctioned countries and optionally the US)' },
                      { section: 'Assumption of Risk', desc: 'Users acknowledge smart contract risks, impermanent loss, and potential loss of funds' },
                      { section: 'No Warranty', desc: 'Protocol provided "as is" — no guarantees of uptime, accuracy, or financial returns' },
                      { section: 'Limitation of Liability', desc: 'Cap liability and disclaim consequential damages. Critical for protecting the team' },
                      { section: 'Dispute Resolution', desc: 'Arbitration clause, governing law jurisdiction. Avoid US courts if possible' },
                      { section: 'Privacy Policy', desc: 'What data you collect (wallet addresses, IP addresses), how you use it, GDPR compliance' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-yellow-400 font-semibold w-36 flex-shrink-0">{item.section}</span>
                        <span className="text-text-muted">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 5: When You Need a Lawyer */}
                <section>
                  <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-purple-400" />
                    When You Need a Lawyer
                  </h4>
                  <p className="text-text-secondary mb-3">
                    Not every situation requires legal counsel — but some absolutely do. Here&apos;s when to invest in a crypto-native lawyer:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card variant="default" padding="md" className="border-red-500/20">
                      <h5 className="font-semibold text-red-400 text-sm mb-2">🚨 Definitely Need a Lawyer</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• Token launch or any form of token sale</li>
                        <li>• Raising investment (SAFE, SAFT agreements)</li>
                        <li>• Incorporating a foundation or DAO legal wrapper</li>
                        <li>• Handling user funds (lending, staking, custody)</li>
                        <li>• Received a regulatory inquiry or subpoena</li>
                      </ul>
                    </Card>
                    <Card variant="default" padding="md" className="border-green-500/20">
                      <h5 className="font-semibold text-green-400 text-sm mb-2">✅ Finding Crypto Counsel</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        <li>• <strong className="text-text-secondary">Specialist firms:</strong> Anderson Kill, Debevoise, Cooley, Fenwick & West</li>
                        <li>• <strong className="text-text-secondary">Crypto-native:</strong> Paradigm Legal, LexDAO, OpenLaw</li>
                        <li>• <strong className="text-text-secondary">Budget option:</strong> Legal DAOs and community legal resources</li>
                        <li>• <strong className="text-text-secondary">Cost:</strong> $300-800/hr for specialists; $5K-25K for token opinion letters</li>
                        <li>• <strong className="text-text-secondary">Ask your ecosystem:</strong> NEAR Foundation can recommend vetted counsel</li>
                      </ul>
                    </Card>
                  </div>
                </section>
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-text-primary">Exercises</h4>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 1: Howey Test Analysis</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Apply the Howey Test to your token. For each prong, honestly assess whether your token meets the criteria. Document what changes you could make to reduce security classification risk (e.g., greater decentralization, utility-first design).
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 2: Jurisdiction Decision Matrix</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Compare 3 jurisdictions for your project: rate each on regulatory clarity, tax treatment, team location feasibility, and banking access. Score each 1-5 and pick your top choice with justification.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 3: Terms of Service Draft</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Draft a Terms of Service outline for your dApp using the framework above. Include all 6 essential sections. This isn&apos;t legal-grade — it&apos;s to understand what&apos;s needed before hiring a lawyer.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 4: KYC Decision Tree</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Map your dApp&apos;s user flows and identify which ones might trigger KYC/AML requirements. Create a decision tree: does this flow involve fiat? Custody? Token sales? For each &quot;yes,&quot; identify the compliance requirement.
                  </p>
                </Card>

                <Card variant="default" padding="md" className="border-red-500/20">
                  <h5 className="font-semibold text-red-400 text-sm mb-2">🔴 Exercise 5: Legal Budget Planning</h5>
                  <p className="text-xs text-text-muted mb-3">
                    Create a legal budget for your project&apos;s first 12 months. Items to budget: entity formation, token opinion letter, ToS/privacy policy, ongoing counsel retainer, and trademark registration. Get real quotes from 2-3 firms.
                  </p>
                </Card>
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-text-primary">Resources</h4>
                {[
                  { title: 'SEC Framework for Digital Assets', url: 'https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets', desc: 'Official SEC guidance on applying the Howey Test to digital assets' },
                  { title: 'EU MiCA Regulation', url: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica', desc: 'ESMA\'s MiCA overview — the EU\'s comprehensive crypto regulatory framework' },
                  { title: 'Singapore MAS Digital Token Guide', url: 'https://www.mas.gov.sg/regulation/digital-token-offerings', desc: 'MAS guide on digital token offerings and payment services licensing' },
                  { title: 'a16z Crypto Regulation Hub', url: 'https://a16zcrypto.com/regulation/', desc: 'Policy research and regulatory analysis from Andreessen Horowitz\'s crypto team' },
                  { title: 'Coin Center (Policy)', url: 'https://www.coincenter.org/', desc: 'Non-profit research and advocacy for sound cryptocurrency policy' },
                  { title: 'LexDAO', url: 'https://lexdao.org/', desc: 'Community of legal engineers building at the intersection of law and blockchain' },
                  { title: 'SAFT Project (Cooley)', url: 'https://saftproject.com/', desc: 'Simple Agreement for Future Tokens — framework for compliant token sales' },
                  { title: 'Uniswap Labs ToS (Example)', url: 'https://uniswap.org/terms-of-service', desc: 'Real-world example of Terms of Service for a major DeFi protocol' },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-purple-400 transition-colors">{link.title}</p>
                      <p className="text-xs text-text-muted">{link.desc}</p>
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

export default LegalRegulatoryBasics;
