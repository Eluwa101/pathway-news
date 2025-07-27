-- Create tables for the content management system

-- News table
CREATE TABLE public.news (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    is_hot BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Books table
CREATE TABLE public.books (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recordings table
CREATE TABLE public.recordings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration_minutes INTEGER,
    category TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Devotionals table
CREATE TABLE public.devotionals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    scripture_reference TEXT,
    author TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Career events table
CREATE TABLE public.career_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    speaker TEXT NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    registration_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published content
CREATE POLICY "Allow public read access to published news" 
ON public.news FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow public read access to published books" 
ON public.books FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow public read access to published recordings" 
ON public.recordings FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow public read access to published devotionals" 
ON public.devotionals FOR SELECT 
USING (is_published = true);

CREATE POLICY "Allow public read access to published career events" 
ON public.career_events FOR SELECT 
USING (is_published = true);

-- Create policies for admin access (since no auth is required, allow all operations)
CREATE POLICY "Allow all operations on news" 
ON public.news FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on books" 
ON public.books FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on recordings" 
ON public.recordings FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on devotionals" 
ON public.devotionals FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on career events" 
ON public.career_events FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON public.news
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recordings_updated_at
    BEFORE UPDATE ON public.recordings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_devotionals_updated_at
    BEFORE UPDATE ON public.devotionals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_events_updated_at
    BEFORE UPDATE ON public.career_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();