# Voidspace

**The intelligence layer for NEAR Protocol.**

Voidspace is a unified platform for ecosystem intelligence, AI-powered smart contract development, and structured blockchain education — built exclusively for NEAR.

**Live:** [voidspace.io](https://voidspace.io)

---

## Features

### 🔭 Intelligence Suite

| Tool | What it does |
|------|-------------|
| **Observatory** | Live ecosystem dashboard — browse 20+ categories of NEAR projects with real-time DexScreener market data, opportunity scoring, and AI-generated ecosystem gap analysis |
| **Void Bubbles** | 3D interactive market visualization — token price, volume, and liquidity rendered as an animated bubble field with whale alerts, gainers/losers tracking, and fullscreen mode |
| **Void Lens** | Deep wallet analysis — 6-axis reputation scoring, DeFi position tracking, portfolio valuation (live USD via DexScreener), security profiling, transaction history, and behavioral radar |
| **Constellation Map** | Transaction flow graph (D3 force-directed) — map relationships between wallets, reveal clusters, trace fund flows with direction arrows, time/value filters, minimap, search, and screenshot export |

### 🔍 Discovery & Research

| Feature | What it does |
|---------|-------------|
| **Opportunities (Voids)** | AI-detected ecosystem gaps — Claude analyzes real project data + market signals to surface building opportunities, scored by demand, competition, and difficulty |
| **Void Brief** | AI-generated build plans for any opportunity — architecture, tech stack, go-to-market, competitive analysis, all powered by Claude |
| **Project Pages** | Deep-dive profiles for 140+ NEAR projects — live token market cards (DexScreener), GitHub stats, category context, related opportunities |
| **Search** | Full-text search across projects, opportunities, categories, and learning modules |
| **Categories** | Browse the NEAR ecosystem by category with aggregate DeFi stats and token data |

### ⚡ Sanctum (AI Development Environment)

The first AI-powered IDE built specifically for NEAR and Rust smart contracts.

- **Natural language → Rust code.** Describe what you want, watch it generate production-ready smart contracts in real time.
- **8 specialist AI personas:** Shade (Lead Architect), Oxide (Rust Grandmaster), Warden (Security Overlord), Phantom (Gas & Performance), Nexus (Cross-Chain), Prism (Frontend & Integration), Crucible (Testing & QA), Ledger (DeFi & Tokenomics).
- **3 builder modes:** Learn (guided education) · Build (project scaffold) · Expert (full control, minimal hand-holding).
- **Scratch mode:** Start from pre-built contract templates (token, NFT, DAO, marketplace, etc.) and customize with AI.
- **Webapp Builder:** Auto-generates a frontend dApp from your smart contract with method calls, wallet integration, and deploy instructions.
- **Post-contract pipeline:** Downloadable ZIP project scaffold, deploy instructions, simulation sandbox, persistent project management.
- **Roast Zone:** Security audit your contract ideas with brutal honesty (auto-selects Warden persona).
- **Import & iterate:** Import existing contracts for AI-assisted refactoring and enhancement.
- **Credit-gated:** Powered by Claude Opus 4 with per-request credit billing.

### 📚 Learning Platform

- **71 learning modules** across 4 tracks: Explorer (16) · Builder (27) · Hacker (16) · Founder (12).
- **Quick Start guide** for new developers entering the NEAR ecosystem.
- **7 deep dives:** Rust for Blockchain, Rust Curriculum, NEAR vs Solana, For Solana Developers, Key Technologies, Wallet Setup, Why Rust.
- **Cross-chain SEO content** targeting Solana and Ethereum developers exploring NEAR.
- **Capstone projects** and completion certificates per track.
- **Module completion tracking** with dopamine UX (confetti, progress bars, streak tracking).

### 👤 Profile & Progression

- **Void Command Center** — mission-control-style profile dashboard with sidebar navigation.
- **108 achievements** across exploration, learning, building, and community categories.
- **XP system** with level progression tied to real platform usage.
- **Skill Constellation** — interactive star-map visualization of your learning progress across all 4 tracks.
- **Arsenal section** — saved opportunities, build plans, and Sanctum projects.

### 💰 Monetization

- **4 subscription tiers** via Stripe: Shade (free / $2.50 one-time) · Specter ($25/mo) · Legion ($60/mo) · Leviathan ($200/mo).
- **Credit top-ups** ($5 / $20 / $50 / $100) available to all tiers. Never expire.
- **Customer portal** for self-service subscription management.
- **Webhook-driven** credit allocation and tier enforcement.
- **All intelligence tools free.** Only Sanctum (AI builder) is credit-gated.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript, RSC) |
| Styling | Tailwind CSS, Framer Motion |
| Visualization | D3.js (force graphs, constellation), Three.js (3D bubbles), Recharts |
| Database | Supabase (PostgreSQL, Realtime, Row-Level Security) |
| Auth | NEAR Connector (@hot-labs/near-connect) + WalletConnect |
| AI | Anthropic Claude Opus 4 (Sanctum code gen, Void Brief, opportunity detection) |
| Market Data | DexScreener API (shared service, 60s cache, sequential batch fetching) |
| Chain Data | NearBlocks API (transactions, wallets, rate-limited with retry + cache) |
| Ecosystem Data | NEAR Catalog, DeFiLlama, GitHub API, RSS feeds |
| Payments | Stripe (subscriptions, one-time purchases, webhooks, customer portal) |
| Hosting | Vercel (ISR, edge middleware, serverless functions) |

