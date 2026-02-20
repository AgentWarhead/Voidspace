'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Rocket,
  Clock,
  Compass,
  Zap,
  Handshake,
  Users,
  RefreshCw,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface GoToMarketProps {
  isActive: boolean;
  onToggle?: () => void;
}

const funnelStages = [
  { label: 'Awareness', desc: 'They know you exist', color: 'from-violet-500 to-purple-600', width: 100, users: '100K' },
  { label: 'Interest', desc: 'They join your Discord/Twitter', color: 'from-blue-500 to-cyan-600', width: 82, users: '25K' },
  { label: 'Trial', desc: 'They connect a wallet and try it', color: 'from-cyan-500 to-teal-600', width: 60, users: '8K' },
  { label: 'Adoption', desc: 'They use it regularly', color: 'from-emerald-500 to-green-600', width: 38, users: '2K' },
  { label: 'Advocacy', desc: 'They bring others', color: 'from-green-500 to-lime-600', width: 20, users: '500' },
];

function GTMFunnel() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {funnelStages.map((stage, i) => (
        <motion.div
          key={stage.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="relative"
          onMouseEnter={() => setActiveStage(i)}
          onMouseLeave={() => setActiveStage(null)}
        >
          <motion.div
            className={cn(
              'relative cursor-pointer rounded-lg border transition-all overflow-hidden',
              activeStage === i ? 'border-near-green/40' : 'border-border'
            )}
            style={{ width: `${stage.width}%`, marginLeft: `${(100 - stage.width) / 2}%` }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={cn('absolute inset-0 opacity-20 bg-gradient-to-r', stage.color)} />
            <div className="relative p-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-text-primary">{stage.label}</span>
                {activeStage === i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-text-muted mt-0.5"
                  >
                    {stage.desc}
                  </motion.p>
                )}
              </div>
              <span className="text-xs font-mono text-text-muted">{stage.users}</span>
            </div>
          </motion.div>
          {i < funnelStages.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className="w-4 h-4 text-text-muted/40" />
            </div>
          )}
        </motion.div>
      ))}
      <p className="text-xs text-text-muted text-center mt-2">
        Typical Web3 funnel: ~0.5% awareness-to-advocacy conversion
      </p>
    </div>
  );
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

