-- Create table to store user career plans and preferences
CREATE TABLE public.career_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  timeframe TEXT,
  industry TEXT,
  work_style TEXT,
  goals TEXT,
  plan_type TEXT,
  custom_interests TEXT[] DEFAULT '{}',
  custom_skills TEXT[] DEFAULT '{}',
  custom_timeframe TEXT,
  custom_industry TEXT,
  custom_work_style TEXT,
  custom_plan_type TEXT,
  career_plan TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own career plans" 
ON public.career_plans 
FOR SELECT 
USING (user_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can create their own career plans" 
ON public.career_plans 
FOR INSERT 
WITH CHECK (user_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can update their own career plans" 
ON public.career_plans 
FOR UPDATE 
USING (user_id::text = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can delete their own career plans" 
ON public.career_plans 
FOR DELETE 
USING (user_id::text = current_setting('request.jwt.claim.sub', true));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_career_plans_updated_at
BEFORE UPDATE ON public.career_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();