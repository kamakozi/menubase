-- Create menu items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  allergens TEXT[], -- Array of allergen codes
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  is_daily_special BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for menu items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for menu items
CREATE POLICY "restaurant_owners_can_manage_items" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.owner_id = auth.uid()
    )
  );

-- Allow public to view available items for active restaurants
CREATE POLICY "public_can_view_available_items" ON public.menu_items
  FOR SELECT USING (
    is_available = true AND
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE restaurants.id = menu_items.restaurant_id 
      AND restaurants.is_active = true
    )
  );
