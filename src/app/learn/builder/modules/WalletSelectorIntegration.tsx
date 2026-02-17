'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Wallet,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  LogIn,
  Send,
  Settings,
  Smartphone,
  Eye,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface WalletSelectorIntegrationProps {
  isActive: boolean;
  onToggle: () => void;
}

const walletSteps = [
  { id: 'init', label: 'Init', icon: '⚙️', color: '#f59e0b', desc: 'new NearConnector({ network: "mainnet" }) — zero-dependency setup with auto-discovery' },
  { id: 'select', label: 'Select', icon: '📋', color: '#3b82f6', desc: 'connector.selectWallet() — user picks HOT, Meteor, MyNearWallet, Nightly, etc.' },
  { id: 'connect', label: 'Connect', icon: '🔗', color: '#34d399', desc: 'connector.connect(walletId) — secure sandbox iframe handshake with the wallet' },
  { id: 'sign', label: 'Sign', icon: '✍️', color: '#a78bfa', desc: 'wallet.signAndSendTransaction() — user approves in wallet popup/redirect' },
  { id: 'confirm', label: 'Confirm', icon: '✅', color: '#22d3ee', desc: 'Transaction receipt returned → verify on-chain, show success/failure to user' },
];

function WalletConnectionFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= walletSteps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setActiveStep(step);
      }
    }, 900);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {walletSteps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <motion.div
              onClick={() => { setActiveStep(i); setIsPlaying(false); }}
              animate={{ scale: activeStep === i ? 1.1 : 1, opacity: activeStep >= i ? 1 : 0.4 }}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2 border text-center min-w-[90px] transition-all',
                activeStep === i ? 'border-orange-500/50 bg-orange-500/10' : 'border-border bg-black/30'
              )}
            >
              <span className="text-lg block">{step.icon}</span>
              <span className="text-[10px] font-semibold text-text-primary block mt-1">{step.label}</span>
            </motion.div>
            {i < walletSteps.length - 1 && (
              <motion.div animate={{ opacity: activeStep > i ? 1 : 0.2 }} className="mx-1">
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="border border-border rounded-xl p-4 bg-black/20">
          <h5 className="text-sm font-semibold mb-1" style={{ color: walletSteps[activeStep].color }}>
            Step {activeStep + 1}: {walletSteps[activeStep].label}
          </h5>
          <p className="text-xs text-text-muted">{walletSteps[activeStep].desc}</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={play} disabled={isPlaying}
        className={cn('text-xs px-4 py-2 rounded-lg border transition-all', isPlaying ? 'border-border text-text-muted' : 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10')}>
        {isPlaying ? 'Playing...' : '▶ Animate Full Flow'}
      </button>
    </div>
  );
}

const wallets = [
  { name: 'HOT Wallet', type: 'Extension', keyType: 'Function Call', signUX: 'Popup', icon: '🔥', safe: true },
  { name: 'Meteor', type: 'Extension', keyType: 'Function Call', signUX: 'Popup', icon: '☄️', safe: true },
  { name: 'MyNearWallet', type: 'Web', keyType: 'Full Access', signUX: 'Redirect', icon: '🌐', safe: false },
  { name: 'Near Mobile', type: 'Mobile', keyType: 'Function Call', signUX: 'QR / Deep Link', icon: '📱', safe: true },
  { name: 'Nightly', type: 'Extension', keyType: 'Function Call', signUX: 'Popup', icon: '🌙', safe: true },
];

function WalletComparisonGrid() {
  const [activeWallet, setActiveWallet] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {wallets.map((w, i) => (
          <motion.div key={w.name}
            className={cn('rounded-lg border p-3 cursor-pointer transition-all text-center',
              activeWallet === i
                ? w.safe ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-amber-500/40 bg-amber-500/10'
                : 'border-border bg-black/20'
            )}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveWallet(activeWallet === i ? null : i)}
          >
            <span className="text-xl block">{w.icon}</span>
            <span className="text-[10px] font-semibold text-text-primary block mt-1">{w.name}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeWallet !== null && (
          <motion.div key={activeWallet} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={cn('rounded-lg border p-4', wallets[activeWallet].safe ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5')}>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-text-muted">Type:</span> <span className="text-text-primary">{wallets[activeWallet].type}</span></div>
                <div><span className="text-text-muted">Key:</span> <span className={wallets[activeWallet].safe ? 'text-emerald-400' : 'text-amber-400'}>{wallets[activeWallet].keyType}</span></div>
                <div><span className="text-text-muted">Sign UX:</span> <span className="text-text-primary">{wallets[activeWallet].signUX}</span></div>
              </div>
              {!wallets[activeWallet].safe && (
                <p className="text-[10px] text-amber-400 mt-2">⚠️ Full Access keys are riskier — the wallet can sign ANY transaction, not just your contract calls</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted">👆 Click each wallet to compare — green border = safer Function Call keys</p>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-orange-500/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-orange-400" />
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
  const correctAnswer = 0;
  const options = [
    'Each wallet runs in an isolated sandbox iframe for maximum security',
    'All wallet code runs directly in your app\u0027s main JavaScript thread',
    'Wallets must be installed as separate npm packages individually',
    'NEAR Connector only supports HOT Wallet and no other wallets',
  ];
  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">What makes NEAR Connector&apos;s architecture secure?</p>
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
                ? <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! NEAR Connector runs each wallet in an isolated sandbox iframe — no wallet can access your app&apos;s DOM or state directly.</p>
                : <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. The key security feature is sandboxed iframes — each wallet runs in isolation, preventing malicious wallet code from accessing your application.</p>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WalletSelectorIntegration({ isActive, onToggle }: WalletSelectorIntegrationProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['wallet-selector-integration'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-orange-500/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Wallet Selector Integration</h3>
            <p className="text-text-muted text-sm">Multi-wallet support with sign-in flows and transaction signing UX</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border-orange-500/20">Builder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-orange-500/20 p-6 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-orange-500/10 text-orange-300 border-orange-500/20">Module 26 of 27</Badge>
            <Badge className="bg-black/30 text-text-muted border-border"><Clock className="w-3 h-3 inline mr-1" />50 min read</Badge>
          </motion.div>

          {/* Big Idea */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-xl p-5">
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Think of wallet integration like a <span className="text-orange-400 font-medium">universal remote</span>.
              Users have different wallets (HOT, Meteor, MyNearWallet) like different TV brands.
              NEAR Connector is the universal remote — one API that talks to all of them.
              Each wallet runs in a <span className="text-orange-400 font-medium">secure sandbox</span>,
              so no single wallet can compromise your app. You write the code once, and every
              NEAR wallet just works. No per-wallet packages, no version conflicts.
            </p>
          </motion.div>

          {/* Interactive Flow */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-orange-400" />
              Connection Flow — Interactive
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <WalletConnectionFlow />
            </div>
          </div>

          {/* Wallet Comparison */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              Wallet Comparison
            </h4>
            <WalletComparisonGrid />
          </div>

          {/* Code Example */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-3">💻 Code In Action</h4>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
              <div className="text-text-muted">{'// Complete wallet integration example'}</div>
              <div><span className="text-purple-400">import</span> {'{'} NearConnector {'}'} <span className="text-purple-400">from</span> <span className="text-yellow-300">'@hot-labs/near-connect'</span>;</div>
              <div className="mt-2"><span className="text-purple-400">const</span> connector = <span className="text-purple-400">new</span> <span className="text-cyan-400">NearConnector</span>({'{'}</div>
              <div>  network: <span className="text-yellow-300">'mainnet'</span>,</div>
              <div>  autoConnect: <span className="text-purple-400">true</span>, <span className="text-text-muted">// restore session</span></div>
              <div>{'}'});</div>
              <div className="mt-2"><span className="text-text-muted">// Listen for wallet events</span></div>
              <div>connector.on(<span className="text-yellow-300">'wallet:signIn'</span>, (wallet) =&gt; {'{'}</div>
              <div>  console.log(<span className="text-yellow-300">'Connected:'</span>, wallet.accountId);</div>
              <div>{'}'});</div>
              <div className="mt-2"><span className="text-purple-400">async function</span> <span className="text-near-green">sendTokens</span>(receiver: string) {'{'}</div>
              <div>  <span className="text-purple-400">const</span> wallet = connector.wallet();</div>
              <div>  <span className="text-purple-400">if</span> (!wallet) <span className="text-purple-400">await</span> connector.selectWallet();</div>
              <div>  <span className="text-purple-400">return</span> wallet.signAndSendTransaction({'{'}</div>
              <div>    receiverId: <span className="text-yellow-300">'wrap.near'</span>,</div>
              <div>    actions: [{'{'}</div>
              <div>      type: <span className="text-yellow-300">'FunctionCall'</span>,</div>
              <div>      params: {'{'}</div>
              <div>        methodName: <span className="text-yellow-300">'ft_transfer'</span>,</div>
              <div>        args: {'{'} receiver_id: receiver, amount: <span className="text-yellow-300">'1000000'</span> {'}'},</div>
              <div>        gas: <span className="text-yellow-300">'30000000000000'</span>,</div>
              <div>        deposit: <span className="text-yellow-300">'1'</span>, <span className="text-text-muted">// 1 yoctoNEAR for security</span></div>
              <div>      {'}'},</div>
              <div>    {'}'}],</div>
              <div>  {'}'});</div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard icon={Settings} title="NEAR Connector Setup" preview="Zero-dependency wallet integration in one package"
                details="Install @hot-labs/near-connect — a single package with zero dependencies. Initialize with new NearConnector({ network: 'mainnet', autoConnect: true }). All supported wallets are auto-discovered from a manifest. No per-wallet packages needed." />
              <ConceptCard icon={LogIn} title="Sign-In & Sign-Out" preview="Event-driven wallet lifecycle management"
                details="Call connector.selectWallet() to show the wallet picker, then connector.connect(walletId). Listen for 'wallet:signIn' and 'wallet:signOut' events to track connection state. The connector handles session persistence with autoConnect: true." />
              <ConceptCard icon={Send} title="Transaction Signing" preview="Send function calls and batch transactions"
                details="Get the wallet with connector.wallet(), then call wallet.signAndSendTransaction() with receiverId, methodName, args, gas, and deposit. For batch operations, pass multiple actions. Always show loading states during signing." />
              <ConceptCard icon={Wallet} title="Multi-Wallet Support" preview="9+ wallets work out of the box"
                details="HOT, Meteor, MyNearWallet, Nightly, Near Mobile, Intear, Unity, OKX, and WalletConnect-compatible wallets. Each runs in an isolated sandbox iframe. Manifest-based discovery means new wallets work automatically." />
              <ConceptCard icon={Eye} title="View-Only Calls" preview="Read blockchain state without a wallet connection"
                details="Use connector.viewFunction({ contractId, methodName, args }) to read on-chain state without signing in. Crucial for landing pages showing token balances, NFT galleries, or stats. View calls are free and fast." />
              <ConceptCard icon={Smartphone} title="Mobile Deep Linking" preview="Seamless experience on mobile wallets"
                details="Mobile wallets use deep links (near://) or QR codes instead of popups. NEAR Connector auto-detects the platform and opens the right signing flow. Always test on both desktop and mobile." />
              <ConceptCard icon={Zap} title="UX Best Practices" preview="Loading states, errors, and accessibility"
                details="Show loading spinners during wallet interactions. Distinguish user rejection, insufficient balance, and contract panics. Persist selected wallet across sessions. Never request full access keys unless absolutely necessary." />
            </div>
          </div>

          {/* Security Gotcha */}
          <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
            <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Security Gotcha
            </h4>
            <p className="text-xs text-text-secondary mb-2">
              <strong className="text-red-300">Attack:</strong> A malicious wallet extension could inject modified transaction
              parameters — changing the receiver or inflating the deposit. If you blindly trust wallet responses
              without verifying the on-chain receipt, users could lose funds.
            </p>
            <p className="text-xs text-text-secondary">
              <strong className="text-emerald-300">Defense:</strong> Always verify transaction outcomes by checking on-chain receipt
              status. Use function call access keys (not full access) to limit what a compromised wallet can do.
              Never store private keys in localStorage — wallets handle key management in their sandboxed iframes.
            </p>
          </div>

          {/* Practical Tips */}
          <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🛠️ Practical Tips</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { tip: 'Test with 3+ wallets', detail: 'Each handles signing UX differently — popup vs redirect vs QR code' },
                { tip: 'Handle user rejection', detail: 'Users click "Cancel" — show a friendly message, not a scary error' },
                { tip: 'Cache wallet selection', detail: 'localStorage.setItem("preferredWallet", walletId) for one-click reconnect' },
                { tip: 'Show gas estimates', detail: 'Convert yoctoNEAR to NEAR (÷ 10²⁴) so users understand the real cost' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-lg p-3 bg-black/20">
                  <p className="text-xs font-semibold text-orange-400 mb-1">{item.tip}</p>
                  <p className="text-xs text-text-muted">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mini Quiz */}
          <MiniQuiz />

          {/* Key Takeaways */}
          <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🎯 Key Takeaways</h4>
            <ul className="space-y-2">
              {[
                'NEAR Connector provides multi-wallet support with zero dependencies — one package, all wallets',
                'Each wallet runs in a sandboxed iframe for security — no wallet can access your app directly',
                'Use event listeners (wallet:signIn, wallet:signOut) for reactive state management',
                'Function call keys are safer than full access keys — always prefer them for dApp interactions',
                'Always show loading states and clear error messages during wallet interactions',
                'Test across multiple wallets and platforms — desktop popup vs mobile deep link UX differs',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mark Complete */}
          <motion.button onClick={handleComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className={cn('w-full py-3 rounded-xl font-semibold text-sm transition-all', completed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20')}>
            {completed ? '✓ Module Complete' : 'Mark as Complete'}
          </motion.button>
        </div>
      )}
    </Card>
  );
}
