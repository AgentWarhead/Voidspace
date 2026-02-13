import Link from 'next/link';
import { Wallet, Download, Key, Send, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';

const SETUP_STEPS = [
  {
    step: 1,
    icon: Download,
    title: 'Create a NEAR Wallet',
    description: 'Head to wallet.near.org and create your account. NEAR uses human-readable names — you\'ll get something like "yourname.near" instead of a random hex address.',
    action: 'Create Wallet',
    actionUrl: 'https://wallet.near.org',
    tip: 'Pick a name you\'ll remember. It becomes your on-chain identity.',
    color: 'text-near-green bg-near-green/10',
  },
  {
    step: 2,
    icon: Key,
    title: 'Secure Your Recovery Phrase',
    description: 'Write down your 12-word seed phrase on paper. This is your master key — anyone with these words controls your wallet. Never share it. Never screenshot it.',
    action: null,
    actionUrl: null,
    tip: '⚠️ Store offline ONLY. Not in notes apps, not in email, not in cloud storage.',
    color: 'text-amber-400 bg-amber-500/10',
    warning: true,
  },
  {
    step: 3,
    icon: Wallet,
    title: 'Get Testnet NEAR',
    description: 'Switch to testnet and grab free test tokens from the faucet. Testnet is identical to mainnet but with fake money — perfect for learning without risk.',
    action: 'Get Test Tokens',
    actionUrl: 'https://near-faucet.io',
    tip: 'Testnet tokens are free and unlimited. Experiment as much as you want.',
    color: 'text-cyan-400 bg-cyan-500/10',
  },
  {
    step: 4,
    icon: Send,
    title: 'Send Your First Transaction',
    description: 'Send some test NEAR to another account. Watch it confirm in under 1 second. This is the "aha moment" — you just interacted with a blockchain.',
    action: 'View on NearBlocks',
    actionUrl: 'https://testnet.nearblocks.io',
    tip: 'Check NearBlocks to see your transaction on the explorer. It\'s real.',
    color: 'text-purple-400 bg-purple-500/10',
  },
  {
    step: 5,
    icon: CheckCircle2,
    title: 'Interact With a Contract',
    description: 'Call a function on an existing smart contract. The Sanctum provides a guided sandbox where you can interact with real contracts and see the results live.',
    action: 'Try in Sanctum',
    actionUrl: '/sanctum',
    tip: 'The Sanctum AI explains what each contract function does as you interact.',
    color: 'text-near-green bg-near-green/10',
  },
];

export function WalletSetup() {
  return (
    <ScrollReveal>
      <div id="wallet-setup">
        <SectionHeader title="Wallet Setup & First Transaction" badge="LESSON 1" />
        <p className="text-text-secondary mb-4 max-w-2xl">
          Before you can build anything, you need a wallet. This 15-minute guide takes you from
          zero to your first on-chain transaction.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-near-green/10 border border-near-green/20 mb-8">
          <span className="text-xs font-mono text-near-green">⏱ ~15 minutes</span>
          <span className="text-xs text-text-muted">•</span>
          <span className="text-xs font-mono text-near-green">No coding required</span>
        </div>

        <div className="space-y-4">
          {SETUP_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} variant="glass" padding="lg" className="relative overflow-hidden">
                {/* Step indicator */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-near-green/40 to-transparent" />

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Step number + icon */}
                  <div className="flex items-start gap-3 sm:w-16 shrink-0">
                    <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold text-near-green bg-near-green/10 px-2 py-0.5 rounded-full">
                        STEP {step.step}
                      </span>
                      <h4 className="font-semibold text-text-primary">{step.title}</h4>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-3">{step.description}</p>

                    {/* Tip box */}
                    <div className={`flex items-start gap-2 p-3 rounded-lg ${step.warning ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-surface-hover'}`}>
                      {step.warning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <span className="text-xs shrink-0 mt-0.5">💡</span>
                      )}
                      <p className="text-xs text-text-muted leading-relaxed">{step.tip}</p>
                    </div>

                    {/* Action button */}
                    {step.action && step.actionUrl && (
                      <div className="mt-3">
                        {step.actionUrl.startsWith('http') ? (
                          <a
                            href={step.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-near-green hover:text-near-green/80 transition-colors"
                          >
                            {step.action} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            href={step.actionUrl}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-near-green hover:text-near-green/80 transition-colors"
                          >
                            {step.action} →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}
