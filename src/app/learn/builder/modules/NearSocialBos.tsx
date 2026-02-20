'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Layers,
  Puzzle,
  Code,
  Database,
  Network,
  Eye,
  GitFork,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface NearSocialBosProps {
  isActive: boolean;
  onToggle?: () => void;
}

const bosComponents = [
  { id: 'gateway', label: 'Gateway', desc: 'near.social renders widgets from on-chain source code', x: 50, y: 8, color: '#22d3ee' },
  { id: 'socialdb', label: 'Social DB', desc: 'On-chain key-value store (social.near) holds all data — profiles, posts, widgets', x: 50, y: 92, color: '#34d399' },
  { id: 'widget-a', label: 'Profile Widget', desc: 'mob.near/widget/Profile — a reusable profile card anyone can embed', x: 15, y: 50, color: '#a78bfa' },
  { id: 'widget-b', label: 'Your Widget', desc: 'Your custom widget — composes other widgets + reads/writes Social DB', x: 50, y: 50, color: '#f59e0b' },
  { id: 'widget-c', label: 'Feed Widget', desc: 'Community-built post feed — embed it anywhere, fork it, customize it', x: 85, y: 50, color: '#ec4899' },
];

const connections = [
  { from: 'gateway', to: 'widget-a' }, { from: 'gateway', to: 'widget-b' }, { from: 'gateway', to: 'widget-c' },
  { from: 'widget-a', to: 'socialdb' }, { from: 'widget-b', to: 'socialdb' }, { from: 'widget-c', to: 'socialdb' },
  { from: 'widget-b', to: 'widget-a' }, { from: 'widget-b', to: 'widget-c' },
];

function BosCompositionDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const activeConns = active ? connections.filter(c => c.from === active || c.to === active) : [];

  return (
    <div className="relative h-72 bg-black/20 rounded-xl border border-border overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {connections.map((conn, i) => {
          const from = bosComponents.find(c => c.id === conn.from)!;
          const to = bosComponents.find(c => c.id === conn.to)!;
          const isHighlighted = activeConns.some(a => a.from === conn.from && a.to === conn.to);
          return (
            <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={isHighlighted ? '#22d3ee' : '#334155'} strokeWidth={isHighlighted ? 0.5 : 0.2}
              strokeDasharray={isHighlighted ? '' : '1,1'} />
          );
        })}
      </svg>
      {bosComponents.map((comp) => (
        <motion.div key={comp.id}
          className={cn('absolute cursor-pointer rounded-lg border px-2 py-1.5 text-center -translate-x-1/2 -translate-y-1/2 transition-all',
            active === comp.id ? 'border-cyan-400/60 bg-cyan-500/10 z-10' : 'border-border bg-surface/80'
          )}
          style={{ left: `${comp.x}%`, top: `${comp.y}%`, minWidth: '80px' }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setActive(active === comp.id ? null : comp.id)}
        >
          <span className="text-[10px] font-semibold text-text-primary block">{comp.label}</span>
          <AnimatePresence>
            {active === comp.id && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} className="text-[8px] text-text-muted mt-0.5 leading-tight">
                {comp.desc}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-text-muted">
        👆 Click any node to see how BOS components compose together
      </p>
    </div>
  );
}

const dataModelPaths = [
  { path: 'alice.near/profile/name', value: '"Alice"', desc: 'Profile display name — readable by any widget', color: '#34d399' },
  { path: 'alice.near/profile/image/url', value: '"ipfs://Qm..."', desc: 'Profile picture stored on IPFS, CID saved on-chain', color: '#34d399' },
  { path: 'alice.near/widget/MyApp', value: '<source code>', desc: 'Widget source code stored directly on-chain — the frontend IS the blockchain', color: '#22d3ee' },
  { path: 'alice.near/post/main', value: '{"text":"Hello!"}', desc: 'Social post content — structured JSON stored under post namespace', color: '#a78bfa' },
  { path: 'alice.near/graph/follow/bob.near', value: '""', desc: 'Social graph edge — Alice follows Bob, stored as a key existence check', color: '#ec4899' },
  { path: 'alice.near/index/like', value: '[{...}]', desc: 'Index for efficient discovery — gateways use indices to build feeds', color: '#f59e0b' },
];

function SocialDbDataModel() {
  const [activePath, setActivePath] = useState<number | null>(null);
  return (
    <div className="space-y-1">
      {dataModelPaths.map((item, i) => (
        <motion.div key={item.path}
          className={cn('rounded-lg border p-3 cursor-pointer transition-all font-mono text-xs',
            activePath === i ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-border bg-black/20'
          )}
          onClick={() => setActivePath(activePath === i ? null : i)}
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={{ color: item.color }}>{item.path}</span>
            <span className="text-text-muted">{item.value}</span>
          </div>
          <AnimatePresence>
            {activePath === i && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="text-text-muted mt-1 font-sans overflow-hidden">
                {item.desc}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      <p className="text-center text-xs text-text-muted mt-2">👆 Click any path to see what it stores — Social DB is a tree-structured key-value store</p>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-cyan-500/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-cyan-400" />
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
    'Widgets are compiled to WASM and deployed as smart contracts',
    'Widgets run on a centralized server managed by NEAR Foundation',
    'Widget source code is stored on-chain in Social DB and rendered by gateways',
    'Widgets must be packaged as NPM modules before deployment',
  ];
  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">How are BOS widgets stored and rendered?</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button key={i} onClick={() => { setSelected(i); setRevealed(true); }} className={cn(
            'w-full text-left p-3 rounded-lg border text-sm transition-all',
            revealed && i === correctAnswer ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
              : revealed && i === selected && i !== correctAnswer ? 'border-red-500/50 bg-red-500/10 text-red-300'
              : selected === i ? 'border-near-green/50 bg-near-green/10 text-text-primary'
              : 'border-border hover:border-near-green/30 text-text-secondary hover:text-text-primary'
          )}>
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className={cn('mt-4 p-3 rounded-lg border text-sm', selected === correctAnswer ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' : 'border-amber-500/30 bg-amber-500/5 text-amber-300')}>
              {selected === correctAnswer
                ? <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! BOS widgets live as source code in Social DB (social.near). Any gateway fetches and renders them client-side, making frontends decentralized and composable.</p>
                : <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. BOS widgets are stored as source code in Social DB on-chain. Gateways fetch and render them client-side — no WASM compilation or centralized servers involved.</p>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NearSocialBos({ isActive, onToggle }: NearSocialBosProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['near-social-bos'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-cyan-500/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">NEAR Social &amp; BOS</h3>
            <p className="text-text-muted text-sm">Composable frontends on the Blockchain Operating System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/20">Builder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-cyan-500/20 p-6 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">Module 27 of 27</Badge>
            <Badge className="bg-black/30 text-text-muted border-border"><Clock className="w-3 h-3 inline mr-1" />30 min read</Badge>
          </motion.div>

          {/* Big Idea */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl p-5">
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Imagine if every website stored its HTML in a shared public library, and anyone could remix any page.
              That&apos;s <span className="text-cyan-400 font-medium">BOS (Blockchain Operating System)</span> — a decentralized
              frontend layer where UI components live on-chain in <span className="text-cyan-400 font-medium">Social DB</span>.
              Any gateway can render them, anyone can fork them, and they compose like LEGO bricks. Your frontend becomes
              as open and permissionless as your smart contracts. No centralized hosting, no single points of failure.
            </p>
          </motion.div>

          {/* BOS Composition Diagram */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-cyan-400" />
              BOS Component Composition
            </h4>
            <BosCompositionDiagram />
          </div>

          {/* Social DB Data Model */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Social DB Data Model
            </h4>
            <SocialDbDataModel />
          </div>

          {/* Code Example */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-3">💻 Code In Action</h4>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
              <div className="text-text-muted">{'// BOS Widget — JSX stored on-chain in Social DB'}</div>
              <div className="text-text-muted">{'// Deploy: near call social.near set \'{"data":...}\''}</div>
              <div className="mt-2"><span className="text-purple-400">const</span> accountId = context.accountId;</div>
              <div><span className="text-purple-400">const</span> profile = Social.getr(</div>
              <div>  <span className="text-yellow-300">{"`${accountId}/profile`"}</span></div>
              <div>);</div>
              <div className="mt-2"><span className="text-purple-400">if</span> (!profile) <span className="text-purple-400">return</span> <span className="text-yellow-300">"Loading..."</span>;</div>
              <div className="mt-2"><span className="text-purple-400">return</span> (</div>
              <div>  &lt;<span className="text-cyan-400">div</span> className=<span className="text-yellow-300">"profile-card"</span>&gt;</div>
              <div>    &lt;<span className="text-cyan-400">h2</span>&gt;{'{profile.name}'}&lt;/<span className="text-cyan-400">h2</span>&gt;</div>
              <div>    &lt;<span className="text-cyan-400">p</span>&gt;{'{profile.description}'}&lt;/<span className="text-cyan-400">p</span>&gt;</div>
              <div>    {'{/* Compose another widget */}'}</div>
              <div>    &lt;<span className="text-cyan-400">Widget</span></div>
              <div>      src=<span className="text-yellow-300">"mob.near/widget/FollowButton"</span></div>
              <div>      props={'{{ accountId }}'}</div>
              <div>    /&gt;</div>
              <div>  &lt;/<span className="text-cyan-400">div</span>&gt;</div>
              <div>);</div>
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard icon={Globe} title="Gateways" preview="Entry points that render on-chain widgets for users"
                details="Gateways like near.social fetch widget source code from Social DB and render it client-side. Anyone can run a gateway — if near.social goes down, other gateways still serve the same widgets. It's like having multiple browsers for the same decentralized web." />
              <ConceptCard icon={Database} title="Social DB" preview="The on-chain key-value store powering everything"
                details="Social DB (social.near) stores profiles, posts, follows, widget source code, and arbitrary data. Every NEAR account has a namespace: alice.near/profile/name, alice.near/widget/MyApp. Reading is free; writing costs a small storage deposit (~0.00001 NEAR per byte)." />
              <ConceptCard icon={Puzzle} title="Widget Composability" preview="Import any widget into yours — like on-chain npm"
                details="The <Widget> component lets you embed any published widget by path (e.g., mob.near/widget/Profile). Pass props to customize. Complex apps are assembled from community-built pieces, not written from scratch." />
              <ConceptCard icon={Layers} title="On-Chain Storage" preview="Your frontend code lives on the blockchain forever"
                details="Widget source is stored directly on NEAR via Social DB. This means your frontend is censorship-resistant, version-controlled on-chain, and permanently accessible. Any developer can inspect, fork, or compose with your widget." />
              <ConceptCard icon={Network} title="Cross-Chain Widgets" preview="BOS widgets can interact with multiple blockchains"
                details="While widgets live on NEAR, they interact with other chains via RPC calls and bridges. A single widget can display Ethereum data, execute NEAR transactions, and read Aurora state — all in one composable interface." />
              <ConceptCard icon={GitFork} title="Forking & Remixing" preview="Every widget is forkable — copy, modify, deploy your version"
                details="All widget code is on-chain, so anyone can read, fork, and deploy modified versions under their own account. The ecosystem evolves through community iteration — open source on steroids." />
              <ConceptCard icon={Eye} title="Discovery & Indexing" preview="Social DB indices enable widget and content discovery"
                details="Use the index namespace (account/index/type) for efficient discovery. Post indices build feeds, follow indices create social graphs, widget indices power component marketplaces. Query with Social.index() from your widgets." />
            </div>
          </div>

          {/* Security Gotcha */}
          <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
            <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Security Gotcha
            </h4>
            <p className="text-xs text-text-secondary mb-2">
              <strong className="text-red-300">Attack:</strong> A malicious widget could embed a hidden iframe or redirect
              that tricks users into signing unintended transactions. Since widgets render from on-chain source,
              a compromised widget source affects all gateways rendering it.
            </p>
            <p className="text-xs text-text-secondary">
              <strong className="text-emerald-300">Defense:</strong> Gateways implement sandboxing for widget rendering.
              Always review widget source before embedding. Use Social.getr() with specific version hashes to pin
              widget versions. Implement CSP headers and iframe sandboxing on your gateway.
            </p>
          </div>

          {/* Practical Tips */}
          <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🛠️ Practical Tips</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { tip: 'Use IPFS for media', detail: 'Store images on IPFS, save only CID on-chain — Social DB charges per byte' },
                { tip: 'Break into small widgets', detail: 'Composable pieces are more useful than monolithic apps — others can reuse them' },
                { tip: 'Always null-check Social.getr()', detail: 'Data may not exist yet — handle null gracefully or show a loading state' },
                { tip: 'Pin widget versions', detail: 'Reference specific commit hashes to prevent upstream widget changes breaking your app' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-lg p-3 bg-black/20">
                  <p className="text-xs font-semibold text-cyan-400 mb-1">{item.tip}</p>
                  <p className="text-xs text-text-muted">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-orange-400 mb-3">⚠️ Common Mistakes</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Storing large data blobs directly in Social DB — use IPFS for images/files, store only the CID</li>
              <li>• Ignoring storage deposits — every byte written costs ~0.00001 NEAR (adds up with large widgets)</li>
              <li>• Building monolithic widgets — break them into small composable pieces others can reuse</li>
              <li>• Not handling null from Social.getr() — always check for missing data before rendering</li>
              <li>• Embedding untrusted third-party widgets without reviewing their source code first</li>
            </ul>
          </div>

          {/* Mini Quiz */}
          <MiniQuiz />

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'BOS stores frontend source code on-chain — UIs as decentralized as smart contracts',
                'Social DB is the shared key-value store powering profiles, posts, and widgets',
                'Widget composability builds complex apps from community-built pieces like LEGO',
                'Gateways are interchangeable — no single point of failure for your frontend',
                'Every widget is forkable — the ecosystem evolves through community remixing',
                'Always null-check Social.getr() and use IPFS for large media storage',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </Card>
  );
}
