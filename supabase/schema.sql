-- Skillshelf Foundation Schema
-- Run this script in your Supabase SQL Editor to initialize the database

-- 1. Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  display_name text,
  role text DEFAULT 'user'::text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create skills table
CREATE TABLE public.skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  long_description text,
  category text,
  status text DEFAULT 'draft'::text,
  skill_markdown text,
  preview_html text,
  preview_external_url text,
  cover_image_url text,
  featured boolean DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Create skill interactions
CREATE TABLE public.skill_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE TABLE public.skill_saves (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE TABLE public.skill_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_views ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Profiles: Public read, User update
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Skills: Public can read published. Only Admins can modify.
CREATE POLICY "Published skills are viewable by everyone." ON public.skills FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can view all skills." ON public.skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert skills." ON public.skills FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update skills." ON public.skills FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete skills." ON public.skills FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Likes & Saves: Public read counts, User manage their own
CREATE POLICY "Likes are viewable by everyone." ON public.skill_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes." ON public.skill_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes." ON public.skill_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Saves are viewable by everyone." ON public.skill_saves FOR SELECT USING (true);
CREATE POLICY "Users can insert their own saves." ON public.skill_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saves." ON public.skill_saves FOR DELETE USING (auth.uid() = user_id);

-- Views: Public insert (anonymous counting), Public read (for stats)
CREATE POLICY "Views are insertable by everyone." ON public.skill_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Views are viewable by everyone." ON public.skill_views FOR SELECT USING (true);

-- 6. RPC Functions
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (category text, count bigint)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT category, count(*) as count
  FROM public.skills
  WHERE status = 'published'
  GROUP BY category;
$$;

-- 7. Triggers for Automatic Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'display_name',
    'user'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- To make YOURSELF an admin, run this after you sign up on your hosted app:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
