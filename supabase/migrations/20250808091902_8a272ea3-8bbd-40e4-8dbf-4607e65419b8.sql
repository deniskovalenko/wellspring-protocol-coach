-- Drop existing RLS policies that depend on user_id columns
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

-- Fix user_id columns to accept Firebase auth strings instead of UUIDs
ALTER TABLE public.user_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.user_goals ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.user_commitments ALTER COLUMN user_id TYPE TEXT;

-- Recreate RLS policies with corrected user_id types
-- User progress policies
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own progress" 
ON public.user_progress 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- User goals policies
CREATE POLICY "Users can view their own goals" 
ON public.user_goals 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own goals" 
ON public.user_goals 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.user_goals 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.user_goals 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- User commitments policies
CREATE POLICY "Users can view their own commitments" 
ON public.user_commitments 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own commitments" 
ON public.user_commitments 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own commitments" 
ON public.user_commitments 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own commitments" 
ON public.user_commitments 
FOR DELETE 
USING (auth.uid()::text = user_id);