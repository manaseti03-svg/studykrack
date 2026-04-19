-- -------------------------------------------------------------
-- SECURITY HARDENING: ROW LEVEL SECURITY (RLS) FOR STUDYKRACK
-- -------------------------------------------------------------
-- Execute this file in your Supabase SQL Editor.

-- 1. Enable RLS on both tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_records ENABLE ROW LEVEL SECURITY;

-- 2. Drop the original "Allow all" policies we created during prototyping
DROP POLICY IF EXISTS "Allow all" ON tasks;
DROP POLICY IF EXISTS "Allow all" ON grade_records;

-- =========================================================================
-- OPTION A: If using Supabase Native Auth (auth.uid() maps to built-in auth)
-- =========================================================================
/*
CREATE POLICY "Users can only see and edit their own tasks"
  ON tasks
  FOR ALL
  USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can only see and edit their own academic records"
  ON grade_records
  FOR ALL
  USING (auth.uid() = user_id::uuid);
*/

-- =================================================================================
-- OPTION B: If using Firebase Auth together with Supabase (Current Setup)
-- Due to Firebase being a separate identity provider, you need a custom function 
-- or you must verify Firebase's JWT claims. Assuming user_id stores the Firebase UID:
-- =================================================================================

-- 1. Create a function that extracts the Firebase UID from the JWT "sub" claim
CREATE OR REPLACE FUNCTION firebase_uid() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE SQL STABLE;

-- 2. Apply policies using the function
CREATE POLICY "Users can only access their own Firebase-owned tasks"
  ON tasks
  FOR ALL
  USING (user_id = firebase_uid());

CREATE POLICY "Users can only access their own Firebase-owned grades"
  ON grade_records
  FOR ALL
  USING (user_id = firebase_uid());
  
-- =========================================================================
-- CRITICAL CONFIGURATION STEP:
-- Since you are sending Firebase JWTs to Supabase, you MUST configure Supabase 
-- to accept third-party tokens instead of rejecting them. 
-- Go to Supabase Dashboard -> Project Settings -> API 
-- and configure the specific JWT Secret or JWKS endpoint to validate Google/Firebase tokens.
-- If this isn't possible in 4 hours, revert to the "Allow All" policy and use Next.js API Routes for security.
-- =========================================================================
