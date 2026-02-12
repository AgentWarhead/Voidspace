-- ============================================================
-- Rebrand Sanctum Tiers: free → shade, builder → specter, hacker → legion, founder → leviathan
-- ============================================================

-- 1. Rename enum values (Postgres 10+)
ALTER TYPE sanctum_tier RENAME VALUE 'free' TO 'shade';
ALTER TYPE sanctum_tier RENAME VALUE 'builder' TO 'specter';
ALTER TYPE sanctum_tier RENAME VALUE 'hacker' TO 'legion';
ALTER TYPE sanctum_tier RENAME VALUE 'founder' TO 'leviathan';

-- 2. Update initialize_free_credits() to use 'shade'
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

-- 3. Update reset_monthly_subscription_credits() with new tier names
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

-- 4. Initialize existing user (e96b5fbf-18ed-47b9-bf2e-77770f2c54ba)
INSERT INTO subscriptions (user_id, tier, status)
VALUES ('e96b5fbf-18ed-47b9-bf2e-77770f2c54ba', 'shade', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO credit_balances (user_id, subscription_credits, topup_credits)
VALUES ('e96b5fbf-18ed-47b9-bf2e-77770f2c54ba', 2.50, 0)
ON CONFLICT DO NOTHING;

INSERT INTO credit_transactions (user_id, amount, type, description)
VALUES ('e96b5fbf-18ed-47b9-bf2e-77770f2c54ba', 2.50, 'free_grant', 'Welcome to Sanctum — free starter credits');
