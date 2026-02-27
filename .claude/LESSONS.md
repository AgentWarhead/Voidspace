# LESSONS.md — Voidspace
> ⚠️ Read BEFORE touching this project. These cost us real time and money.

1. Build tool is named "Sanctum" — never call it "Forge".
2. ALL data must be verifiable — zero hallucinated stats or claims.
3. NearBlocks/DexScreener rate limits require server-side queuing (1s gaps).
4. In-memory caches are useless on Vercel — use Supabase or Cache-Control.
5. Never use `process.exit()` in Next.js on Vercel — kills build worker.
6. `style={{display:"none"}}` is unreliable — always remove the node from DOM.
7. Removing JSX blocks with regex fails on nested tags — use indentation-aware parsing.
8. Sanctum `chatMode` is NOT persisted to localStorage — starts in Learn mode.
9. Sonnet 4.6 (not 3.5) is required for complex coding tasks.
10. `GITHUB_ACCESS_TOKEN` (not `GITHUB_TOKEN`) required for Vercel API routes.
11. DexScreener integration uses shared lib with 60s ISR caching.
12. Voidspace repo path is `/home/ubuntu/.openclaw/workspace/projects/Voidspace`.
13. `gemini-3-pro` (not `3.0-pro`) is the correct model ID for production.
14. Pulse Streams is REMOVED — do not reference or build it.
15. Sanctum monetization: Shade ($0), Specter ($25), Legion ($60), Leviathan ($200).
