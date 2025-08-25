-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON public.restaurants(is_active);

CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON public.menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON public.menu_categories(display_order);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_daily_special ON public.menu_items(is_daily_special);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items(display_order);
