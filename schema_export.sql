-- Complete database schema export for saas-boilerplate
-- Generated on: 2025-05-04
-- This file will recreate all tables, functions, triggers, policies, etc.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";

-- Clean up any existing schema (uncomment if needed)
-- DROP TABLE IF EXISTS "subscriptions" CASCADE;
-- DROP TABLE IF EXISTS "profiles" CASCADE;
-- DROP TABLE IF EXISTS "feedback" CASCADE;
-- DROP TABLE IF EXISTS "email_list" CASCADE;

-- Create custom types
DROP TYPE IF EXISTS subscription_status_updated CASCADE;
CREATE TYPE subscription_status_updated AS ENUM (
  'active',
  'ending',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trial',
  'paused',
  'unpaid',
  'pending',
  'expired'
);

-- Table: profiles
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL UNIQUE,
  "email" text,
  "first_name" text,
  "last_name" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Table: subscriptions
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "profiles"("user_id"),
  "product_id" text,
  "billing_period" text,
  "status" subscription_status_updated NOT NULL,
  "current_period_start" timestamp with time zone,
  "current_period_end" timestamp with time zone,
  "cancel_at_period_end" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  "amount" integer,
  "currency" text,
  "customer_id" uuid
);

-- Table: feedback
CREATE TABLE IF NOT EXISTS "feedback" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL,
  "user_email" text,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "type" text NOT NULL CHECK (type = ANY (ARRAY['bug'::text, 'feature'::text, 'general'::text])),
  "status" text NOT NULL DEFAULT 'open'::text CHECK (status = ANY (ARRAY['open'::text, 'in_progress'::text, 'resolved'::text, 'closed'::text])),
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Table: email_list
CREATE TABLE IF NOT EXISTS "email_list" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);
COMMENT ON TABLE "email_list" IS 'Stores email addresses for newsletter subscribers';

-- Function: requesting_user_id()
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT 
    COALESCE(
        current_setting('request.jwt.claims', true)::json->>'sub',
        NULL
    )::TEXT
$$;

-- Function: handle_profile_update()
CREATE OR REPLACE FUNCTION handle_profile_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function: update_updated_at_column()
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function: has_active_subscription()
CREATE OR REPLACE FUNCTION has_active_subscription(user_id_param text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions 
    WHERE user_id = user_id_param 
    AND status IN ('active', 'ending', 'trial', 'past_due') 
    AND (current_period_end > now() OR current_period_end IS NULL)
  );
END;
$$;

-- Function: get_subscription_by_clerk_id()
CREATE OR REPLACE FUNCTION get_subscription_by_clerk_id(clerk_id text)
RETURNS TABLE(
  id uuid, 
  user_id text, 
  product_id text, 
  status text, 
  current_period_start timestamp with time zone, 
  current_period_end timestamp with time zone, 
  amount integer, 
  currency text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  billing_period text
)
LANGUAGE sql
AS $$
  SELECT 
    s.id,
    s.user_id,
    s.product_id,
    s.status::text,
    s.current_period_start,
    s.current_period_end,
    s.amount,
    s.currency,
    s.created_at,
    s.updated_at,
    s.billing_period
  FROM public.subscriptions s
  WHERE s.user_id = clerk_id
  AND s.status = 'active';
$$;

