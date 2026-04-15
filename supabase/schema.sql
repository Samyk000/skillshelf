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
  updated_at timestamp with time zone DEFAULT now(),
  view_count bigint DEFAULT 0,
  like_count bigint DEFAULT 0
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

-- 8. Indexes for Sorting Performance
CREATE INDEX IF NOT EXISTS idx_skills_view_count ON public.skills (view_count DESC);
CREATE INDEX IF NOT EXISTS idx_skills_like_count ON public.skills (like_count DESC);

-- 9. Triggers for Automatic Counting
CREATE OR REPLACE FUNCTION increment_skill_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.skills SET view_count = view_count + 1 WHERE id = NEW.skill_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_skill_view_inserted ON public.skill_views;
CREATE TRIGGER on_skill_view_inserted
  AFTER INSERT ON public.skill_views
  FOR EACH ROW EXECUTE PROCEDURE increment_skill_view_count();

CREATE OR REPLACE FUNCTION handle_skill_like_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.skills SET like_count = like_count + 1 WHERE id = NEW.skill_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.skills SET like_count = like_count - 1 WHERE id = OLD.skill_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS on_skill_like_changed ON public.skill_likes;
CREATE TRIGGER on_skill_like_changed
  AFTER INSERT OR DELETE ON public.skill_likes
  FOR EACH ROW EXECUTE PROCEDURE handle_skill_like_count();

-- 10. Optimized Sorting RPCs
CREATE OR REPLACE FUNCTION public.get_skills_sorted_by_views(p_limit integer DEFAULT 6, p_offset integer DEFAULT 0, p_category text DEFAULT NULL::text)
 RETURNS SETOF skills
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM skills
  WHERE status = 'published'
    AND (p_category IS NULL OR category = p_category)
  ORDER BY view_count DESC, created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_skills_sorted_by_likes(p_limit integer DEFAULT 6, p_offset integer DEFAULT 0, p_category text DEFAULT NULL::text)
 RETURNS SETOF skills
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM skills
  WHERE status = 'published'
    AND (p_category IS NULL OR category = p_category)
  ORDER BY like_count DESC, created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$;
