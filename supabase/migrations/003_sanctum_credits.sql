-- ============================================================
-- Sanctum Credit System: Subscriptions, Balances, Transactions
-- ============================================================

-- Sanctum subscription tiers enum
CREATE TYPE sanctum_tier AS ENUM ('shade', 'specter', 'legion', 'leviathan');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
CREATE TYPE credit_transaction_type AS ENUM ('subscription_grant', 'usage', 'topup', 'free_grant');

-- ============================================================
-- Subscriptions Table
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier sanctum_tier NOT NULL DEFAULT 'shade',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);

-- ============================================================
-- Credit Balances Table
-- ============================================================
CREATE TABLE IF NOT EXISTS credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_credits NUMERIC(10, 2) NOT NULL DEFAULT 0,
  topup_credits NUMERIC(10, 2) NOT NULL DEFAULT 0,
  last_reset TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_balance UNIQUE (user_id)
);

CREATE INDEX idx_credit_balances_user_id ON credit_balances(user_id);

-- ============================================================
-- Credit Transactions Table
-- ============================================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 4) NOT NULL,
  type credit_transaction_type NOT NULL,
  description TEXT,
  session_id TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_created ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_session ON credit_transactions(session_id) WHERE session_id IS NOT NULL;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Users can read their own balance
CREATE POLICY "Users can view own balance"
  ON credit_balances FOR SELECT
  USING (user_id = auth.uid());

-- Users can read their own transactions
CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  USING (user_id = auth.uid());

-- Service role can do everything (for webhooks and server-side ops)
CREATE POLICY "Service role full access subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access balances"
  ON credit_balances FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access transactions"
  ON credit_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_balances_updated_at
  BEFORE UPDATE ON credit_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Initialize free tier balance on user creation
-- ============================================================
CREATE OR REPLACE FUNCTION initialize_free_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'shade', 'active')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO credit_balances (user_id, subscription_credits, topup_credits)
  VALUES (NEW.id, 2.50, 0)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 2.50, 'free_grant', 'Welcome to Sanctum — free starter credits');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_init_credits
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION initialize_free_credits();

-- ============================================================
-- Monthly credit reset function (call via pg_cron or edge function)
-- ============================================================
CREATE OR REPLACE FUNCTION reset_monthly_subscription_credits()
RETURNS void AS $$
DECLARE
  tier_credits RECORD;
BEGIN
  FOR tier_credits IN
    SELECT s.user_id, s.tier,
      CASE s.tier
        WHEN 'specter' THEN 25.00
        WHEN 'legion' THEN 70.00
        WHEN 'leviathan' THEN 230.00
        ELSE 0.00
      END AS credit_amount
    FROM subscriptions s
    WHERE s.status = 'active'
      AND s.tier != 'shade'
  LOOP
    UPDATE credit_balances
    SET subscription_credits = tier_credits.credit_amount,
        last_reset = now()
    WHERE user_id = tier_credits.user_id;

    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (tier_credits.user_id, tier_credits.credit_amount, 'subscription_grant',
            'Monthly credit reset — ' || tier_credits.tier || ' tier');
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
