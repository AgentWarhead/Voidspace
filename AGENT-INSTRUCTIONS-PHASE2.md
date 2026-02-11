# Phase 2 — SkillTree + WhyRust + RustCurriculum Rewrite

## YOUR TASK
Fix trust, accuracy, and quality issues in 3 learn page components. This is Phase 2 of a 4-phase rebuild.

**Components:**
- `src/app/learn/components/SkillTree.tsx` (1490 lines)
- `src/app/learn/components/WhyRust.tsx` (1023 lines)
- `src/app/learn/components/RustCurriculum.tsx` (1170 lines)

## CRITICAL RULES
- **DO NOT create new files.** Edit the 3 existing files only.
- **DO NOT change the component's export name or props interface.**
- **DO NOT remove sections** — fix them. Replace bad content with good content.
- **Keep all imports working.** If you remove AnimatedCounter usage, don't leave orphan imports.
- After all edits, run: `cd /home/ubuntu/workspace/projects/voidspace && npx tsc --noEmit 2>&1 | tail -30` to verify compilation.
- If build works, commit and push: `git add -A && git commit -m "Phase 2: SkillTree + WhyRust + RustCurriculum rewrite" && git push`

## TASK 2.1 — WhyRust.tsx: Remove Fake Testimonials
The testimonials section has unverifiable/fake quotes:
- "Illia Polosukhin" — quote may not be real, can't verify
- "NEAR Core Team" — not a real person
- "Discord Engineering" — not a real person  
- "NEAR Builder" — generic, not real

**Fix:** Replace the entire testimonials carousel with a **"Why Top Projects Choose Rust"** section showing REAL projects that use Rust:
- **NEAR Protocol** — Core protocol written in Rust (nearcore on GitHub)
- **Solana** — Validator and runtime in Rust
- **Polkadot/Substrate** — Framework built in Rust
- **Discord** — Switched from Go to Rust for performance (this is public knowledge)
- **Cloudflare** — Uses Rust for edge workers
- **Dropbox** — Rebuilt sync engine in Rust

Use project logos/icons (lucide icons are fine) with a brief real fact about each. No fake quotes.

## TASK 2.2 — WhyRust.tsx: Fix AnimatedCounter
Line 835 uses `AnimatedCounter` which renders as zero.
**Fix:** Replace with static display values that render immediately (same fix pattern as Phase 1 SocialProof).
Remove the `AnimatedCounter` import if no longer used.

## TASK 2.3 — RustCurriculum.tsx: Fix AnimatedCounter  
Line 923 uses `AnimatedCounter` which renders as zero.
**Fix:** Same as above — replace with static values. Remove orphan import.

## TASK 2.4 — SkillTree.tsx: Quality Review
This is 1490 lines. Review for:
- Any fake data, placeholder content, or unverifiable claims
- Broken animations or elements that don't render properly
- Heading hierarchy issues (h2 used as subtitle should be p)
- Accessibility issues
Fix whatever you find. If it's clean, note that and move on.

## TASK 2.5 — Heading Hierarchy Audit (all 3 files)
Phase 1 found subtitle `<GradientText as="h2">` being misused across components. These were already fixed in WhyRust and RustCurriculum to `as="p"`, but **double-check all 3 files** for any remaining heading hierarchy issues.

## DESIGN SYSTEM REFERENCE
- Colors: background #0a0a0a, surface #111111, near-green #00EC97, accent-cyan #00D4FF
- Components available: Card, Button, GlowCard, GradientText, SectionHeader, ScrollReveal
- Path: `@/components/ui`, `@/components/effects/*`

## AFTER ALL TASKS
1. Run `npx tsc --noEmit` to verify no type errors
2. `git add -A && git commit -m "Phase 2: SkillTree + WhyRust + RustCurriculum rewrite" && git push`
3. Report what you changed in each task