-- Function: debug_find_user_by_email()
CREATE OR REPLACE FUNCTION debug_find_user_by_email(email_to_find text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if the email exists with exact match
  SELECT jsonb_build_object(
    'exact_match_count', COUNT(*),
    'exact_match_users', COALESCE(jsonb_agg(jsonb_build_object('user_id', user_id, 'email', email)), '[]'::jsonb)
  )
  INTO result
  FROM profiles
  WHERE email = email_to_find;

  -- Check case-insensitive match
  result = result || jsonb_build_object(
    'ilike_match_count', (SELECT COUNT(*) FROM profiles WHERE email ILIKE email_to_find),
    'ilike_match_users', COALESCE((SELECT jsonb_agg(jsonb_build_object('user_id', user_id, 'email', email)) 
                          FROM profiles 
                          WHERE email ILIKE email_to_find), '[]'::jsonb)
  );
  
  -- Check trimmed match
  result = result || jsonb_build_object(
    'trimmed_match_count', (SELECT COUNT(*) FROM profiles WHERE TRIM(email) = TRIM(email_to_find)),
    'similar_emails', COALESCE((SELECT jsonb_agg(email) 
                           FROM profiles 
                           WHERE email ILIKE '%' || regexp_replace(email_to_find, '[^a-zA-Z0-9]', '%', 'g') || '%'), '[]'::jsonb)
  );
  
  -- Add metadata about the input
  result = result || jsonb_build_object(
    'input_email', email_to_find,
    'input_length', LENGTH(email_to_find),
    'input_trimmed', TRIM(email_to_find),
    'input_lower', LOWER(email_to_find)
  );
  
  RETURN result;
END;
$$;

-- Function: log_subscription_update()
CREATE OR REPLACE FUNCTION log_subscription_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only log if status has changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    RAISE NOTICE 'Subscription % status changed: % -> %', 
      NEW.id, 
      OLD.status, 
      NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: trigger_set_timestamp()
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function: get_active_subscription()
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id text)
RETURNS TABLE(
  subscription_id text, 
  status text, 
  product_id text, 
  amount integer, 
  currency text, 
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean
)
LANGUAGE sql
AS $$
  SELECT 
    id::text as subscription_id,
    status::text,
    product_id,
    amount,
    currency,
    current_period_end,
    cancel_at_period_end
  FROM subscriptions
  WHERE user_id = p_user_id
  AND status IN ('active', 'trial', 'past_due')
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Function: get_user_subscription_history()
CREATE OR REPLACE FUNCTION get_user_subscription_history(p_user_id text)
RETURNS TABLE(
  subscription_id text, 
  status text, 
  product_id text, 
  amount integer, 
  currency text, 
  created_at timestamp with time zone,
  current_period_end timestamp with time zone,
  is_active boolean
)
LANGUAGE sql
AS $$
  SELECT 
    id::text as subscription_id,
    status::text,
    product_id,
    amount,
    currency,
    created_at,
    current_period_end,
    (status IN ('active', 'trial', 'past_due') AND (current_period_end > now() OR current_period_end IS NULL)) as is_active
  FROM subscriptions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC;
$$;

