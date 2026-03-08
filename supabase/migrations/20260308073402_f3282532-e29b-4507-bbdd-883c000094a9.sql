-- Create table for storing roast results (public leaderboard)
CREATE TABLE public.roast_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_username TEXT NOT NULL,
  github_name TEXT,
  avatar_url TEXT,
  roast TEXT NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  code_quality_score INTEGER NOT NULL DEFAULT 0,
  originality_score INTEGER NOT NULL DEFAULT 0,
  consistency_score INTEGER NOT NULL DEFAULT 0,
  documentation_score INTEGER NOT NULL DEFAULT 0,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  project_ideas TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roast_results ENABLE ROW LEVEL SECURITY;

-- Anyone can view roast results (public leaderboard)
CREATE POLICY "Roast results are publicly readable"
  ON public.roast_results FOR SELECT
  USING (true);

-- Only edge functions (service role) can insert
CREATE POLICY "Service role can insert roast results"
  ON public.roast_results FOR INSERT
  WITH CHECK (true);

-- Index for leaderboard queries
CREATE INDEX idx_roast_results_score ON public.roast_results (overall_score DESC);
CREATE INDEX idx_roast_results_username ON public.roast_results (github_username);
CREATE INDEX idx_roast_results_created ON public.roast_results (created_at DESC);