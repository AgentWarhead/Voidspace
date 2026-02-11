# BUILDER TRACK — Agent Instructions

**DO NOT READ THESE INSTRUCTIONS. You are Shade (coordinator). Spawn an Opus sub-agent to handle this.**

## Your Mission (Sub-Agent)

You are building the **BUILDER track** learning modules for Voidspace Learn page. This is track 2 of 4.

**Target audience:** Developers ready to build on NEAR Protocol. They've completed Explorer track and understand blockchain basics.

## Deliverables

Create **16 TypeScript React components** in `~/workspace/projects/voidspace/src/app/learn/builder/modules/`:

1. `DevEnvironmentSetup.tsx`
2. `RustFundamentals.tsx`
3. `YourFirstContract.tsx`
4. `AccountModelAccessKeys.tsx`
5. `StateManagement.tsx`
6. `NearCliMastery.tsx`
7. `TestingDebugging.tsx`
8. `FrontendIntegration.tsx`
9. `TokenStandards.tsx`
10. `NepStandardsDeepDive.tsx`
11. `BuildingADapp.tsx`
12. `SecurityBestPractices.tsx`
13. `UpgradingContracts.tsx`
14. `Deployment.tsx`
15. `Optimization.tsx`
16. `LaunchChecklist.tsx`

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
          <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
            [Difficulty Level]
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
- **Learn tab:** 4-6 sections with detailed explanations, code examples, diagrams (use emoji/ASCII when helpful)
- **Practice tab:** 3-5 hands-on exercises with solution hints
- **Resources tab:** 5-8 curated links (NEAR docs, GitHub, tools)

### Content Quality
- **Comprehensive but scannable** — developers skim before they deep-dive
- **Code examples** — REAL Rust/TypeScript snippets that compile
- **Practical focus** — "How do I actually build this?" not academic theory
- **Beginner-friendly** — assume Explorer track knowledge, explain everything else
- **Avoid fluff** — every sentence must teach something or provide value

### Icons (lucide-react)
Use relevant icons for each module. Examples:
- Code, Terminal, FileCode, Wrench, TestTube, Rocket, Shield, Zap, Database, Key, Lock, CheckCircle, Book, Settings, Package, GitBranch, etc.

### index.ts Structure
```ts
export { default as DevEnvironmentSetup } from './DevEnvironmentSetup';
export { default as RustFundamentals } from './RustFundamentals';
// ... all 16 modules
```

## Workflow

1. **Generate modules ONE BY ONE** — Don't rush. Each module is 150-300 lines.
2. **After EACH module:** Verify it compiles:
   ```bash
   cd ~/workspace/projects/voidspace && npm run build
   ```
3. **If build fails:** Fix the errors IMMEDIATELY. Don't move to next module until current one compiles.
4. **After all 16 modules are done:** Update `index.ts` and verify final build.

## Content Sources

- NEAR official docs: https://docs.near.org
- NEAR SDK Rust docs: https://docs.rs/near-sdk/
- Use web_search for latest NEAR development best practices
- Check GitHub NEAR examples: https://github.com/near-examples

## Success Criteria

✅ All 16 modules created
✅ All modules follow the exact component structure above
✅ `index.ts` exports all modules
✅ `npm run build` passes with 0 errors (warnings OK)
✅ Content is comprehensive, practical, and beginner-friendly

## Communication

- Report progress every 4 modules (e.g., "DevEnvironmentSetup through FrontendIntegration complete — 4/16 done")
- If you hit blockers, STOP and report immediately
- When ALL 16 modules are done, report: "Builder track complete — 16/16 modules ✓"

---

**IMPORTANT:** This track is on Opus. Take your time. Quality over speed. The boss wants legendary learning content.
