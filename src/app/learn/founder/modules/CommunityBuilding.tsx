'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Users,
  Sprout,
  TrendingUp,
  Crown,
  RefreshCw,
  Award,
  Vote,
  Palette,
  Maximize2,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface CommunityBuildingProps {
  isActive: boolean;
  onToggle?: () => void;
}

const stages = [
  {
    label: 'Seeders',
    range: '0 – 100',
    icon: Sprout,
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Your founding tribe — hand-picked believers who shape the culture',
    traits: ['Direct DMs to onboard', 'Founders active daily', 'Every member matters', 'Culture is set here'],
  },
  {
    label: 'Early Adopters',
    range: '100 – 1K',
    icon: Users,
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Word spreads organically — early contributors emerge and take ownership',
    traits: ['Contributor programs launch', 'Governance experiments begin', 'Community-created content appears', 'First moderators emerge'],
  },
  {
    label: 'Growth',
    range: '1K – 10K',
    icon: TrendingUp,
    color: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    description: 'Scaling while preserving culture — the hardest transition',
    traits: ['Sub-communities form', 'Ambassador programs scale', 'Onboarding becomes automated', 'Culture guides written down'],
  },
  {
    label: 'Maturity',
    range: '10K+',
    icon: Crown,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Self-sustaining ecosystem — community runs itself through governance',
    traits: ['DAO governance active', 'Community-led initiatives', 'Multi-language expansion', 'Ecosystem flywheel spinning'],
  },
];

