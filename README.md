# Voidspace

**AI-powered gap scanner for the NEAR Protocol ecosystem.**

Voidspace analyzes the NEAR ecosystem to surface underserved categories and generate actionable project briefs using AI. It helps builders find where to build next by quantifying opportunity gaps across DeFi, infrastructure, social, gaming, and more.

**Live:** [voidspace-nine.vercel.app](https://voidspace-nine.vercel.app)

---

## What It Does

- **Ecosystem Dashboard** — Real-time overview of NEAR ecosystem health with category saturation charts, TVL distribution, and trending gaps.
- **Opportunity Discovery** — Browse scored opportunities with filters by category, difficulty, and gap score. Higher scores indicate greater unmet demand.
- **AI Project Briefs** — Generate detailed project briefs for any opportunity using Claude. Each brief includes problem statement, technical requirements, NEAR tech stack recommendations, competitive analysis, and monetization strategies.
- **NEAR Wallet Auth** — Connect with MyNearWallet, Meteor Wallet, or HERE Wallet. No passwords — authenticate directly with your NEAR account.
- **Save & Track** — Bookmark opportunities, track your research progress, and export briefs as Markdown or JSON.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS, Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | NEAR Wallet Selector |
| AI | Claude Sonnet 4 (via Supabase Edge Functions) |
| Data Sources | DeFiLlama, NEAR Catalog, NearBlocks, GitHub API |
| Hosting | Vercel |

## Architecture

```
src/
├── app/                    # Next.js pages and API routes
│   ├── api/                # REST endpoints (auth, brief, saved, sync, usage)
│   ├── categories/         # Category browsing pages
│   ├── opportunities/      # Opportunity listing and detail pages
│   └── profile/            # User profile page
├── components/
│   ├── brief/              # AI brief generation and display
│   ├── charts/             # Recharts visualizations
│   ├── dashboard/          # Dashboard widgets
│   ├── effects/            # Animations (GlowCard, PageTransition)
│   ├── layout/             # Header, Footer
│   ├── opportunities/      # Cards, filters, save button
│   ├── profile/            # Profile content
│   ├── tier/               # Tier gating
│   ├── ui/                 # Reusable UI primitives
│   └── wallet/             # Wallet connection button
├── contexts/               # WalletContext, SavedOpportunities, Toast
├── hooks/                  # useWallet, useUser, useSavedOpportunities
├── lib/
│   ├── near/               # Wallet selector setup, network config
│   ├── supabase/           # Client, server, and admin clients
│   ├── sync/               # Data pipeline (DeFiLlama, ecosystem, opportunities)
│   ├── gap-score.ts        # Gap score calculation algorithm
│   ├── queries.ts          # Supabase data fetching
│   └── tiers.ts            # Subscription tier definitions
└── types/                  # TypeScript type definitions

supabase/
├── functions/              # Edge Functions (data sync, brief generation)
└── migrations/             # Database schema
```

## Tier System

| Tier | Price | Briefs/Month | Saved | Key Features |
|------|-------|-------------|-------|-------------|
| Shade | Free | 0 | 5 | Browse, preview |
| Specter | $14.99/mo | 10 | Unlimited | AI briefs, export, history |
| Legion | $49.99/mo | 50 | Unlimited | Team access, API |
| Leviathan | Custom | Unlimited | Unlimited | Enterprise features |

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project with the schema from `supabase/migrations/`
- NEAR Wallet Selector compatible wallets

### Setup

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Fill in your Supabase URL, keys, and NEAR network

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_NEAR_NETWORK` | NEAR network (`testnet` or `mainnet`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `SYNC_API_KEY` | API key for triggering data sync |

## Data Pipeline

Voidspace aggregates data from multiple sources:

1. **DeFiLlama** — TVL data for NEAR Protocol projects
2. **NEAR Catalog** — Ecosystem project directory
3. **GitHub API** — Repository activity and health metrics
4. **NearBlocks** — On-chain transaction data

Data is synced via Supabase Edge Functions and scored using a gap analysis algorithm that factors in category saturation, project maturity, TVL concentration, and developer activity.

## Competition

Built for the **NEARCON 2026 Innovation Sandbox** hackathon.

## License

MIT
