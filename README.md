<div align="center">

# Voidspace

**The intelligence layer for NEAR Protocol.**

### 🎬 Watch the Demo

<a href="https://github.com/AgentWarhead/Voidspace/releases/download/v1.0-demo/Voidspace.Launch.Video.mp4">
  <img src="public/demo-thumbnail.png" alt="Watch Voidspace Demo" width="720"/>
</a>

<sub>Click to watch the 90-second demo video</sub>

</div>

Voidspace is a unified platform for ecosystem intelligence, AI-powered smart contract development, and structured blockchain education — built exclusively for NEAR.

**Live:** [voidspace.io](https://voidspace.io)

---

## Features

### 🔭 Intelligence Suite

| Tool | What it does |
|------|-------------|
| **Observatory** | Live ecosystem dashboard — browse 20+ categories of NEAR projects with real-time market data, opportunity scoring, and AI-generated ecosystem gap analysis |
| **Void Bubbles** | 3D interactive market visualization — token price, volume, and liquidity rendered as an animated bubble field with whale alerts, gainers/losers tracking, and fullscreen mode |
| **Void Lens** | Deep wallet analysis — 6-axis reputation scoring, DeFi position tracking, portfolio valuation with live USD pricing, security profiling, transaction history, and behavioral radar |
| **Constellation Map** | Transaction flow graph — map relationships between wallets, reveal clusters, trace fund flows with direction arrows, time/value filters, minimap, search, and screenshot export |

### 🔍 Discovery & Research

| Feature | What it does |
|---------|-------------|
| **Opportunities (Voids)** | AI-detected ecosystem gaps — real project data + market signals analyzed to surface building opportunities, scored by demand, competition, and difficulty |
| **Void Brief** | AI-generated build plans for any opportunity — architecture, tech stack, go-to-market, and competitive analysis |
| **Project Pages** | Deep-dive profiles for 140+ NEAR projects — live token market data, GitHub stats, category context, related opportunities |
| **Search** | Full-text search across projects, opportunities, categories, and learning modules |
| **Categories** | Browse the NEAR ecosystem by category with aggregate DeFi stats and token data |

### ⚡ Sanctum (AI Development Environment)

The first AI-powered IDE built specifically for NEAR and Rust smart contracts.

- **Natural language → Rust code.** Describe what you want, watch it generate production-ready smart contracts in real time.
- **8 specialist AI personas:** Shade (Lead Architect), Oxide (Rust Grandmaster), Warden (Security Overlord), Phantom (Gas & Performance), Nexus (Cross-Chain), Prism (Frontend & Integration), Crucible (Testing & QA), Ledger (DeFi & Tokenomics).
- **3 builder modes:** Learn (guided education) · Build (project scaffold) · Expert (full control).
- **Scratch mode:** Start from pre-built contract templates (token, NFT, DAO, marketplace, etc.) and customize with AI.
- **Webapp Builder:** Auto-generates a frontend dApp from your smart contract with method calls, wallet integration, and deploy instructions.
- **Post-contract pipeline:** Downloadable ZIP project scaffold, deploy instructions, simulation sandbox, persistent project management.
- **Roast Zone:** Security audit your contract ideas with brutal honesty.
- **Import & iterate:** Import existing contracts for AI-assisted refactoring and enhancement.
- **Powered by Claude Opus 4** with credit-based usage.

### 📚 Learning Platform

- **66 learning modules** across 4 tracks: Explorer (16) · Builder (22) · Hacker (16) · Founder (12).
- **Quick Start guide** for new developers entering the NEAR ecosystem.
- **7 deep dives:** Rust for Blockchain, Rust Curriculum, NEAR vs Solana, For Solana Developers, Key Technologies, Wallet Setup, Why Rust.
- **Cross-chain content** targeting Solana and Ethereum developers exploring NEAR.
- **Capstone projects** and completion certificates per track.
- **Module completion tracking** with progress visualization and streak tracking.

### 👤 Profile & Progression

- **Void Command Center** — mission-control-style profile dashboard.
- **108 achievements** across exploration, learning, building, and community categories.
- **XP system** with level progression tied to real platform usage.
- **Skill Constellation** — interactive star-map visualization of your learning progress across all 4 tracks.
- **Arsenal** — saved opportunities, build plans, and Sanctum projects.

### 💰 Subscription Tiers

| Tier | Price | What you get |
|------|-------|-------------|
| **Shade** | Free ($2.50 one-time) | All intelligence tools, learning modules, limited Sanctum |
| **Specter** | $25/mo | Full Sanctum access, all personas, export |
| **Legion** | $60/mo | Higher limits, priority, advanced features |
| **Leviathan** | $200/mo | Unlimited everything, enterprise support |

Credit top-ups ($5–$100) available to all tiers. Never expire.
All intelligence tools are free — only Sanctum (AI builder) is credit-gated.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS, Framer Motion |
| Visualization | D3.js, Three.js, Recharts |
| Database | Supabase (PostgreSQL) |
| Auth | NEAR Connector (@hot-labs/near-connect) |
| AI | Anthropic Claude Opus 4 |
| Market Data | DexScreener API |
| Chain Data | NearBlocks API |
| Ecosystem Data | NEAR Catalog, DeFiLlama, GitHub API |
| Payments | Stripe |
| Hosting | Vercel |

## Architecture

```
src/
├── app/
│   ├── api/                  # API routes (auth, AI, payments, data sync)
│   ├── observatory/          # Ecosystem dashboard
│   ├── void-bubbles/         # 3D market visualization
│   ├── void-lens/            # Wallet analysis tool
│   ├── constellation/        # Transaction flow mapping
│   ├── sanctum/              # AI development environment (50+ components)
│   ├── learn/                # 66 learning modules across 4 tracks + 7 deep dives
│   ├── pricing/              # Subscription tiers
│   ├── profile/              # Void Command Center + Skill Constellation
│   ├── opportunities/        # AI-detected ecosystem gaps
│   ├── projects/             # Individual project profiles
│   ├── categories/           # Category browsing
│   ├── search/               # Full-text search
│   └── legal/                # Terms, privacy, cookies, disclaimer
├── components/               # Shared UI components, effects, brand assets
├── contexts/                 # App-wide state (wallet, achievements, etc.)
├── hooks/                    # Custom React hooks
├── lib/                      # Business logic, data services, utilities
└── types/                    # TypeScript definitions
```

**448 source files · ~94,000 lines of TypeScript · Zero templates · Built in 2 weeks**

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- NEAR wallet

### Development

```bash
git clone https://github.com/AgentWarhead/Voidspace.git
cd Voidspace
npm install
cp .env.example .env.local  # Configure environment variables
npm run dev
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
