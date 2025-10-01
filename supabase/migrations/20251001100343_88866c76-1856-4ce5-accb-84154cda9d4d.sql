-- Add video_url and image_urls columns to news table
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- Migrate existing media_url data to appropriate columns
-- If media_url looks like a YouTube link, move to video_url
-- Otherwise move to first position in image_urls array
UPDATE news
SET 
  video_url = CASE 
    WHEN media_url LIKE '%youtube.com%' OR media_url LIKE '%youtu.be%' 
    THEN media_url 
    ELSE NULL 
  END,
  image_urls = CASE 
    WHEN media_url IS NOT NULL 
      AND media_url NOT LIKE '%youtube.com%' 
      AND media_url NOT LIKE '%youtu.be%'
    THEN ARRAY[media_url]
    ELSE NULL
  END
WHERE media_url IS NOT NULL;

-- Remove the old media_url column (optional - comment out if you want to keep it)
-- ALTER TABLE news DROP COLUMN IF EXISTS media_url;