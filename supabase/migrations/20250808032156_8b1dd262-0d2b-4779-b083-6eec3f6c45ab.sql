-- Add featured flags to allow admins to select items for homepage display

-- Add featured flag to news table
ALTER TABLE public.news 
ADD COLUMN featured_on_homepage boolean DEFAULT false;

-- Add featured flag to devotionals table  
ALTER TABLE public.devotionals
ADD COLUMN featured_on_homepage boolean DEFAULT false;

-- Add featured flag to career_events table
ALTER TABLE public.career_events
ADD COLUMN featured_on_homepage boolean DEFAULT false;

-- Add indexes for better performance
CREATE INDEX idx_news_featured_homepage ON public.news(featured_on_homepage, is_published, created_at DESC);
CREATE INDEX idx_devotionals_featured_homepage ON public.devotionals(featured_on_homepage, is_published, event_date ASC);
CREATE INDEX idx_career_events_featured_homepage ON public.career_events(featured_on_homepage, is_published, event_date ASC);