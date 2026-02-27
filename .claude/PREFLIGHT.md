# PREFLIGHT.md — Voidspace
> ⚠️ Run these checks BEFORE any deploy. All must pass.

```bash
cd /home/ubuntu/.openclaw/workspace/projects/Voidspace

# 1. Build passes
npm run build 2>&1 | tail -5
echo $? | grep -q 0 && echo "✅ Build passes" || echo "❌ BUILD FAILED — fix before deploying"

# 2. Git clean
DIRTY=$(git status --porcelain 2>/dev/null | wc -l)
[ "$DIRTY" -eq 0 ] && echo "✅ Git clean" || echo "⚠️ $DIRTY uncommitted changes"

# 3. No process.exit() in codebase
EXITS=$(grep -r "process.exit" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
[ "$EXITS" -eq 0 ] && echo "✅ No process.exit() calls" || echo "❌ FOUND $EXITS process.exit() calls — REMOVE THEM (kills Vercel build worker)"

# 4. Env vars present
[ -f .env.local ] && echo "✅ .env.local exists" || echo "⚠️ No .env.local — check Vercel env vars"

# 5. Disk space
FREE=$(df -BG / | tail -1 | awk '{print $4}' | tr -d 'G')
[ "$FREE" -gt 3 ] && echo "✅ Disk: ${FREE}GB free" || echo "❌ DISK LOW"

# 6. No hallucinated data (manual check)
echo "⚠️ MANUAL: Verify all stats/claims are sourced. Nearcon judges WILL check."
```
