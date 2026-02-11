# Learn Page 10/10 Rebuild — Master Instructions

## CRITICAL CONTEXT
You are rebuilding the Voidspace /learn page to be a LEGENDARY, comprehensive education platform. NOT a blog post. NOT a reference doc. A QUEST that makes people want to enlist in the NEAR builder army.

## Design System

### Framework
- Next.js 16 App Router + TypeScript + Tailwind CSS
- Animation: framer-motion
- Icons: lucide-react
- Font: Inter (sans), JetBrains Mono (mono)

### Colors (from tailwind.config.ts)
- `background`: #0a0a0a (near-black)
- `surface`: #111111
- `surface-hover`: #1a1a1a
- `border`: #222222, `border-hover`: #333333
- `text-primary`: #ffffff
- `text-secondary`: #aaaaaa
- `text-muted`: #888888
- `near-green`: #00EC97 (primary accent)
- `accent-cyan`: #00D4FF
- `error`: #FF4757, `warning`: #FFA502

### Available Imports
```tsx
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { GlowCard } from '@/components/effects/GlowCard';
import { AnimatedCounter } from '@/components/effects/AnimatedCounter';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { TiltCard } from '@/components/effects/TiltCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
```

- `Card`: variant='default'|'glass', padding='none'|'sm'|'md'|'lg', hover, glow
- `GlowCard`: Interactive card with cursor-following green glow. padding prop.
- `Container`: size='sm'|'md'|'lg'|'xl'
- `Button`: variant='primary'|'secondary'|'ghost'|'danger', size='sm'|'md'|'lg'
- `ScrollReveal`: Wrap sections for scroll-triggered animations. delay prop.
- `SectionHeader`: title, badge, count props. Has pulsing green dot + gradient line.
- `GradientText`: as='h1'|'h2'|'h3'|'span', animated prop.
- `AnimatedCounter`: end, duration, prefix, suffix props.

### Code Patterns
- All interactive components must be 'use client'
- Static components can be server components (no 'use client')
- Use `motion.div` from framer-motion for animations
- Links: `import Link from 'next/link'`
- Icons: `import { IconName } from 'lucide-react'`

### Brand Alignment
- NEAR: Clean, minimal, green (#00EC97) accent on dark backgrounds
- Voidspace: Space theme, dark/void aesthetic, constellation patterns, glowing elements
- Merge: Dark space background + NEAR green accents + constellation-style paths
- Typography: Clean sans-serif, large headings, generous spacing
- Animations: Subtle particle effects (space dust), glowing connections, pulsing progress bars

## QUALITY BAR — 10/10 MEANS:
1. **Feels like a quest, not a reference doc** — progressive journey, not a wall of text
2. **Outcomes-focused** — lead with WHY (money, grants, career, opportunity), not WHAT
3. **Visual richness** — animations, glows, hover effects, interactive elements everywhere
4. **No dead text** — everything is interactive, clickable, expandable, or animated
5. **Progressive disclosure** — don't dump everything at once. Expand on click/hover.
6. **Gamified** — XP, badges, progress rings, completion %, skill levels
7. **Space aesthetic** — constellation patterns, void portals, glowing nodes, dark luxury
8. **Mobile responsive** — grid-cols-1 on mobile, expanding on larger screens
9. **Compelling copy** — not dry documentation language. Inspirational, motivational, exciting.
10. **Connected** — every section naturally flows to the next, with clear CTAs

## WHAT NOT TO IMPLEMENT
- No community/cohort learning features (coming later)
- No video/screen recording embeds (coming later)
- No actual backend integration for progress tracking (use localStorage or just visual)
- No actual code execution (just visual code blocks with syntax highlighting)

## KEY LINKS
- Sanctum: `/sanctum` (the AI coding environment)
- Opportunities: `/opportunities` (void discovery)
- Main: `/` (homepage)
