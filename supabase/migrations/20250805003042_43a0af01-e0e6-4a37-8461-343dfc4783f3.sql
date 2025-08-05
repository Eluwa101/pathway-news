-- Create career_paths table for the Career Map functionality
CREATE TABLE public.career_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  steps TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  timeframe TEXT NOT NULL,
  prospects TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for users)
CREATE POLICY "Allow public read access to published career paths" 
ON public.career_paths 
FOR SELECT 
USING (is_published = true);

-- Create policy for full admin access
CREATE POLICY "Allow all operations on career paths" 
ON public.career_paths 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_career_paths_updated_at
BEFORE UPDATE ON public.career_paths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.career_paths (title, category, description, steps, skills, timeframe, prospects) VALUES
(
  'Business Administration',
  'Business',
  'Learn fundamental business principles and management skills',
  ARRAY[
    'Complete Business Foundations courses',
    'Choose specialization (Marketing, Finance, Operations)',
    'Complete internship or work experience',
    'Develop leadership skills',
    'Build professional network'
  ],
  ARRAY['Leadership', 'Strategic Thinking', 'Communication', 'Analysis'],
  '2-4 years',
  'High demand across industries'
),
(
  'Software Development',
  'Technology',
  'Build applications and software solutions',
  ARRAY[
    'Learn programming fundamentals',
    'Master a programming language',
    'Build portfolio projects',
    'Contribute to open source',
    'Apply for entry-level positions'
  ],
  ARRAY['Programming', 'Problem Solving', 'Logic', 'Continuous Learning'],
  '1-3 years',
  'Excellent growth opportunities'
),
(
  'Healthcare Administration',
  'Healthcare',
  'Manage healthcare facilities and operations',
  ARRAY[
    'Complete healthcare management courses',
    'Gain healthcare industry experience',
    'Develop regulatory knowledge',
    'Build leadership skills',
    'Pursue certification'
  ],
  ARRAY['Healthcare Knowledge', 'Management', 'Compliance', 'Communication'],
  '3-5 years',
  'Growing field with aging population'
);