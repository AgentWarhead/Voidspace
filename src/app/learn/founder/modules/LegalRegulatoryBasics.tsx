'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Scale,
  Globe,
  Shield,
  FileText,
  Users,
  Eye,
  Receipt,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  MapPin,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface LegalRegulatoryBasicsProps {
  isActive: boolean;
  onToggle: () => void;
}

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-near-green/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-text-muted" /></motion.div>
          </div>
          <p className="text-xs text-text-secondary">{preview}</p>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border leading-relaxed">{details}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const regions = [
  {
    id: 'us',
    name: 'United States',
    emoji: '🇺🇸',
    approach: 'Enforcement-First',
    color: 'from-red-400 to-orange-500',
    summary: 'SEC actively pursues unregistered securities. The Howey Test determines if tokens are securities. FinCEN requires money transmitter licenses. State-by-state licensing adds complexity.',
    risk: 'High',
  },
  {
    id: 'eu',
    name: 'European Union',
    emoji: '🇪🇺',
    approach: 'Comprehensive Framework',
    color: 'from-blue-400 to-indigo-500',
    summary: 'MiCA (Markets in Crypto-Assets) provides a unified framework across 27 member states. Requires authorization for crypto-asset service providers. Clear token classification system: utility tokens, asset-referenced tokens, e-money tokens.',
    risk: 'Medium',
  },
  {
    id: 'asia',
    name: 'Asia Pacific',
    emoji: '🌏',
    approach: 'Mixed — Varies by Country',
    color: 'from-amber-400 to-yellow-500',
    summary: 'Singapore: progressive MAS framework with clear guidelines. Japan: licensed exchange model under FSA. South Korea: strict real-name trading requirements. China: outright ban on crypto trading. India: heavy taxation (30%) but legal.',
    risk: 'Varies',
  },
  {
    id: 'friendly',
    name: 'Crypto-Friendly',
    emoji: '🏝️',
    approach: 'Innovation-Focused',
    color: 'from-emerald-400 to-teal-500',
    summary: 'Switzerland (Zug — "Crypto Valley"): FINMA provides clear guidelines, foundation-friendly. UAE (DIFC/ADGM): free zones with tailored crypto regulations. Cayman Islands: zero-tax with strong legal framework. BVI: popular for token issuance structures.',
    risk: 'Low',
  },
];

function RegulatoryMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const active = regions.find(r => r.id === activeRegion);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {regions.map((region) => (
          <motion.button
            key={region.id}
            onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'p-3 rounded-xl border text-center transition-all',
              activeRegion === region.id
                ? 'border-near-green/50 bg-near-green/10'
                : 'border-border bg-black/20 hover:border-near-green/20'
            )}
          >
            <div className="text-2xl mb-1">{region.emoji}</div>
            <div className="text-xs font-medium text-text-primary">{region.name}</div>
            <div className={cn(
              'text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block',
              region.risk === 'High' && 'bg-red-500/20 text-red-300',
              region.risk === 'Medium' && 'bg-amber-500/20 text-amber-300',
              region.risk === 'Low' && 'bg-emerald-500/20 text-emerald-300',
              region.risk === 'Varies' && 'bg-purple-500/20 text-purple-300',
            )}>
              {region.risk} Risk
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-black/30 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-text-primary text-sm">{active.name}</span>
                <Badge className="text-[10px] bg-white/10 border-white/10 text-text-muted">{active.approach}</Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{active.summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const quizOptions = [
  { id: 'a', text: 'Whether a project needs a business license' },
  { id: 'b', text: 'Whether a token qualifies as a security under US law' },
  { id: 'c', text: 'Whether a DAO is legally recognized' },
  { id: 'd', text: 'Whether a crypto exchange can operate in a state' },
];

export default function LegalRegulatoryBasics({ isActive, onToggle }: LegalRegulatoryBasicsProps) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const correctAnswer = 'b';

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Legal &amp; Regulatory Basics</h3>
            <p className="text-text-muted text-sm">Navigate the evolving Web3 compliance landscape</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20">Founder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-near-green/20 p-6 space-y-8">
          {/* The Big Idea */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-text-primary mb-1">The Big Idea</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Web3 legal compliance is like <span className="text-emerald-400 font-medium">building codes for architects</span> — ignoring them doesn&apos;t make them go away, it just means your building gets <span className="text-red-400 font-medium">condemned later</span>. The best founders treat compliance as a competitive advantage, not a burden.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Regulatory Map */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              Regulatory Landscape Map
            </h4>
            <div className="bg-black/30 rounded-xl p-5 border border-border">
              <RegulatoryMap />
              <p className="text-xs text-text-muted mt-3 text-center">Click a region to explore its regulatory approach and risk level.</p>
            </div>
          </motion.div>

          {/* Concept Cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard
                icon={Scale}
                title="Securities Law & The Howey Test"
                preview="The 1946 test that still determines if your token is a security."
                details="The Howey Test asks four questions: Is there (1) an investment of money, (2) in a common enterprise, (3) with expectation of profits, (4) derived from the efforts of others? If all four apply, your token may be a security under US law. Most utility tokens try to avoid the 'efforts of others' prong by ensuring the network is sufficiently decentralized. This is why progressive decentralization matters — the more decentralized your project, the less likely your token is deemed a security."
              />
              <ConceptCard
                icon={FileText}
                title="Token Classification"
                preview="Utility token, security token, or payment token — classification matters."
                details="Tokens generally fall into three categories: Utility tokens (access to a service — like NEAR for gas fees), Security tokens (represent ownership or profit-sharing — regulated like stocks), and Payment tokens (function as currency). The EU's MiCA framework adds 'asset-referenced tokens' and 'e-money tokens.' Classification determines which regulations apply. Many projects issue utility tokens but add features (staking rewards, buybacks) that push them toward security classification. Work with legal counsel before adding token economics."
              />
              <ConceptCard
                icon={Shield}
                title="KYC/AML Requirements"
                preview="Know Your Customer and Anti-Money Laundering — the gatekeepers of finance."
                details="If your dApp handles fiat on/off-ramps, token sales, or operates as a money services business, KYC/AML compliance is likely required. This means verifying user identities, screening against sanctions lists (OFAC, EU, UN), monitoring transactions for suspicious activity, and filing Suspicious Activity Reports (SARs). Even DeFi protocols face increasing pressure — the FATF Travel Rule may apply to certain DeFi activities. Consider using compliant on-ramp partners rather than building KYC infrastructure from scratch."
              />
              <ConceptCard
                icon={Users}
                title="DAO Legal Wrappers"
                preview="A DAO without a legal wrapper is a general partnership — and that's dangerous."
                details="Without a legal entity, DAO members may face unlimited personal liability. Legal wrapper options include: Wyoming DAO LLC (US — limited liability but US tax obligations), Marshall Islands DAO LLC (offshore, DAO-specific legislation), Swiss Association/Foundation (popular for Web3 — NEAR Foundation uses this), and Cayman Foundation Company (flexible, widely recognized). Ref Finance and other NEAR projects use legal wrappers to shield contributors while maintaining decentralized governance. Choose based on where your team and users are located."
              />
              <ConceptCard
                icon={Eye}
                title="Privacy Regulations"
                preview="GDPR, CCPA, and the tension between privacy laws and public blockchains."
                details="GDPR (EU) and CCPA (California) grant users the 'right to be forgotten' — but blockchain data is immutable. The solution: never store personal data on-chain. Use off-chain databases for PII with on-chain references (hashes). For dApps serving EU users, you need a privacy policy, cookie consent, data processing agreements, and a mechanism for data deletion requests. Failure to comply can result in fines up to 4% of annual global revenue under GDPR."
              />
              <ConceptCard
                icon={Receipt}
                title="Tax Obligations"
                preview="Token sales, airdrops, staking rewards — they all have tax implications."
                details="In most jurisdictions: token sales are taxable events, airdrops are income at fair market value, staking rewards are income when received, and DAO treasury distributions are taxable. As a founder, ensure your entity handles tax obligations for token treasury management, team compensation in tokens, and operational expenses. In the US, the IRS treats crypto as property. In the EU, treatment varies by country but MiCA is harmonizing this. Always engage a crypto-specialized tax advisor — generic accountants miss critical nuances."
              />
            </div>
          </motion.div>

          {/* Case Studies */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              NEAR Ecosystem Case Studies
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h5 className="font-semibold text-text-primary text-sm mb-2">NEAR Foundation (Swiss Structure)</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  The NEAR Foundation is established as a Swiss foundation in Zug, leveraging Switzerland&apos;s clear regulatory framework for blockchain entities. This structure provides legal personality, limited liability for council members, and favorable tax treatment for non-profit foundation activities. The Swiss foundation model is widely recognized internationally and has become a template for other L1 ecosystems seeking regulatory clarity.
                </p>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h5 className="font-semibold text-text-primary text-sm mb-2">Ref Finance DAO Legal Wrapper</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  As the leading DEX on NEAR, Ref Finance operates through a DAO structure with a legal wrapper to protect contributors and establish clear governance boundaries. This allows the protocol to enter into real-world contracts, engage service providers, and manage intellectual property while maintaining decentralized governance over protocol parameters and treasury allocation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quiz */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/30 rounded-xl p-5 border border-border"
          >
            <h4 className="text-lg font-bold text-text-primary mb-1">Quick Quiz</h4>
            <p className="text-sm text-text-secondary mb-4">What&apos;s the Howey Test used to determine?</p>
            <div className="grid gap-2">
              {quizOptions.map((option) => {
                const isSelected = quizAnswer === option.id;
                const isCorrect = option.id === correctAnswer;
                const showResult = quizAnswer !== null;
                return (
                  <button
                    key={option.id}
                    onClick={() => !quizAnswer && setQuizAnswer(option.id)}
                    disabled={quizAnswer !== null}
                    className={cn(
                      'text-left p-3 rounded-lg border text-sm transition-all',
                      !showResult && 'border-border hover:border-near-green/30 hover:bg-white/5',
                      showResult && isCorrect && 'border-emerald-500/50 bg-emerald-500/10',
                      showResult && isSelected && !isCorrect && 'border-red-500/50 bg-red-500/10',
                      showResult && !isSelected && !isCorrect && 'border-border opacity-50'
                    )}
                  >
                    <span className="text-text-muted mr-2 font-mono">{option.id.toUpperCase()}.</span>
                    <span className={cn(
                      showResult && isCorrect ? 'text-emerald-300' : 'text-text-secondary',
                      showResult && isSelected && !isCorrect && 'text-red-300'
                    )}>{option.text}</span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {quizAnswer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={cn(
                    'mt-4 p-4 rounded-lg border text-sm',
                    quizAnswer === correctAnswer
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-amber-500/30 bg-amber-500/10'
                  )}>
                    {quizAnswer === correctAnswer ? (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary">
                          <span className="text-emerald-300 font-medium">Correct!</span> The Howey Test (from SEC v. W.J. Howey Co., 1946) determines whether a transaction qualifies as an &ldquo;investment contract&rdquo; — and therefore a security — under US law. It examines investment of money, common enterprise, profit expectation, and reliance on others&apos; efforts.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary">
                          <span className="text-amber-300 font-medium">Not quite.</span> The answer is <span className="text-emerald-300">B</span> — the Howey Test determines whether a token qualifies as a security under US law. This 1946 Supreme Court test is the primary framework the SEC uses to evaluate crypto tokens. If your token passes all four prongs, it&apos;s likely a security.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-3">Key Takeaways</h4>
            <div className="space-y-2">
              {[
                'Get legal counsel early — it\'s cheaper to build compliant than to fix violations later',
                'Understand the Howey Test before designing your tokenomics',
                'Choose your jurisdiction strategically — Switzerland and UAE are popular for Web3 foundations',
                'Always use a legal wrapper for your DAO to protect contributors from personal liability',
                'Never store personal data on-chain — use off-chain databases with on-chain references',
                'Tax obligations exist for tokens, airdrops, staking rewards, and treasury operations',
              ].map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-text-secondary">{takeaway}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5"
          >
            <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Action Items
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span>
                Run your token through the Howey Test — consult a crypto-specialized attorney
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                Research legal wrapper options for your DAO (Wyoming LLC, Swiss foundation, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                Implement a privacy policy and data handling procedures for any user-facing dApp
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">4.</span>
                Engage a crypto tax advisor to structure treasury operations compliantly
              </li>
            </ul>
          </motion.div>
        </div>
      )}
    </Card>
  );
}
