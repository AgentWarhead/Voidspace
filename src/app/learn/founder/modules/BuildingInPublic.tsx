'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Lightbulb,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Star,
  Code,
  BarChart3,
  Flag,
  Users,
  Calendar,
  MessageSquare,
  Eye,
  Heart,
  Shield,
  Megaphone,
  GitBranch,
  Target,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

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

const contentTypes = [
  {
    key: 'devlog',
    label: 'Dev Logs',
    icon: Code,
    color: 'from-blue-400 to-blue-600',
    day: 'Mon',
    desc: 'Technical updates, code snippets, architecture decisions. Show the engineering behind the product.',
    examples: ['New smart contract deployment walkthrough', 'Refactoring our indexer for 10x throughput', 'Why we chose Rust over Solidity for our core contracts'],
    platform: 'Twitter threads + GitHub discussions',
  },
  {
    key: 'metrics',
    label: 'Metrics',
    icon: BarChart3,
    color: 'from-emerald-400 to-emerald-600',
    day: 'Wed',
    desc: 'Share real numbers — DAU, TVL, revenue. Transparency builds trust, even when numbers are small.',
    examples: ['Weekly metrics dashboard screenshot', 'Month-over-month growth analysis', 'Honest breakdown of what worked and what didn\'t'],
    platform: 'Twitter + Blog post',
  },
  {
    key: 'milestones',
    label: 'Milestones',
    icon: Flag,
    color: 'from-purple-400 to-purple-600',
    day: 'Fri',
    desc: 'Celebrate wins and acknowledge setbacks. Roadmap progress, launches, partnerships, and pivots.',
    examples: ['Mainnet launch retrospective', 'Partnership announcement with context', 'Why we pivoted our roadmap and what we learned'],
    platform: 'Twitter + Discord announcement',
  },
  {
    key: 'community',
    label: 'Community',
    icon: Users,
    color: 'from-amber-400 to-amber-600',
    day: 'Sat',
    desc: 'Contributor spotlights, governance decisions, community proposals, and user stories.',
    examples: ['Developer spotlight: how @dev built X with our SDK', 'Governance proposal results and next steps', 'User story: how someone uses our protocol in real life'],
    platform: 'Discord + Twitter',
  },
];

