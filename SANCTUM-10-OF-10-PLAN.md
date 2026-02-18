# SANCTUM 10/10 PLAN
## From "Impressive Demo" → "Can't Live Without It"

**Date:** Feb 18, 2026  
**Author:** Shade 🐧  
**Status:** PROPOSED — Awaiting boss approval  
**Estimated Total:** ~60-80 hours across 6 phases  

---

## Current State Audit

**What we HAVE (already impressive):**
- 🧠 8 expert personas (Shade, Oxide, Warden, Phantom, Nexus, Prism, Crucible, Ledger)
- 🛠️ 3 modes (Learn / Build / Expert)
- 📝 Real-time code preview with syntax highlighting
- ⚡ One-click actions: Explain / Tests / Optimize / Audit
- 🚀 Deploy button + deploy instructions
- 🌐 Webapp builder (full-stack scaffold from contract)
- 📦 Import contract (paste or fetch from testnet)
- 🎮 XP + achievements system (DB tables exist)
- 💾 Conversations API (DB tables + routes exist)
- 🎯 Projects API (route exists)
- 💰 Credit system + paywall + Stripe integration
- 🖼️ 56 components, ~15,000 lines of UI code

**What we HAVE but isn't fully wired:**
- `ProjectManager.tsx` — exists but project CRUD is shallow
- `ScratchTemplates.tsx` — template data structure exists, not surfaced prominently
- `SimulationSandbox.tsx` — 6 TODOs/stubs
- `ImportContract.tsx` — UI exists, Solidity conversion not implemented
- `ContractComparison.tsx` — exists but placeholder-ish
- `SessionSummary.tsx` — exists, unclear if active
- Conversations DB tables exist but cloud save might not be fully working for all tiers

**What's MISSING (the 10/10 gaps):**

| Gap | Impact | Who It Hurts Most |
|-----|--------|-------------------|
| First-time onboarding flow | Massive bounce reduction | Everyone |
| Template gallery (prominent, not hidden) | Cold start killer | Beginners + Migrators |
| Project persistence (reliable save/load) | Retention killer | Everyone |
| Guided deploy flow (not just a button) | Conversion to on-chain users | Beginners + Migrators |
| Solidity → NEAR converter | Captures entire EVM migration wave | Migrators |
| Test execution (not just generation) | Completes the build cycle | Migrators + Experts |
| Credit burn visibility / pacing | Reduces subscription anxiety | Everyone |
| Multi-file project structure | Real-world contract support | Experts |
| Conversation search | Basic productivity feature | Experts |
| Plain English code overlay | Accessibility for non-Rust devs | Beginners |

---

## Phase 1: First Impressions (The "Aha" Phase)
**Goal:** Zero-to-building in under 60 seconds. Kill the bounce.  
**Effort:** ~8-12 hours  
**Priority:** 🔥 CRITICAL — do this first, it's the funnel  

### 1A. Onboarding Wizard (First Visit Only)
- Detect first visit (localStorage flag or `sanctum_conversations` count = 0)
- 3-step wizard (NOT a wall of text):
  1. **"What brings you here?"** → 3 cards: "I want to learn NEAR/Rust" | "I have an idea to build" | "I'm migrating from another chain"
  2. **"What's your experience?"** → Beginner | Intermediate | Expert (auto-selects mode)
  3. **"Pick your guide"** → Persona selector with 1-sentence descriptions + personality previews
- Wizard result auto-configures: mode, persona, and optionally pre-loads a template
- `SanctumWizard.tsx` already exists — extend it
- Skip button always visible ("I know what I'm doing")

### 1B. Template Gallery (Prominent, Above the Fold)
- Surface `ScratchTemplates.tsx` as the DEFAULT landing view (before any chat starts)
- **8 starter templates** (with preview thumbnails):
  1. 🪙 **Fungible Token** — "Launch your own token in 5 minutes"
  2. 🎨 **NFT Collection** — "Deploy an NFT collection with metadata"
  3. 🏛️ **DAO / Governance** — "Create a voting contract for your community"
  4. 🏪 **Marketplace** — "Build a decentralized marketplace"
  5. 💰 **DeFi Vault** — "Simple yield vault with deposit/withdraw"
  6. 🎮 **On-chain Game** — "Build a provably fair game"
  7. ✍️ **Guestbook** — "The NEAR hello-world (great for learning)"
  8. 🔗 **Cross-Contract Call** — "Contract that talks to other contracts"
