-- Added menu analytics table for real-time analytics tracking
CREATE TABLE IF NOT EXISTS menu_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 1,
  session_duration INTEGER, -- in seconds
  device_type TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_analytics_restaurant_id ON menu_analytics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_analytics_created_at ON menu_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_menu_analytics_visitor_id ON menu_analytics(visitor_id);

-- Add view_count column to menu_items if it doesn't exist
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create trigger to update view_count when analytics are inserted
CREATE OR REPLACE FUNCTION update_menu_item_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE menu_items 
  SET view_count = view_count + NEW.views
  WHERE id = NEW.menu_item_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_view_count
  AFTER INSERT ON menu_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_item_view_count();

-- Enable RLS
ALTER TABLE menu_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own restaurant analytics" ON menu_analytics
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow public to insert analytics" ON menu_analytics
  FOR INSERT WITH CHECK (true);