-- Function: find_user_subscriptions_by_email()
CREATE OR REPLACE FUNCTION find_user_subscriptions_by_email(p_email text)
RETURNS TABLE(
  user_id text,
  subscription_id text,
  status text,
  product_id text,
  amount integer,
  currency text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone,
  is_active boolean,
  first_name text,
  last_name text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.user_id,
    s.id::text as subscription_id,
    s.status::text,
    s.product_id,
    s.amount,
    s.currency,
    s.current_period_end,
    s.created_at,
    (s.status IN ('active', 'trial', 'past_due') AND (s.current_period_end > now() OR s.current_period_end IS NULL)) as is_active,
    p.first_name,
    p.last_name
  FROM profiles p
  JOIN subscriptions s ON p.user_id = s.user_id
  WHERE p.email ILIKE p_email
  ORDER BY s.created_at DESC;
$$;

-- Function: update_subscription_status()
CREATE OR REPLACE FUNCTION update_subscription_status(p_subscription_id text, p_status text, p_cancel_at_period_end boolean DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status subscription_status_updated;
  v_updated boolean := false;
BEGIN
  -- Convert text to enum
  BEGIN
    v_status := p_status::subscription_status_updated;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'Invalid subscription status: %', p_status;
    RETURN false;
  END;
  
  -- Update the subscription
  UPDATE subscriptions
  SET 
    status = v_status,
    cancel_at_period_end = COALESCE(p_cancel_at_period_end, cancel_at_period_end),
    updated_at = now()
  WHERE id::text = p_subscription_id;
  
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  
  RETURN v_updated > 0;
END;
$$;

-- Function: cleanup_old_transactions()
CREATE OR REPLACE FUNCTION cleanup_old_transactions(IN older_than_days integer DEFAULT 365)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add your cleanup logic here if needed
  -- For example, archiving old subscriptions
  RAISE NOTICE 'Cleaning up transactions older than % days', older_than_days;
END;
$$;

-- Trigger: set_profiles_updated_at
CREATE TRIGGER set_profiles_updated_at 
BEFORE UPDATE ON profiles 
FOR EACH ROW EXECUTE FUNCTION handle_profile_update();

-- Trigger: log_subscription_changes
CREATE TRIGGER log_subscription_changes
AFTER UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION log_subscription_update();

-- Trigger: update_feedback_updated_at
CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON feedback
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: set_timestamp (for email_list)
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON email_list
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- RLS Policies: profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable insert access for authenticated users" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Enable update for users based on user_id" 
ON profiles FOR UPDATE 
TO authenticated 
USING (requesting_user_id() = user_id);

CREATE POLICY "Prevent deletion" 
ON profiles FOR DELETE 
TO authenticated 
USING (false);

-- RLS Policies: subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access all subscriptions" 
ON subscriptions FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Users can view their own subscriptions" 
ON subscriptions FOR SELECT 
TO authenticated 
USING (user_id = requesting_user_id());

-- RLS Policies: feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can access all feedback" 
ON feedback FOR ALL 
TO service_role 
USING (true);

CREATE POLICY "Users can view their own feedback" 
ON feedback FOR SELECT 
TO authenticated 
USING (user_id = requesting_user_id());

CREATE POLICY "Users can submit feedback" 
ON feedback FOR INSERT 
TO authenticated 
WITH CHECK (user_id = requesting_user_id());

-- RLS Policies: email_list
ALTER TABLE email_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for service role" 
ON email_list FOR INSERT 
TO service_role;

CREATE POLICY "Allow select for service role" 
ON email_list FOR SELECT 
TO service_role 
USING (true);

CREATE POLICY "Allow anonymous to insert emails" 
ON email_list FOR INSERT 
TO anon;

CREATE POLICY "Allow anon to read emails they insert" 
ON email_list FOR SELECT 
TO anon 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_email_list_email ON email_list(email);

-- Add comments to tables and columns
COMMENT ON COLUMN subscriptions.customer_id IS 'Stores the Polar customer ID for subscription management';
COMMENT ON COLUMN subscriptions.status IS '
Status meanings:
1. active - The subscription is currently valid and the customer is being billed according to the subscription cycle.
2. ending - The subscription has been set to not renew at the end of the current billing period. It remains active until the end date.
3. canceled - The subscription has been terminated before the end of the billing period. Depending on settings, access might be revoked immediately.
4. past_due - Payment failed but the system is still attempting to collect payment. The subscription is still considered active during this grace period.
5. unpaid - After multiple failed payment attempts, the subscription enters this state before being canceled.
6. trial - Customer is in a trial period and has not been charged yet.
7. incomplete - Checkout was initiated but not completed.
8. paused - Subscription is temporarily suspended but can be reactivated later.
9. pending - Waiting for an action (like payment confirmation) before becoming active.
10. expired - Subscription has reached its end date and is no longer active.
';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'Indicates if the subscription has been cancelled but remains active until the end of the billing period. When true, the subscription should be displayed with "ending" status even if still technically active.'; 

COMMENT ON COLUMN feedback.type IS 'Type of feedback: bug, feature, or general';
COMMENT ON COLUMN feedback.status IS 'Status of the feedback: open, in_progress, resolved, or closed';

-- Create auth helper function for checking active subscriptions
CREATE OR REPLACE FUNCTION auth.has_active_subscription()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id text;
  has_subscription boolean;
BEGIN
  -- Get user_id from JWT
  user_id := (SELECT auth.uid())::text;
  
  -- Check if user has active subscription
  RETURN public.has_active_subscription(user_id);
END;
$$; 