# Sanctum Chat — Education & Conversion Overhaul

**Goal:** Transform Sanctum from "AI writes code for you" into "AI teaches you while building together." Users should leave each session more confident, more knowledgeable, and itching to build the next thing.

**Philosophy:** The AI does the heavy lifting but brings the user along for the ride. After a few contracts, users should understand basic Rust/NEAR concepts and be able to answer foundational questions. This is what makes us the ONLY crypto vibe-coding + education platform.

---

## Phase 1: Enhanced Teaching System Prompt

### 1.1 — Richer `learnTip` System (System Prompt Upgrade)

**Current:** AI sometimes returns a single `learnTip` with title + explanation.

**Upgrade:** Expand the response JSON to support richer educational content:

```json
{
  "content": "...",
  "code": "...",
  "learnTips": [
    {
      "title": "Ownership & Borrowing",
      "explanation": "In Rust, every value has exactly one owner...",
      "difficulty": "beginner",
      "category": "rust"  // rust | near | security | patterns | gas
    }
  ],
  "featureSuggestion": {
    "title": "Add Access Control",
    "description": "Your contract doesn't restrict who can call `mint`. Consider adding an owner check — on NEAR, that's as simple as checking `env::predecessor_account_id()`.",
    "codeSnippet": "assert_eq!(env::predecessor_account_id(), self.owner, \"Unauthorized\");",
    "why": "Without access control, anyone could mint unlimited tokens."
  },
  "codeAnnotations": [
    {
      "line": 5,
      "concept": "#[near(contract_state)]",
      "explanation": "This macro tells NEAR this struct is your contract's permanent storage. It auto-serializes to the blockchain."
    },
    {
      "line": 12,
      "concept": "#[payable]",
      "explanation": "This attribute allows the function to receive NEAR tokens. Without it, any attached deposit would cause a panic."
    }
  ],
  "quiz": {
    "question": "What would happen if you removed #[payable] from the deposit function?",
    "options": [
      "Nothing — it's optional",
      "The function would panic if someone attaches NEAR tokens",
      "The contract wouldn't compile",
      "It would accept tokens but not record them"
    ],
    "correctIndex": 1,
    "explanation": "NEAR's SDK panics by default when tokens are attached to a non-payable function. This is a security feature to prevent accidental token loss."
  },
  "options": [...]
}
```

### 1.2 — System Prompt Enhancements

Add these directives to `FORGE_SYSTEM_PROMPT`:

```
EDUCATIONAL PHILOSOPHY:
You are not just building FOR the user — you are building WITH them. Every contract is a lesson.

1. CODE ANNOTATIONS: When generating code, include `codeAnnotations` for every important line/pattern. Explain WHAT it does and WHY it matters. Focus especially on:
   - Rust-specific concepts (ownership, borrowing, lifetimes, Result/Option)
   - NEAR-specific patterns (#[near], env::, storage, gas, cross-contract calls)
   - Security patterns (access control, input validation, overflow protection)
   - Design patterns (factory, proxy, upgradeable)

2. FEATURE SUGGESTIONS: After generating code, ALWAYS suggest 1-2 features the user hasn't considered. Frame these as "Did you know NEAR supports..." or "Your contract could also...". Examples:
   - "Did you know you can add NEP-297 events so indexers can track your contract?"
   - "Your DAO could use time-locked execution — proposals pass but can't execute for 24h, giving members time to exit"
   - "Consider adding a pause mechanism — if you find a bug, you can freeze the contract"
   - "NEAR's storage staking model means users pay for their own storage — add a storage_deposit function"

3. PROGRESSIVE DIFFICULTY: Track the conversation. Start with basics, progressively introduce advanced concepts:
   - First contract: Focus on struct, impl, basic functions, storage
   - Second interaction: Introduce cross-contract calls, promises, gas
   - Third interaction: Advanced patterns — upgradeable contracts, access control lists, factory pattern
   - Ongoing: Security hardening, gas optimization, testing strategies

4. QUIZZES: Every 2-3 messages, include a short quiz about a concept you just taught. This reinforces learning. Keep them fun, not test-like. Frame as "Quick check —" not "Test question:".

5. NEAR ECOSYSTEM AWARENESS: Proactively mention relevant NEAR features and ecosystem tools:
   - Chain Signatures for cross-chain
   - NEAR AI for on-chain inference
   - Intents for user-friendly transactions
   - Aurora for EVM compatibility
   - Storage staking model (unique to NEAR)
   - Named accounts (human-readable addresses)
   - Access keys (full vs function-call)
   
6. CONFIDENCE BUILDING: 
   - Celebrate milestones: "You just wrote your first NEAR smart contract!"
   - Reference their progress: "Remember the ownership concept from earlier? This is the same pattern."
   - Encourage exploration: "Try changing the interest_rate and see how it affects the math"
```