function CommunityStages() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Stage selector */}
      <div className="flex gap-2">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <motion.button
              key={stage.label}
              onClick={() => setActiveStage(i)}
              className={cn(
                'flex-1 p-3 rounded-lg border text-center transition-all',
                activeStage === i
                  ? `${stage.borderColor} ${stage.bgColor}`
                  : 'border-border hover:border-near-green/30 bg-black/20'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn('w-5 h-5 mx-auto mb-1', activeStage === i ? 'text-emerald-400' : 'text-text-muted')} />
              <span className={cn('text-xs font-semibold block', activeStage === i ? 'text-text-primary' : 'text-text-muted')}>{stage.label}</span>
              <span className="text-[10px] text-text-muted">{stage.range}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Stage progress bar */}
      <div className="relative h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', stages[activeStage].color)}
          animate={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      </div>

      {/* Stage detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={cn('border rounded-xl p-4', stages[activeStage].borderColor, stages[activeStage].bgColor)}
        >
          <h5 className="font-semibold text-text-primary text-sm mb-1">{stages[activeStage].label} Stage</h5>
          <p className="text-xs text-text-secondary mb-3">{stages[activeStage].description}</p>
          <div className="grid grid-cols-2 gap-2">
            {stages[activeStage].traits.map((trait) => (
              <div key={trait} className="flex items-center gap-2 text-xs text-text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {trait}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="text-xs text-text-muted text-center">Click each stage to explore the community growth journey</p>
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
  const correctAnswer = 3;
  const options = [
    'Not running enough AMAs and Twitter Spaces',
    'Using Discord instead of Telegram',
    'Failing to airdrop tokens to early members',
    'Focusing on member count instead of engagement quality',
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">What&apos;s the #1 mistake in Web3 community building?</p>
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
                <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! Vanity metrics (10K Discord members!) mean nothing if engagement is dead. A community of 500 active contributors who participate in governance, create content, and onboard others is infinitely more valuable than 50K silent lurkers who joined for an airdrop.</p>
              ) : (
                <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. The biggest mistake is chasing member count over engagement quality. Projects with 50K silent Discord members and zero governance participation have communities in name only. Quality engagement — active contributors, governance voters, content creators — is what actually drives protocol growth.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CommunityBuilding({ isActive, onToggle }: CommunityBuildingProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['community-building']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['community-building'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={() => {}} style={{display:"none"}} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Community Building</h3>
            <p className="text-text-muted text-sm">Build a digital nation, not just a Discord server</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 6 of 12</Badge>
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
              A Web3 community isn&apos;t a Discord server — it&apos;s a digital nation with citizens, culture, and shared purpose. 
              Just like a nation needs founding principles, governance structures, and civic engagement, your community needs 
              architecture, rituals, and pathways for members to contribute meaningfully. The strongest protocols aren&apos;t 
              built by companies — they&apos;re sustained by communities that feel ownership.
            </p>
          </motion.div>

          {/* Interactive Community Stages */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Community Growth Stages
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <CommunityStages />
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard
                icon={Maximize2}
                title="Community Architecture"
                preview="Design your community like a city — with districts, gathering spaces, and clear pathways"
                details="Community architecture is the intentional design of spaces, roles, and information flows. NEAR's community has distinct layers: core contributors (protocol development), ecosystem teams (building on NEAR), regional hubs (local communities), and general community (users and holders). Each layer has its own spaces, communication norms, and governance rights. Key architectural decisions: platform choice (Discord vs. Telegram vs. Forum), channel structure (too many = fragmentation, too few = noise), role hierarchy (how do new members level up?), and information flow (how do decisions propagate?)."
              />
              <ConceptCard
                icon={RefreshCw}
                title="Engagement Loops"
                preview="Great communities aren't built on announcements — they're built on loops that keep people coming back"
                details="An engagement loop is a cycle that creates recurring value for members. Examples: weekly community calls (ritual), governance votes (agency), bounty programs (reward), builder showcases (recognition), and meme contests (fun). The best loops combine intrinsic motivation (belonging, purpose, mastery) with extrinsic rewards (tokens, NFTs, access). Mintbase's creator community runs on a loop: create → get featured → sell → earn → create more. Each loop should answer: 'Why would someone come back tomorrow?'"
              />
              <ConceptCard
                icon={Award}
                title="Contributor Programs"
                preview="Turn passive members into active builders with structured contribution paths"
                details="Contributor programs formalize how community members add value and get recognized. Tiers: casual contributors (bug reports, feedback), regular contributors (content creation, translations), core contributors (code, governance proposals), and leads (managing sub-teams). NEAR's guilds system allowed community members to form focused working groups with treasury access. Best practices: clear bounty boards, transparent compensation (tokens + reputation), skill-based matching, and contribution tracking (on-chain credentials or POAPs)."
              />
              <ConceptCard
                icon={Vote}
                title="Governance Participation"
                preview="Governance isn't just voting — it's the ultimate engagement mechanism"
                details="Active governance participation signals the healthiest communities. But most DAOs have <5% voter turnout. Solutions: delegated voting (delegate your vote to someone who pays attention), temperature checks before formal proposals (lower the barrier), incentivized participation (small rewards for voting), governance mining (earn tokens by participating in governance), and progressive decentralization (start centralized, gradually hand over control as the community matures). NEAR's Astro DAO framework enables granular governance for ecosystem projects."
              />
              <ConceptCard
                icon={Palette}
                title="Culture Design"
                preview="Culture is what happens when the founders aren't in the room"
                details="Community culture is the unwritten rules that shape behavior. It's set in the first 100 members and becomes nearly impossible to change later. NEAR's culture emphasizes builder-friendliness and inclusivity — this attracted a distinct community profile compared to more adversarial crypto cultures. Culture design levers: founding team behavior (you model the culture), early member selection (curate carefully), community norms (explicit guidelines), rituals (weekly calls, traditions, inside jokes), and storytelling (origin stories create shared identity). Culture is your most important and least understood competitive advantage."
              />
              <ConceptCard
                icon={Maximize2}
                title="Scaling Community"
                preview="The transition from 1K to 10K members breaks most communities — here's how to survive it"
                details="Scaling is where community-building gets hard. What worked with 500 members (personal touch, founder accessibility) doesn't work at 5,000. Solutions: sub-communities (regional chapters, interest-based groups), tiered access (general vs. contributor vs. core), automated onboarding (bots, documentation, self-serve resources), community-led moderation (trusted members become moderators), and local leadership (NEAR's regional hub model — empower local leaders to run their own community instances with shared values but local flavor). The goal: maintain culture density as you grow."
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
                <h5 className="font-semibold text-emerald-400 text-sm mb-1">NEAR Regional Hubs — Decentralized Community at Scale</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  NEAR Protocol pioneered the regional hub model: semi-autonomous community organizations in Ukraine, Kenya, Vietnam, the Balkans, 
                  and more. Each hub had its own leadership, budget, and local strategy while sharing NEAR&apos;s core values and brand. This model 
                  solved the scaling problem — instead of one global community becoming diluted, NEAR had dozens of tight-knit local communities. 
                  The result: genuine grassroots adoption in regions most L1s ignored, with local hackathons, education programs, and builder communities 
                  that felt native rather than transplanted.
                </p>
              </div>
              <div className="border border-border rounded-xl p-4 bg-black/20">
                <h5 className="font-semibold text-cyan-400 text-sm mb-1">Mintbase — Creator Community Flywheel</h5>
                <p className="text-xs text-text-muted leading-relaxed">
                  Mintbase built their community around creators, not traders. By focusing on onboarding artists and helping them succeed (workshops, 
                  featured spotlights, creator tools), they created a self-reinforcing flywheel. Happy creators attracted their audiences, those 
                  audiences became collectors, collector demand attracted more creators. Their community engagement metrics focused on creation 
                  activity (mints, listings) rather than vanity metrics (Discord members, Twitter followers). This quality-over-quantity approach 
                  built one of the most authentic creator communities in the NEAR ecosystem.
                </p>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'Culture is set by your first 100 members — curate them carefully, they define everything',
                'Engagement loops (rituals + rewards + recognition) keep people coming back',
                'Contributor programs turn passive audiences into active co-builders',
                'Scale through sub-communities and local leadership, not bigger Discord servers',
                'Measure engagement quality (governance votes, contributions) not vanity metrics (member count)',
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
            <h4 className="text-base font-semibold text-text-primary mb-4">⚠️ Common Community Building Mistakes</h4>
            <div className="space-y-3">
              {[
                { mistake: 'Optimizing for Discord member count', fix: 'A 50K-member Discord where 200 people talk is worse than a 2K server where 500 are active daily. Prune inactive members, close invite links during low-activity periods, and celebrate engagement metrics over headcount.' },
                { mistake: 'No moderation strategy from day one', fix: 'Toxic members poison culture fast. Establish clear guidelines, appoint moderators early, and enforce consistently. One banned troll saves you 100 silent departures from members who didn\'t feel safe.' },
                { mistake: 'Paying for engagement instead of earning it', fix: 'Token incentives for Discord activity create mercenary communities that vanish when rewards stop. Invest in genuine value instead: education, exclusive access, networking, and co-creation opportunities.' },
                { mistake: 'Founder as single point of community failure', fix: 'If your community dies when you\'re offline for a week, it\'s a fan club, not a community. Distribute leadership through contributor programs, regional leads, and community-elected moderators.' },
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
            <h4 className="font-semibold text-amber-300 text-sm mb-1">⚡ Action Item: Community Health Audit</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Run a community health audit this week. Count your active members (posted in last 7 days) vs. total members — 
              that&apos;s your engagement rate. If it&apos;s below 5%, you have a growth problem disguised as a success metric. 
              Then identify your top 10 contributors and ask each one: &quot;What would make you 2x more engaged?&quot; Their answers 
              are your community roadmap. Finally, create one weekly ritual (AMA, builder showcase, meme contest) and commit 
              to it for 8 weeks straight. Consistency builds culture.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-xl p-4">
            <h4 className="font-semibold text-cyan-300 text-sm mb-1">📋 Action Item: Contributor Onboarding</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Design a 3-step contributor onboarding flow: (1) Identify — watch for members who answer others&apos; questions, create 
              content, or provide feedback; (2) Invite — personally reach out with a specific role that matches their demonstrated skills; 
              (3) Empower — give them a title, a channel, a small budget, and clear expectations. The best contributors are already 
              contributing informally — your job is to formalize their role and remove obstacles. Aim to onboard 3 new contributors per month.
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
