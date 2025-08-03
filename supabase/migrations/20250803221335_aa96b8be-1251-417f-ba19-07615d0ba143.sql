-- Create WhatsApp groups table
CREATE TABLE public.whatsapp_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  members INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'MessageCircle',
  color TEXT NOT NULL DEFAULT 'bg-gray-100 text-gray-800',
  link TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for WhatsApp groups
CREATE POLICY "Allow all operations on whatsapp groups" 
ON public.whatsapp_groups 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to published whatsapp groups" 
ON public.whatsapp_groups 
FOR SELECT 
USING (is_published = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_whatsapp_groups_updated_at
BEFORE UPDATE ON public.whatsapp_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial WhatsApp groups data
INSERT INTO public.whatsapp_groups (name, category, members, description, icon, color, link, is_active, is_published) VALUES
('Business Administration', 'Major', 450, 'Connect with fellow business students, share resources, and discuss career opportunities.', 'Briefcase', 'bg-blue-100 text-blue-800', 'https://chat.whatsapp.com/business-admin', true, true),
('Computer Science & IT', 'Major', 380, 'Programming help, project collaboration, and tech career discussions.', 'Code', 'bg-green-100 text-green-800', 'https://chat.whatsapp.com/computer-science', true, true),
('Healthcare Administration', 'Major', 220, 'Healthcare industry insights, internship opportunities, and study groups.', 'Users', 'bg-red-100 text-red-800', 'https://chat.whatsapp.com/healthcare-admin', true, true),
('Education Studies', 'Major', 180, 'Teaching resources, classroom management tips, and education career paths.', 'GraduationCap', 'bg-purple-100 text-purple-800', 'https://chat.whatsapp.com/education-studies', true, true),
('General Studies - English', 'Course', 520, 'English composition help, writing tips, and literature discussions.', 'BookOpen', 'bg-yellow-100 text-yellow-800', 'https://chat.whatsapp.com/english-course', true, true),
('Mathematics Fundamentals', 'Course', 340, 'Math problem solving, study sessions, and exam preparation.', 'BookOpen', 'bg-indigo-100 text-indigo-800', 'https://chat.whatsapp.com/math-fundamentals', true, true),
('Finance & Accounting', 'Major', 290, 'Financial concepts, accounting principles, and career opportunities in finance.', 'Briefcase', 'bg-orange-100 text-orange-800', 'https://chat.whatsapp.com/finance-accounting', true, true),
('Study Group - Statistics', 'Course', 150, 'Statistics homework help, group study sessions, and exam prep.', 'BookOpen', 'bg-teal-100 text-teal-800', 'https://chat.whatsapp.com/statistics-study', true, true),
('Psychology Studies', 'Major', 200, 'Psychology research, case studies, and mental health resources.', 'Users', 'bg-pink-100 text-pink-800', 'https://chat.whatsapp.com/psychology-studies', true, true),
('General Student Support', 'General', 680, 'General questions, announcements, and peer support for all students.', 'MessageCircle', 'bg-gray-100 text-gray-800', 'https://chat.whatsapp.com/general-support', true, true);