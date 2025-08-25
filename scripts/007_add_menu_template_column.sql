-- Add menu_template column to restaurants table
ALTER TABLE restaurants 
ADD COLUMN menu_template VARCHAR(50) DEFAULT 'classic';

-- Add comment for the column
COMMENT ON COLUMN restaurants.menu_template IS 'Template style for menu display: classic (free), modern, elegant, minimal (premium)';

-- Update existing restaurants to use classic template
UPDATE restaurants SET menu_template = 'classic' WHERE menu_template IS NULL;
