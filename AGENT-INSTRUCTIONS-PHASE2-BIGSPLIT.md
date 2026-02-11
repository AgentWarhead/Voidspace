# Phase 2 — The Big Split

## OBJECTIVE
Slash `/learn` from a massive scroll page (~22,600px) to a focused hub (~8,000px) by moving heavy components to standalone routes. Add navigation structure (sticky ToC, breadcrumbs) and structured data for SEO.

## PROJECT
- **Path:** `/home/ubuntu/workspace/projects/voidspace`
- **Framework:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Current page:** `src/app/learn/page.tsx` (201 lines, 12 stacked sections)

## CURRENT LEARN PAGE SECTIONS (in order)
1. HeroSection (459 lines)
2. SocialProof (210 lines)
3. LearningTracks (559 lines)
4. SkillTree (1490 lines) — **REPLACE with CTA card**
5. "What is NEAR?" inline section
6. WalletSetup (1015 lines) — **MOVE to standalone route**
7. KeyTechnologies (558 lines) — **MOVE to standalone route**
8. WhyRust (1030 lines) — **MOVE to standalone route**
9. RustCurriculum (1169 lines) — **MOVE to standalone route**
10. "How AI Creates Your Void Brief" inline section
11. EcosystemMap (697 lines)
12. ProjectTemplates (483 lines)
13. ResourceHub (329 lines)
14. BottomCTA (356 lines)

## TASK 2.1 — Create Standalone Routes (4 new pages)

