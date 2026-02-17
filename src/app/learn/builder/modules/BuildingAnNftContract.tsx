'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Palette,
  Coins,
  Layers,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Image,
  Tag,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface BuildingAnNftContractProps {
  isActive: boolean;
  onToggle: () => void;
}

const lifecycleStages = [
  { id: 'mint', label: 'Mint', icon: '🎨', color: '#ec4899', desc: 'Creator mints a new NFT — unique token ID, metadata (title, media URL, description), and owner assigned. Requires storage deposit.' },
  { id: 'transfer', label: 'Transfer', icon: '🔄', color: '#a78bfa', desc: 'Owner transfers the NFT to another account. Requires exactly 1 yoctoNEAR attached for security.' },
  { id: 'approve', label: 'Approve', icon: '✅', color: '#22d3ee', desc: 'Owner approves a marketplace to transfer their NFT. Enables listing without escrow — NFT stays in wallet.' },
  { id: 'sell', label: 'Sell', icon: '💰', color: '#34d399', desc: 'Buyer purchases via marketplace. Royalties automatically distributed to creator via nft_transfer_payout.' },
];

function NftLifecycleFlow() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
    setActiveStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= lifecycleStages.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setActiveStep(step);
      }
    }, 1100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {lifecycleStages.map((step, i) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <motion.div
              onClick={() => { setActiveStep(i); setIsPlaying(false); }}
              animate={{ scale: activeStep === i ? 1.1 : 1, opacity: activeStep >= i ? 1 : 0.4 }}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2 border text-center min-w-[90px] transition-all',
                activeStep === i ? 'border-pink-500/50 bg-pink-500/10' : 'border-border bg-black/30'
              )}
            >
              <span className="text-lg block">{step.icon}</span>
              <span className="text-[10px] font-semibold text-text-primary block mt-1">{step.label}</span>
            </motion.div>
            {i < lifecycleStages.length - 1 && (
              <motion.div animate={{ opacity: activeStep > i ? 1 : 0.2 }} className="mx-1">
                <ArrowRight className="w-4 h-4 text-pink-400" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="border border-border rounded-xl p-4 bg-black/20">
          <h5 className="text-sm font-semibold mb-1" style={{ color: lifecycleStages[activeStep].color }}>
            Step {activeStep + 1}: {lifecycleStages[activeStep].label}
          </h5>
          <p className="text-xs text-text-muted">{lifecycleStages[activeStep].desc}</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={play} disabled={isPlaying}
        className={cn('text-xs px-4 py-2 rounded-lg border transition-all', isPlaying ? 'border-border text-text-muted' : 'border-pink-500/30 text-pink-400 hover:bg-pink-500/10')}>
        {isPlaying ? 'Playing...' : '▶ Animate Full Lifecycle'}
      </button>
    </div>
  );
}

const nepStandards = [
  { nep: 'NEP-171', name: 'Core', desc: 'Ownership & transfers', color: 'border-emerald-500/40 bg-emerald-500/10', textColor: 'text-emerald-400', methods: ['nft_transfer', 'nft_transfer_call', 'nft_token'] },
  { nep: 'NEP-177', name: 'Metadata', desc: 'Title, media, description', color: 'border-blue-500/40 bg-blue-500/10', textColor: 'text-blue-400', methods: ['nft_metadata', 'TokenMetadata'] },
  { nep: 'NEP-178', name: 'Approvals', desc: 'Marketplace permissions', color: 'border-purple-500/40 bg-purple-500/10', textColor: 'text-purple-400', methods: ['nft_approve', 'nft_revoke', 'nft_is_approved'] },
  { nep: 'NEP-181', name: 'Enumeration', desc: 'List & paginate tokens', color: 'border-amber-500/40 bg-amber-500/10', textColor: 'text-amber-400', methods: ['nft_total_supply', 'nft_tokens', 'nft_tokens_for_owner'] },
  { nep: 'NEP-199', name: 'Royalties', desc: 'Creator payouts on resale', color: 'border-pink-500/40 bg-pink-500/10', textColor: 'text-pink-400', methods: ['nft_payout', 'nft_transfer_payout'] },
];

