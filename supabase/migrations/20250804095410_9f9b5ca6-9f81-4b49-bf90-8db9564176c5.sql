-- Add missing fields to devotionals table for better event management
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS speaker TEXT;
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS event_time TEXT;
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS live_link TEXT;
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS recording_link TEXT;
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS download_link TEXT;
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS topics TEXT[];
ALTER TABLE public.devotionals ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';

-- Add missing fields to career_events table for better event management  
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS topics TEXT[];
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS attendees INTEGER DEFAULT 0;
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS live_link TEXT;
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS recording_link TEXT;
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS download_link TEXT;
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';
ALTER TABLE public.career_events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false;

-- Insert sample devotionals data to replace static content
INSERT INTO public.devotionals (title, content, author, speaker, event_date, event_time, status, live_link, recording_link, download_link, topics, scripture_reference) VALUES
('Faith and Learning: The Divine Connection', 'Explore how faith enhances our capacity to learn and grow intellectually and spiritually.', 'Elder David A. Bednar', 'Elder David A. Bednar', '2024-01-22 19:00:00-07:00', '7:00 PM MT', 'upcoming', 'https://example.com/live', NULL, NULL, ARRAY['Faith', 'Learning', 'Spiritual Growth'], NULL),
('Finding Joy in the Journey of Education', 'Discover how to maintain joy and perspective during challenging academic pursuits.', 'Sister Joy D. Jones', 'Sister Joy D. Jones', '2024-01-25 20:00:00-07:00', '8:00 PM MT', 'upcoming', 'https://example.com/live2', NULL, NULL, ARRAY['Joy', 'Education', 'Perseverance'], NULL),
('The Purpose of Education', 'Understanding the eternal significance of learning and education in our lives.', 'President Russell M. Nelson', 'President Russell M. Nelson', '2024-01-15 19:00:00-07:00', '7:00 PM MT', 'completed', NULL, 'https://example.com/recording1', 'https://example.com/download1', ARRAY['Education', 'Purpose', 'Eternal Perspective'], NULL),
('Overcoming Academic Challenges', 'Practical and spiritual insights for overcoming difficulties in our educational journey.', 'Elder Dieter F. Uchtdorf', 'Elder Dieter F. Uchtdorf', '2024-01-08 20:00:00-07:00', '8:00 PM MT', 'completed', NULL, 'https://example.com/recording2', 'https://example.com/download2', ARRAY['Challenges', 'Resilience', 'Faith'], NULL);

-- Insert sample career events data to replace static content
INSERT INTO public.career_events (title, description, speaker, position, industry, event_date, location, registration_url, live_link, recording_link, download_link, topics, attendees, status, registration_required) VALUES
('Business Leadership in the Digital Age', 'Learn essential leadership skills for navigating modern business challenges and building effective teams.', 'Sarah Johnson', 'CEO, TechCorp Solutions', 'Business', '2024-01-24 18:00:00-07:00', 'Virtual Event', 'https://example.com/register', 'https://example.com/live', NULL, NULL, ARRAY['Leadership', 'Management', 'Digital Transformation'], 250, 'upcoming', true),
('Breaking into the Technology Sector', 'Discover pathways to enter the tech industry, from coding bootcamps to computer science degrees.', 'Michael Chen', 'Senior Software Engineer, Google', 'Technology', '2024-01-26 19:30:00-07:00', 'Virtual Event', 'https://example.com/register2', 'https://example.com/live2', NULL, NULL, ARRAY['Technology', 'Software Development', 'Career Transition'], 400, 'upcoming', true),
('Healthcare Administration Careers', 'Explore opportunities in healthcare management and the skills needed to succeed in this growing field.', 'Dr. Maria Rodriguez', 'Hospital Administrator, Regional Medical Center', 'Healthcare', '2024-01-17 18:30:00-07:00', 'Virtual Event', NULL, NULL, 'https://example.com/recording1', 'https://example.com/download1', ARRAY['Healthcare', 'Administration', 'Management'], 180, 'completed', false),
('Financial Planning and Advisory', 'Learn about career opportunities in financial planning and the path to becoming a certified advisor.', 'Robert Kim', 'Certified Financial Planner, Wealth Partners', 'Finance', '2024-01-10 19:00:00-07:00', 'Virtual Event', NULL, NULL, 'https://example.com/recording2', 'https://example.com/download2', ARRAY['Finance', 'Planning', 'Investment'], 320, 'completed', false),
('Education and Teaching Excellence', 'Discover the rewards and challenges of a career in education and how to make a lasting impact.', 'Jennifer Taylor', 'Principal, Lincoln Elementary', 'Education', '2024-01-03 20:00:00-07:00', 'Virtual Event', NULL, NULL, 'https://example.com/recording3', 'https://example.com/download3', ARRAY['Education', 'Teaching', 'Leadership'], 150, 'completed', false);