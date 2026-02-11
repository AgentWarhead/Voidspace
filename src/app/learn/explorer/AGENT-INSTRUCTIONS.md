# Explorer Track — Module Generation Instructions

## YOUR TASK
Generate 11 individual lesson pages for the Explorer Track at `/learn/explorer/[slug]`.
Each module is a full interactive lesson page with educational content about blockchain/NEAR basics.

## ROUTE STRUCTURE
Create: `src/app/learn/explorer/[slug]/page.tsx` (dynamic route)
And: `src/app/learn/explorer/modules/` directory with one component per lesson.

## THE 11 EXPLORER MODULES (in order)

1. `what-is-blockchain` — What is Blockchain? Explain distributed ledgers, consensus, blocks, immutability. Use analogies (shared Google Doc vs blockchain). Visual: animated chain of blocks.
2. `what-is-near` — What is NEAR? Protocol overview, sharding (Nightshade), human-readable accounts, sub-second finality, "blockchain for AI" narrative. Compare to Ethereum/Solana briefly.
3. `create-a-wallet` — Create a Wallet. Step-by-step guide for creating a NEAR wallet (Meteor Wallet, MyNearWallet, HERE Wallet). Screenshots-style visual guides. Testnet vs mainnet toggle.
4. `your-first-transaction` — Your First Transaction. Guide to sending NEAR, checking on NearBlocks explorer. Explain gas fees (tiny on NEAR). Visual transaction flow diagram.
5. `understanding-dapps` — Understanding dApps. What makes an app "decentralized." Frontend + smart contract architecture. Examples on NEAR (Ref Finance, Burrow, Mintbase). 
6. `reading-smart-contracts` — Reading Smart Contracts. How to look at a contract on NearBlocks. Understanding methods, state, access keys. No coding required — just reading.
7. `near-ecosystem-tour` — NEAR Ecosystem Tour. Tour of DeFi, NFTs, DAOs, gaming, AI, infrastructure on NEAR. Key projects in each category. Where the opportunities are.
8. `near-vs-other-chains` — **NEW** NEAR vs Other Chains. Comparison table: NEAR vs Ethereum vs Solana vs Sui. Speed, cost, developer experience, account model, unique features.
9. `reading-the-explorer` — **NEW** Reading the Explorer. How to use NearBlocks and Pikespeak. Understanding blocks, transactions, accounts, contract calls. Be a chain detective.
10. `defi-basics` — **NEW** DeFi Basics on NEAR. What is DeFi, swapping (Ref Finance), staking (Meta Pool), lending (Burrow), liquidity pools. Risks and rewards.
11. `choose-your-path` — Choose Your Path. Summary of what they learned. Quiz/self-assessment. Recommend Builder vs Hacker track. Links to continue.

## DYNAMIC ROUTE PAGE
Create `src/app/learn/explorer/[slug]/page.tsx`:
- Server component with `generateStaticParams` for all 11 slugs
- Imports the right module component based on slug
- Has breadcrumb nav: Learn > Explorer Track > Module Name
- Has prev/next navigation at the bottom
- Progress bar at the top showing current module (e.g., 3/11)

## MODULE COMPONENT PATTERN
Each module in `src/app/learn/explorer/modules/[Name].tsx` should:
- Be 'use client' (for interactivity)
- Have multiple sections that reveal as you scroll (ScrollReveal)
- Include interactive elements: expandable cards, hover reveals, quizzes, visual diagrams
- Use the design system (Card, Button, GlowCard, GradientText, SectionHeader)
- End with a "Key Takeaways" summary box
- End with "Mark as Complete" button (localStorage: `voidspace-explorer-progress`)
- Have estimated read time shown at top

## DESIGN SYSTEM

### Colors
- background: #0a0a0a, surface: #111111, surface-hover: #1a1a1a
- border: #222222, border-hover: #333333
- text-primary: #ffffff, text-secondary: #aaaaaa, text-muted: #888888
- near-green: #00EC97 (primary accent), accent-cyan: #00D4FF
- Explorer track theme: green (near-green)

### Imports
```tsx
import { Container, Card } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { SectionHeader } from '@/components/effects/SectionHeader';
import { GradientText } from '@/components/effects/GradientText';
import { GlowCard } from '@/components/effects/GlowCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
```

### Component APIs
- `Card`: variant='default'|'glass', padding='none'|'sm'|'md'|'lg', hover, glow
- `GlowCard`: Interactive card with cursor-following green glow. padding prop.
- `Container`: size='sm'|'md'|'lg'|'xl'  
- `Button`: variant='primary'|'secondary'|'ghost'|'danger', size='sm'|'md'|'lg'
- `ScrollReveal`: Wrap sections for scroll-triggered animations. delay prop.
- `SectionHeader`: title, badge props.
- `GradientText`: as='h1'|'h2'|'h3'|'span', animated prop.

### Key Rules
- 'use client' for interactive components
- `import Link from 'next/link'` for links
- Mobile responsive: grid-cols-1 on mobile
- Space/void aesthetic with NEAR green accents
- Compelling, motivational copy — NOT dry documentation
- Progressive disclosure: expandable sections, click to reveal
- Each module should be 300-600 lines of rich interactive content

## WHAT NOT TO DO
- No actual code execution
- No video embeds  
- No backend integration (localStorage only)
- No community features
- Don't use Badge component (use custom styled spans)
- Don't use AnimatedCounter with `end`/`suffix` — use `value`/`duration` pattern

## ALSO UPDATE
After creating all modules, update `src/app/learn/components/LearningTracks.tsx`:
- Update Explorer track moduleCount from 8 to 11
- Add the 3 new modules to the modules array
- Add slug field to Module type and each module entry
- Make each module item a Link to `/learn/explorer/[slug]`

## FILE LIST TO CREATE
1. `src/app/learn/explorer/[slug]/page.tsx` — dynamic route
2. `src/app/learn/explorer/modules/WhatIsBlockchain.tsx`
3. `src/app/learn/explorer/modules/WhatIsNear.tsx`
4. `src/app/learn/explorer/modules/CreateAWallet.tsx`
5. `src/app/learn/explorer/modules/YourFirstTransaction.tsx`
6. `src/app/learn/explorer/modules/UnderstandingDapps.tsx`
7. `src/app/learn/explorer/modules/ReadingSmartContracts.tsx`
8. `src/app/learn/explorer/modules/NearEcosystemTour.tsx`
9. `src/app/learn/explorer/modules/NearVsOtherChains.tsx`
10. `src/app/learn/explorer/modules/ReadingTheExplorer.tsx`
11. `src/app/learn/explorer/modules/DefiBasics.tsx`
12. `src/app/learn/explorer/modules/ChooseYourPath.tsx`
13. `src/app/learn/explorer/modules/index.ts` — barrel export

## QUALITY BAR
Each module should feel like a mini-quest. Visual, interactive, motivational. Not a textbook. Not a blog post. A journey that makes someone EXCITED about NEAR.
