-- Remove RLS policies that depend on Supabase auth.uid() since we're using Firebase auth
-- We'll handle authorization at the application level instead

-- Disable RLS on all tables since we're using Firebase auth
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals DISABLE ROW LEVEL SECURITY; 
ALTER TABLE public.user_commitments DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can create their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete their own progress" ON public.user_progress;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.user_goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.user_goals;

DROP POLICY IF EXISTS "Users can view their own commitments" ON public.user_commitments;
DROP POLICY IF EXISTS "Users can create their own commitments" ON public.user_commitments;
DROP POLICY IF EXISTS "Users can update their own commitments" ON public.user_commitments;
DROP POLICY IF EXISTS "Users can delete their own commitments" ON public.user_commitments;