-- =============================================
-- VOIDSPACE SUPABASE RLS POLICY RECOMMENDATIONS
-- =============================================
-- 
-- ⚠️  DO NOT APPLY DIRECTLY - REVIEW FIRST ⚠️
-- 
-- These policies enforce data security by restricting access based on 
-- user authentication and ownership. Always test in staging first.
-- 
-- Prerequisites:
-- 1. Enable RLS on all tables: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
-- 2. Ensure auth.uid() returns the correct user ID for authenticated users
-- 3. Service role operations bypass RLS (admin.ts usage)
-- =============================================

-- ---------------------------------------------
-- USERS TABLE
-- Users can only read/update their own profile
-- ---------------------------------------------

-- Allow users to read their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (for new registrations)
CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------
-- SAVED_OPPORTUNITIES TABLE  
-- Users can only CRUD their own saved opportunities
-- ---------------------------------------------

-- Allow users to read their own saved opportunities
CREATE POLICY "saved_opportunities_select_own" ON saved_opportunities
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own saved opportunities
CREATE POLICY "saved_opportunities_insert_own" ON saved_opportunities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own saved opportunities
CREATE POLICY "saved_opportunities_update_own" ON saved_opportunities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own saved opportunities
CREATE POLICY "saved_opportunities_delete_own" ON saved_opportunities
  FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------------------------------
-- USAGE TABLE
-- Users can read their own usage; inserts via service role only
-- ---------------------------------------------

-- Allow users to read their own usage statistics
CREATE POLICY "usage_select_own" ON usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for regular users
-- Usage tracking is handled server-side via service role
-- This prevents users from manipulating their usage stats

-- ---------------------------------------------
-- OPPORTUNITIES TABLE
-- Read-only for all authenticated users
-- ---------------------------------------------

-- Allow all authenticated users to read opportunities
CREATE POLICY "opportunities_select_authenticated" ON opportunities
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- No INSERT/UPDATE/DELETE policies for regular users
-- Opportunity management is admin/service-role only

-- ---------------------------------------------
-- CATEGORIES TABLE  
-- Read-only for all users (public data)
-- ---------------------------------------------

-- Allow all authenticated users to read categories
CREATE POLICY "categories_select_authenticated" ON categories
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow anonymous users to read categories (public data)
CREATE POLICY "categories_select_anon" ON categories
  FOR SELECT
  USING (auth.role() = 'anon');

-- No INSERT/UPDATE/DELETE policies for regular users
-- Category management is admin/service-role only

-- ---------------------------------------------
-- SYNC_LOGS TABLE
-- No public access - service role only
-- ---------------------------------------------

-- No policies defined = no access for regular users
-- All operations must use service role key
-- This table contains sensitive sync/admin operations

-- ---------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- Run these commands to activate the policies above
-- ---------------------------------------------

-- Uncomment to enable (review table names first):
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saved_opportunities ENABLE ROW LEVEL SECURITY;  
-- ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- TESTING CHECKLIST
-- ---------------------------------------------
-- 
-- 1. Test as authenticated user:
--    - Can read/update own profile ✓
--    - Can CRUD own saved opportunities ✓
--    - Can read own usage ✓
--    - Can read opportunities ✓
--    - Can read categories ✓
--    - Cannot access sync_logs ✓
-- 
-- 2. Test as anonymous user:
--    - Can read categories only ✓
--    - Cannot access any other tables ✓
-- 
-- 3. Test service role operations:
--    - Can perform all operations (bypasses RLS) ✓
-- 
-- 4. Test edge cases:
--    - User cannot access other users' data ✓
--    - User cannot manipulate usage stats ✓
--    - User cannot modify opportunities/categories ✓
--
-- =============================================