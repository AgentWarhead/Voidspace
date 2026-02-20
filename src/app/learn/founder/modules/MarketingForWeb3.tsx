'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Megaphone,
  Users,
  FileText,
  Star,
  Gift,
  Palette,
  Shield,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface MarketingForWeb3Props {
  isActive: boolean;
  onToggle?: () => void;
}

const channels = [
  { name: 'Twitter/X', roi: 'High', effort: 'Medium', best: 'Narrative building, thought leadership', color: 'text-blue-400' },
  { name: 'Discord', roi: 'High', effort: 'High', best: 'Community depth, power users, governance', color: 'text-indigo-400' },
  { name: 'Telegram', roi: 'Medium', effort: 'Low', best: 'Announcements, quick updates, regional groups', color: 'text-cyan-400' },
  { name: 'YouTube', roi: 'High', effort: 'High', best: 'Education, tutorials, long-form content', color: 'text-red-400' },
  { name: 'Podcasts', roi: 'Medium', effort: 'Medium', best: 'Founder credibility, deep dives', color: 'text-purple-400' },
  { name: 'Paid Ads', roi: 'Low', effort: 'High', best: 'Retargeting only, broad awareness is wasteful', color: 'text-amber-400' },
  { name: 'KOL Deals', roi: 'Variable', effort: 'Medium', best: 'Token launches, major announcements', color: 'text-emerald-400' },
  { name: 'Quests (Galxe)', roi: 'Medium', effort: 'Low', best: 'User onboarding, testnet participation', color: 'text-pink-400' },
];