function NepStandardsMap() {
  const [activeNep, setActiveNep] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {nepStandards.map((nep, i) => (
          <motion.div key={nep.nep}
            className={cn('rounded-lg border p-3 cursor-pointer transition-all text-center', activeNep === i ? nep.color : 'border-border bg-black/20')}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveNep(activeNep === i ? null : i)}>
            <span className={cn('text-xs font-bold block', activeNep === i ? nep.textColor : 'text-text-primary')}>{nep.nep}</span>
            <span className="text-[10px] text-text-muted block">{nep.name}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeNep !== null && (
          <motion.div key={activeNep} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={cn('rounded-lg border p-4', nepStandards[activeNep].color)}>
              <p className="text-sm text-text-secondary mb-2">{nepStandards[activeNep].desc}</p>
              <div className="flex flex-wrap gap-1">
                {nepStandards[activeNep].methods.map((m) => (
                  <code key={m} className="text-xs font-mono px-2 py-0.5 rounded bg-black/30 text-text-primary">{m}</code>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-center text-xs text-text-muted">👆 Click each NEP to see its methods — these standards compose together</p>
    </div>
  );
}

function ConceptCard({ icon: Icon, title, preview, details }: {
  icon: React.ElementType; title: string; preview: string; details: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer border border-border rounded-xl p-4 hover:border-pink-500/30 transition-all bg-black/20">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-pink-400" />
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
    'NEP-171 handles metadata, NEP-177 handles core transfers',
    'NEP-171 is the core NFT standard, NEP-177 adds metadata, NEP-178 adds approvals',
    'NEP-171 is for fungible tokens, NEP-177 is for non-fungible tokens',
    'All NFT functionality is defined in a single NEP-171 standard',
  ];
  return (
    <div className="border border-border rounded-xl p-5 bg-black/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h4 className="font-semibold text-text-primary">Quick Check</h4>
      </div>
      <p className="text-sm text-text-secondary mb-4">How are the NEAR NFT standards organized?</p>
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
                ? <p><CheckCircle className="w-4 h-4 inline mr-1" /> Correct! NEAR NFTs are modular: NEP-171 defines core transfer/ownership, NEP-177 adds metadata, NEP-178 adds approval management, and NEP-199 defines royalty payouts.</p>
                : <p><AlertTriangle className="w-4 h-4 inline mr-1" /> Not quite. The standards are modular: NEP-171 (core), NEP-177 (metadata), NEP-178 (approvals), NEP-199 (royalties). Each builds on the previous.</p>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BuildingAnNftContract({ isActive, onToggle }: BuildingAnNftContractProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      const progress = JSON.parse(localStorage.getItem('voidspace-builder-progress') || '{}');
      progress['building-an-nft-contract'] = true;
      localStorage.setItem('voidspace-builder-progress', JSON.stringify(progress));
      setCompleted(true);
    }
  };

  return (
    <Card variant="glass" padding="none" className="border-pink-500/20">
      <div onClick={onToggle} className="cursor-pointer p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Building an NFT Contract</h3>
            <p className="text-text-muted text-sm">Implement NEP-171 with minting, royalties, and marketplace integration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/20">Builder</Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-pink-500/20 p-6 space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-pink-500/10 text-pink-300 border-pink-500/20">Module 22 of 27</Badge>
            <Badge className="bg-black/30 text-text-muted border-border"><Clock className="w-3 h-3 inline mr-1" />40 min read</Badge>
          </motion.div>

          {/* Big Idea */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-gradient-to-br from-pink-500/10 to-purple-500/5 border border-pink-500/20 rounded-xl p-5">
            <h4 className="text-lg font-bold text-text-primary mb-2">💡 The Big Idea</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              An NFT contract is like a <span className="text-pink-400 font-medium">digital art gallery with a built-in notary</span>.
              Each piece has a certificate of authenticity (token ID + metadata), a current owner recorded in the ledger,
              and a royalty agreement that pays the artist on every resale. The NEP standards define how this gallery operates —
              minting, transferring, approving auction houses, and splitting sale proceeds. The standards are modular:
              pick what you need and compose them together.
            </p>
          </motion.div>

          {/* Interactive Lifecycle */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-pink-400" />
              NFT Lifecycle — Interactive
            </h4>
            <div className="border border-border rounded-xl p-5 bg-black/20">
              <NftLifecycleFlow />
            </div>
          </div>

          {/* NEP Standards Map */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-400" />
              NEP Standards Map
            </h4>
            <NepStandardsMap />
          </div>

          {/* Code Example */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-3">💻 Code In Action</h4>
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-text-secondary border border-border overflow-x-auto">
              <div className="text-text-muted">{'// Simplified NFT mint with metadata'}</div>
              <div><span className="text-purple-400">use</span> near_sdk::{'{'}near, env, AccountId{'}'};</div>
              <div><span className="text-purple-400">use</span> near_sdk::store::UnorderedMap;</div>
              <div className="mt-2">#[near(<span className="text-yellow-300">serializers</span> = [json, borsh])]</div>
              <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">TokenMetadata</span> {'{'}</div>
              <div>    <span className="text-purple-400">pub</span> title: Option&lt;String&gt;,</div>
              <div>    <span className="text-purple-400">pub</span> media: Option&lt;String&gt;, <span className="text-text-muted">// IPFS CID</span></div>
              <div>    <span className="text-purple-400">pub</span> copies: Option&lt;u64&gt;,</div>
              <div>{'}'}</div>
              <div className="mt-2">#[<span className="text-yellow-300">near</span>(contract_state)]</div>
              <div><span className="text-purple-400">pub struct</span> <span className="text-cyan-400">NftContract</span> {'{'}</div>
              <div>    owner_id: AccountId,</div>
              <div>    tokens: UnorderedMap&lt;String, AccountId&gt;,</div>
              <div>    metadata: UnorderedMap&lt;String, TokenMetadata&gt;,</div>
              <div>{'}'}</div>
              <div className="mt-2">#[<span className="text-yellow-300">near</span>]</div>
              <div><span className="text-purple-400">impl</span> <span className="text-cyan-400">NftContract</span> {'{'}</div>
              <div>    #[<span className="text-yellow-300">payable</span>]</div>
              <div>    <span className="text-purple-400">pub fn</span> <span className="text-near-green">nft_mint</span>(</div>
              <div>        &amp;<span className="text-purple-400">mut</span> self,</div>
              <div>        token_id: String,</div>
              <div>        token_metadata: TokenMetadata,</div>
              <div>        receiver_id: AccountId,</div>
              <div>    ) {'{'}</div>
              <div>        assert_eq!(env::predecessor_account_id(),</div>
              <div>            self.owner_id, <span className="text-yellow-300">"Only owner can mint"</span>);</div>
              <div>        assert!(self.tokens.get(&amp;token_id).is_none(),</div>
              <div>            <span className="text-yellow-300">"Token already exists"</span>);</div>
              <div>        self.tokens.insert(token_id.clone(), receiver_id);</div>
              <div>        self.metadata.insert(token_id, token_metadata);</div>
              <div>    {'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Concept Cards */}
          <div>
            <h4 className="text-base font-semibold text-text-primary mb-4">Core Concepts</h4>
            <div className="grid gap-3">
              <ConceptCard icon={Layers} title="NEP-171: Core Standard" preview="The foundation — ownership tracking, transfers, and enumeration"
                details="NEP-171 defines the minimum interface: nft_transfer, nft_transfer_call, and nft_token (view). It tracks token ownership in a map of token_id → owner_id. Transfers require exactly 1 yoctoNEAR attached deposit for security. nft_transfer_call enables cross-contract NFT receivers via the nft_on_transfer callback." />
              <ConceptCard icon={Palette} title="NEP-177: Metadata" preview="Title, description, media URL, and contract-level metadata"
                details="NEP-177 adds TokenMetadata (title, description, media, copies, etc.) and NFTContractMetadata (name, symbol, icon, base_uri). Media URLs typically point to IPFS or Arweave for decentralized storage. The base_uri + token media path pattern keeps individual token metadata lightweight." />
              <ConceptCard icon={Shield} title="NEP-178: Approvals" preview="Allow marketplaces to transfer NFTs on your behalf"
                details="Approval management lets owners approve specific accounts to transfer their tokens. nft_approve(token_id, account_id, msg) grants permission with a unique approval_id. Marketplaces use this to list NFTs without escrow. nft_revoke and nft_revoke_all manage permissions." />
              <ConceptCard icon={Coins} title="NEP-199: Royalties" preview="Perpetual creator earnings on every secondary sale"
                details="nft_payout returns a map of account_id → payout_amount for a given sale price. The marketplace calls nft_transfer_payout which transfers the token AND returns the royalty split. Typical: 90% seller, 5% creator, 5% platform. Royalties are enforced by the contract, not the marketplace." />
              <ConceptCard icon={Image} title="Media Storage" preview="IPFS vs Arweave vs on-chain — where to store NFT media"
                details="Never store large files on-chain — storage costs ~1 NEAR per 100KB. Use IPFS (via Pinata or web3.storage) for cost-effective decentralized storage, or Arweave for permanent storage. Store only the CID/URL in TokenMetadata.media. The base_uri pattern lets you batch-update storage providers." />
              <ConceptCard icon={Tag} title="NEP-297: Event Logs" preview="Standardized events for indexers and wallets to track NFT activity"
                details="Emit NftMint, NftTransfer, and NftBurn events using env::log_str with the NEP-297 JSON format. Indexers like NEAR Indexer use these events to build searchable databases. Without proper event logs, your NFTs won't appear in wallets or marketplace UIs." />
            </div>
          </div>

          {/* Security Gotcha */}
          <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5">
            <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Security Gotcha
            </h4>
            <p className="text-xs text-text-secondary mb-2">
              <strong className="text-red-300">Attack:</strong> Stale approvals — if you don&apos;t clear the approval map after a transfer,
              the previously-approved marketplace can still transfer the NFT from the new owner. This is the #1 source of NFT theft on NEAR.
            </p>
            <p className="text-xs text-text-secondary">
              <strong className="text-emerald-300">Defense:</strong> Always clear all approvals in nft_transfer and nft_transfer_call.
              Reset approved_account_ids when ownership changes. Validate approval_id matches to prevent replay attacks.
            </p>
          </div>

          {/* Practical Tips */}
          <div className="bg-gradient-to-br from-pink-500/5 to-transparent border border-pink-500/20 rounded-xl p-5">
            <h4 className="font-semibold text-text-primary mb-3">🛠️ Practical Tips</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { tip: 'Use IPFS for media', detail: 'Pinata or web3.storage — store CID on-chain, not the file itself' },
                { tip: 'Test with near-workspaces', detail: 'Simulate minting, transfers, and approvals in automated tests' },
                { tip: 'Implement nft_resolve_transfer', detail: 'Handle rollbacks when nft_transfer_call receiver rejects the NFT' },
                { tip: 'Validate royalty sums', detail: 'Ensure all royalty percentages sum to ≤ 10000 basis points (100%)' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-lg p-3 bg-black/20">
                  <p className="text-xs font-semibold text-pink-400 mb-1">{item.tip}</p>
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
                'NEP-171 is modular: core transfers (171), metadata (177), approvals (178), enumeration (181), royalties (199)',
                'Always require exactly 1 yoctoNEAR on transfers to prevent accidental or malicious calls',
                'Store media on IPFS/Arweave — never store large files on-chain',
                'Clear approval maps after transfers to prevent stale approvals',
                'Emit NEP-297 event logs so indexers and wallets can discover your NFTs',
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
            className={cn('w-full py-3 rounded-xl font-semibold text-sm transition-all', completed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-pink-500/10 text-pink-400 border border-pink-500/30 hover:bg-pink-500/20')}>
            {completed ? '✓ Module Complete' : 'Mark as Complete'}
          </motion.button>
        </div>
      )}
    </Card>
  );
}
