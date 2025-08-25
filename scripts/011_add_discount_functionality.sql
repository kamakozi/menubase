-- Add discount columns to menu_items table
ALTER TABLE menu_items 
ADD COLUMN original_price DECIMAL(10,2),
ADD COLUMN discount_percentage INTEGER DEFAULT 0,
ADD COLUMN discount_active BOOLEAN DEFAULT false,
ADD COLUMN discount_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN discount_end_date TIMESTAMP WITH TIME ZONE;

-- Create activity_log table for tracking user changes
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'menu_item_added', 'menu_item_updated', 'price_changed', etc.
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on activity_log
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policy for activity_log
CREATE POLICY "Users can view their restaurant activity" ON activity_log
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activity for their restaurants" ON activity_log
  FOR INSERT WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE owner_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_activity_log_restaurant_id ON activity_log(restaurant_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);
