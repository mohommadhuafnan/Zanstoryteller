-- ========================================================
-- Zan Storyteller - Idempotent Supabase Database & Storage Setup
-- Project Ref: cixleelzsctwspdtoffh
-- Safe to run multiple times without any errors.
-- ========================================================

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT DEFAULT 'Studio / To be agreed',
    session_type TEXT DEFAULT 'Unspecified',
    date TEXT,
    time TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public booking submissions" ON public.bookings;
CREATE POLICY "Allow public booking submissions"
    ON public.bookings FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow reading bookings" ON public.bookings;
CREATE POLICY "Allow reading bookings"
    ON public.bookings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow updating bookings" ON public.bookings;
CREATE POLICY "Allow updating bookings"
    ON public.bookings FOR UPDATE TO public USING (true);


-- 2. SITE CONTENT (CMS) TABLE
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read site content" ON public.site_content;
CREATE POLICY "Allow public read site content"
    ON public.site_content FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow upsert site content" ON public.site_content;
CREATE POLICY "Allow upsert site content"
    ON public.site_content FOR ALL TO public USING (true) WITH CHECK (true);


-- 3. GALLERY / PORTFOLIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'editorial',
    image_url TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read gallery items" ON public.gallery_items;
CREATE POLICY "Allow public read gallery items"
    ON public.gallery_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow insert/update gallery items" ON public.gallery_items;
CREATE POLICY "Allow insert/update gallery items"
    ON public.gallery_items FOR ALL TO public USING (true) WITH CHECK (true);


-- 4. STORAGE BUCKET FOR IMAGES
-- Create public bucket 'zanstoryteller-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'zanstoryteller-images',
    'zanstoryteller-images',
    true,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800;

-- Drop and recreate storage policies safely
DROP POLICY IF EXISTS "Allow public read from zanstoryteller-images" ON storage.objects;
CREATE POLICY "Allow public read from zanstoryteller-images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'zanstoryteller-images');

DROP POLICY IF EXISTS "Allow public upload to zanstoryteller-images" ON storage.objects;
CREATE POLICY "Allow public upload to zanstoryteller-images"
    ON storage.objects FOR INSERT TO public
    WITH CHECK (bucket_id = 'zanstoryteller-images');

DROP POLICY IF EXISTS "Allow public update in zanstoryteller-images" ON storage.objects;
CREATE POLICY "Allow public update in zanstoryteller-images"
    ON storage.objects FOR UPDATE TO public
    USING (bucket_id = 'zanstoryteller-images');

DROP POLICY IF EXISTS "Allow public delete in zanstoryteller-images" ON storage.objects;
CREATE POLICY "Allow public delete in zanstoryteller-images"
    ON storage.objects FOR DELETE TO public
    USING (bucket_id = 'zanstoryteller-images');