interface BuildingInPublicProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function BuildingInPublic({ isActive, onToggle }: BuildingInPublicProps) {
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['building-in-public']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['building-in-public'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  const quizOptions = [
    'It generates more social media impressions',
    'Builds trust and attracts contributors who become advocates',
    'It replaces the need for marketing spend',
    'Investors require it before funding decisions',
  ];
  const correctAnswer = 1;

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building in Public</h3>
            <p className="text-text-muted text-sm">Transparency, content cadence & community trust</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 3 of 12</Badge>
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
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-text-primary mb-1">The Big Idea</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Building in public is like cooking in an open kitchen — customers trust you more when they can see
                  the ingredients and the process. In Web3, where trust is everything and anonymity is common,
                  transparency becomes your ultimate competitive advantage.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive: Content Calendar */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-2">📅 Build-in-Public Content Calendar</h4>
            <p className="text-xs text-text-muted mb-4">Click each content type to see how it fits your weekly cadence</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {contentTypes.map((ct) => (
                <motion.button
                  key={ct.key}
                  onClick={() => setActiveContent(activeContent === ct.key ? null : ct.key)}
                  className={cn(
                    'relative p-4 rounded-xl border text-left transition-all',
                    activeContent === ct.key
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-border bg-black/20 hover:border-near-green/20'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3', ct.color)}>
                    <ct.icon className="w-5 h-5 text-white" />
                  </div>
                  <h5 className="font-semibold text-text-primary text-sm">{ct.label}</h5>
                  <p className="text-xs text-text-muted mt-1">{ct.day}</p>
                  {activeContent === ct.key && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            {/* Content details */}
            <AnimatePresence mode="wait">
              {activeContent && (
                <motion.div
                  key={activeContent}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-black/30 border border-border rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-text-primary text-sm">
                      {contentTypes.find(c => c.key === activeContent)?.label}
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/20 text-xs">
                      Every {contentTypes.find(c => c.key === activeContent)?.day}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    {contentTypes.find(c => c.key === activeContent)?.desc}
                  </p>
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-text-primary mb-2">Content Examples:</p>
                    <ul className="space-y-1.5">
                      {contentTypes.find(c => c.key === activeContent)?.examples.map((ex, ei) => (
                        <li key={ei} className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-px">•</span>
                          <span className="text-xs text-text-muted">{ex}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-text-muted mt-2">
                      <span className="font-semibold text-text-secondary">Best platform: </span>
                      {contentTypes.find(c => c.key === activeContent)?.platform}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transparency Spectrum */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🔍 Transparency Spectrum</h4>
            <p className="text-xs text-text-muted mb-3">Understanding what to share at each level of openness</p>
            <div className="space-y-2">
              {[
                {
                  level: 'Always Public',
                  color: 'border-emerald-500/30 bg-emerald-500/5',
                  labelColor: 'text-emerald-400',
                  items: ['Roadmap progress & shipped features', 'Aggregate metrics (DAU, TVL, revenue)', 'Post-mortems and incident reports', 'Team composition and hiring plans'],
                },
                {
                  level: 'Selectively Public',
                  color: 'border-amber-500/30 bg-amber-500/5',
                  labelColor: 'text-amber-400',
                  items: ['Partnership discussions in progress', 'Detailed financial runway', 'Internal team debates on direction', 'Upcoming feature specifics'],
                },
                {
                  level: 'Private',
                  color: 'border-red-500/30 bg-red-500/5',
                  labelColor: 'text-red-400',
                  items: ['Security vulnerabilities pre-patch', 'Token launch exact timing', 'Team personal information', 'Investor term sheet details'],
                },
              ].map((tier) => (
                <div key={tier.level} className={cn('border rounded-xl p-4', tier.color)}>
                  <h5 className={cn('font-semibold text-sm mb-2', tier.labelColor)}>{tier.level}</h5>
                  <div className="grid grid-cols-2 gap-1.5">
                    {tier.items.map((item, ii) => (
                      <span key={ii} className="text-xs text-text-muted">• {item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">📚 Key Concepts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ConceptCard
                icon={Eye}
                title="Transparency Framework"
                preview="What to share, what to protect, and when"
                details="Not everything should be public. Build a transparency framework with three tiers: Always Public (roadmap progress, metrics, post-mortems), Selectively Public (hiring plans, partnership discussions in progress), and Private (security vulnerabilities pre-patch, token launch exact timing, team personal info). The framework prevents over-sharing while maintaining trust. Update your community on the framework itself — meta-transparency builds deeper trust."
              />
              <ConceptCard
                icon={Calendar}
                title="Content Cadence"
                preview="Consistency beats virality in building trust"
                details="The best build-in-public founders follow a predictable cadence: weekly dev updates, monthly metrics reports, quarterly roadmap reviews. Consistency signals commitment and professionalism. Use a content calendar with dedicated themes: Technical Tuesdays, Metrics Mondays, or Feature Fridays. The cadence should be sustainable — it's better to post quality weekly updates than burn out on daily posts. Batch content creation for efficiency."
              />
              <ConceptCard
                icon={GitBranch}
                title="Developer Relations"
                preview="Turning builders into your biggest advocates"
                details="DevRel in Web3 goes beyond documentation. Successful strategies include: open-source everything possible, maintain excellent SDK docs with working examples, create bounty programs for contributions, host regular developer calls, and spotlight community-built tools. NEAR's developer community grew through accessible tooling (near-cli, near-api-js) and strong documentation. Your developers are your distribution — invest in their success."
              />
              <ConceptCard
                icon={Flag}
                title="Open Roadmaps"
                preview="Public planning that invites participation"
                details="An open roadmap isn't just a Notion board — it's a social contract with your community. Use tools like GitHub Projects or dedicated governance forums to share planned features, gather feedback, and let the community vote on priorities. Include status labels (Planning, In Progress, Shipped, Paused) and regular update cadence. The most powerful roadmaps include community-proposed features alongside team priorities."
              />
              <ConceptCard
                icon={MessageSquare}
                title="Community Feedback Loops"
                preview="Structured channels for community input"
                details="Effective feedback loops include: governance forums for major decisions, Discord channels for feature requests, regular AMAs (Ask Me Anything) sessions, and on-chain governance votes for protocol changes. The key is closing the loop — always report back on what you heard and what you're doing about it. Silent feedback collection destroys trust faster than no feedback at all. Create a public 'You Said, We Did' tracker."
              />
              <ConceptCard
                icon={Shield}
                title="Vulnerability in Leadership"
                preview="How honest leadership builds unshakeable trust"
                details="The most trusted Web3 leaders share failures openly: missed deadlines, technical setbacks, and strategic pivots. This vulnerability is counterintuitive but powerful — it signals confidence and integrity. Write post-mortems for incidents, explain why decisions changed, and acknowledge when community feedback was right. Vulnerability doesn't mean weakness — it means you trust your community enough to be honest. This is rare in crypto and therefore extremely valuable."
              />
            </div>
          </div>

          {/* Case Studies */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🔍 NEAR Ecosystem Case Studies</h4>
            <div className="space-y-3">
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">NEAR Protocol — Open Development Culture</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  NEAR Protocol built its reputation through radical openness. Their GitHub is fully public with
                  active commit history, their protocol specifications are published and discussed in community
                  forums, and their technical decisions are debated in public NEPs (NEAR Enhancement Proposals).
                  This openness attracted a deeply technical community who became core contributors. The lesson:
                  when your code is your product, open-source development isn&apos;t just marketing — it&apos;s your
                  primary distribution channel.
                </p>
              </div>
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">Pagoda — Transparency Reports</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Pagoda (formerly NEAR Inc) pioneered detailed transparency reports for the NEAR ecosystem,
                  publishing quarterly updates on ecosystem fund allocation, development milestones, and treasury
                  management. These reports included both wins and challenges, with honest assessments of what
                  didn&apos;t work. The transparency reports became a template that other NEAR projects adopted,
                  creating an ecosystem-wide culture of openness. Key takeaway: institutional-grade transparency
                  raises the bar for the entire ecosystem.
                </p>
              </div>
            </div>
          </div>

          {/* Mini Quiz */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🧠 Quick Check</h4>
            <div className="bg-black/30 border border-border rounded-xl p-5">
              <p className="text-sm text-text-primary font-medium mb-4">What&apos;s the main benefit of building in public for Web3 projects?</p>
              <div className="space-y-2">
                {quizOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border text-sm transition-all',
                      showResult && i === correctAnswer
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : showResult && i === selectedAnswer && i !== correctAnswer
                        ? 'border-red-500 bg-red-500/10 text-red-300'
                        : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className={cn(
                      'p-3 rounded-lg text-sm',
                      selectedAnswer === correctAnswer ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                    )}>
                      {selectedAnswer === correctAnswer ? (
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <p className="text-emerald-300">Correct! Building in public creates trust that converts observers into contributors and contributors into advocates. This organic community growth is the most durable distribution advantage in Web3.</p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-amber-300">Not quite. While building in public has many benefits, the core value is trust-building that attracts genuine contributors who become your strongest advocates. Impressions, marketing savings, and investor requirements are secondary effects.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">💡 Key Takeaways</h4>
            <div className="space-y-2">
              {[
                'Create a transparency framework — not everything should be public, but define what is',
                'Consistency beats virality: a reliable weekly cadence outperforms sporadic viral posts',
                'Close the feedback loop — always report back on what you heard from the community',
                'Vulnerability in leadership builds stronger trust than projecting perfection',
                'Developer relations is distribution — invest in your builders\' success',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-text-secondary">{t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-text-primary">Action Items</h4>
            </div>
            <ul className="space-y-2">
              {[
                'Define your transparency framework: list what\'s Always Public, Selectively Public, and Private',
                'Set up a content calendar with at least 2 recurring weekly content types',
                'Write your first post-mortem or "lessons learned" post about a recent challenge',
                'Create a public "You Said, We Did" tracker for community feedback',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-sm mt-px">→</span>
                  <p className="text-sm text-text-secondary">{item}</p>
                </li>
              ))}
            </ul>
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
