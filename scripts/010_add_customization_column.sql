-- Add customization column to restaurants table
ALTER TABLE restaurants ADD COLUMN customization JSONB DEFAULT '{}';

-- Update existing restaurants with default customization
UPDATE restaurants 
SET customization = '{
  "primaryColor": "#d97706",
  "secondaryColor": "#92400e", 
  "backgroundColor": "#fefbf3",
  "fontFamily": "Inter"
}'::jsonb
WHERE customization IS NULL OR customization = '{}'::jsonb;
