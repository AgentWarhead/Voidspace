# Achievement System Overhaul — THE PLAN

**DO NOT DEVIATE FROM THIS PLAN. This is the boss's plan. Follow it exactly.**

## 🔴 The Problem
- THREE separate achievement registries that don't talk to each other
- Profile has 108 achievements in `src/lib/achievements.ts`
- Sanctum has its own separate system in `useSanctumState.ts` + `BuilderProgress.tsx` + `AchievementPopup.tsx`
- `AchievementContext.tsx` is a 43-line stub, not a real unified system
- `GlobalAchievementTracker.tsx` is 21 lines — basically nothing
- XP bar is a boring collapsed accordion
- Unlocking achievements feels like checking a box, not earning a trophy

## 🏗 The Plan (6 Phases)

### Phase 1 — Unify (4-6h)
Kill the duplicate registries. ONE source of truth.
- Merge Sanctum's 27 achievements into the global `src/lib/achievements.ts` registry
- Build a proper `AchievementContext.tsx` that ALL features use
- Wire all platform features into the global achievement context:
  - Sanctum (chat messages, code generation, deployments, persona usage)
  - Voids (opportunity views, brief generation)
  - Void Bubbles (exploration, time spent)
  - Constellation Map (wallets mapped, clusters found)
  - Void Lens (wallets analyzed, reputation checks)
  - Learn (module completions — already partially connected)
- Remove Sanctum's separate achievement state from `useSanctumState.ts`
- Make `GlobalAchievementTracker.tsx` actually track globally
- Persist to Supabase via the achievement context

### Phase 2 — Sanctum XP HUD (6-8h)
Replace the accordion XP display with something alive.
- Always-visible XP ribbon/bar in Sanctum (not collapsible — always there)
- Floating "+25 XP" popups on actions (code gen, deploy, quiz, etc.)
- Animated level-up celebrations (particle burst, sound-ready, modal)
- Persistent session stats bar (messages sent, code generated, time spent)
- XP ribbon should also work on /profile and /learn pages

### Phase 3 — Unlock Dopamine (5-7h)
Make unlocking achievements FEEL like something.
- Rarity tiers: Common, Uncommon, Rare, Epic, Legendary
- Rarity-aware unlock animations:
  - Common = subtle slide-in toast
  - Uncommon = glow pulse toast
  - Rare = screen-edge shimmer + toast
  - Epic = brief screen flash + centered modal with particles
  - Legendary = FULL SCREEN TAKEOVER — golden particle storm, dramatic reveal
- Konami code easter egg → triggers a hidden legendary achievement
- Toast queue system for multiple simultaneous unlocks (don't stack/overlap)
- Sound-ready hooks (play sound on unlock — implement hook, actual audio optional)

### Phase 4 — Profile Trophy Vault (8-10h)
**NOT a constellation/star map** (that's Skill Constellation for learning — keep them distinct).
This is a **Trophy Vault** — think glass display cases in a museum.
- Trophy Vault grid: glass display cases with holographic rarity glow effects
- Featured trophy shelf: pin your best achievements, holographic pedestals
- Legendary achievements get golden pedestals with particle effects
- Rarity breakdown dashboard: counts per tier, progress bars
- "You're 3 away from X" predictions / next-unlock suggestions
- Enhanced achievement timeline (when you unlocked what, streaks)
- Filter/sort by rarity, category, date unlocked
- Visual distinction from Skill Constellation: vault = rectangles/shelves/cases, constellation = nodes/lines/stars

### Phase 5 — Engagement Loops (4-6h)
Keep people coming back.
- Daily challenges: 3 per day, rotating, bonus XP for completing all 3
- Visual streak system: GitHub-style contribution calendar
- XP multipliers: streak bonus (2x after 7 days), weekend bonus, night owl bonus
- Challenge categories: exploration, learning, building, analysis

### Phase 6 — Social (3-4h)
Let people show off.
- Share cards for X/Twitter: beautiful OG-image-style cards for achievements
- Public profile achievement display (opt-in)
- Optional leaderboard (XP-based, weekly/all-time)

---

## Key Files (Current State)
- `src/lib/achievements.ts` — 108 achievements (profile registry)
- `src/contexts/AchievementContext.tsx` — 43 lines (stub)
- `src/components/tracking/GlobalAchievementTracker.tsx` — 21 lines (stub)
- `src/app/sanctum/hooks/useSanctumState.ts` — Sanctum's separate achievement system
- `src/app/sanctum/components/AchievementPopup.tsx` — Sanctum-only popup
- `src/app/sanctum/components/BuilderProgress.tsx` — 249 lines, Sanctum XP display
- `src/components/achievements/` — Profile achievement UI components
- `src/components/profile/sections/Achievements*.tsx` — Profile page sections
- `src/hooks/useAchievements.ts` — Achievement hook

## Hard Rules
- **ONE achievement registry.** No duplicates. Ever.
- **Skill Constellation = learning modules.** Trophy Vault = achievements. Keep them visually and conceptually separate.
- **No fake data.** Achievement counts and stats must be real.
- **Persist to Supabase.** Achievements survive across sessions.
- **No `process.exit()` in any Next.js code.** It kills Vercel builds.
- **Repo path:** `/home/ubuntu/.openclaw/workspace/projects/Voidspace` (capital V)