function ChannelGrid() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {channels.map((ch, i) => (
          <motion.div
            key={ch.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setSelected(selected === i ? null : i)}
            className={cn(
              'cursor-pointer border rounded-lg p-3 text-center transition-all',
              selected === i
                ? 'border-near-green/50 bg-near-green/5'
                : 'border-border hover:border-near-green/30 bg-black/20'
            )}
          >
            <span className={cn('text-sm font-semibold', ch.color)}>{ch.name}</span>
            <div className="flex justify-center gap-2 mt-1">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                ch.roi === 'High' ? 'bg-emerald-500/20 text-emerald-300'
                  : ch.roi === 'Medium' ? 'bg-amber-500/20 text-amber-300'
                    : ch.roi === 'Low' ? 'bg-red-500/20 text-red-300'
                      : 'bg-purple-500/20 text-purple-300'
              )}>
                ROI: {ch.roi}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-near-green/30 rounded-lg p-4 bg-near-green/5">
              <div className="flex items-center justify-between mb-2">
                <span className={cn('font-semibold', channels[selected].color)}>{channels[selected].name}</span>
                <div className="flex gap-2">
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-muted">ROI: {channels[selected].roi}</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-muted">Effort: {channels[selected].effort}</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary">Best for: {channels[selected].best}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-xs text-text-muted text-center">Click a channel to see ROI/effort analysis</p>
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
  const correctAnswer = 2;
  const options = [
    'Ad platforms ban crypto content too aggressively',
    'Web3 users use ad blockers more than average',
    'Crypto-native users trust community signals over ads',
    'The cost per click is too high in crypto verticals',
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">Why do traditional paid ads often fail in Web3?</p>
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
                <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! Crypto-native users have been conditioned to distrust ads due to years of scams and rug pulls. They rely on community signals — what their trusted follows are talking about, what&apos;s being discussed in Discord, and what builders they respect are endorsing.</p>
              ) : (
                <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. While ad restrictions and costs are real issues, the fundamental problem is trust. Crypto-native users trust community signals — peer recommendations, builder endorsements, and organic discussion — far more than any advertisement.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MarketingForWeb3({ isActive, onToggle }: MarketingForWeb3Props) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['marketing-for-web3']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['marketing-for-web3'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Marketing for Web3</h3>
            <p className="text-text-muted text-sm">Build movements, not ad campaigns — Web3 marketing decoded</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 11 of 12</Badge>
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
              Web3 marketing is more like politics than advertising — you&apos;re building a movement, not selling a product. 
              Your &quot;customers&quot; are voters who choose to support your vision with their capital, time, and reputation. 
              The best Web3 marketing doesn&apos;t feel like marketing at all — it feels like joining a cause.
            </p>
          </motion.div>

          {/* Interactive Channel Grid */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Channel Effectiveness Grid
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <ChannelGrid />
            </div>
          </div>

          {/* Marketing Budget Framework */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">💰 Web3 Marketing Budget Framework</h4>
            <div className="border border-border rounded-xl p-5 bg-black/20 space-y-3">
              <p className="text-xs text-text-muted mb-2">Allocate your marketing budget across these categories based on your stage:</p>
              {[
                { category: 'Community Building', pct: '30-40%', desc: 'Discord/Telegram management, events, AMAs, contributor incentives' },
                { category: 'Content & Education', pct: '20-25%', desc: 'Blog posts, tutorials, video content, documentation, courses' },
                { category: 'Ecosystem Partnerships', pct: '15-20%', desc: 'Co-marketing, integrations, hackathon sponsorships, grants' },
                { category: 'KOL & Ambassador', pct: '10-15%', desc: 'Long-term relationships with authentic voices in your niche' },
                { category: 'PR & Comms', pct: '5-10%', desc: 'Media outreach, crisis comms prep, press releases for milestones' },
                { category: 'Experimental', pct: '5-10%', desc: 'New channels, quest platforms, airdrops, guerrilla marketing tests' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-near-green font-mono text-xs font-bold whitespace-nowrap w-14 text-right">{item.pct}</span>
                  <div>
                    <span className="text-xs font-semibold text-text-primary">{item.category}</span>
                    <span className="text-xs text-text-muted ml-2">— {item.desc}</span>
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
                icon={Users}
                title="Community Marketing"
                preview="Your community IS your marketing department — empower them, don't manage them"
                details="Community marketing flips the traditional model: instead of broadcasting messages, you empower community members to spread your story in their own voice. NEAR Foundation built regional communities (guilds) that marketed NEAR in local languages and cultural contexts — far more effective than any global campaign. Tactics: ambassador programs, community-generated content bounties, governance-as-marketing (letting the community shape the product creates ownership narratives), and 'build in public' transparency."
              />
              <ConceptCard
                icon={FileText}
                title="Content Strategy"
                preview="In Web3, your content is your product demo, whitepaper, and marketing rolled into one"
                details="Web3 content hierarchy: Twitter threads (top-of-funnel awareness), blog posts (mid-funnel education), documentation (bottom-funnel conversion), and governance proposals (retention). The best Web3 content is educational — it teaches something genuinely useful while naturally showcasing your product. Paras NFT grew their artist community through creator education content — tutorials, artist spotlights, and marketplace guides that served the community while building the brand."
              />
              <ConceptCard
                icon={Star}
                title="KOL Partnerships"
                preview="Influencer marketing in Web3 is a minefield — but done right, it's rocket fuel"
                details="Web3 KOLs (Key Opinion Leaders) range from respected researchers to paid shills. The distinction matters enormously. A genuine endorsement from a respected builder can drive more conversion than a $50K paid promotion. Best practices: long-term partnerships over one-off posts, equity/token alignment over cash payments, authentic product usage over scripted endorsements, and micro-KOLs (1K-10K followers with high engagement) over mega-influencers with passive audiences."
              />
              <ConceptCard
                icon={Gift}
                title="Airdrop Marketing"
                preview="Airdrops are the most powerful and most abused marketing tool in Web3"
                details="Done well (Uniswap, ENS), airdrops create lifelong community members. Done poorly, they attract mercenary farmers who dump instantly. Best practices: retroactive rewards for genuine usage (not prospective tasks), anti-sybil measures (proof of humanity, on-chain activity thresholds), tiered rewards (more tokens for deeper engagement), and vesting periods for large allocations. NEAR ecosystem airdrops that worked targeted users who had already been actively participating."
              />
              <ConceptCard
                icon={Palette}
                title="Brand Building"
                preview="In a sea of generic crypto projects, brand is your moat"
                details="Web3 brand extends beyond logos and colors — it's your protocol's personality, values, and vibe. NEAR's brand as the 'user-friendly' L1 differentiated it from Ethereum's complexity and Solana's speed narrative. Strong Web3 brands have: a clear narrative position (what you stand for), visual consistency across touchpoints, a distinctive voice on social media, memorable memes and culture (community-generated > corporate-designed), and transparency as a brand value (public treasury, open governance)."
              />
              <ConceptCard
                icon={Shield}
                title="Narrative Control"
                preview="In crypto, narrative IS reality — whoever controls the story controls the market"
                details="Crypto narratives move markets more than fundamentals. 'DeFi Summer,' 'NFT boom,' 'L2 season' — each narrative created billions in value for projects positioned within them. To leverage narratives: identify emerging macro narratives early (AI + crypto, RWA, DePIN), position your project within the narrative authentically, create sub-narratives within your community, and prepare counter-narratives for FUD. NEAR's 'chain abstraction' narrative positioned it at the center of the multi-chain future discussion."
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
                <h5 className="font-semibold text-emerald-400 text-sm mb-1">NEAR Foundation — Ecosystem Marketing at Scale</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  NEAR Foundation&apos;s marketing strategy centered on ecosystem growth rather than token promotion. They funded regional hubs (Ukraine, Kenya, Vietnam, Balkans) 
                  that marketed NEAR in local contexts. Instead of running global ad campaigns, they empowered local builders to tell NEAR&apos;s story. This grassroots approach 
                  built genuine developer communities in regions underserved by other L1s, creating sustainable organic growth through local events, hackathons, and education.
                </p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-cyan-400 text-sm mb-1">Paras — Community-Driven NFT Growth</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Paras NFT marketplace grew through creator-first marketing. Instead of chasing collectors with hype, they invested in onboarding artists — 
                  running creator workshops, spotlighting artists on social media, and building tools that made minting accessible. This created a flywheel: 
                  happy artists brought their audiences, those audiences became collectors, collectors attracted more artists. Their marketing budget was minimal — 
                  the community itself was the marketing engine.
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'Web3 marketing is movement-building — empower your community to tell your story',
                'Educational content converts better than promotional content in crypto',
                'KOL partnerships work best with long-term alignment, not one-off payments',
                'Airdrops should reward genuine past behavior, not incentivize mercenary farming',
                'Control your narrative or the market will create one for you — and you won\'t like it',
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
            <h4 className="text-base font-semibold text-text-primary mb-4">⚠️ Common Web3 Marketing Mistakes</h4>
            <div className="space-y-3">
              {[
                { mistake: 'Spending treasury on Facebook/Google ads', fix: 'Most crypto ad accounts get banned within weeks. Even if they don\'t, crypto-native users don\'t discover projects through display ads. Invest in ecosystem presence instead.' },
                { mistake: 'Paying influencers for one-off shills', fix: 'A single KOL tweet has a 24-hour shelf life. Long-term ambassador relationships where KOLs actually use your product create sustained, authentic promotion that their audience trusts.' },
                { mistake: 'Running airdrops without Sybil protection', fix: 'Unprotected airdrops attract farmers who dump immediately. Use on-chain identity verification, activity requirements, and tiered rewards based on genuine protocol usage.' },
                { mistake: 'Ignoring negative narratives', fix: 'In crypto, FUD spreads 10x faster than positive news. Have a rapid-response playbook: acknowledge issues within 1 hour, provide transparent updates, and never delete criticism — address it publicly.' },
                { mistake: 'Marketing before product', fix: 'Hype without substance creates expectations you can\'t meet. Every disappointed user becomes a vocal critic. Build first, create genuine users, then amplify their authentic stories.' },
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
            <h4 className="font-semibold text-amber-300 text-sm mb-1">⚡ Action Item: Channel Audit</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Audit your current marketing channels. For each, calculate the rough cost-per-engaged-user (not impressions — actual 
              wallet connections or meaningful interactions). Kill any channel below your threshold and reallocate to community-driven 
              initiatives. Start a &quot;build in public&quot; practice: post one genuine development update per week on Twitter showing real 
              progress, decisions, and even mistakes. Authenticity compounds.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl p-4">
            <h4 className="font-semibold text-cyan-300 text-sm mb-1">📋 Action Item: Content Calendar</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Build a 30-day content calendar with 4 content types rotating weekly: (1) Technical deep-dive — explain your architecture decisions, 
              (2) Community spotlight — feature a user, contributor, or partner, (3) Ecosystem insight — share your perspective on a NEAR trend, 
              (4) Behind-the-scenes — show your team working, failing, and learning. Batch-produce a week&apos;s content every Monday. Consistency 
              beats virality — your 50th post will perform better than your 1st because you&apos;ve earned algorithmic trust.
            </p>
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