- Each template = pre-written first message + suggested persona + mode
- One click → drops you into a chat with the template already generating
- "Start from scratch" option always available

### 1C. Mode Explainers
- Tooltip/popover on each mode (Learn / Build / Expert) explaining:
  - **Learn:** "I'll explain everything step by step. Ask me anything."
  - **Build:** "Tell me what you want. I'll build it and explain the key parts."
  - **Expert:** "Minimal hand-holding. Fast iteration. You drive."
- Show recommended mode based on onboarding wizard selection

---

## Phase 2: The Build Cycle (Make It Complete)
**Goal:** From idea → tested, audited, deployable contract without leaving Sanctum.  
**Effort:** ~15-20 hours  
**Priority:** 🔥 CRITICAL — this is the core product loop  

### 2A. Guided Deploy Flow
- Replace the raw "Deploy" button with a multi-step flow:
  1. **Pre-deploy checklist:** ✅ Compiles | ✅ Tests pass | ⚠️ Audit warnings | ✅ Gas estimate
  2. **Target selection:** Testnet (free, recommended for first deploy) | Mainnet (costs NEAR)
  3. **Wallet connection:** NEAR wallet connect with clear instructions
  4. **Deploy + verify:** Show transaction hash, link to NearBlocks explorer
  5. **Post-deploy:** "Your contract is live! Here's how to interact with it" → auto-generate a simple frontend or API call examples
- First-time deployers get extra guidance (detect from user profile)
- Testnet faucet integration (auto-fund testnet account if balance < 1 NEAR)

### 2B. Test Execution (Not Just Generation)
- When "Tests" button is clicked → generate test code (already works)
- **NEW:** "Run Tests" button that:
  - Sends test code to a sandboxed NEAR environment (near-workspaces)
  - Shows pass/fail results inline in the code preview panel
  - Highlights failing lines with error messages
- Backend: Serverless function that spins up near-sandbox, compiles + runs tests, returns results
- Rate limit: 5 test runs per session (prevents abuse)
- Show estimated test runtime before running

### 2C. Simulation Sandbox (Wire Up the Stub)
- `SimulationSandbox.tsx` has 6 TODOs — complete them
- After deploy (testnet), show an interactive panel:
  - Call any contract method (dropdown of available methods)
  - See return values + state changes in real-time
  - View account balances before/after
  - Transaction history for this contract
- This turns "I deployed something" into "I understand what I deployed"

### 2D. Gas Estimation Upgrade
- `GasEstimator.tsx` exists — enhance it:
  - Before/after comparison when Optimize is used ("Saved ~40% gas")
  - Show gas cost in both TGas and USD equivalent
  - Benchmark against common operations ("This costs about the same as a token transfer")
  - Flag any method that exceeds 300 TGas (the max)

---

## Phase 3: Retention & Persistence (Make Them Come Back)
**Goal:** Your work is always there. Your progress matters.  
**Effort:** ~10-15 hours  
**Priority:** 🟡 HIGH — without this, every session is disposable  

### 3A. Project Persistence (Bulletproof)
- **All tiers:** localStorage save (auto-save every 30 seconds)
- **Specter+:** Cloud save to Supabase (conversations + code snapshots)
- Project dashboard on Sanctum landing (before chat):
  - "Continue where you left off" → list of recent projects with last-edited timestamp
  - Each project shows: name, template/category, last code snapshot preview, message count
- **Auto-recovery:** If browser crashes, detect incomplete session and offer to restore
- Wire up `ProjectManager.tsx` fully: create, rename, delete, duplicate projects
- Projects API (`/api/sanctum/projects`) — verify CRUD is complete

### 3B. Conversation History & Search
- **Sidebar (collapsible):** List of past conversations grouped by project
- **Search:** Full-text search across conversation history
  - Client-side for free tier (search localStorage)
  - Server-side for paid tiers (search Supabase `sanctum_messages`)
- **Pin messages:** Star/pin important AI responses for quick reference
- **Export:** Download conversation as Markdown

