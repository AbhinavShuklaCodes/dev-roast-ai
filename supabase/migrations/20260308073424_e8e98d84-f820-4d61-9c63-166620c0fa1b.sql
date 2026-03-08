-- Drop the overly permissive INSERT policy
DROP POLICY "Service role can insert roast results" ON public.roast_results;

-- No INSERT policy for anon/authenticated - only service_role (which bypasses RLS) can insert
-- This means edge functions using service role key can insert, but no client-side inserts are allowed