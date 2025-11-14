-- Add icon and icon_color columns to products table
ALTER TABLE products
ADD COLUMN icon TEXT DEFAULT 'Package',
ADD COLUMN icon_color TEXT DEFAULT '#8b5cf6';

-- Add comment for documentation
COMMENT ON COLUMN products.icon IS 'Lucide icon name for the product';
COMMENT ON COLUMN products.icon_color IS 'Hex color code for the product icon';
