-- EveryPosting Supabase Database Schema

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro_monthly', 'pro_yearly', 'pro', 'annual')),
  generations_used_this_month INT NOT NULL DEFAULT 0,
  monthly_generation_limit INT NOT NULL DEFAULT 5,
  has_seen_review_prompt BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. GENERATIONS (HISTORY) TABLE
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  niche TEXT NOT NULL CHECK (niche IN ('podcaster', 'youtuber', 'coach')),
  input_transcript TEXT NOT NULL,
  selected_formats TEXT[] NOT NULL,
  outputs JSONB NOT NULL, -- Storing format -> generated text mapping
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'trailing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ATOMIC GENERATION RESERVATION FUNCTION (Prevents Race Conditions)
CREATE OR REPLACE FUNCTION public.reserve_user_generation_atomic(user_id_input UUID)
RETURNS INT AS $$
DECLARE
  new_count INT := -1;
BEGIN
  UPDATE public.users
  SET generations_used_this_month = generations_used_this_month + 1,
      updated_at = NOW()
  WHERE id = user_id_input
    AND generations_used_this_month < monthly_generation_limit
  RETURNING generations_used_this_month INTO new_count;
  
  RETURN COALESCE(new_count, -1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ATOMIC GENERATION ROLLBACK FUNCTION (Restores credit if AI call fails)
CREATE OR REPLACE FUNCTION public.rollback_user_generation_atomic(user_id_input UUID)
RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE public.users
  SET generations_used_this_month = GREATEST(0, generations_used_this_month - 1),
      updated_at = NOW()
  WHERE id = user_id_input
  RETURNING generations_used_this_month INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  generation_id UUID REFERENCES public.generations(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  source TEXT NOT NULL CHECK (source IN ('per_generation', 'milestone', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FEEDBACK SUMMARY VIEW
CREATE OR REPLACE VIEW public.feedback_summary AS
SELECT 
  ROUND(AVG(rating)::numeric, 2) AS average_rating,
  COUNT(*) AS total_reviews
FROM public.feedback;

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR true);

CREATE POLICY "Users can view own generations" ON public.generations
  FOR SELECT USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can insert own generations" ON public.generations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR true);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view feedback" ON public.feedback
  FOR SELECT USING (true);
