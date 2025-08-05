import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Network, FileText, Download, Target, BookOpen, TrendingUp, Edit3, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  skills: string[];
  timeframe: string;
  prospects: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function CareerMapPage() {
  const { toast } = useToast();
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [viewMode, setViewMode] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPath, setEditedPath] = useState<CareerPath | null>(null);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('career_paths')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const paths = data || [];
      setCareerPaths(paths);
      if (paths.length > 0 && !selectedPath) {
        setSelectedPath(paths[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch career paths",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const majors = [
    "Business Administration",
    "Computer Science", 
    "Healthcare Administration",
    "Psychology",
    "Education",
    "Marketing",
    "Accounting",
    "Information Technology"
  ];

  const handleEditPath = () => {
    if (selectedPath) {
      setEditedPath({ ...selectedPath });
      setIsEditing(true);
    }
  };

  const handleSavePath = () => {
    if (editedPath && selectedPath) {
      const updatedPaths = careerPaths.map(path => 
        path.id === editedPath.id ? editedPath : path
      );
      setCareerPaths(updatedPaths);
      setSelectedPath(editedPath);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (selectedPath) {
      setEditedPath(selectedPath);
      setIsEditing(false);
    }
  };

  const handleAddStep = () => {
    if (editedPath) {
      setEditedPath(prev => prev ? ({
        ...prev,
        steps: [...prev.steps, ""]
      }) : null);
    }
  };

  const handleRemoveStep = (index: number) => {
    if (editedPath) {
      setEditedPath(prev => prev ? ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }) : null);
    }
  };

  const handleStepChange = (index: number, value: string) => {
    if (editedPath) {
      setEditedPath(prev => prev ? ({
        ...prev,
        steps: prev.steps.map((step, i) => i === index ? value : step)
      }) : null);
    }
  };

  const handleAddSkill = () => {
    if (editedPath) {
      setEditedPath(prev => prev ? ({
        ...prev,
        skills: [...prev.skills, ""]
      }) : null);
    }
  };

  const handleRemoveSkill = (index: number) => {
    if (editedPath) {
      setEditedPath(prev => prev ? ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }) : null);
    }
  };

  const handleSkillChange = (index: number, value: string) => {
    if (editedPath) {
      setEditedPath(prev => prev ? ({
        ...prev,
        skills: prev.skills.map((skill, i) => i === index ? value : skill)
      }) : null);
    }
  };

  const filterPathsByMajor = () => {
    if (!selectedMajor) return careerPaths;
    return careerPaths.filter(path => 
      path.title.toLowerCase().includes(selectedMajor.toLowerCase()) ||
      path.category.toLowerCase().includes(selectedMajor.toLowerCase())
    );
  };

  const generateMarkdown = (path: CareerPath) => {
    return `# ${path.title} Career Path

## Overview
${path.description}

## Steps to Success
${path.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Key Skills
${path.skills.map(skill => `- ${skill}`).join('\n')}

## Timeline
${path.timeframe}

## Job Prospects
${path.prospects}
`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Map className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading career paths...</p>
        </div>
      </div>
    );
  }

  if (!selectedPath) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No career paths available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Career Map</h1>
            <p className="text-muted-foreground">
              Plan your career journey with interactive tools and visualizations
            </p>
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <Target className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="mindmap">
                <Network className="h-4 w-4 mr-2" />
                Mind Map
              </TabsTrigger>
              <TabsTrigger value="markdown">
                <FileText className="h-4 w-4 mr-2" />
                Markdown
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="space-y-4">
                {/* Major Filter */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium">Filter by Major:</label>
                      <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Majors</SelectItem>
                          {majors.map(major => (
                            <SelectItem key={major} value={major}>{major}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Career Paths List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Paths</CardTitle>
                      {selectedMajor && (
                        <p className="text-sm text-muted-foreground">
                          Filtered by: {selectedMajor}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filterPathsByMajor().map(path => (
                        <div
                          key={path.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPath?.id === path.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:bg-accent'
                          }`}
                          onClick={() => setSelectedPath(path)}
                        >
                          <div className="font-medium">{path.title}</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {path.category}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Path Details */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">
                            {isEditing && editedPath ? (
                              <Input
                                value={editedPath.title}
                                onChange={(e) => setEditedPath(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                                className="text-2xl font-bold"
                              />
                            ) : (
                              selectedPath?.title
                            )}
                          </CardTitle>
                          <Badge className="mt-2">
                            {isEditing && editedPath ? (
                              <Input
                                value={editedPath.category}
                                onChange={(e) => setEditedPath(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                                className="h-6 text-xs"
                              />
                            ) : (
                              selectedPath?.category
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              {isEditing && editedPath ? (
                                <Input
                                  value={editedPath.timeframe}
                                  onChange={(e) => setEditedPath(prev => prev ? ({ ...prev, timeframe: e.target.value }) : null)}
                                  className="h-6 text-xs w-24"
                                />
                              ) : (
                                <span>{selectedPath?.timeframe}</span>
                              )}
                            </div>
                          </div>
                          {!isEditing ? (
                            <Button size="sm" onClick={handleEditPath}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Path
                            </Button>
                          ) : (
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={handleSavePath}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        {isEditing && editedPath ? (
                          <Textarea
                            value={editedPath.description}
                            onChange={(e) => setEditedPath(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                            className="min-h-20"
                          />
                        ) : (
                          <p className="text-muted-foreground">{selectedPath?.description}</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center space-x-2">
                            <BookOpen className="h-4 w-4" />
                            <span>Steps to Success</span>
                          </h3>
                          {isEditing && (
                            <Button size="sm" variant="outline" onClick={handleAddStep}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Step
                            </Button>
                          )}
                        </div>
                        <ol className="space-y-2">
                          {(isEditing && editedPath ? editedPath.steps : selectedPath?.steps || []).map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
                                {index + 1}
                              </span>
                              {isEditing ? (
                                <div className="flex-1 flex items-center space-x-2">
                                  <Input
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button size="sm" variant="outline" onClick={() => handleRemoveStep(index)}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="flex-1">{step}</span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Key Skills Required</h3>
                          {isEditing && (
                            <Button size="sm" variant="outline" onClick={handleAddSkill}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Skill
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(isEditing && editedPath ? editedPath.skills : selectedPath?.skills || []).map((skill, index) => (
                            <div key={index} className="flex items-center">
                              {isEditing ? (
                                <div className="flex items-center space-x-1">
                                  <Input
                                    value={skill}
                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                    className="h-8 w-24 text-xs"
                                  />
                                  <Button size="sm" variant="outline" onClick={() => handleRemoveSkill(index)}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Badge variant="secondary">{skill}</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Job Market Outlook</span>
                        </h3>
                        {isEditing && editedPath ? (
                          <Textarea
                            value={editedPath.prospects}
                            onChange={(e) => setEditedPath(prev => prev ? ({ ...prev, prospects: e.target.value }) : null)}
                            className="min-h-16"
                          />
                        ) : (
                          <p className="text-muted-foreground">{selectedPath?.prospects}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mindmap">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="h-5 w-5" />
                    <span>Mind Map View - {selectedPath?.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-4">
                      <Network className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Interactive Mind Map</p>
                        <p className="text-muted-foreground">Visual representation of your career path</p>
                        <Button className="mt-4" onClick={() => {
                          toast({
                            title: "Mind Map Feature",
                            description: "This feature is coming soon! It will generate an interactive mind map of your career path."
                          });
                        }}>
                          Generate Mind Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="markdown">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Markdown Format - {selectedPath?.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                    {selectedPath ? generateMarkdown(selectedPath) : ''}
                  </pre>
                  <div className="mt-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (selectedPath) {
                          const element = document.createElement('a');
                          const file = new Blob([generateMarkdown(selectedPath)], { type: 'text/markdown' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${selectedPath.title.replace(/\s+/g, '_')}_career_path.md`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                          toast({
                            title: "Success",
                            description: "Markdown file downloaded!"
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Markdown
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Export Career Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-medium mb-2">PDF Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive career plan document
                      </p>
                      <Button size="sm">Download PDF</Button>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <Network className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-medium mb-2">Mind Map</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Visual mind map image
                      </p>
                      <Button size="sm">Export Image</Button>
                    </Card>
                    
                    <Card className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <h3 className="font-medium mb-2">Checklist</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Step-by-step action items
                      </p>
                      <Button size="sm">Create Checklist</Button>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}