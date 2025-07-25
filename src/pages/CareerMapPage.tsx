import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Network, FileText, Download, Target, BookOpen, TrendingUp, Edit3, Plus, X } from 'lucide-react';

const careerPaths = [
  {
    id: 1,
    title: "Business Administration",
    category: "Business",
    description: "Learn fundamental business principles and management skills",
    steps: [
      "Complete Business Foundations courses",
      "Choose specialization (Marketing, Finance, Operations)",
      "Complete internship or work experience",
      "Develop leadership skills",
      "Build professional network"
    ],
    skills: ["Leadership", "Strategic Thinking", "Communication", "Analysis"],
    timeframe: "2-4 years",
    prospects: "High demand across industries"
  },
  {
    id: 2,
    title: "Software Development",
    category: "Technology",
    description: "Build applications and software solutions",
    steps: [
      "Learn programming fundamentals",
      "Master a programming language",
      "Build portfolio projects",
      "Contribute to open source",
      "Apply for entry-level positions"
    ],
    skills: ["Programming", "Problem Solving", "Logic", "Continuous Learning"],
    timeframe: "1-3 years",
    prospects: "Excellent growth opportunities"
  },
  {
    id: 3,
    title: "Healthcare Administration",
    category: "Healthcare",
    description: "Manage healthcare facilities and operations",
    steps: [
      "Complete healthcare management courses",
      "Gain healthcare industry experience",
      "Develop regulatory knowledge",
      "Build leadership skills",
      "Pursue certification"
    ],
    skills: ["Healthcare Knowledge", "Management", "Compliance", "Communication"],
    timeframe: "3-5 years",
    prospects: "Growing field with aging population"
  }
];

export default function CareerMapPage() {
  const [selectedPath, setSelectedPath] = useState(careerPaths[0]);
  const [viewMode, setViewMode] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPath, setEditedPath] = useState(careerPaths[0]);
  const [userPaths, setUserPaths] = useState(careerPaths);
  const [selectedMajor, setSelectedMajor] = useState("");

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
    setEditedPath({ ...selectedPath });
    setIsEditing(true);
  };

  const handleSavePath = () => {
    const updatedPaths = userPaths.map(path => 
      path.id === editedPath.id ? editedPath : path
    );
    setUserPaths(updatedPaths);
    setSelectedPath(editedPath);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPath(selectedPath);
    setIsEditing(false);
  };

  const handleAddStep = () => {
    setEditedPath(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const handleRemoveStep = (index: number) => {
    setEditedPath(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleStepChange = (index: number, value: string) => {
    setEditedPath(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleAddSkill = () => {
    setEditedPath(prev => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setEditedPath(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    setEditedPath(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const filterPathsByMajor = () => {
    if (!selectedMajor) return userPaths;
    return userPaths.filter(path => 
      path.title.toLowerCase().includes(selectedMajor.toLowerCase()) ||
      path.category.toLowerCase().includes(selectedMajor.toLowerCase())
    );
  };

  const generateMarkdown = (path: typeof careerPaths[0]) => {
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
                            selectedPath.id === path.id 
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
                            {isEditing ? (
                              <Input
                                value={editedPath.title}
                                onChange={(e) => setEditedPath(prev => ({ ...prev, title: e.target.value }))}
                                className="text-2xl font-bold"
                              />
                            ) : (
                              selectedPath.title
                            )}
                          </CardTitle>
                          <Badge className="mt-2">
                            {isEditing ? (
                              <Input
                                value={editedPath.category}
                                onChange={(e) => setEditedPath(prev => ({ ...prev, category: e.target.value }))}
                                className="h-6 text-xs"
                              />
                            ) : (
                              selectedPath.category
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              {isEditing ? (
                                <Input
                                  value={editedPath.timeframe}
                                  onChange={(e) => setEditedPath(prev => ({ ...prev, timeframe: e.target.value }))}
                                  className="h-6 text-xs w-24"
                                />
                              ) : (
                                <span>{selectedPath.timeframe}</span>
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
                        {isEditing ? (
                          <Textarea
                            value={editedPath.description}
                            onChange={(e) => setEditedPath(prev => ({ ...prev, description: e.target.value }))}
                            className="min-h-20"
                          />
                        ) : (
                          <p className="text-muted-foreground">{selectedPath.description}</p>
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
                          {(isEditing ? editedPath.steps : selectedPath.steps).map((step, index) => (
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
                          {(isEditing ? editedPath.skills : selectedPath.skills).map((skill, index) => (
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
                        {isEditing ? (
                          <Textarea
                            value={editedPath.prospects}
                            onChange={(e) => setEditedPath(prev => ({ ...prev, prospects: e.target.value }))}
                            className="min-h-16"
                          />
                        ) : (
                          <p className="text-muted-foreground">{selectedPath.prospects}</p>
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
                    <span>Mind Map View - {selectedPath.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center space-y-4">
                      <Network className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Interactive Mind Map</p>
                        <p className="text-muted-foreground">Visual representation of your career path</p>
                        <Button className="mt-4">
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
                    <span>Markdown Format - {selectedPath.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                    {generateMarkdown(selectedPath)}
                  </pre>
                  <div className="mt-4">
                    <Button variant="outline">
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