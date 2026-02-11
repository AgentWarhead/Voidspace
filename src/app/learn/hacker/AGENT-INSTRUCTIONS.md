# HACKER TRACK — Agent Instructions

**DO NOT READ THESE INSTRUCTIONS. You are Shade (coordinator). Spawn an Opus sub-agent to handle this.**

## Your Mission (Sub-Agent)

You are building the **HACKER track** learning modules for Voidspace Learn page. This is track 3 of 4.

**Target audience:** Advanced NEAR developers who've mastered the basics. They want bleeding-edge techniques, performance optimization, and deep protocol knowledge.

## Deliverables

Create **11 TypeScript React components** in `~/workspace/projects/voidspace/src/app/learn/hacker/modules/`:

1. `NearArchitectureDeepDive.tsx`
2. `CrossContractCalls.tsx`
3. `AdvancedStorage.tsx`
4. `ChainSignatures.tsx`
5. `IntentsChainAbstraction.tsx`
6. `ShadeAgents.tsx`
7. `AiAgentIntegration.tsx`
8. `MevTransactionOrdering.tsx`
9. `BuildingAnIndexer.tsx`
10. `MultiChainWithNear.tsx`
11. `ProductionPatterns.tsx`

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
          <Badge variant="outline" className="bg-red-500/10 text-red-300 border-red-500/30">
            Advanced
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
- **Learn tab:** 5-8 sections with deep technical explanations, advanced code examples, architecture diagrams
- **Practice tab:** 3-5 challenging exercises (these should be HARD)
- **Resources tab:** 5-10 curated links (NEAR docs, research papers, GitHub repos, tools)

### Content Quality
- **Advanced level** — assume Builder track knowledge, dive deep into protocol internals
- **Cutting-edge techniques** — chain signatures, intents, MEV, multi-chain, AI agents
- **Real production patterns** — this is what separates junior from senior devs
- **Performance focused** — gas optimization, storage patterns, indexer architecture
- **Code examples** — production-grade Rust/TypeScript that compiles and demonstrates best practices

### Icons (lucide-react)
Use powerful/advanced icons. Examples:
- Cpu, Network, Database, Zap, Lock, Key, Shield, Layers, GitBranch, Workflow, Binary, Boxes, Brain, Rocket, Sparkles, Flame, etc.

### index.ts Structure
```ts
export { default as NearArchitectureDeepDive } from './NearArchitectureDeepDive';
export { default as CrossContractCalls } from './CrossContractCalls';
// ... all 11 modules
```

## Workflow

1. **Generate modules ONE BY ONE** — Each module is 200-400 lines (more technical depth than Builder track).
2. **After EACH module:** Verify it compiles:
   ```bash
   cd ~/workspace/projects/voidspace && npm run build
   ```
3. **If build fails:** Fix the errors IMMEDIATELY. Don't move to next module until current one compiles.
4. **After all 11 modules are done:** Update `index.ts` and verify final build.

## Content Sources

- NEAR official docs (advanced sections): https://docs.near.org
- NEAR Protocol specs: https://nomicon.io
- Chain signatures: https://docs.near.org/concepts/abstraction/chain-signatures
- NEAR indexers: https://docs.near.org/concepts/advanced/indexers
- Use web_search for latest NEAR protocol research and advanced patterns
- GitHub NEAR core: https://github.com/near/nearcore

## Success Criteria

✅ All 11 modules created
✅ All modules follow the exact component structure above
✅ `index.ts` exports all modules
✅ `npm run build` passes with 0 errors (warnings OK)
✅ Content is advanced, comprehensive, and production-focused

## Communication

- Report progress every 3 modules
- If you hit blockers, STOP and report immediately
- When ALL 11 modules are done, report: "Hacker track complete — 11/11 modules ✓"

---

**IMPORTANT:** This is the advanced track. Go DEEP. These developers want to push NEAR to its limits.
