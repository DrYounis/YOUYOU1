-- ============================================
-- YOUNIS STORE - SUPABASE SETUP
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Customer info
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Delivery info
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('school', 'home')),
    school_name TEXT,
    home_address TEXT,
    home_city TEXT,
    home_phone TEXT,
    
    -- Payment info
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'apple_pay')),
    price NUMERIC NOT NULL DEFAULT 50,
    currency TEXT NOT NULL DEFAULT 'SAR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    
    -- Delivery tracking
    delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'preparing', 'ready', 'delivered')),
    delivery_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Image
    image_url TEXT NOT NULL,
    
    -- Admin tracking
    payment_confirmed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(delivery_status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
-- Allow anyone to insert orders (for store purchases)
CREATE POLICY "Anyone can create orders"
    ON orders
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Restrict reads to authenticated users only (for admin)
-- Note: For simple setup without auth, you can make this public
-- But it's better to use Supabase Auth for admin access
CREATE POLICY "Authenticated users can read orders"
    ON orders
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update orders
CREATE POLICY "Authenticated users can update orders"
    ON orders
    FOR UPDATE
    TO authenticated
    USING (true);

-- 5. Create Storage Bucket for puzzle images
-- Run this separately in Supabase Dashboard > Storage > Create bucket
-- Bucket name: puzzle-images
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage policies (run after creating bucket):
-- Allow public uploads to puzzle-images bucket
CREATE POLICY "Anyone can upload to puzzle-images"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'puzzle-images');

-- Allow public reads from puzzle-images bucket
CREATE POLICY "Anyone can view puzzle-images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'puzzle-images');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named "puzzle-images"
-- 3. Set it to Public
-- 4. The policies above will automatically apply
-- 5. Test your store at /store
-- ============================================