### 3C. Achievement System (Wire Up)
- DB tables exist (`user_achievements`, `user_achievement_stats`)
- `AchievementPopup.tsx` exists
- **Define 20 achievements:**
  - 🏗️ First Contract — Generate your first contract
  - 🧪 Test Runner — Run tests for the first time
  - 🚀 Deployer — Deploy to testnet
  - 🌍 Mainnet Pioneer — Deploy to mainnet
  - 🛡️ Security Conscious — Run your first audit
  - ⚡ Optimizer — Use the Optimize feature
  - 🎓 Scholar — Complete 10 Learn mode sessions
  - 🦀 Rustacean — Build 5 different contract types
  - 🔗 Cross-Chain — Use the Solidity converter
  - 👥 Social — Share a contract
  - 🏆 Master Builder — Deploy 10 contracts
  - ...etc
- Achievements visible on profile + shareable (social proof for the platform)
- XP gains tied to meaningful actions (not just chatting)

### 3D. Credit Burn Indicator
- Replace static "10,001 operations" with dynamic display:
  - **Burn rate:** "~45 min remaining at current pace"
  - **Session cost:** "This session: 234 credits used"
  - **Pacing bar:** Visual indicator (green → yellow → red)
- Show credit cost BEFORE expensive operations (Opus model, long generation)
- Low-credit warning at 10% remaining (offer top-up inline)

---

## Phase 4: The Migration Play (Capture EVM Developers)
**Goal:** Make Sanctum the #1 destination for Solidity devs exploring NEAR.  
**Effort:** ~10-12 hours  
**Priority:** 🟡 HIGH — this is a massive TAM expansion  

### 4A. Solidity → NEAR Converter
- New mode or prominent button: "Convert from Solidity"
- Flow:
  1. Paste Solidity code (or paste a verified Etherscan URL)
  2. AI analyzes the contract, identifies patterns (ERC-20, ERC-721, custom)
  3. Generates equivalent NEAR/Rust contract with inline comments explaining every difference
  4. Side-by-side view: Solidity (left, read-only) | NEAR Rust (right, editable)
  5. `ContractComparison.tsx` already exists — this is its purpose
- **Comparison annotations:** Highlight key differences:
  - "Solidity uses `mapping` → NEAR uses `LookupMap` (stored in Trie)"
  - "No `msg.sender` → use `env::predecessor_account_id()`"
  - "No `payable` keyword → use `#[payable]` attribute"
- **Learn hooks:** Each annotation links to the relevant Learn module
- Persona auto-switch to Nexus (Cross-Chain expert) for conversion sessions

### 4B. "Coming from X" Guided Paths
- Landing cards (shown when user selects "migrating from another chain" in onboarding):
  - "Coming from Ethereum/EVM" → Solidity converter + key differences guide
  - "Coming from Solana" → Rust similarities + NEAR-specific patterns (we already have `/for-solana-developers`)
  - "Coming from Cosmos" → Actor model similarities
- Each path = curated sequence of Learn modules + suggested templates

---

## Phase 5: Power User Features (Make Experts Stay)
**Goal:** Daily driver for professional NEAR developers.  
**Effort:** ~12-15 hours  
**Priority:** 🟡 MEDIUM — experts are smaller audience but highest LTV  

### 5A. Multi-File Project Support
- Upgrade code preview from single file → file tree:
  - `FileStructure.tsx` already exists — wire it up
  - Default structure: `src/lib.rs` + `Cargo.toml` + `src/tests.rs`
  - Click file in tree → code preview switches
  - AI generates all files coherently (Cargo.toml with correct dependencies)
- For complex projects: multiple contract files (e.g., token.rs, vault.rs, lib.rs)
- Export as ZIP (already partially implemented in `DownloadContract.tsx`)

### 5B. Diff View
- When AI modifies code, show a diff (green/red lines) before applying
- "Accept" / "Reject" / "Accept with changes" buttons
- Inspired by Cursor's diff UX — developers expect this now
- Especially critical for Expert mode where changes can be sweeping

### 5C. Conversation Context Window
- Show how much context the AI currently has (% of token window used)
- When approaching limit: "Context is getting long. Start a new session or I'll summarize and continue."
- Auto-summarize option: compress conversation history to key decisions + current code state

### 5D. Keyboard Shortcuts
- `Cmd+Enter` → Send message
- `Cmd+K` → New session
- `Cmd+/` → Toggle code annotations
- `Cmd+S` → Save project
- `Cmd+D` → Deploy
- `Cmd+T` → Run tests
- Show shortcut hints on hover

