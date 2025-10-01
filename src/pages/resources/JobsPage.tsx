import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, Clock, DollarSign, ExternalLink, Search, Filter, Calendar, Building2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_range?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  application_url: string;
  contact_email?: string;
  is_published: boolean;
  is_featured: boolean;
  category: string;
  tags?: string[];
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(jobs.map(job => job.category))];
  const jobTypes = [...new Set(jobs.map(job => job.job_type))];
  const experienceLevels = [...new Set(jobs.map(job => job.experience_level))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesJobType = selectedJobType === "all" || job.job_type === selectedJobType;
    const matchesExperience = selectedExperience === "all" || job.experience_level === selectedExperience;
    
    return matchesSearch && matchesCategory && matchesJobType && matchesExperience;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlineNear = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const JobCard = ({ job }: { job: Job }) => (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${job.is_featured ? 'ring-2 ring-primary/20 shadow-md' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg line-clamp-1">{job.title}</CardTitle>
              {job.is_featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.company}</span>
              <MapPin className="h-4 w-4 ml-2" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline">{job.category}</Badge>
          <Badge variant="secondary">{job.job_type.replace('-', ' ').toUpperCase()}</Badge>
          <Badge variant="outline">{job.experience_level.replace('-', ' ')}</Badge>
          {job.salary_range && (
            <Badge variant="outline" className="text-green-700 bg-green-50">
              <DollarSign className="h-3 w-3 mr-1" />
              {job.salary_range}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>
        
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {req}
                </li>
              ))}
              {job.requirements.length > 3 && (
                <li className="text-primary">+{job.requirements.length - 3} more requirements</li>
              )}
            </ul>
          </div>
        )}
        
        {job.benefits && job.benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Benefits:</h4>
            <div className="flex flex-wrap gap-1">
              {job.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {job.benefits.length > 3 && (
                <span className="text-xs text-muted-foreground">+{job.benefits.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="h-3 w-3" />
              <span>Posted {formatDate(job.created_at)}</span>
            </div>
            {job.deadline && (
              <div className={`flex items-center gap-1 ${isDeadlineNear(job.deadline) ? 'text-red-600' : ''}`}>
                <Calendar className="h-3 w-3" />
                <span>Deadline: {formatDate(job.deadline)}</span>
                {isDeadlineNear(job.deadline) && (
                  <Badge variant="destructive" className="text-xs ml-1">
                    Urgent
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <Button 
            size="sm"
            onClick={() => window.open(job.application_url, '_blank')}
            className="ml-auto"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-muted border-t-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading Job Opportunities</p>
            <p className="text-sm text-muted-foreground">Finding the best career opportunities for you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Career Opportunities</h1>
            <p className="text-muted-foreground">
              Discover job opportunities that align with your career goals and pathway education
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Job Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Types</SelectItem>
                    {jobTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('-', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience Levels</SelectItem>
                    {experienceLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.replace('-', ' ').charAt(0).toUpperCase() + level.replace('-', ' ').slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} opportunities
            </p>
            {filteredJobs.filter(job => job.is_featured).length > 0 && (
              <p className="text-sm text-muted-foreground">
                {filteredJobs.filter(job => job.is_featured).length} featured positions
              </p>
            )}
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}