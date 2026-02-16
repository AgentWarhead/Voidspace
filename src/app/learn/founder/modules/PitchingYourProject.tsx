'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Presentation,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Zap,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  Play,
  Mic,
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

const slides = [
  { key: 'problem', label: 'Problem', icon: Target, color: 'from-red-400 to-red-600', desc: 'Make the investor feel the pain. Use specific data, user quotes, or market failures. Don\'t describe a problem — make them experience it.' },
  { key: 'solution', label: 'Solution', icon: Zap, color: 'from-emerald-400 to-emerald-600', desc: 'Show your solution in action, not in theory. A 30-second demo beats 10 slides of architecture diagrams. Focus on the "aha moment."' },
  { key: 'market', label: 'Market', icon: Globe, color: 'from-blue-400 to-blue-600', desc: 'TAM/SAM/SOM with crypto-native framing. Show the wedge: which specific user segment do you capture first, and how does it expand?' },
  { key: 'traction', label: 'Traction', icon: TrendingUp, color: 'from-purple-400 to-purple-600', desc: 'On-chain metrics, user growth, partnerships, and revenue. Show the trajectory, not just the snapshot. Include organic vs incentivized.' },
  { key: 'team', label: 'Team', icon: Users, color: 'from-amber-400 to-amber-600', desc: 'Highlight relevant experience: previous exits, protocol contributions, open-source work. In Web3, your GitHub profile matters as much as your LinkedIn.' },
  { key: 'ask', label: 'The Ask', icon: DollarSign, color: 'from-cyan-400 to-cyan-600', desc: 'Be specific: raise amount, valuation, use of funds, and timeline. Include token economics if applicable. Show how this round gets you to the next milestone.' },
];

