# Pre-Launch Security Checklist

## Before Going Live

### 1. Rotate SYNC_API_KEY
The current value `"voidspace-sync-2026"` is predictable. Replace it with a random string.

**Steps:**
1. Generate a new key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update `.env.local` with the new value
3. Update the Vercel environment variable
4. Update any cron jobs or external services that call `/api/sync` with the new Bearer token

### 2. Test CSP with Wallet Connect
The Content-Security-Policy in `next.config.mjs` allowlists known domains. Wallet-selector modals may connect to additional domains not yet listed.

**Steps:**
1. Open browser DevTools > Console on the deployed site
2. Connect each wallet type (MyNearWallet, Meteor, HERE)
3. Look for CSP violation errors like `Refused to connect to 'https://...'`
4. For each blocked domain, add it to the `connect-src` list in `next.config.mjs` line 29
