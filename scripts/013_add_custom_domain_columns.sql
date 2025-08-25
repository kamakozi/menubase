-- Add custom domain functionality to restaurants table
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS custom_domain TEXT,
ADD COLUMN IF NOT EXISTS domain_changes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_domain_change TIMESTAMP WITH TIME ZONE;

-- Create index for custom domain lookups
CREATE INDEX IF NOT EXISTS idx_restaurants_custom_domain ON restaurants(custom_domain);

-- Add comment
COMMENT ON COLUMN restaurants.custom_domain IS 'Custom domain for premium users';
COMMENT ON COLUMN restaurants.domain_changes_count IS 'Number of domain changes this month';
COMMENT ON COLUMN restaurants.last_domain_change IS 'Last time domain was changed';
