# Sanctum Pricing Specification — LOCKED IN

## Philosophy
- ALL Voidspace tools are 100% FREE (ecosystem intel, bubbles, ticker, learn, deep dives)
- Sanctum is the ONLY paywalled feature — credit-gated AI builder
- We are the ONLY crypto vibe-coding + education platform. Premium positioning, no undercutting.

## Subscription Tiers

| Tier | Price/mo | Credits/mo | Annual | Features |
|------|----------|------------|--------|----------|
| Free | $0 | $2.50 (one-time) | — | Sanctum access, starter templates, community support |
| Builder | $25/mo | $25 | $250/yr (2mo free) | Opus 4.6, all templates, guided Rust curriculum, project export, 3 active projects |
| Hacker | $60/mo | $70 | $600/yr (2mo free) | Everything in Builder + unlimited projects, contract auditing, advanced NEAR tooling, priority queue |
| Founder | $200/mo | $230 | $2,000/yr (2mo free) | Everything in Hacker + dedicated capacity, team seats (3), priority support, white-label deploys |

## Top-Up Packs (buy anytime, never expire)

| Pack | Price | Credits | Bonus |
|------|-------|---------|-------|
| Spark | $5 | $5 | — |
| Boost | $20 | $22 | 10% |
| Surge | $50 | $58 | 16% |
| Overload | $100 | $120 | 20% |

## Credit Rules
- 1 credit = $1 of AI compute (at our marked-up rate)
- Subscription credits reset monthly (don't roll over)
- Top-up credits NEVER expire
- System burns subscription credits FIRST, then top-ups
- Top-ups available to ALL tiers including Free

## Markup & Economics
- **Markup: 3x on raw API cost**
- Raw Opus 4.6: Input $15/M tokens, Output $75/M tokens
- $1 user credit = ~$0.33 raw API cost
- Average Sanctum session: ~40K input + ~15K output = ~$1.75 raw = ~$5.25 in credits

### Per-Tier Margins
| Tier | Revenue | API Cost | Profit/User/Mo | Margin % |
|------|---------|----------|----------------|----------|
| Free | $0 | $0.83 | -$0.83 | Loss leader |
| Builder | $25 | $8.33 | $16.67 | 67% |
| Hacker | $60 | $23.33 | $36.67 | 61% |
| Founder | $200 | $76.67 | $123.33 | 62% |

## Technical Requirements
1. **Stripe Integration:** Products + Prices for 4 tiers (monthly + annual) + 4 top-up packs
2. **Supabase Tables:** subscriptions, credit_balances, credit_transactions, top_ups
3. **API Routes:** /api/stripe/checkout, /api/stripe/webhook, /api/credits/balance, /api/credits/usage
4. **Pricing Page:** /pricing (new route)
5. **Credit Middleware:** Track token usage in Sanctum, deduct credits in real-time
6. **User Dashboard:** Credit balance display, usage history, upgrade/top-up buttons

## Stripe Product IDs (to be created)
- prod_sanctum_builder_monthly
- prod_sanctum_builder_annual
- prod_sanctum_hacker_monthly
- prod_sanctum_hacker_annual
- prod_sanctum_founder_monthly
- prod_sanctum_founder_annual
- prod_topup_spark
- prod_topup_boost
- prod_topup_surge
- prod_topup_overload
