-- Create restaurants table for business owners
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  slug TEXT UNIQUE NOT NULL, -- For custom URLs like smartmenu.at/gasthaus-zur-post
  logo_url TEXT,
  cover_image_url TEXT,
  opening_hours JSONB, -- Store opening hours as JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for restaurants
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- RLS policies for restaurants
CREATE POLICY "restaurant_owners_can_view_own" ON public.restaurants
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "restaurant_owners_can_insert_own" ON public.restaurants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "restaurant_owners_can_update_own" ON public.restaurants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "restaurant_owners_can_delete_own" ON public.restaurants
  FOR DELETE USING (auth.uid() = owner_id);

-- Allow public to view active restaurants (for customer-facing menus)
CREATE POLICY "public_can_view_active_restaurants" ON public.restaurants
  FOR SELECT USING (is_active = true);
