-- Fix template column name in restaurants table
ALTER TABLE restaurants 
RENAME COLUMN template TO menu_template;

-- Update any existing restaurants to use classic template as default
UPDATE restaurants 
SET menu_template = 'classic' 
WHERE menu_template IS NULL;
