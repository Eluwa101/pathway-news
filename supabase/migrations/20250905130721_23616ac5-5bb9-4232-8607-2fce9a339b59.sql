-- Add media support for news and cover images for devotionals and career events

-- Add media_url to news table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='media_url') THEN
        ALTER TABLE public.news ADD COLUMN media_url text;
    END IF;
END $$;

-- Add cover_image_url to devotionals table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='devotionals' AND column_name='cover_image_url') THEN
        ALTER TABLE public.devotionals ADD COLUMN cover_image_url text;
    END IF;
END $$;

-- Add cover_image_url to career_events table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='career_events' AND column_name='cover_image_url') THEN
        ALTER TABLE public.career_events ADD COLUMN cover_image_url text;
    END IF;
END $$;