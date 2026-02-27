# Product Marketing Context — Voidspace

> ⚠️ **SINGLE SOURCE OF TRUTH** — This is the canonical context file for this project.
> Do NOT create competing docs. Update THIS file.
> Last verified: 2026-02-27



## Product Overview
**One-liner:** The ecosystem intelligence platform for NEAR Protocol — explore, learn, and build with AI-powered tools.

**Product name:** Voidspace
**URL:** voidspace.io
**Product type:** Web app (Next.js + Supabase)
**Business model:** Freemium. All exploration/learning tools free. Sanctum (AI builder) is the only paywall — credit-gated.
**Stage:** Live (exploration + learn track). Sanctum monetization infrastructure built, not yet revenue-generating.

## Target Audience
**Demographics:** Ages 20-40, developers and crypto-curious builders, global (heavy in NEAR ecosystem)
**Psychographics:** Builders who want to ship on NEAR but find the ecosystem fragmented. Want one place to learn, explore data, and build contracts without bouncing between 10 tabs.
**Primary use case:** "I want to build on NEAR but don't know where to start" / "I need to quickly understand what's happening in the NEAR ecosystem"
**Jobs to be done:**
1. Explore NEAR ecosystem data (projects, tokens, metrics) in one place
2. Learn NEAR development from zero to deployed contract (structured 66-module track)
3. Build smart contracts with AI guidance (Sanctum — the revenue engine)

## Personas
- **The Explorer:** Crypto-curious, wants to understand NEAR before committing. Uses Void Lens, Bubbles, Constellation Map.
- **The Learner:** Wants to go from zero to NEAR developer. Uses the 66-module Learn track across 4 paths (Explorer/Builder/Hacker/Founder).
- **The Builder:** Already knows some Rust/JS, wants AI help writing and deploying contracts. Sanctum power user. Pays for credits.
- **The Founder:** Building a project on NEAR, needs market intelligence + contract help. Highest LTV.

## Core Products
- **Void Lens** — Real-time ecosystem explorer. FREE (no credit gate).
- **Void Bubbles** — Visual token/project map. FREE.
- **Constellation Map** — Relationship graph of NEAR projects. FREE.
- **Learn Track** — 66 modules across 4 tracks (Explorer/Builder/Hacker/Founder), 9 routes. FREE.
- **Sanctum** — AI-powered smart contract builder. 8 expert personas. Credit-gated (THE REVENUE ENGINE).

## Sanctum — The Revenue Engine
- **8 Council Members:** Shade 🐧 (lead), Oxide 🦀, Warden 🛡️, Phantom ⚡, Nexus 🌉, Prism 🎭, Crucible 🧪, Ledger 💰
- **2 Modes:** Learn (Professor 🎓 — calibration, theory-first) and Void (Vending Machine 🌑 — full contract on first message)
- **Tiers:** Shade ($0 + $2.50 one-time) / Specter ($25/mo) / Legion ($60/mo) / Leviathan ($200/mo)
- **Top-ups:** $5/$20/$50/$100 packs, never expire
- **Margins:** 3x markup on Opus API, ~61-67% profit per tier
- **Auth:** NEAR wallet (WalletConnect) for identity, Stripe for payments
- **Paywall:** LIVE — returns 402 on insufficient credits

## Problems & Pain Points
- NEAR ecosystem data is scattered across 20+ sites — no single source of truth
- Learning NEAR development is fragmented (docs, tutorials, Discord — no structured path)
- Building smart contracts requires deep Rust knowledge — AI can bridge the gap
- No crypto-specific vibe-coding platform exists (ChatGPT doesn't know NEAR specifics)

## Competitive Landscape
- **Direct competitors (AI builder):** None in crypto vibe-coding. We're first.
- **Indirect (ecosystem tools):** NEAR Explorer, Pikespeak, NEARBlocks (data only, no AI, no learning)
- **Indirect (AI coding):** ChatGPT, Claude, Cursor (general purpose — don't know NEAR specifics or have ecosystem data)
- **Indirect (learning):** NEAR docs, Buildspace (general), Alchemy University (Ethereum-focused)

## Differentiation
- Only platform combining ecosystem intelligence + structured learning + AI contract building
- Sanctum experts know NEAR-specific patterns (NEP-141, LookupMap, ed25519 auth)
- All ecosystem data verifiable (critical — Nearcon judges will review)
- Learn track is the most comprehensive NEAR education resource (66 modules)

## Objections
1. "Why not just use ChatGPT?" → ChatGPT hallucinates NEAR code. Sanctum experts are trained on NEAR-specific patterns, standards, and best practices. They produce deployable contracts, not guesses.
2. "Is NEAR dead?" → 850+ active projects, Nearcon, active development. Voidspace surfaces this data live.
3. "Why pay when docs are free?" → Docs tell you what exists. Sanctum builds it for you. Time-to-deploy goes from weeks to minutes.

## Customer Language
**Use:** build, ship, deploy, ecosystem, protocol, smart contract, vibe-coding, credits, council
**Avoid:** blockchain (use "protocol"), crypto bro, moon, WAGMI, degen (we're builder-focused, not speculation-focused)
**Tone:** Technical but accessible. Dark, space-themed. Confident. Builder energy.

## Brand Voice
- **Tone:** Dark, technical, builder-focused — like mission control for NEAR development
- **Visual:** Space theme, deep blacks, neon accents, constellation imagery
- **Personality:** Knowledgeable, slightly mysterious, empowering
- **Key tension:** "The ecosystem is vast. Voidspace is your map."

## Proof Points
- 66 learning modules (most comprehensive NEAR education)
- 850+ indexed NEAR projects
- 8 specialized AI experts (Sanctum Council)
- Real-time ecosystem data (DexScreener integration)
- All data traceable to public sources (Nearcon requirement)

## Goals
- **Primary:** Drive Sanctum credit purchases (revenue)
- **Secondary:** Become the default NEAR ecosystem portal
- **Key conversion:** Explore free tools → try Sanctum → hit credit wall → purchase tier/top-up
- **North star metric:** Monthly Sanctum revenue (MRR)
- **GA4:** G-T0WSNESD0W

## Key URLs
- Production: https://voidspace.io
- Supabase: ptlakxymdbdgxmfinyzh.supabase.co
- Repo: /home/ubuntu/.openclaw/workspace/projects/Voidspace/ (capital V)
