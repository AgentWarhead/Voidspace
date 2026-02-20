'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Banknote,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Target,
  FileText,
  Rocket,
  Search,
  Milestone,
  Gift,
  Send,
  Users,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface NearGrantsFundingProps {
  isActive: boolean;
  onToggle?: () => void;
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

const funnelSteps = [
  { icon: Lightbulb, label: 'Idea', desc: 'Define the problem you solve', color: 'from-amber-400 to-yellow-500', pct: 100 },
  { icon: FileText, label: 'Application', desc: 'Submit detailed proposal', color: 'from-orange-400 to-amber-500', pct: 82 },
  { icon: Search, label: 'Review', desc: 'Technical & impact evaluation', color: 'from-rose-400 to-orange-500', pct: 55 },
  { icon: Milestone, label: 'Milestone', desc: 'Define measurable deliverables', color: 'from-purple-400 to-rose-500', pct: 38 },
  { icon: Banknote, label: 'Funding', desc: 'Receive milestone-based payments', color: 'from-cyan-400 to-purple-500', pct: 25 },
  { icon: Send, label: 'Delivery', desc: 'Ship, report, and grow', color: 'from-emerald-400 to-cyan-500', pct: 18 },
];

function GrantFunnel() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {funnelSteps.map((step, i) => {
        const Icon = step.icon;
        const isHovered = activeStep === i;
        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onMouseEnter={() => setActiveStep(i)}
            onMouseLeave={() => setActiveStep(null)}
            className="cursor-pointer"
          >
            <div className="relative">
              {/* Funnel bar */}
              <motion.div
                className={cn(
                  'rounded-lg border transition-all overflow-hidden',
                  isHovered ? 'border-near-green/40 bg-black/40' : 'border-border bg-black/20'
                )}
              >
                {/* Width indicator (funnel shape) */}
                <motion.div
                  className={cn('h-full absolute top-0 left-0 opacity-20 rounded-lg bg-gradient-to-r', step.color)}
                  initial={{ width: '0%' }}
                  animate={{ width: `${step.pct}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                />
                <div className="relative z-10 flex items-center gap-3 p-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                    step.color
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-muted">Step {i + 1}</span>
                      <span className="font-semibold text-text-primary text-sm">{step.label}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{step.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono text-text-muted">{step.pct}%</div>
                    <div className="text-[10px] text-text-muted">pass rate</div>
                  </div>
                </div>
              </motion.div>
              {/* Connector */}
              {i < funnelSteps.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <div className="w-px h-2 bg-border" />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const quizOptions = [
  { id: 'a', text: 'The project isn\'t innovative enough' },
  { id: 'b', text: 'The team is too small' },
  { id: 'c', text: 'Vague milestones without measurable deliverables' },
  { id: 'd', text: 'Not enough social media followers' },
];

export default function NearGrantsFunding({ isActive, onToggle }: NearGrantsFundingProps) {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const correctAnswer = 'c';

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      if (progress['near-grants-funding']) setCompleted(true);
    } catch {}
  }, []);

  const handleComplete = () => {
    if (completed) return;
    try {
      const progress = JSON.parse(localStorage.getItem('voidspace-founder-progress') || '{}');
      progress['near-grants-funding'] = true;
      localStorage.setItem('voidspace-founder-progress', JSON.stringify(progress));
      setCompleted(true);
    } catch {}
  };

  return (
    <Card variant="glass" padding="none" className="border-near-green/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Banknote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR Grants &amp; Funding</h3>
            <p className="text-text-muted text-sm">Secure ecosystem funding for your NEAR project</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-near-green/10 text-near-green border-near-green/20">Module 1 of 12</Badge>
          {completed && <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">✓ Done</Badge>}
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
                  Applying for a NEAR grant is like writing a <span className="text-emerald-400 font-medium">business plan for a bank</span> — they want to see exactly what you&apos;ll build, when, and how you&apos;ll <span className="text-cyan-400 font-medium">measure success</span>. Vague promises don&apos;t get funded. Specific, measurable milestones do.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive Grant Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-emerald-400" />
              Grant Application Funnel
            </h4>
            <div className="bg-black/30 rounded-xl p-5 border border-border">
              <GrantFunnel />
              <p className="text-xs text-text-muted mt-4 text-center">Approximate pass rates at each stage. Only ~18% of initial ideas result in successful delivery.</p>
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
                icon={Gift}
                title="NEAR Foundation Grants"
                preview="The primary funding source for projects building on NEAR Protocol."
                details="The NEAR Foundation offers grants across multiple categories: infrastructure, DeFi, NFTs/gaming, social, and tooling. Grants typically range from $10K to $250K+ depending on scope and team track record. The process is milestone-based — you receive funding in tranches as you deliver on agreed milestones. The Foundation prioritizes projects that grow the ecosystem's TVL, user base, or developer experience. Applications go through technical review, impact assessment, and alignment evaluation."
              />
              <ConceptCard
                icon={Banknote}
                title="Ecosystem Funds"
                preview="Beyond Foundation grants — VCs, accelerators, and ecosystem funds."
                details="The NEAR ecosystem includes multiple funding sources: Proximity Labs (focused on DeFi), MetaWeb (NEAR-focused VC fund), and various regional ecosystem funds. Accelerator programs like NEAR Horizon provide mentorship alongside funding. Many NEAR VCs do follow-on rounds for successful grant recipients, making grants a stepping stone to larger raises. The key is building relationships — attend NEAR events, contribute to governance, and build in public."
              />
              <ConceptCard
                icon={Users}
                title="DevHub & Community Funding"
                preview="Decentralized funding through NEAR's developer community."
                details="NEAR DevHub enables community-driven funding for developer tools, documentation, and education projects. Unlike Foundation grants which go through a centralized review, DevHub proposals are evaluated by community members and funded through on-chain governance. DevHub is particularly good for smaller projects ($1K-$20K): developer tools, tutorials, open-source libraries, and community events. The bar is lower but you still need clear deliverables and a timeline."
              />
              <ConceptCard
                icon={FileText}
                title="Application Strategy"
                preview="What separates funded applications from rejected ones."
                details="Winning applications share five traits: (1) Clear problem statement with evidence — show the gap in the ecosystem. (2) Specific solution with technical architecture — not just 'we'll build a DeFi app.' (3) Team credibility — past experience, GitHub profiles, previous projects. (4) Realistic timeline with concrete milestones. (5) Sustainability plan — how will you survive after grant money runs out? Pro tip: reference successful NEAR projects to show ecosystem awareness. And always include metrics you'll track."
              />
              <ConceptCard
                icon={Calendar}
                title="Milestone Planning"
                preview="Break your project into measurable, time-bound deliverables."
                details="The #1 rejection reason is vague milestones. Bad milestone: 'Build the platform.' Good milestone: 'Deploy smart contracts for token staking with 3 pool types, achieve 95%+ test coverage, and complete security audit by Week 8.' Each milestone should be: Specific (what exactly ships), Measurable (how to verify completion), Time-bound (specific deadline), and Costed (budget breakdown for this phase). Plan 3-5 milestones for most grants, with the first milestone achievable within 4-6 weeks."
              />
              <ConceptCard
                icon={TrendingUp}
                title="Post-Grant Growth"
                preview="Grants are a launchpad, not a destination — plan your next phase."
                details="The best grant recipients use funding to prove traction, then leverage that into larger raises. Track and publicize your metrics: users, TVL, transactions, developer adoption. Engage with the NEAR community through governance, partnerships, and ecosystem contributions. Many successful NEAR projects (Mintbase, Burrow, Ref Finance) started with Foundation grants and grew into standalone projects with VC backing, token launches, and self-sustaining revenue models."
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
                <h5 className="font-semibold text-text-primary text-sm mb-2">Mintbase — NFT Infrastructure</h5>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">
                  Mintbase started with NEAR Foundation support to build NFT minting and marketplace infrastructure. Their grant application focused on specific technical deliverables: smart contract standards, indexer infrastructure, and developer SDK. They delivered on milestones consistently, which led to follow-on funding and eventually became one of NEAR&apos;s flagship NFT platforms.
                </p>
                <Badge className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-500/20">Success Pattern: Technical specificity + consistent delivery</Badge>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border">
                <h5 className="font-semibold text-text-primary text-sm mb-2">Burrow — DeFi Lending</h5>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">
                  Burrow (supported by Proximity Labs) built NEAR&apos;s first major lending protocol. Their approach: detailed technical specification, phased rollout plan, and clear metrics (TVL targets, supported assets timeline). By hitting milestones early and maintaining transparent communication, they secured additional ecosystem support and grew into a core DeFi primitive on NEAR.
                </p>
                <Badge className="text-[10px] bg-cyan-500/20 text-cyan-300 border-cyan-500/20">Success Pattern: Phased rollout + metric-driven growth</Badge>
              </div>
              <div className="bg-black/30 rounded-xl p-4 border border-border sm:col-span-2">
                <h5 className="font-semibold text-text-primary text-sm mb-2">DevHub Funding Model</h5>
                <p className="text-xs text-text-secondary leading-relaxed">
                  NEAR DevHub represents a shift toward decentralized funding. Community members propose projects, other developers review and vote, and funding is disbursed on-chain. This model has funded dozens of developer tools, educational content, and open-source libraries. The key difference: DevHub prioritizes community utility over commercial potential, making it ideal for public goods and developer experience improvements.
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
            <p className="text-sm text-text-secondary mb-4">What&apos;s the #1 reason NEAR grant applications get rejected?</p>
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
                          <span className="text-emerald-300 font-medium">Correct!</span> Vague milestones are the top killer. &ldquo;Build a DeFi app&rdquo; tells reviewers nothing. &ldquo;Deploy lending contracts supporting 5 assets with liquidation engine, achieving $1M TVL within 3 months&rdquo; gets funded. Be specific, measurable, and time-bound.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-secondary">
                          <span className="text-amber-300 font-medium">Not quite.</span> The answer is <span className="text-emerald-300">C</span> — vague milestones without measurable deliverables. Grant reviewers need to know exactly what you&apos;ll deliver, when, and how success is measured. Small teams with clear plans beat large teams with fuzzy proposals every time.
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
                'Write milestones that are specific, measurable, time-bound, and costed',
                'Show ecosystem awareness — reference how your project fills a gap in NEAR',
                'Include a sustainability plan — grants are a launchpad, not a business model',
                'Track metrics religiously and share progress publicly to build credibility',
                'Explore multiple funding paths: Foundation grants, DevHub, ecosystem funds, and VCs',
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
                Study 3 successful NEAR grant applications — identify what made them compelling
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                Write your project&apos;s problem statement in one paragraph — clear, specific, with evidence
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                Break your roadmap into 3-5 milestones with specific deliverables and deadlines
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">4.</span>
                Join NEAR DevHub and participate in governance before applying — build your reputation first
              </li>
            </ul>
          </motion.div>

        </div>
      )}
    </Card>
  );
}
