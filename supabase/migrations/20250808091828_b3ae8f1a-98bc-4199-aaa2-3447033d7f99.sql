-- Fix user_id columns to accept Firebase auth strings instead of UUIDs
ALTER TABLE public.user_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.user_goals ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE public.user_commitments ALTER COLUMN user_id TYPE TEXT;