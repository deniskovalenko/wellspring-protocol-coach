-- Drop existing tables to recreate with new schema
DROP TABLE IF EXISTS public.user_commitments;
DROP TABLE IF EXISTS public.user_goals;

-- Create user_goals table with integer budget
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  struggle TEXT NOT NULL,
  time_per_day INTEGER NOT NULL, -- minutes
  budget INTEGER NOT NULL, -- 1=low, 2=medium, 3=high
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create protocols table for reusable protocol templates
CREATE TABLE public.protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL, -- sleep, energy, focus, etc.
  actions JSONB NOT NULL, -- array of action objects
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_commitments table linking goals to selected protocols
CREATE TABLE public.user_commitments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID NOT NULL REFERENCES public.user_goals(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES public.protocols(id) ON DELETE CASCADE,
  commitment_text TEXT NOT NULL,
  selected_actions JSONB NOT NULL, -- array of selected action IDs/indices
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_commitments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_goals
CREATE POLICY "Users can view their own goals" 
ON public.user_goals 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own goals" 
ON public.user_goals 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own goals" 
ON public.user_goals 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own goals" 
ON public.user_goals 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- RLS Policies for protocols (public read, admin write)
CREATE POLICY "Anyone can view protocols" 
ON public.protocols 
FOR SELECT 
USING (true);

-- RLS Policies for user_commitments
CREATE POLICY "Users can view their own commitments" 
ON public.user_commitments 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own commitments" 
ON public.user_commitments 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own commitments" 
ON public.user_commitments 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own commitments" 
ON public.user_commitments 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at
BEFORE UPDATE ON public.protocols
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_commitments_updated_at
BEFORE UPDATE ON public.user_commitments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample protocols
INSERT INTO public.protocols (name, summary, category, actions) VALUES
(
  'Evening Reset Protocol',
  'Improve sleep quality by managing light, supplements, and routine.',
  'sleep',
  '[
    {
      "id": "block_blue_light",
      "title": "Block Blue Light",
      "description": "Wear blue-light blocking glasses after 8pm.",
      "timing": "Evening",
      "why": "Reduces melatonin suppression and supports sleep onset."
    },
    {
      "id": "magnesium_supplement",
      "title": "Take Magnesium",
      "description": "Take 200-400mg magnesium glycinate 1-2 hours before bed.",
      "timing": "Evening",
      "why": "Supports muscle relaxation and nervous system calming."
    },
    {
      "id": "room_temperature",
      "title": "Cool Bedroom",
      "description": "Set bedroom temperature to 65-68°F (18-20°C).",
      "timing": "Bedtime",
      "why": "Lower core body temperature triggers sleepiness."
    },
    {
      "id": "blackout_curtains",
      "title": "Complete Darkness",
      "description": "Use blackout curtains or eye mask for complete darkness.",
      "timing": "Bedtime",
      "why": "Even small amounts of light can disrupt melatonin production."
    }
  ]'::jsonb
),
(
  'Morning Energy Boost',
  'Kickstart your day with natural energy and focus enhancement.',
  'energy',
  '[
    {
      "id": "morning_sunlight",
      "title": "Morning Sunlight",
      "description": "Get 10-15 minutes of direct sunlight within 1 hour of waking.",
      "timing": "Morning",
      "why": "Sets circadian rhythm and boosts cortisol awakening response."
    },
    {
      "id": "cold_shower",
      "title": "Cold Shower",
      "description": "End shower with 30-90 seconds of cold water.",
      "timing": "Morning",
      "why": "Increases norepinephrine and dopamine for sustained energy."
    },
    {
      "id": "protein_breakfast",
      "title": "High-Protein Breakfast",
      "description": "Eat 25-30g protein within 2 hours of waking.",
      "timing": "Morning",
      "why": "Stabilizes blood sugar and provides sustained energy."
    }
  ]'::jsonb
),
(
  'Focus Enhancement Protocol',
  'Optimize cognitive performance and sustained attention.',
  'focus',
  '[
    {
      "id": "pomodoro_technique",
      "title": "Pomodoro Sessions",
      "description": "Work in 25-minute focused blocks with 5-minute breaks.",
      "timing": "Work hours",
      "why": "Leverages natural attention spans and prevents mental fatigue."
    },
    {
      "id": "eliminate_distractions",
      "title": "Phone in Drawer",
      "description": "Place phone in desk drawer during focused work.",
      "timing": "Work hours",
      "why": "Mere presence of phone reduces cognitive capacity by 10%."
    },
    {
      "id": "alpha_gpc",
      "title": "Alpha-GPC Supplement",
      "description": "Take 300-600mg Alpha-GPC on empty stomach.",
      "timing": "30 min before work",
      "why": "Increases acetylcholine for enhanced focus and memory."
    }
  ]'::jsonb
);