---

## Phase 2: UI Components for Education

### 2.1 — Code Annotations Panel

**New Component: `CodeAnnotations.tsx`**

Display inline annotations alongside the generated code. When user hovers over highlighted lines, a tooltip/sidebar shows the explanation.

- Highlighted lines with colored markers (🟢 Rust concept, 🔵 NEAR-specific, 🔴 Security, ⚡ Performance)
- Click a marker to expand the full explanation
- Persistent sidebar option for "explain mode"

### 2.2 — Feature Suggestion Cards

**New Component: `FeatureSuggestion.tsx`**

After code generation, show a glassmorphism card below the chat:
- "💡 Did you know?" header
- Feature title + description
- One-click "Add this feature" button that sends the suggestion as a chat message
- Code snippet preview of what would change

### 2.3 — Interactive Quiz Inline

**New Component: `InlineQuiz.tsx`**

Renders inside the chat flow as a special message type:
- Multiple choice with clickable options
- Correct answer turns green with confetti animation
- Wrong answer shows the right one with explanation
- Track quiz score in session (feeds into achievements)
- "🧠 Quick check" header to keep it casual

### 2.4 — Knowledge Progress Tracker

**New Component: `KnowledgeTracker.tsx`**

Sidebar or top-bar widget showing the user's learning progress:
- Concepts learned this session (list of check marks)
- Skill categories: Rust Basics, NEAR SDK, Security, Gas Optimization, Cross-Chain
- Progress bar per category
- "You've learned 12 concepts this session!" counter
- Persisted to localStorage between sessions

### 2.5 — "Explain This" Button on Code Preview

**Modification: `CodePreview.tsx`**

Add a floating "Explain This" button. User can:
- Click any line in the generated code
- A tooltip or modal explains that specific line/block
- Option to "Ask Sanctum about this" which sends the line as a chat message

### 2.6 — Concept Glossary Sidebar

**New Component: `ConceptGlossary.tsx`**

Collapsible sidebar/panel with all concepts mentioned in the current session:
- Searchable list
- Grouped by category (Rust, NEAR, Security, Patterns)
- Each entry links back to where it was first explained
- "📚" icon in the toolbar to toggle

---

## Phase 3: Conversation Flow Improvements

### 3.1 — Smart Follow-Up Suggestions

After code is generated, instead of just showing options, show contextually intelligent next steps:

```
✅ Your lending pool contract is ready!

What would you like to do next?
├─ 🛡️ "Run a security audit" → triggers Sentinel persona
├─ ⚡ "Optimize gas usage" → triggers Vapor persona  
├─ 🎭 "Build the frontend" → triggers Echo persona
├─ 🧪 "Add unit tests" → generates test code
├─ 📦 "Add NEP-297 events" → feature enhancement
├─ 🚀 "Deploy to testnet" → deployment flow
```

### 3.2 — Contract Evolution Path

After a user's first contract, suggest a natural progression:

```
"Great work on your first token contract! Here's what builders typically explore next:

1. 🔄 Add a swap mechanism (DEX basics)
2. 🏦 Create a lending pool using your token
3. 🗳️ Build a DAO to govern your token
4. 🌉 Enable cross-chain transfers with Chain Signatures

Which sounds interesting?"
```

### 3.3 — "Why" Explanations for Every Decision

System prompt directive: Every time the AI makes a design choice, explain WHY:

- "I'm using `LookupMap` instead of `HashMap` because NEAR's LookupMap only loads entries you actually access — saving gas on every call."
- "I added `#[payable]` here because this function needs to accept NEAR tokens. Without it, the SDK would panic."
- "Using `u128` for balances because NEAR token amounts are in yoctoNEAR (10^24), which exceeds u64's max."

---

## Phase 4: Gamification Enhancements

### 4.1 — Learning Achievements (expand existing system)

New achievements tied to education:

