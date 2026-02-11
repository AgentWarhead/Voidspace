# Learn Page Redesign — Design Brief

## Design System Reference
- **Framework:** Next.js 16 App Router + TypeScript + Tailwind CSS
- **Animation:** framer-motion
- **Icons:** lucide-react
- **Font:** Inter (sans), JetBrains Mono (mono)

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

### Existing Components to Use
```tsx
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GridPattern } from '@/components/effects/GridPattern';
import { GlowCard } from '@/components/effects/GlowCard';
```

- `Card`: variant='default'|'glass', padding='none'|'sm'|'md'|'lg', hover, glow
- `GlowCard`: Interactive card with cursor-following green glow. padding prop.
- `Container`: size='sm'|'md'|'lg'|'xl'
- `Button`: variant='primary'|'secondary'|'ghost'|'danger', size='sm'|'md'|'lg'
- `ScrollReveal`: Wrap sections for scroll-triggered animations. delay prop.
- `SectionHeader`: title, badge, count props. Has pulsing green dot + gradient line.
- `GradientText`: as='h1'|'h2'|'h3'|'span', animated prop.
- `cn()`: from '@/lib/utils' — clsx wrapper

### Code Patterns
- All interactive components must be 'use client'
- Static components can be server components (no 'use client')
- Use `motion.div` from framer-motion for animations
- Links: `import Link from 'next/link'`
- Icons: `import { IconName } from 'lucide-react'`

### Brand Alignment
- NEAR: Clean, minimal, green (#00EC97) accent on dark
- Voidspace: Space theme, dark/void aesthetic, constellation patterns, glowing elements
- Merge: Dark space background + NEAR green accents + constellation-style paths
