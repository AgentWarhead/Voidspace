import Link from 'next/link';
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Globe, 
  Star, 
  DollarSign, 
  Target,
  Sparkles
} from 'lucide-react';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';


export function WhyRust() {
  return (
    <div className="w-full space-y-8">
      <SectionHeader title="Why Rust?" badge="THE LANGUAGE OF THE FUTURE" />

      {/* Compelling intro */}
      <p className="text-lg text-text-secondary leading-relaxed max-w-4xl">
        Rust isn&apos;t just NEAR&apos;s smart contract language — it&apos;s the <span className="text-near-green font-semibold">most loved programming language for 8 years running</span>, the backbone of companies like Mozilla, Cloudflare, Discord, and Figma, and the highest-paying language in developer surveys. Learning Rust doesn&apos;t just let you build on NEAR — it makes you{' '}
        <span className="text-near-green font-semibold">one of the most in-demand developers on the planet</span>.
      </p>

      {/* Rust vs Solidity comparison */}
      <GlowCard padding="lg" className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Solidity (Ethereum) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Solidity</h3>
                <p className="text-xs text-text-muted">Ethereum</p>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <X className="w-4 h-4 mt-0.5 text-red-500/70 flex-shrink-0" />
                <span><span className="text-red-500/90">Runtime errors</span> — bugs slip into production</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <AlertTriangle className="w-4 h-4 mt-0.5 text-red-500/70 flex-shrink-0" />
                <span><span className="text-red-500/90">Reentrancy vulnerabilities</span> — infamous security pitfalls</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <Shield className="w-4 h-4 mt-0.5 text-red-500/70 flex-shrink-0" />
                <span><span className="text-red-500/90">Limited to EVM</span> — locked into Ethereum&apos;s ecosystem</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <Zap className="w-4 h-4 mt-0.5 text-red-500/70 flex-shrink-0" />
                <span><span className="text-red-500/90">Garbage collected</span> — unpredictable performance</span>
              </li>
            </ul>
          </div>

          {/* Rust (NEAR) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-near-green/10 border border-near-green/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-near-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Rust</h3>
                <p className="text-xs text-text-muted">NEAR Protocol</p>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <CheckCircle className="w-4 h-4 mt-0.5 text-near-green flex-shrink-0" />
                <span><span className="text-near-green">Memory safe at compile time</span> — bugs caught before deployment</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <Shield className="w-4 h-4 mt-0.5 text-near-green flex-shrink-0" />
                <span><span className="text-near-green">Eliminates entire bug categories</span> — no null pointers, no data races</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <Globe className="w-4 h-4 mt-0.5 text-near-green flex-shrink-0" />
                <span><span className="text-near-green">WASM everywhere</span> — web, mobile, IoT, blockchain</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-secondary">
                <Zap className="w-4 h-4 mt-0.5 text-near-green flex-shrink-0" />
                <span><span className="text-near-green">Zero-cost abstractions</span> — blazing fast, predictable performance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fair comparison note */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-text-muted text-center italic">
            Both are valid tools. But here&apos;s what Rust gives you: safety, performance, and portability that extends far beyond blockchain.
          </p>
        </div>
      </GlowCard>

      {/* 3 stat cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card variant="glass" padding="lg" className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-near-green/10 border border-near-green/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-near-green" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-near-green">#1 Most Loved Language</h3>
            <p className="text-sm text-text-muted mt-2">
              Stack Overflow Developer Survey, 8 years running
            </p>
          </div>
        </Card>

        <Card variant="glass" padding="lg" className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-near-green/10 border border-near-green/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-near-green" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-near-green">$120K+ Median Salary</h3>
            <p className="text-sm text-text-muted mt-2">
              Rust developers command premium compensation globally
            </p>
          </div>
        </Card>

        <Card variant="glass" padding="lg" className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-near-green/10 border border-near-green/20 flex items-center justify-center">
            <Target className="w-6 h-6 text-near-green" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-near-green">10x Safer</h3>
            <p className="text-sm text-text-muted mt-2">
              Compile-time guarantees eliminate entire categories of bugs
            </p>
          </div>
        </Card>
      </div>

      {/* AI Makes Rust Easy callout */}
      <GlowCard padding="lg" className="border-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-near-green/20 to-accent-cyan/20 border border-near-green/30 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-near-green" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-text-primary">
              AI Makes Rust Easy
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Worried Rust is hard? <span className="text-near-green font-semibold">The Sanctum</span> pairs you with Claude AI that explains every concept, catches your mistakes, and guides you step-by-step. You&apos;re never coding alone.
            </p>
          </div>
          <Link href="/sanctum">
            <Button variant="primary" size="lg" className="whitespace-nowrap">
              Enter the Sanctum →
            </Button>
          </Link>
        </div>
      </GlowCard>
    </div>
  );
}