## Architecture

```
src/
├── app/
│   ├── api/                  # 16 API routes
│   │   ├── auth/             # NEAR wallet signature verification (ed25519)
│   │   ├── sanctum/          # chat, roast, deploy, projects, save, visual
│   │   ├── stripe/           # checkout, webhooks, customer portal
│   │   ├── void-lens/        # Wallet analysis engine
│   │   ├── void-bubbles/     # Market data aggregation
│   │   ├── constellation/    # Transaction graph data
│   │   ├── brief/            # AI build plan generation
│   │   ├── sync/             # Data pipeline (DeFiLlama, NearBlocks, NEAR Catalog)
│   │   ├── dex-token/        # Single token market lookup
│   │   ├── near-price/       # NEAR price ticker
│   │   ├── achievements/     # Achievement tracking
│   │   ├── credits/          # Credit balance & usage
│   │   ├── usage/            # Per-user rate limiting
│   │   ├── saved/            # Saved opportunities
│   │   ├── health/           # System health check
│   │   └── cron/             # Scheduled data sync
│   ├── observatory/          # Ecosystem dashboard
│   ├── void-bubbles/         # 3D market visualization
│   ├── void-lens/            # Wallet analysis tool
│   ├── constellation/        # Transaction flow mapping
│   ├── sanctum/              # AI development environment
│   │   ├── components/       # 50+ components (chat, wizard, code preview, deploy, etc.)
│   │   ├── hooks/            # Session state, persistence, auto-save
│   │   └── lib/              # Personas, tiers, templates
│   ├── learn/                # Learning platform
│   │   ├── explorer/         # Track: Explorer (16 modules)
│   │   ├── builder/          # Track: Builder (27 modules)
│   │   ├── hacker/           # Track: Hacker (16 modules)
│   │   ├── founder/          # Track: Founder (12 modules)
│   │   ├── quick-start/      # New developer onboarding
│   │   ├── certificate/      # Track completion certificates
│   │   ├── rust-for-blockchain/   # Cross-chain deep dive
│   │   ├── solana-vs-near/        # Comparison deep dive
│   │   ├── for-solana-developers/ # Migration guide
│   │   ├── key-technologies/      # NEAR tech overview
│   │   ├── rust-curriculum/       # Rust learning path
│   │   ├── wallet-setup/          # Wallet guide
│   │   └── why-rust/              # Rust advocacy
│   ├── pricing/              # Subscription tiers + Stripe checkout
│   ├── profile/              # Void Command Center + Skill Constellation
│   ├── opportunities/        # AI-detected ecosystem gaps
│   ├── projects/             # Individual project deep-dives
│   ├── categories/           # Category browsing with DeFi stats
│   ├── search/               # Full-text search
│   └── legal/                # Terms, privacy, cookies, disclaimer, acceptable use
├── components/               # 25+ component directories (UI, effects, brand, layout)
├── contexts/                 # Wallet, achievements, saved items, toast notifications
├── hooks/                    # Custom React hooks
├── lib/
│   ├── near/                 # NEAR Connector config, network setup
│   ├── supabase/             # Database clients (browser, server, admin)
│   ├── auth/                 # Signature verification, rate limiting, validation
│   ├── sync/                 # Data pipeline (DeFiLlama, NearBlocks, GitHub, RSS)
│   ├── dexscreener.ts        # Market data service (6 functions, 60s cache)
│   ├── sanctum-tiers.ts      # Subscription tier definitions + Stripe price IDs
│   ├── achievements.ts       # 108 achievement definitions
│   ├── credits.ts            # Credit system (check, deduct, estimate)
│   ├── tiers.ts              # Tier permission checks
│   ├── gap-score.ts          # Opportunity scoring algorithm
│   └── queries.ts            # Shared database queries
└── types/                    # TypeScript definitions
```

**448 source files · ~94,000 lines of TypeScript · Zero templates · Built in 2 weeks**

---

## Security

- **NEAR wallet signature verification** (ed25519 via tweetnacl) on all authenticated endpoints.
- **Per-user rate limiting** on AI endpoints (daily budget system).
- **Global request body size limits** (100KB) via middleware.
- **Sanitized error responses** — no database internals leaked.
- **Row-Level Security** on all Supabase tables.
- **Stripe webhook signature verification** for payment events.

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

- [ ] Cloud WASM compilation (compile and test contracts in-browser)
- [ ] One-click testnet deployment from Sanctum
- [ ] Community layer (share contracts, collaborate on opportunities)
- [ ] DAO integration (governance tooling, treasury analysis)
- [ ] Sanctum marketplace (community contract templates)
- [ ] Mobile app

## License

MIT — see [LICENSE](LICENSE) for details.

---

**Built for the [Nearcon Innovation Sandbox](https://nearcon.org/innovation-sandbox/) by Warhead & Urban Blazer.**
