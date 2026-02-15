# Voidspace

**The intelligence layer for NEAR Protocol.**

Voidspace is a unified platform for ecosystem intelligence, AI-powered smart contract development, and structured blockchain education — built exclusively for NEAR.

**Live:** [voidspace.io](https://voidspace.io)

---

## Features

### 🔭 Intelligence Suite

| Tool | What it does |
|------|-------------|
| **Observatory** | Live ecosystem dashboard — track NEAR projects across 20+ categories with real-time market data and opportunity scoring |
| **Void Bubbles** | 3D interactive market visualization — token movements, volume, and liquidity rendered as an animated bubble field |
| **Void Lens** | Deep wallet analysis — reputation scoring, DeFi tracking, portfolio valuation, security profiling, 6-axis behavioral radar |
| **Constellation Map** | Transaction flow graph — map relationships between wallets, reveal clusters and fund flows across the network |

### ⚡ Sanctum (AI Development Environment)

The first AI-powered IDE built specifically for NEAR and Rust smart contracts.

- **Natural language → Rust code.** Describe what you want, watch it generate production-ready smart contracts in real time.
- **8 specialist AI personas:** Lead Architect, Rust Grandmaster, Security Overlord, Gas & Performance, Cross-Chain, Frontend & Integration, Testing & QA, DeFi & Tokenomics.
- **3 builder modes:** Learn (guided) · Build (scaffold) · Expert (full control).
- **Post-contract pipeline:** Downloadable project scaffold, deploy instructions, simulation sandbox.
- **Roast Zone:** Security audit your contract ideas with brutal honesty.

### 📚 Learning Platform

- **66 learning modules** across 4 tracks: Explorer (16) · Builder (22) · Hacker (16) · Founder (12).
- **Deep dives:** Rust for Blockchain, NEAR vs Solana, Key Technologies, Wallet Setup, Why Rust.
- **Cross-chain content** targeting Solana and Ethereum developers exploring NEAR.
- **XP system** with 107 achievements, skill constellation visualization, and capstone projects.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS, Framer Motion |
| Visualization | D3.js (force graphs), Three.js (3D bubbles) |
| Database | Supabase (PostgreSQL) |
| Auth | NEAR Connector (@hot-labs/near-connect) |
| AI | Claude Opus 4 (Sanctum code generation) |
| Market Data | DexScreener API (real-time, cached) |
| Chain Data | NearBlocks API (transactions, wallets) |
| Ecosystem Data | NEAR Catalog, DeFiLlama, GitHub API |
| Payments | Stripe (subscriptions + credit top-ups) |
| Hosting | Vercel (edge functions, ISR) |

## Architecture

```
src/
├── app/
│   ├── api/               # 16 API routes (auth, sanctum, stripe, void-lens, etc.)
│   ├── observatory/       # Ecosystem dashboard
│   ├── void-bubbles/      # 3D market visualization
│   ├── void-lens/         # Wallet analysis tool
│   ├── constellation/     # Transaction flow mapping
│   ├── sanctum/           # AI development environment
│   │   ├── components/    # Chat, ModeSelector, BuilderProgress, etc.
│   │   ├── hooks/         # Session state, persistence
│   │   └── lib/           # Personas, tiers, XP system
│   ├── learn/             # 66 learning modules across 4 tracks
│   │   ├── explorer/      # Track: Explorer (16 modules)
│   │   ├── builder/       # Track: Builder (22 modules)
│   │   ├── hacker/        # Track: Hacker (16 modules)
│   │   └── founder/       # Track: Founder (12 modules)
│   ├── pricing/           # Subscription tiers
│   ├── profile/           # User profile, achievements, skills
│   ├── opportunities/     # Ecosystem opportunity discovery
│   ├── categories/        # Category browsing
│   └── legal/             # Terms, privacy, cookies, disclaimer
├── components/            # Shared UI components
├── contexts/              # Wallet, saved items, toast notifications
├── hooks/                 # Custom React hooks
├── lib/
│   ├── near/              # Wallet selector, network config
│   ├── supabase/          # Database clients
│   ├── sync/              # Data pipeline (DeFiLlama, NearBlocks, etc.)
│   ├── dexscreener.ts     # Market data service (6 functions, 60s cache)
│   ├── sanctum-tiers.ts   # Subscription tier definitions
│   └── gap-score.ts       # Opportunity scoring algorithm
└── types/                 # TypeScript definitions
```

**448 source files · ~94,000 lines of TypeScript · Zero templates**

## Subscription Tiers

| Tier | Price | What you get |
|------|-------|-------------|
| **Shade** | Free ($2.50 one-time) | Browse intelligence tools, learning modules, limited Sanctum |
| **Specter** | $25/mo | Full Sanctum access, all personas, export |
| **Legion** | $60/mo | Higher limits, priority, advanced features |
| **Leviathan** | $200/mo | Unlimited everything, enterprise support |

Credit top-ups ($5–$100) available for all tiers. Never expire.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project (for database)
- NEAR wallet (for authentication)

### Development

```bash
git clone https://github.com/AgentWarhead/Voidspace.git
cd Voidspace
npm install
cp .env.example .env.local  # Configure environment variables
npm run dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
ANTHROPIC_API_KEY=your_anthropic_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
NEARBLOCKS_API_KEY=your_nearblocks_key
```

## Roadmap

- [ ] Cloud WASM compilation (compile contracts in-browser)
- [ ] One-click testnet deployment from Sanctum
- [ ] Community layer (share contracts, collaborate on opportunities)
- [ ] DAO integration (governance, treasury analysis)
- [ ] Sanctum marketplace (community contract templates)
- [ ] Mobile app

## License

MIT — see [LICENSE](LICENSE) for details.

---

**Built for the [Nearcon Innovation Sandbox](https://nearcon.org/innovation-sandbox/) by Warhead & Urban Blazer.**
