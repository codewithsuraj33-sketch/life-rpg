-- Update Profiles Table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS class_type text DEFAULT 'Novice',
ADD COLUMN IF NOT EXISTS last_login_date date;

-- Create Bosses Table
CREATE TABLE IF NOT EXISTS public.bosses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  max_hp integer NOT NULL,
  current_hp integer NOT NULL,
  image_url text,
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Bosses
ALTER TABLE public.bosses ENABLE ROW LEVEL SECURITY;

-- Bosses Policies (Anyone can read, authenticated users can update)
CREATE POLICY "Anyone can view bosses" ON public.bosses
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update bosses" ON public.bosses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert Initial Boss
INSERT INTO public.bosses (name, max_hp, current_hp, image_url, is_active)
VALUES ('The Procrastination Dragon 🐉', 10000, 10000, '🐉', true);
