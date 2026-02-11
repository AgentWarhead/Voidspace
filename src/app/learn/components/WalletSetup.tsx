import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { Card } from '@/components/ui/Card';


export function WalletSetup() {
  return (
    <section id="wallet-setup" className="py-12">
      <SectionHeader title="Get Started: Your First Wallet" badge="STEP BY STEP" />
      
      <p className="text-text-secondary text-base leading-relaxed mt-4 mb-8">
        Before you can build or even explore NEAR, you need a wallet. This takes about 2 minutes.
      </p>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-near-green/50 via-near-green/30 to-near-green/10" />

        <div className="space-y-6">
          {/* Step 1: Choose a Wallet */}
          <div className="relative flex gap-6">
            {/* Numbered circle */}
            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-near-green flex items-center justify-center text-black font-bold text-sm">
              1
            </div>
            
            <Card variant="glass" padding="lg" className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-3">Choose a Wallet</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                We recommend MyNearWallet (web) or Meteor Wallet (browser extension) for beginners. 
                Both support human-readable names like yourname.near.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <Link 
                  href="https://mynearwallet.com" 
                  target="_blank"
                  className="group relative bg-surface/80 border border-border hover:border-near-green/40 rounded-lg p-4 transition-all hover:translate-y-[-2px]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl mb-2">🌐</div>
                      <div className="font-semibold text-text-primary">MyNearWallet</div>
                      <div className="text-xs text-text-muted mt-1">Web</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors" />
                  </div>
                </Link>

                <Link 
                  href="https://meteorwallet.app" 
                  target="_blank"
                  className="group relative bg-surface/80 border border-border hover:border-near-green/40 rounded-lg p-4 transition-all hover:translate-y-[-2px]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl mb-2">🧩</div>
                      <div className="font-semibold text-text-primary">Meteor Wallet</div>
                      <div className="text-xs text-text-muted mt-1">Extension</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-near-green transition-colors" />
                  </div>
                </Link>
              </div>
            </Card>
          </div>

          {/* Step 2: Create Your Account */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-near-green flex items-center justify-center text-black font-bold text-sm">
              2
            </div>
            
            <Card variant="glass" padding="lg" className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-3">Create Your Account</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Pick a human-readable name (like alice.near). No long hex addresses to memorize. 
                NEAR accounts work like usernames.
              </p>
              
              <div className="bg-near-green/10 border border-near-green/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-text-primary font-medium">
                  💡 Your .near name is your identity across the entire ecosystem
                </p>
              </div>
            </Card>
          </div>

          {/* Step 3: Get Testnet NEAR */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-near-green flex items-center justify-center text-black font-bold text-sm">
              3
            </div>
            
            <Card variant="glass" padding="lg" className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-3">Get Testnet NEAR</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Before spending real money, practice on testnet. Visit the NEAR Faucet to get free testnet tokens.
              </p>
              
              <Link 
                href="https://near-faucet.io" 
                target="_blank"
                className="inline-flex items-center gap-2 text-near-green hover:text-near-green/80 transition-colors mb-4"
              >
                <span className="font-medium">near-faucet.io</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <div className="bg-black/40 border border-border rounded-lg p-4 mt-4">
                <pre className="text-xs font-mono text-text-secondary overflow-x-auto">
                  <code>{`near account create-account fund-later use-auto-generation save-to-folder ~/.near-credentials/testnet/`}</code>
                </pre>
              </div>
            </Card>
          </div>

          {/* Step 4: Make Your First Transaction */}
          <div className="relative flex gap-6">
            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-near-green flex items-center justify-center text-black font-bold text-sm">
              4
            </div>
            
            <Card variant="glass" padding="lg" className="flex-1">
              <h3 className="text-xl font-semibold text-text-primary mb-3">Make Your First Transaction</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Send 1 NEAR to a friend or interact with a contract. That&apos;s it — you&apos;re on-chain!
              </p>
              
              <div className="bg-gradient-to-r from-near-green/20 to-accent-cyan/20 border border-near-green/30 rounded-lg p-6 mt-4 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-lg font-semibold text-text-primary">
                  Congratulations — you&apos;re a NEAR user!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