Create these new routes. Each should:
- Be a proper Next.js page with its own `metadata` export (title, description, OG tags, canonical URL)
- Import and render the existing component (don't rewrite the components)
- Have breadcrumb navigation: Learn > [Page Title]
- Have a "Back to Learn" link
- Have a clean URL structure

### Routes to create:
1. **`/learn/wallet-setup`** → `src/app/learn/wallet-setup/page.tsx`
   - Note: this directory already exists, check if there's already a page.tsx there
   - Title: "Set Up Your NEAR Wallet — Getting Started | Voidspace"
   - Import and render `WalletSetup` component

2. **`/learn/key-technologies`** → `src/app/learn/key-technologies/page.tsx`
   - Title: "NEAR Key Technologies — Chain Abstraction, Intents & More | Voidspace"
   - Import and render `KeyTechnologies` component

3. **`/learn/why-rust`** → `src/app/learn/why-rust/page.tsx`
   - Title: "Why Rust for Blockchain? — Smart Contract Development | Voidspace"
   - Import and render `WhyRust` component

4. **`/learn/rust-curriculum`** → `src/app/learn/rust-curriculum/page.tsx`
   - Title: "Rust Smart Contract Curriculum — Free Course | Voidspace"
   - Import and render `RustCurriculum` component

Each page template:
```tsx
import { Metadata } from 'next';
import { Container } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ComponentName } from '../components/ComponentName';

export const metadata: Metadata = {
  title: '...',
  description: '...',
  alternates: { canonical: 'https://voidspace.io/learn/route-name' },
  openGraph: { title: '...', description: '...', url: 'https://voidspace.io/learn/route-name', siteName: 'Voidspace', locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image', title: '...', description: '...', creator: '@VoidSpaceNear' },
};

export default function PageName() {
  return (
    <div className="min-h-screen">
      <Container className="pt-8 pb-4">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-near-green transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Learn
        </Link>
        <nav className="mt-2 text-xs text-text-muted">
          <Link href="/learn" className="hover:text-near-green">Learn</Link>
          <span className="mx-1">›</span>
          <span className="text-text-secondary">Page Title</span>
        </nav>
      </Container>
      <Container className="pb-20">
        <ComponentName />
      </Container>
    </div>
  );
}
```

## TASK 2.2 — Slim Down /learn Main Page

Rewrite `src/app/learn/page.tsx` to remove the moved components and replace them with link cards. The new page should have:

1. **HeroSection** (keep)
2. **SocialProof** (keep)
3. **LearningTracks** (keep — this is the core of the page, links to Explorer/Builder/Hacker/Founder tracks)
4. **Skill Tree → Replace with a compact CTA card** linking to `/profile#skills`
   - Small card: "📊 Track Your Progress" with subtitle "View your skill tree and learning roadmap" and a button to /profile#skills
   - Remove the massive SkillTree import entirely
5. **"What is NEAR?" section** (keep — it's small and important for SEO)
6. **NEW: "Deep Dive" link cards section** — Replace the 4 removed full components with a grid of attractive link cards:
   - 🔑 "Wallet Setup" → /learn/wallet-setup — "Set up your first NEAR wallet in minutes"
   - ⚡ "Key Technologies" → /learn/key-technologies — "Chain Abstraction, Intents, and more"
   - 🦀 "Why Rust?" → /learn/why-rust — "Why Rust is the language of secure smart contracts"
   - 📚 "Rust Curriculum" → /learn/rust-curriculum — "Free structured course from zero to deployment"
   Each card should use the existing Card/GlowCard components with hover effects.
7. **"How AI Creates Your Void Brief"** (keep — it's unique content)
8. **EcosystemMap** (keep — important for SEO and orientation)
9. **ProjectTemplates** (keep)
10. **ResourceHub** (keep)
11. **BottomCTA** (keep)

## TASK 2.3 — Add Sticky Table of Contents

Add a sticky/floating Table of Contents to the slimmed-down /learn page:
- Fixed position on the left side (desktop only, hidden on mobile)
- Shows section anchors: Overview, Learning Tracks, Deep Dives, NEAR Overview, AI Briefs, Ecosystem, Templates, Resources
- Highlights current section on scroll (use IntersectionObserver)
- Create as a new component: `src/app/learn/components/TableOfContents.tsx`
- Make sure each section in page.tsx has an `id` attribute for anchor linking

## TASK 2.4 — Add Structured Data (JSON-LD)

Add structured data to the main /learn page for SEO:

1. **Course structured data** (schema.org/Course):
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Learn NEAR Protocol — Free Blockchain Developer Course",
  "description": "Master Rust, build smart contracts, and ship dApps on NEAR Protocol.",
  "provider": { "@type": "Organization", "name": "Voidspace", "url": "https://voidspace.io" },
  "isAccessibleForFree": true,
  "coursePrerequisites": "Basic programming knowledge",
  "educationalLevel": "Beginner to Advanced",
  "inLanguage": "en",
  "url": "https://voidspace.io/learn"
}
```

2. **BreadcrumbList** for each standalone page:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://voidspace.io" },
    { "@type": "ListItem", "position": 2, "name": "Learn", "item": "https://voidspace.io/learn" },
    { "@type": "ListItem", "position": 3, "name": "Page Title" }
  ]
}
```

3. **FAQ structured data** on main page (use real questions learners would ask):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Is this course free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all learning tracks..." }},
    { "@type": "Question", "name": "Do I need coding experience?", "acceptedAnswer": { "@type": "Answer", "text": "The Explorer track requires..." }},
    { "@type": "Question", "name": "What is NEAR Protocol?", "acceptedAnswer": { "@type": "Answer", "text": "NEAR Protocol is a..." }}
  ]
}
```

Add these as `<script type="application/ld+json">` in the page, or use Next.js metadata approach if available.

## DESIGN SYSTEM
- Colors: background #0a0a0a, surface #111111, near-green #00EC97, accent-cyan #00D4FF
- Components: Card, Button, GlowCard, GradientText, SectionHeader, ScrollReveal, Container
- Paths: `@/components/ui`, `@/components/effects/*`

## CRITICAL RULES
- **DO NOT rewrite existing components** — just move them to new routes
- **DO NOT break existing track routes** (/learn/explorer/[slug], etc.)
- **Verify TypeScript compiles:** `npx tsc --noEmit 2>&1 | tail -30`
- **Commit and push:** `git add -A && git commit -m "Phase 2: The Big Split — standalone routes, sticky ToC, structured data" && git push`

## AFTER ALL TASKS
1. Run `npx tsc --noEmit` to verify no type errors
2. `git add -A && git commit -m "Phase 2: The Big Split — standalone routes, sticky ToC, structured data" && git push`
3. Report summary of all changes
