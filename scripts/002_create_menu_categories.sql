-- Create menu categories table
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for menu categories
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for menu categories
CREATE POLICY "restaurant_owners_can_manage_categories" ON public.menu_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_categories.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Allow public to view active categories for active restaurants
CREATE POLICY "public_can_view_active_categories" ON public.menu_categories
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_categories.restaurant_id 
      AND restaurants.is_active = true
    )
  );
