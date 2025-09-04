import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Target, BookOpen, TrendingUp, Plus, X, Download, FileText, Network, Edit, Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CareerPreference {
  interests: string[];
  skills: string[];
  timeframe: string;
  industry: string;
  workStyle: string;
  goals: string;
  planType: string;
  customInterests: string[];
  customSkills: string[];
}

const defaultPreferences: CareerPreference = {
  interests: [],
  skills: [],
  timeframe: '',
  industry: '',
  workStyle: '',
  goals: '',
  planType: '',
  customInterests: [],
  customSkills: []
};

const interestOptions = [
  'Technology', 'Healthcare', 'Education', 'Business', 'Finance', 'Marketing',
  'Design', 'Engineering', 'Social Work', 'Research', 'Writing', 'Art'
];

const skillOptions = [
  'Communication', 'Leadership', 'Problem Solving', 'Technical Skills', 
  'Creativity', 'Analytics', 'Project Management', 'Teaching', 'Sales'
];

const industries = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Marketing',
  'Government', 'Non-Profit', 'Consulting', 'Manufacturing', 'Retail'
];

export default function CareerMapPage() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<CareerPreference>(defaultPreferences);
  const [careerPlan, setCareerPlan] = useState<string>('');
  const [viewMode, setViewMode] = useState("preferences");
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showCustomInterest, setShowCustomInterest] = useState(false);
  const [showCustomSkill, setShowCustomSkill] = useState(false);

  const handleAddInterest = (interest: string) => {
    if (!preferences.interests.includes(interest)) {
      setPreferences(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (!preferences.skills.includes(skill)) {
      setPreferences(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setPreferences(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
      customSkills: prev.customSkills.filter(s => s !== skill)
    }));
  };

  const addCustomInterest = () => {
    if (customInterestInput.trim() && !preferences.interests.includes(customInterestInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        interests: [...prev.interests, customInterestInput.trim()],
        customInterests: [...prev.customInterests, customInterestInput.trim()]
      }));
      setCustomInterestInput('');
      setShowCustomInterest(false);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !preferences.skills.includes(customSkillInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        skills: [...prev.skills, customSkillInput.trim()],
        customSkills: [...prev.customSkills, customSkillInput.trim()]
      }));
      setCustomSkillInput('');
      setShowCustomSkill(false);
    }
  };

  const generateCareerPlan = () => {
    const plan = `# My Career Plan

## Personal Interests
${preferences.interests.map(interest => `- ${interest}`).join('\n')}

## Key Skills
${preferences.skills.map(skill => `- ${skill}`).join('\n')}

## Career Preferences
- **Industry:** ${preferences.industry}
- **Work Style:** ${preferences.workStyle}
- **Timeline:** ${preferences.timeframe}

## Career Goals
${preferences.goals}

## Recommended Next Steps
1. Research specific roles in ${preferences.industry} that align with your interests
2. Develop skills in: ${preferences.skills.slice(0, 3).join(', ')}
3. Network with professionals in your target industry
4. Consider internships or volunteer opportunities
5. Update your resume to highlight relevant experiences

## Action Plan
- Week 1-2: Research 5 companies in ${preferences.industry}
- Week 3-4: Connect with 3 professionals on LinkedIn
- Month 2: Apply for relevant internships or entry-level positions
- Month 3: Evaluate progress and adjust plan as needed

Generated on: ${new Date().toLocaleDateString()}
`;
    setCareerPlan(plan);
    setViewMode("plan");
    toast({
      title: "Career Plan Generated!",
      description: "Your personalized career plan is ready."
    });
  };

  const downloadPlan = () => {
    const blob = new Blob([careerPlan], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-career-plan.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your career plan has been downloaded as a Markdown file."
    });
  };

  const printPlan = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>My Career Plan</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #333; }
              h2 { color: #666; margin-top: 30px; }
              ul { margin: 10px 0; }
              li { margin: 5px 0; }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${careerPlan}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Career Map</h1>
            <p className="text-muted-foreground">
              Build your personalized career plan based on your interests and goals
            </p>
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="preferences">
                <Target className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="plan">
                <FileText className="h-4 w-4 mr-2" />
                Career Plan
              </TabsTrigger>
              <TabsTrigger value="mindmap">
                <Network className="h-4 w-4 mr-2" />
                Visual Map
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Interests */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>What are your interests?</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowCustomInterest(!showCustomInterest)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map(interest => (
                        <Button
                          key={interest}
                          variant={preferences.interests.includes(interest) ? "default" : "outline"}
                          size="sm"
                          onClick={() => preferences.interests.includes(interest) 
                            ? handleRemoveInterest(interest) 
                            : handleAddInterest(interest)
                          }
                          className="justify-start"
                        >
                          {preferences.interests.includes(interest) && <X className="h-3 w-3 mr-1" />}
                          {interest}
                        </Button>
                      ))}
                    </div>
                    
                    {showCustomInterest && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom interest..."
                          value={customInterestInput}
                          onChange={(e) => setCustomInterestInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                        />
                        <Button onClick={addCustomInterest} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {preferences.interests.map(interest => (
                        <Badge 
                          key={interest} 
                          variant={preferences.customInterests.includes(interest) ? "secondary" : "default"} 
                          className="flex items-center gap-1"
                        >
                          {interest}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveInterest(interest)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>What are your strengths?</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowCustomSkill(!showCustomSkill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {skillOptions.map(skill => (
                        <Button
                          key={skill}
                          variant={preferences.skills.includes(skill) ? "default" : "outline"}
                          size="sm"
                          onClick={() => preferences.skills.includes(skill) 
                            ? handleRemoveSkill(skill) 
                            : handleAddSkill(skill)
                          }
                          className="justify-start"
                        >
                          {preferences.skills.includes(skill) && <X className="h-3 w-3 mr-1" />}
                          {skill}
                        </Button>
                      ))}
                    </div>
                    
                    {showCustomSkill && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom skill..."
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                        />
                        <Button onClick={addCustomSkill} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">
                      {preferences.skills.map(skill => (
                        <Badge 
                          key={skill} 
                          variant={preferences.customSkills.includes(skill) ? "outline" : "secondary"} 
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Preference */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preferred Industry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={preferences.industry} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, industry: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Work Style */}
                <Card>
                  <CardHeader>
                    <CardTitle>Work Style Preference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={preferences.workStyle} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, workStyle: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote Work</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Remote + Office)</SelectItem>
                        <SelectItem value="office">Office-based</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Plan Type */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={preferences.planType} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, planType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short-term (1-2 years)</SelectItem>
                        <SelectItem value="long">Long-term (3-5 years)</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (Both)</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Career Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={preferences.timeframe} onValueChange={(value) => 
                      setPreferences(prev => ({ ...prev, timeframe: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">0-6 months</SelectItem>
                        <SelectItem value="short">6-12 months</SelectItem>
                        <SelectItem value="medium">1-2 years</SelectItem>
                        <SelectItem value="long">2+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Career Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Career Goals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Describe your career goals and aspirations..."
                      value={preferences.goals}
                      onChange={(e) => setPreferences(prev => ({ ...prev, goals: e.target.value }))}
                      className="min-h-32"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={generateCareerPlan}
                  disabled={preferences.interests.length === 0 || preferences.skills.length === 0}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Generate My Career Plan
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="plan" className="space-y-6">
              {careerPlan ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Your Personalized Career Plan</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={printPlan}>
                          Print Plan
                        </Button>
                        <Button onClick={downloadPlan}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {careerPlan}
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Career Plan Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Complete your preferences to generate a personalized career plan
                    </p>
                    <Button onClick={() => setViewMode("preferences")}>
                      Go to Preferences
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="mindmap" className="space-y-6">
              {preferences.interests.length > 0 || preferences.skills.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Career Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative min-h-96 bg-gradient-to-br from-background to-muted/20 rounded-lg p-8 overflow-hidden">
                      {/* Central Career Goal */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
                          Career Goal
                        </div>
                      </div>
                      
                      {/* Interests Branch */}
                      {preferences.interests.length > 0 && (
                        <div className="absolute top-1/4 left-1/4">
                          <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg mb-2 shadow-md">
                            Interests
                          </div>
                          <div className="space-y-2">
                            {preferences.interests.slice(0, 4).map((interest, index) => (
                              <div key={interest} 
                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm shadow-sm ml-2"
                                style={{ 
                                  transform: `rotate(${index * 5 - 10}deg)`,
                                  marginLeft: `${index * 8}px`
                                }}
                              >
                                {interest}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Skills Branch */}
                      {preferences.skills.length > 0 && (
                        <div className="absolute top-1/4 right-1/4">
                          <div className="bg-accent text-accent-foreground px-4 py-2 rounded-lg mb-2 shadow-md">
                            Skills
                          </div>
                          <div className="space-y-2">
                            {preferences.skills.slice(0, 4).map((skill, index) => (
                              <div key={skill} 
                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm shadow-sm mr-2"
                                style={{ 
                                  transform: `rotate(${index * -5 + 10}deg)`,
                                  marginRight: `${index * 8}px`
                                }}
                              >
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Industry & Work Style */}
                      {preferences.industry && (
                        <div className="absolute bottom-1/4 left-1/3">
                          <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg shadow-md">
                            Industry: {preferences.industry}
                          </div>
                        </div>
                      )}
                      
                      {preferences.workStyle && (
                        <div className="absolute bottom-1/4 right-1/3">
                          <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg shadow-md">
                            Style: {preferences.workStyle}
                          </div>
                        </div>
                      )}
                      
                      {/* Connecting Lines */}
                      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Center to branches lines */}
                        <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <line x1="50%" y1="50%" x2="33%" y2="75%" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <line x1="50%" y1="50%" x2="67%" y2="75%" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Visual Career Map</h3>
                    <p className="text-muted-foreground mb-6">
                      Add your interests and skills to see your visual career map
                    </p>
                    <Button onClick={() => setViewMode("preferences")}>
                      Add Preferences
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              {careerPlan ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Career Timeline View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {preferences.planType === 'short' || preferences.planType === 'comprehensive' ? (
                        <div className="bg-muted/50 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Short-term Plan (1-2 years)
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-medium">Months 1-3: Foundation</h4>
                                <p className="text-sm text-muted-foreground">Research {preferences.industry} industry, identify key players and opportunities</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-medium">Months 4-8: Skill Development</h4>
                                <p className="text-sm text-muted-foreground">Focus on developing: {preferences.skills.slice(0, 3).join(', ')}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-medium">Months 9-12: Application</h4>
                                <p className="text-sm text-muted-foreground">Apply knowledge through projects, internships, or entry-level positions</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      
                      {preferences.planType === 'long' || preferences.planType === 'comprehensive' ? (
                        <div className="bg-muted/30 p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            Long-term Plan (3-5 years)
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-secondary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-medium">Year 1-2: Establish Expertise</h4>
                                <p className="text-sm text-muted-foreground">Become proficient in core skills and build professional network</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-secondary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-medium">Year 3-4: Leadership & Growth</h4>
                                <p className="text-sm text-muted-foreground">Take on leadership roles, mentor others, pursue advanced certifications</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-4">
                              <div className="w-3 h-3 bg-secondary rounded-full mt-2"></div>
                              <div>
                                <h4 className="font-medium">Year 5+: Strategic Impact</h4>
                                <p className="text-sm text-muted-foreground">Drive strategic initiatives, consider entrepreneurship or executive roles</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Career Timeline</h3>
                    <p className="text-muted-foreground mb-6">
                      Generate your career plan to see the timeline view
                    </p>
                    <Button onClick={() => setViewMode("preferences")}>
                      Start Planning
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Your Career Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {careerPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button onClick={downloadPlan} className="h-20 flex-col space-y-2">
                        <Download className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Download as Markdown</div>
                          <div className="text-xs text-muted-foreground">For editing in any text editor</div>
                        </div>
                      </Button>
                      
                      <Button onClick={printPlan} variant="outline" className="h-20 flex-col space-y-2">
                        <FileText className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Print or Save as PDF</div>
                          <div className="text-xs text-muted-foreground">Physical copy for reference</div>
                        </div>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Generate your career plan first to enable export options
                      </p>
                      <Button onClick={() => setViewMode("preferences")}>
                        Start Planning
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}