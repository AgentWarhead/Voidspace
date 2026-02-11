# FOUNDER TRACK — Agent Instructions

## Your Mission

You are building the **FOUNDER track** learning modules for Voidspace Learn page. This is track 4 of 4 — the FINAL track.

**Target audience:** Builders who want to turn their NEAR project into a real business. They've completed Explorer, Builder, and Hacker tracks.

## Deliverables

Create **5 TypeScript React components** in `~/workspace/projects/voidspace/src/app/learn/founder/modules/`:

1. `NearGrantsFunding.tsx`
2. `TokenomicsDesign.tsx`
3. `BuildingInPublic.tsx`
4. `PitchingYourProject.tsx`
5. `RevenueModelsForDapps.tsx`

Plus `index.ts` that exports all modules.

## Technical Requirements

### Component Structure (MANDATORY)
```tsx
'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, [other icons] } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface [ModuleName]Props {
  isActive: boolean;
  onToggle: () => void;
}

const [ModuleName]: React.FC<[ModuleName]Props> = ({ isActive, onToggle }) => {
  const [selectedTab, setSelectedTab] = useState<string>('overview');

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur">
      {/* Header */}
      <div
        onClick={onToggle}
        className="cursor-pointer p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">[Module Title]</h3>
            <p className="text-slate-400 text-sm">[Short description]</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
            Founder
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
            [Time estimate]
          </Badge>
          {isActive ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isActive && (
        <CardContent className="border-t border-purple-500/20 p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-slate-700">
            {['overview', 'learn', 'practice', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  selectedTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {selectedTab === 'overview' && (
              <div className="space-y-4">
                {/* Overview content */}
              </div>
            )}

            {selectedTab === 'learn' && (
              <div className="space-y-6">
                {/* Learning content with sections */}
              </div>
            )}

            {selectedTab === 'practice' && (
              <div className="space-y-6">
                {/* Hands-on exercises */}
              </div>
            )}

            {selectedTab === 'resources' && (
              <div className="space-y-4">
                {/* External links and references */}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default [ModuleName];
```

### Content Density
- **Overview tab:** 3-5 bullet points on what you'll learn
- **Learn tab:** 4-6 sections with practical business/strategy content
- **Practice tab:** 3-5 exercises (worksheets, templates, real-world scenarios)
- **Resources tab:** 5-8 curated links (NEAR grants, DAO tools, communities, case studies)

### Content Quality
- **Business-focused** — this is about building a sustainable project, not just code
- **Practical frameworks** — tokenomics templates, pitch decks, revenue models
- **NEAR-specific** — reference NEAR grants, NEAR Foundation, ecosystem DAOs
- **Real examples** — reference successful NEAR projects as case studies
- **Actionable** — every module should leave the learner with something they can DO

### Icons (lucide-react)
Use business/growth icons. Examples:
- DollarSign, TrendingUp, Users, Megaphone, Target, Briefcase, PieChart, Award, Lightbulb, Rocket, Globe, BarChart, etc.

### index.ts Structure
```ts
export { default as NearGrantsFunding } from './NearGrantsFunding';
export { default as TokenomicsDesign } from './TokenomicsDesign';
export { default as BuildingInPublic } from './BuildingInPublic';
export { default as PitchingYourProject } from './PitchingYourProject';
export { default as RevenueModelsForDapps } from './RevenueModelsForDapps';
```

## Workflow

1. **Generate modules ONE BY ONE** — Each module is 150-300 lines.
2. **After EACH module:** Verify it compiles:
   ```bash
   cd ~/workspace/projects/voidspace && npm run build
   ```
3. **If build fails:** Fix the errors IMMEDIATELY.
4. **After all 5 modules are done:** Update `index.ts` and verify final build.

## Content Sources

- NEAR grants: https://near.org/ecosystem/get-funding
- NEAR Foundation: https://near.foundation
- Use web_search for latest NEAR ecosystem funding, successful projects, tokenomics examples
- Reference real NEAR projects: Mintbase, Ref Finance, Burrow, Aurora, Octopus, etc.

## Success Criteria

✅ All 5 modules created
✅ All modules follow the exact component structure above
✅ `index.ts` exports all modules
✅ `npm run build` passes with 0 errors (warnings OK)
✅ Content is practical, business-focused, and actionable

## Communication

- Report progress after module 3 and after module 5
- When ALL 5 modules are done, report: "Founder track complete — 5/5 modules ✓"

---

**IMPORTANT:** This is the capstone track. Help builders become founders. Make it inspiring AND practical.