function MiniQuiz() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correctAnswer = 1;
  const options = [
    'Paid advertising on crypto media sites',
    'Community-led growth through existing ecosystem users',
    'Influencer marketing with celebrity endorsements',
    'Listing on as many exchanges as possible at launch',
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">What&apos;s the most effective Web3 GTM channel?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setRevealed(true); }}
            className={cn(
              'w-full text-left p-3 rounded-lg border text-sm transition-all',
              revealed && i === correctAnswer
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : revealed && i === selected && i !== correctAnswer
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : selected === i
                    ? 'border-near-green/50 bg-near-green/10 text-text-primary'
                    : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
            )}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'mt-4 p-3 rounded-lg border text-sm',
              selected === correctAnswer
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/5 text-amber-300'
            )}>
              {selected === correctAnswer ? (
                <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! Web3 users already live in ecosystems. Tapping into existing communities — through integrations, partnerships, and genuine value — converts far better than cold advertising. Sweat Economy acquired millions through existing Web2 fitness app users.</p>
              ) : (
                <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. Community-led growth through ecosystem users is the most effective channel. Web3 users are embedded in communities and trust peer recommendations far more than ads or celebrity endorsements.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GoToMarket({ isActive, onToggle }: GoToMarketProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['go-to-market']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['go-to-market'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Go-To-Market Strategy</h3>
            <p className="text-text-muted text-sm">Launch your Web3 product with ecosystem-native distribution</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 7 of 12</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/20">Founder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-near-green/20 p-6 space-y-8">
          {/* The Big Idea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-xl p-5"
          >
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Launching a Web3 product is like opening a restaurant in a food court — your neighbors are your distribution. 
              The protocols, DAOs, and communities already in your ecosystem are both your competitors and your best marketing channels. 
              The smartest founders don&apos;t fight for attention — they plug into existing flows of users, capital, and attention.
            </p>
          </motion.div>

          {/* Interactive Funnel */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-emerald-400" />
              Web3 GTM Funnel
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <GTMFunnel />
            </div>
          </div>

          {/* GTM Checklist */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">📋 Pre-Launch GTM Checklist</h4>
            <div className="border border-border rounded-xl p-5 bg-black/20 space-y-3">
              {[
                { item: 'Ecosystem map completed', desc: 'All protocols, wallets, and communities in your chain catalogued with integration opportunities' },
                { item: 'Top 5 partners identified', desc: 'Active conversations with complementary protocols for co-launch amplification' },
                { item: 'Community seeded', desc: 'At least 200 genuine early users in Discord/Telegram who\'ve tested the product' },
                { item: 'Content pipeline loaded', desc: '30 days of content pre-written: launch announcement, tutorials, partnership reveals, AMAs' },
                { item: 'Metrics dashboard live', desc: 'On-chain analytics tracking DAU, transactions, TVL, and retention before launch day' },
                { item: 'Launch narrative crafted', desc: 'One-sentence pitch that non-crypto people understand, tested on 10 outsiders' },
                { item: 'Rollback plan ready', desc: 'If launch goes wrong — critical bug, low traction, negative sentiment — what\'s Plan B?' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded border border-near-green/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] text-near-green font-mono">{i + 1}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">{item.item}</span>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard
                icon={Clock}
                title="Market Timing"
                preview="In crypto, timing isn't everything — it's the only thing"
                details="Launching in a bear market means fewer users but less competition and more serious builders. Bull markets bring attention but also noise. Sweat Economy launched their token during a bear market but had already built 120M+ users on their Web2 app — when the bull returned, they were positioned perfectly. Key timing signals: ecosystem grant cycles, major protocol upgrades, and narrative shifts (DeFi summer, NFT boom, AI season)."
              />
              <ConceptCard
                icon={Compass}
                title="Ecosystem Positioning"
                preview="Where you build is as important as what you build"
                details="Every blockchain ecosystem has gaps. NEAR's ecosystem in 2023-24 needed better DeFi tooling, social apps, and AI integrations. Mintbase positioned as the NFT infrastructure layer — not competing with OpenSea, but serving NEAR-native creators. Map your ecosystem's existing projects, identify underserved niches, and position as complementary rather than competitive. Your positioning statement should complete: 'We are the [category] for [ecosystem] that [unique value]'."
              />
              <ConceptCard
                icon={Zap}
                title="Launch Strategy"
                preview="The first 72 hours define your trajectory for the next 12 months"
                details="Web3 launches have unique mechanics: testnet phases build anticipation, mainnet launch creates a news event, and token generation events (TGE) are your IPO moment. Best practice: progressive rollout (closed alpha → open beta → mainnet → TGE). Each phase builds social proof. Mintbase ran months of creator onboarding before their marketplace launch, ensuring day-one activity. Never launch a token before product-market fit."
              />
              <ConceptCard
                icon={Handshake}
                title="Partnership Leverage"
                preview="In Web3, a single integration can be worth more than a year of marketing"
                details="Ecosystem partnerships create compounding distribution. When a DEX integrates your token, every trader becomes a potential user. When a wallet adds your dApp, every wallet holder sees you. Strategic partnerships to pursue: wallet integrations (NEAR Wallet, Meteor), DEX listings (Ref Finance), launchpad features (Skyward), ecosystem grants (NEAR Foundation), and cross-chain bridges. Each partnership should answer: 'How does this put us in front of users who need us?'"
              />
              <ConceptCard
                icon={Users}
                title="User Acquisition"
                preview="In Web3, your best users are already someone else's users"
                details="Web3 user acquisition is fundamentally different from Web2. Users already have wallets, already understand tokens, and already participate in ecosystems. Sweat Economy bridged 120M Web2 users into Web3 by meeting them in an app they already used (Sweatcoin). For native Web3 acquisition: liquidity mining, retroactive airdrops, quest platforms (Galxe, Layer3), referral programs with on-chain rewards, and ambassador programs in target geographies."
              />
              <ConceptCard
                icon={RefreshCw}
                title="Retention Loops"
                preview="Acquisition without retention is an expensive way to burn your treasury"
                details="Web3 retention mechanics: staking rewards (lock tokens for yield), governance participation (vote to shape the product), progressive rewards (increasing benefits for long-term users), social features (on-chain reputation, achievement NFTs), and ecosystem lock-in (composability with other protocols). Ref Finance retains liquidity providers through veREF mechanics — longer locking = higher yield multiplier. Design your retention loop before your acquisition strategy."
              />
            </div>
          </div>

          {/* Mini Quiz */}
          <MiniQuiz />

          {/* Case Studies */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">📚 NEAR Ecosystem Case Studies</h4>
            <div className="space-y-3">
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-emerald-400 text-sm mb-1">Mintbase — NFT Marketplace Infrastructure Play</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Mintbase didn&apos;t try to out-OpenSea OpenSea. Instead, they positioned as NFT infrastructure for NEAR — providing minting tools, 
                  marketplace APIs, and creator-friendly UX. Their GTM focused on onboarding creators directly, running workshops in emerging markets 
                  (Africa, Latin America), and building integrations with NEAR wallets. By the time they launched their marketplace, they had a built-in 
                  creator base already minting and trading.
                </p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-cyan-400 text-sm mb-1">Sweat Economy — Web2 → Web3 Bridge Masterclass</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Sweat Economy is the gold standard for Web2-to-Web3 GTM. They built Sweatcoin as a Web2 fitness app, acquired 120M+ users, then 
                  introduced a token on NEAR. Users didn&apos;t need to understand blockchain — they earned tokens by walking. The Web3 transition happened 
                  gradually: first earning, then wallets, then staking, then governance. This funnel converted millions of non-crypto users into Web3 
                  participants with zero cold-start problem.
                </p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-violet-400 text-sm mb-1">Ref Finance — DeFi Ecosystem Hub Strategy</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Ref Finance positioned itself as NEAR&apos;s one-stop DeFi hub rather than just another DEX. Their GTM leveraged every new NEAR project launch — 
                  each new token needed liquidity, and Ref was the default venue. By building the deepest liquidity pools and integrating with every major NEAR 
                  wallet, they created a gravitational pull. Their partnership strategy was simple: &quot;Every new NEAR token needs us on day one.&quot; This made them 
                  infrastructure rather than just a product — a powerful GTM position because infrastructure gets adopted by default, not by choice.
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'Your ecosystem is your distribution — partner with protocols, not against them',
                'Time your launch to ecosystem momentum, not just your roadmap',
                'Progressive rollout (alpha → beta → mainnet → TGE) builds compounding social proof',
                'Web3 users are already active in crypto — acquisition means redirecting, not educating',
                'Design retention loops before acquisition funnels — sustainable growth compounds',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">⚠️ Common GTM Mistakes</h4>
            <div className="space-y-3">
              {[
                { mistake: 'Launching token before product-market fit', fix: 'Your token is your biggest marketing moment. Wasting it on a product nobody wants yet means you can\'t use that lever again. Ship the product first, prove demand, then launch the token.' },
                { mistake: 'Targeting "crypto users" as a segment', fix: '"Crypto users" is not a market segment. DeFi degens, NFT collectors, DAOs, and retail holders have completely different needs and channels. Pick ONE to dominate first.' },
                { mistake: 'Ignoring geographic distribution', fix: 'NEAR has strong communities in specific regions (Africa, Asia, Eastern Europe). Geographic focus lets you dominate a market before expanding. Mintbase focused on African creators first.' },
                { mistake: 'No retention plan at launch', fix: 'Most Web3 launches see 90% user drop after incentives end. Build sticky features (staking, governance, social) before you turn on the acquisition firehose.' },
                { mistake: 'Copying a Web2 GTM playbook', fix: 'Web3 GTM is fundamentally different. Users own assets, communities have governance power, and composability means your product can integrate into others. Lean into these Web3-native advantages.' },
              ].map((item, i) => (
                <div key={i} className="border border-red-500/20 rounded-lg p-3 bg-red-500/5">
                  <p className="text-xs text-red-300 font-semibold mb-1">❌ {item.mistake}</p>
                  <p className="text-xs text-text-muted">{item.fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="border-l-4 border-amber-500 bg-amber-500/5 rounded-r-xl p-4">
            <h4 className="font-semibold text-amber-300 text-sm mb-1">⚡ Action Item: GTM Map</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Create a &quot;GTM Map&quot; for your project: list every protocol, wallet, and community in your ecosystem. 
              For each, write one sentence on how you could integrate with or distribute through them. Rank by potential user overlap 
              and effort required. Your top 3 partnerships should be active conversations within 2 weeks of reading this.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl p-4">
            <h4 className="font-semibold text-cyan-300 text-sm mb-1">📋 Action Item: 72-Hour Launch Plan</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Draft your first 72 hours post-launch. Hour by hour: What announcements go out? On which channels? Who are the pre-committed 
              amplifiers (KOLs, partner projects, ecosystem accounts)? What&apos;s the first milestone users should hit? The best launches feel 
              like events, not announcements. Pre-arrange at least 10 ecosystem partners to co-announce within 24 hours of your launch.
            </p>
          </div>

          {/* GTM Metrics Framework */}
          <div className="bg-black/30 rounded-xl p-4 mt-4">
            <h4 className="font-semibold text-text-primary text-sm mb-3">📊 GTM Metrics That Actually Matter</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { metric: 'Activation Rate', desc: 'What % of signups complete the core action within 24 hours? Target: 40%+.' },
                { metric: 'Organic Mentions', desc: 'Track unpaid tweets, Discord mentions, and forum posts. Real signal of product-market fit.' },
                { metric: 'Retention (D7/D30)', desc: 'How many users return after a week? After a month? This is the only metric VCs truly care about.' },
                { metric: 'Referral Coefficient', desc: 'Does each user bring in >1 new user? If k > 1, you have viral growth. Web3 referrals should be on-chain and verifiable.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs font-bold text-near-green mb-1">{item.metric}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mark Complete */}
          <div className="flex justify-center pt-4 mt-4 border-t border-white/5">
            <motion.button
              onClick={handleComplete}
              disabled={completed}
              className={cn(
                'px-8 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2',
                completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-near-green to-emerald-500 text-white hover:shadow-lg hover:shadow-near-green/20'
              )}
              whileHover={completed ? {} : { scale: 1.03, y: -1 }}
              whileTap={completed ? {} : { scale: 0.97 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completed ? 'Module Completed ✓' : 'Mark as Complete'}
            </motion.button>
          </div>
        </div>
      )}
    </Card>
  );
}
