-- Create jobs table for the resources section
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'full-time',
  experience_level TEXT NOT NULL DEFAULT 'entry-level',
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  application_url TEXT NOT NULL,
  contact_email TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published jobs
CREATE POLICY "Public can view published jobs" 
ON public.jobs 
FOR SELECT 
USING (is_published = true);

-- Create policies for authenticated users to manage jobs
CREATE POLICY "Authenticated users can insert jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update jobs" 
ON public.jobs 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete jobs" 
ON public.jobs 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_jobs_published ON public.jobs(is_published);
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_featured ON public.jobs(is_featured);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at);
CREATE INDEX idx_jobs_deadline ON public.jobs(deadline);