import Link from 'next/link';
import { Gauge, Lock, Code, Rocket } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GlowCard } from '@/components/effects/GlowCard';

const RUST_BENEFITS = [
  {
    icon: Gauge,
    title: 'Performance',
    description: 'Rust compiles to WebAssembly (WASM) with near-native performance. Your contracts execute faster and cost less gas than interpreted languages.',
  },
  {
    icon: Lock,
    title: 'Memory Safety',
    description: "Rust's ownership model eliminates entire classes of bugs at compile time — no null pointers, no buffer overflows, no data races. Critical for code that handles real money.",
  },
  {
    icon: Code,
    title: 'Great Tooling',
    description: 'Cargo package manager, excellent error messages, built-in testing, and the near-sdk-rs makes NEAR-specific patterns easy. The compiler is your pair programmer.',
  },
];

const RUST_CONCEPTS = [
  {
    title: 'Ownership & Borrowing',
    code: `// Each value has exactly one owner
let wallet = String::from("alice.near");
let borrowed = &wallet;  // Borrow, don't move
// wallet is still valid here`,
    description: "Rust's core innovation. Values have one owner; others can borrow references. This prevents memory bugs without garbage collection.",
  },
  {
    title: 'Structs & Impl',
    code: `#[near(contract_state)]
pub struct TokenVault {
    owner: AccountId,
    balance: Balance,
}

#[near]
impl TokenVault {
    pub fn deposit(&mut self) { ... }
}`,
    description: 'Define data structures with struct, add methods with impl. The #[near] macros handle serialization and contract boilerplate.',
  },
  {
    title: 'Result & Option',
    code: `// No null! Use Option for "maybe" values
fn find_user(id: &str) -> Option<User> {
    users.get(id)  // Returns Some(user) or None
}

// Handle errors explicitly
fn transfer() -> Result<(), Error> {
    // Must handle success AND failure
}`,
    description: 'Rust forces you to handle edge cases. Option for nullable values, Result for operations that can fail. No surprise crashes.',
  },
];

export function RustSection() {
  return (
    <ScrollReveal>
      <SectionHeader title="Rust for Smart Contracts" badge="ESSENTIAL" />
      <Card variant="glass" padding="lg" className="mb-6">
        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">NEAR smart contracts are written in Rust</strong> — a modern systems language that prioritizes safety without sacrificing performance. If you&apos;re new to Rust, don&apos;t worry: it&apos;s designed to catch bugs at compile time, which means fewer surprises when your contract goes live.
          </p>
          <p>
            The <code className="text-near-green bg-near-green/10 px-1.5 py-0.5 rounded text-sm">near-sdk-rs</code> crate provides everything you need: account management, token handling, cross-contract calls, and storage. Combined with the <Link href="/sanctum" className="text-near-green hover:underline">Sanctum</Link>, you can learn Rust interactively while building real contracts.
          </p>
        </div>
      </Card>

      {/* Why Rust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {RUST_BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <GlowCard key={benefit.title} padding="md" className="h-full">
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-amber-500/10 w-fit">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-semibold text-text-primary">{benefit.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
              </div>
            </GlowCard>
          );
        })}
      </div>

      {/* Rust Concepts */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider">Key Concepts</h3>
        {RUST_CONCEPTS.map((concept) => (
          <Card key={concept.title} variant="glass" padding="md">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-1/2">
                <h4 className="font-semibold text-text-primary mb-2">{concept.title}</h4>
                <p className="text-sm text-text-secondary">{concept.description}</p>
              </div>
              <div className="lg:w-1/2">
                <pre className="text-xs bg-void-black/50 border border-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-text-secondary">{concept.code}</code>
                </pre>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sanctum CTA */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-near-green/10 border border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Rocket className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Learn Rust by Building</h4>
              <p className="text-sm text-text-secondary">The Sanctum teaches you Rust interactively as you build real contracts with AI.</p>
            </div>
          </div>
          <Link
            href="/sanctum"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Enter the Sanctum →
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