### 5E. CLI / API Access (Future — V2)
- `voidspace sanctum audit ./src/lib.rs` — pipe into CI/CD
- `voidspace sanctum explain ./src/lib.rs:45-60` — explain specific lines
- REST API with API key for team integrations
- **This is the enterprise play** — teams, not just individuals
- Defer to after Nearcon unless we get enterprise interest early

---

## Phase 6: Polish & Social Proof (The 10/10 Finish)
**Goal:** Every pixel intentional. Every interaction delightful.  
**Effort:** ~5-8 hours  
**Priority:** 🟢 MEDIUM — the difference between 9/10 and 10/10  

### 6A. Plain English Code Overlay
- Toggle button on code preview: "Explain this code"
- Overlays natural-language annotations on each code block:
  ```
  // 🧠 This creates a new token with 1 billion total supply
  const TOTAL_SUPPLY: Balance = 1_000_000_000_000_000_000_000_000_000;
  
  // 🧠 This is the main contract. Think of it as a class in JavaScript.
  pub struct ShadeToken {
  ```
- `CodeAnnotations.tsx` already exists — wire it into the code preview
- Toggle persists per session (beginners keep it on, experts turn it off)

### 6B. Social Sharing
- `ShareContract.tsx` exists — enhance:
  - Generate a beautiful OG image of the contract (code snippet + Voidspace branding)
  - Share to Twitter/X with one click: "I just built [Contract Name] on NEAR using Voidspace Sanctum 🚀"
  - Shareable link that shows read-only contract preview (no auth required)
  - This is FREE marketing from every user

### 6C. Status Messages That Make Sense
- Replace "Ready to sanctum" with clear, human-readable statuses:
  - "✅ Contract ready — 142 lines, 3 methods"
  - "🧪 Tests generated — 8 test cases"
  - "⚡ Optimized — estimated 45 TGas per call"
  - "🛡️ Audit complete — 0 critical, 2 suggestions"
  - "🚀 Deployed to testnet — view on NearBlocks"

### 6D. Loading States & Micro-interactions
- Skeleton loaders for code generation (not just a spinner)
- Typewriter effect for code (already have `TypewriterCode.tsx`)
- Smooth transitions between states
- Subtle sound effects option (keyboard clicks while generating, success chime on deploy)

### 6E. Demo Video / Interactive Tutorial
- 90-second video on the Sanctum landing showing the full flow
- OR: Interactive tutorial (build a guestbook contract step-by-step with guided prompts)
- This is the single best conversion tool for the pricing page

---

## Implementation Priority (Recommended Order)

```
WEEK 1:  Phase 1 (First Impressions)     — 🔥 Stop the bleeding (bounce rate)
WEEK 2:  Phase 2A-2B (Deploy + Tests)    — 🔥 Complete the core loop
WEEK 3:  Phase 3A-3D (Persistence)       — 🟡 Make them come back
WEEK 4:  Phase 4A (Solidity Converter)   — 🟡 Capture EVM wave
WEEK 5:  Phase 5A-5B (Multi-file + Diff) — 🟡 Expert retention
WEEK 6:  Phase 6 (Polish)                — 🟢 The 10/10 finish
```

Post-Nearcon: Phase 5C-5E (CLI, API, enterprise features)

---

## What We're NOT Doing (Scope Control)

- ❌ **Full IDE replacement** — We're not competing with VS Code. We're the on-ramp.
- ❌ **Mainnet deployment without explicit confirmation** — Safety first.
- ❌ **Free tier cloud save** — localStorage is fine. Cloud save is a paid perk.
- ❌ **Real-time collaboration** — Cool but not now. Solo builder tool first.
- ❌ **Language support beyond Rust** — NEAR = Rust. AssemblyScript is deprecated.

---

## Success Metrics

| Metric | Current (Est.) | Target (10/10) |
|--------|---------------|----------------|
| Time to first contract | ~5 min (if they figure it out) | < 60 seconds (template) |
| Bounce rate (first visit) | ~60-70% (guessing) | < 30% |
| Session-to-deploy conversion | ~5% | > 25% |
| Return rate (7-day) | ~10% | > 40% |
| Paid conversion | ~1% | > 5% |
| Contracts deployed (monthly) | ~0 (pre-launch) | 500+ |

---

*The bones are excellent. 56 components, 15K lines, 8 personas, credit system, Stripe — we built a mansion. Now we need to furnish it, put up signs, and unlock all the rooms.*

*THE PLAN demands nothing less than 10/10.* 🐧