interface PitchingYourProjectProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function PitchingYourProject({ isActive, onToggle }: PitchingYourProjectProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const quizOptions = [
    'Not having a working product at the time of pitch',
    'Leading with technology instead of the problem being solved',
    'Asking for too much money in the first round',
    'Not having enough team members on stage',
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
            <Presentation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Pitching Your Project</h3>
            <p className="text-text-muted text-sm">Pitch structure, storytelling & investor psychology</p>
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-text-primary mb-1">The Big Idea</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  A great Web3 pitch doesn&apos;t explain blockchain — it makes the investor feel the pain of the
                  problem and the inevitability of your solution. Technology is the how, not the what. Lead with
                  the human story, not the technical architecture.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Interactive: Pitch Deck Visualizer */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-2">🎤 Pitch Deck Structure</h4>
            <p className="text-xs text-text-muted mb-4">Click through each slide to build the perfect pitch</p>
            {/* Slide navigation */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSlide(i)}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <motion.div
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                      i === activeSlide
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : i < activeSlide
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400/60'
                        : 'border-border bg-black/20 text-text-muted'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <s.icon className="w-3.5 h-3.5" />
                    {s.label}
                  </motion.div>
                  {i < slides.length - 1 && (
                    <ArrowRight className={cn('w-3 h-3 flex-shrink-0', i < activeSlide ? 'text-emerald-500/40' : 'text-border')} />
                  )}
                </button>
              ))}
            </div>
            {/* Slide content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/30 border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', slides[activeSlide].color)}>
                    {(() => { const SlideIcon = slides[activeSlide].icon; return <SlideIcon className="w-5 h-5 text-white" />; })()}
                  </div>
                  <div>
                    <h5 className="font-bold text-text-primary">{slides[activeSlide].label}</h5>
                    <p className="text-xs text-text-muted">Slide {activeSlide + 1} of {slides.length}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{slides[activeSlide].desc}</p>
                {/* Navigation buttons */}
                <div className="flex justify-between mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                    disabled={activeSlide === 0}
                    className={cn('text-xs px-3 py-1.5 rounded-lg border transition-all', activeSlide === 0 ? 'border-border text-text-muted opacity-50' : 'border-border text-text-secondary hover:border-near-green/30')}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                    disabled={activeSlide === slides.length - 1}
                    className={cn('text-xs px-3 py-1.5 rounded-lg border transition-all', activeSlide === slides.length - 1 ? 'border-border text-text-muted opacity-50' : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10')}
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">📚 Key Concepts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ConceptCard
                icon={Layers}
                title="Pitch Structure"
                preview="The proven framework for Web3 pitches"
                details="The most effective Web3 pitch follows a modified problem-solution framework: 1) Hook — a compelling stat or story that captures attention, 2) Problem — make the pain tangible, 3) Solution — show, don't tell, 4) Why Now — what changed that makes this possible (often a technology or regulation shift), 5) Traction — on-chain proof, 6) Team — why you specifically, 7) Ask — specific, justified, time-bound. Keep it to 12-15 slides max. Each slide should have one core message."
              />
              <ConceptCard
                icon={BookOpen}
                title="Storytelling"
                preview="Narrative techniques that make pitches memorable"
                details="Great pitches follow narrative arcs. Start with a specific user or scenario — 'Maria is a farmer in Brazil who can't access banking.' Make the investor see themselves in the story. Use the 'inevitable future' technique: describe the world your product creates, then explain why you're the team to build it. Avoid jargon — if you can't explain it to a non-crypto person, you don't understand it well enough. The best Web3 pitches never use the word 'blockchain' in the first two minutes."
              />
              <ConceptCard
                icon={Play}
                title="Demo Strategy"
                preview="When and how to show your product in action"
                details="Live demos are high-risk, high-reward. For early-stage: use a recorded demo video (60 seconds max) that shows the core user journey. For later-stage: live demos demonstrate confidence and real product quality. Always have a backup recording. Show the 'aha moment' within the first 15 seconds. In Web3, showing a real on-chain transaction happening in real-time is incredibly powerful — it proves the technology works, not just the slides."
              />
              <ConceptCard
                icon={MessageSquare}
                title="Objection Handling"
                preview="Anticipating and addressing investor concerns"
                details="Common Web3 objections and how to handle them: 'Why do you need a token?' — Be honest; if you don't need one, don't force it. 'What about regulation?' — Show you've thought about it, have legal counsel. 'Can this work without blockchain?' — Explain the specific properties (permissionless, composable, transparent) that blockchain enables. 'What if a big player copies you?' — Network effects, community moats, and first-mover advantage in specific niches. Prepare 5-10 objection responses and practice them until natural."
              />
              <ConceptCard
                icon={Clock}
                title="Follow-up Cadence"
                preview="The post-pitch process that closes deals"
                details="The pitch is just the beginning. Follow-up cadence: Same day — send a thank-you email with deck attached. Day 3 — share a relevant article or data point discussed. Week 1 — provide any additional materials requested. Week 2 — check in with a progress update. Weekly after — brief metric updates until they pass or commit. Track everything in a CRM. If you don't hear back after 3 touchpoints, ask directly: 'Is this something you'd like to pass on? No hard feelings — clarity helps us both.'"
              />
              <ConceptCard
                icon={Mic}
                title="Different Pitch Contexts"
                preview="Adapting your pitch for conferences, 1-on-1s, and demo days"
                details="The 30-second elevator pitch: problem + solution + one traction metric. The 3-minute demo day pitch: problem + demo + traction + ask. The 30-minute partner meeting: full story with deep-dive capability. The dinner conversation: personal journey + vision + one memorable insight. Each context requires a different version. Conference pitches should be bold and memorable. 1-on-1s should be conversational with room for questions. Demo days need energy and precision. Practice all versions until they're natural."
              />
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">⚠️ Common Pitch Mistakes</h4>
            <div className="space-y-2">
              {[
                {
                  mistake: 'Leading with "We\'re building on blockchain"',
                  fix: 'Lead with the problem. Blockchain is how you solve it, not what you\'re building.',
                },
                {
                  mistake: 'Spending 5+ minutes on tokenomics',
                  fix: 'Investors want to understand the business first. Token details belong in the appendix or follow-up.',
                },
                {
                  mistake: 'Showing projected metrics instead of real ones',
                  fix: 'Even small real numbers beat large projections. "We have 200 daily users growing 15% weekly" beats "TAM is $50B."',
                },
                {
                  mistake: 'No live demo or product walkthrough',
                  fix: 'A 30-second screen recording of your product in action is worth more than 10 architecture slides.',
                },
                {
                  mistake: 'Generic competitive landscape slide',
                  fix: 'Show specifically why existing solutions fail for your target user. Use real user quotes if possible.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-black/20 border border-border rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-red-300 font-medium line-through decoration-red-500/30">{item.mistake}</p>
                      <div className="flex items-start gap-2 mt-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-emerald-300">{item.fix}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Studies */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🔍 NEAR Ecosystem Case Studies</h4>
            <div className="space-y-3">
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">Successful NEAR Ecosystem Pitches</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  The most successful NEAR ecosystem pitches share common patterns: they lead with the user problem
                  (not NEAR&apos;s technology), demonstrate real on-chain traction, and position NEAR&apos;s advantages
                  (low fees, fast finality, account abstraction) as enabling features rather than the product itself.
                  Projects like Sweat Economy succeeded by pitching &quot;We turn physical activity into digital value&quot;
                  rather than &quot;We built a Move-to-Earn on NEAR.&quot; The blockchain choice was a supporting detail,
                  not the headline. This approach attracted both crypto-native and mainstream investors.
                </p>
              </div>
              <div className="bg-black/20 border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h5 className="font-semibold text-text-primary text-sm">NearCon Pitch Competition Insights</h5>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  NearCon pitch competitions reveal what judges value most: clarity of problem definition (not
                  technical complexity), live product demonstrations (not roadmap promises), real user metrics
                  (not projected TAM), and founder authenticity (not polished corporate speak). Winners consistently
                  open with a human story, show a working product within 60 seconds, and end with a specific,
                  achievable milestone tied to the funding ask. The most common mistake: spending 70% of the
                  pitch on technology and only 30% on the business — it should be the reverse.
                </p>
              </div>
            </div>
          </div>

          {/* Mini Quiz */}
          <div>
            <h4 className="text-lg font-bold text-text-primary mb-4">🧠 Quick Check</h4>
            <div className="bg-black/30 border border-border rounded-xl p-5">
              <p className="text-sm text-text-primary font-medium mb-4">What&apos;s the most common reason Web3 pitches fail?</p>
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
                          <p className="text-emerald-300">Correct! The #1 pitch mistake is leading with technology. Investors fund solutions to problems, not clever implementations. Start with the pain, then reveal how your technology uniquely solves it.</p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <p className="text-amber-300">Not quite. The most common failure is leading with technology instead of the problem. Investors hear hundreds of pitches about &quot;revolutionary blockchain technology&quot; — they fund teams that clearly articulate the problem and demonstrate why their solution is inevitable.</p>
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
                'Lead with the problem and human impact — technology is the how, not the what',
                'Show a working product within 60 seconds of starting your pitch',
                'Prepare different pitch versions: 30-second, 3-minute, and 30-minute formats',
                'Follow up systematically — the pitch opens the door, follow-up closes the deal',
                'Practice objection handling until responses feel natural, not rehearsed',
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
              <Presentation className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-text-primary">Action Items</h4>
            </div>
            <ul className="space-y-2">
              {[
                'Write your 30-second pitch and test it on 5 non-crypto people — if they get it, you\'re ready',
                'Record a 60-second product demo video showing the core "aha moment"',
                'Build an objection bank: list 10 likely investor questions and craft concise responses',
                'Create a post-pitch follow-up template with a 2-week touchpoint schedule',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-sm mt-px">→</span>
                  <p className="text-sm text-text-secondary">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