```typescript
'concept_collector_5': { name: 'Concept Collector', description: 'Learned 5 Rust/NEAR concepts', icon: '📚' },
'concept_collector_20': { name: 'Knowledge Hoarder', description: 'Learned 20 concepts', icon: '🧠' },
'quiz_ace': { name: 'Quiz Ace', description: 'Got 5 quizzes right in a row', icon: '🎯' },
'security_aware': { name: 'Security Minded', description: 'Asked Sentinel to audit your code', icon: '🛡️' },
'gas_conscious': { name: 'Gas Conscious', description: 'Asked Vapor to optimize your code', icon: '⛽' },
'cross_chain_explorer': { name: 'Chain Hopper', description: 'Built a cross-chain contract', icon: '🌉' },
'full_stack': { name: 'Full Stack Builder', description: 'Built contract + frontend', icon: '🏗️' },
'three_contracts': { name: 'Contract Factory', description: 'Built 3 different contracts', icon: '🏭' },
'asked_why': { name: 'Curious Mind', description: 'Asked "why" or "how does this work"', icon: '🤔' },
```

### 4.2 — Session Summary Card

When user ends a session or navigates away, show a summary:

```
📊 Session Complete!

⏱ Duration: 12 minutes
💬 Messages: 8
📝 Contracts Built: 1
🧠 Concepts Learned: 7
  ✓ #[near(contract_state)]
  ✓ LookupMap vs HashMap
  ✓ #[payable] attribute
  ✓ Access control patterns
  ✓ yoctoNEAR precision
  ✓ Storage staking
  ✓ NEP-141 token standard
🎯 Quiz Score: 2/2
🏆 Achievements: First Code, Concept Collector

"You're building real skills. Come back to explore cross-chain with Chain Signatures!"
```

---

## Phase 5: Feature Discovery System

### 5.1 — "NEAR Can Do That?" Moments

The AI proactively introduces NEAR-unique features when contextually relevant:

| User is building... | AI suggests... |
|---|---|
| Any token contract | "Did you know NEAR has named accounts? Your token could live at `mytoken.near` instead of a hex address" |
| Access control | "NEAR has a unique Access Key system — you can create limited keys that can only call specific functions" |
| Cross-chain anything | "Chain Signatures let your contract sign Bitcoin, Ethereum, and Solana transactions natively" |
| Storage-heavy contract | "NEAR's storage staking model is unique — users deposit NEAR to cover their own storage costs" |
| DeFi/trading | "NEAR Intents let users specify outcomes instead of transactions — solvers compete to fill them" |
| AI/automation | "NEAR AI runs inference on-chain — your contract could use AI without leaving the blockchain" |

### 5.2 — Contextual Tips Based on Category

When a user picks a category (e.g., DeFi), show a brief "What you'll learn" banner:

```
🏦 DeFi on NEAR — What You'll Learn:
• How lending pools calculate interest rates
• Why u128 is critical for token math
• Cross-contract calls for token transfers
• Storage deposit patterns
• Building secure financial contracts
```

---

## Implementation Priority

1. **Phase 1** (System prompt + JSON response format) — Highest impact, least code change
2. **Phase 3** (Conversation flow) — System prompt + minor UI additions
3. **Phase 2** (UI components) — New components, moderate effort
4. **Phase 4** (Gamification) — Extends existing achievement system
5. **Phase 5** (Feature discovery) — Polish and delight

---

## Files to Modify

| File | Changes |
|------|---------|
| `api/sanctum/chat/route.ts` | Updated system prompt, expanded JSON response format, feature suggestion logic |
| `components/SanctumChat.tsx` | Render new message types (annotations, quizzes, feature cards), knowledge tracker |
| `components/CodePreview.tsx` | "Explain This" button, annotation highlighting |
| `components/AchievementPopup.tsx` | New education-related achievements |
| `hooks/useSanctumState.ts` | Track concepts learned, quiz scores, contract count |
| `lib/personas.ts` | Update persona prompts for teaching style |

### New Components

| Component | Purpose |
|-----------|---------|
| `CodeAnnotations.tsx` | Inline code explanations with colored markers |
| `FeatureSuggestion.tsx` | "Did you know?" feature discovery cards |
| `InlineQuiz.tsx` | Multiple-choice quiz inside chat flow |
| `KnowledgeTracker.tsx` | Session learning progress sidebar |
| `ConceptGlossary.tsx` | Searchable glossary of learned concepts |
| `SessionSummary.tsx` | End-of-session learning recap |
| `CategoryLearnBanner.tsx` | "What you'll learn" intro per category |

---

*This makes Sanctum not just a builder — it's a teacher, a guide, and a confidence machine. Users leave knowing MORE than when they arrived. That's the moat no one else has.*
