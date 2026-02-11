# Phase 3 — KeyTechnologies + EcosystemMap + WalletSetup Rewrite

## YOUR TASK
Fix trust, accuracy, and quality issues in 3 learn page components. This is Phase 3 of a 4-phase rebuild.

**Components:**
- `src/app/learn/components/KeyTechnologies.tsx` (558 lines)
- `src/app/learn/components/EcosystemMap.tsx` (698 lines)
- `src/app/learn/components/WalletSetup.tsx` (1015 lines)

## CRITICAL RULES
- **DO NOT create new files.** Edit the 3 existing files only.
- **DO NOT change the component's export name or props interface.**
- **DO NOT remove sections** — fix them. Replace bad content with good content.
- **Keep all imports working.** If you remove AnimatedCounter usage, don't leave orphan imports.
- After all edits, run: `cd /home/ubuntu/workspace/projects/voidspace && npx tsc --noEmit 2>&1 | tail -30` to verify compilation.
- If build works, commit and push: `git add -A && git commit -m "Phase 3: KeyTechnologies + EcosystemMap + WalletSetup rewrite" && git push`

## TASK 3.1 — EcosystemMap.tsx: Fix AnimatedCounter
Line 622 uses `AnimatedCounter` which renders as zero on initial load.
**Fix:** Replace with static display values that render immediately. Remove the `AnimatedCounter` import.

## TASK 3.2 — EcosystemMap.tsx: Fix Heading Hierarchy
Line 683: `<GradientText as="h3">` — check if this is a section heading or a subtitle. If it's a subtitle within a card/section, change to `as="p"`. If it's a legitimate section heading, leave it.

## TASK 3.3 — WalletSetup.tsx: Fix Heading Hierarchy
Line 884: `<GradientText as="h2">` — this appears to be a subtitle, not a section heading. Change to `as="p"`.

## TASK 3.4 — Quality Review: All 3 Components
Review all 3 components for:
- Any fake data, placeholder content, or unverifiable claims
- Broken animations or elements that don't render properly
- Accessibility issues
- Any remaining AnimatedCounter usage
- Verify all ecosystem data in EcosystemMap is accurate (real NEAR projects, real stats)
- Verify WalletSetup instructions are current (correct wallet names, URLs)
Fix whatever you find. If something is clean, note that and move on.

## TASK 3.5 — KeyTechnologies.tsx: Verify Content Accuracy
This component covers NEAR's key technologies. Verify:
- Nightshade sharding description is accurate
- Aurora (EVM layer) description is current
- Any stats or claims are verifiable
- GradientText at line 489 is already `as="p"` — confirmed good

## DESIGN SYSTEM REFERENCE
- Colors: background #0a0a0a, surface #111111, near-green #00EC97, accent-cyan #00D4FF
- Components available: Card, Button, GlowCard, GradientText, SectionHeader, ScrollReveal
- Path: `@/components/ui`, `@/components/effects/*`

## AFTER ALL TASKS
1. Run `npx tsc --noEmit` to verify no type errors
2. `git add -A && git commit -m "Phase 3: KeyTechnologies + EcosystemMap + WalletSetup rewrite" && git push`
3. Report what you changed in each task
