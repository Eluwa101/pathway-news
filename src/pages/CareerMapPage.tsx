import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Network, FileText, Download, Target, BookOpen, TrendingUp } from 'lucide-react';

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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Career Paths List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Paths</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {careerPaths.map(path => (
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
                          <CardTitle className="text-2xl">{selectedPath.title}</CardTitle>
                          <Badge className="mt-2">{selectedPath.category}</Badge>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{selectedPath.timeframe}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">{selectedPath.description}</p>
                      
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Steps to Success</span>
                        </h3>
                        <ol className="space-y-2">
                          {selectedPath.steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Key Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPath.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2 flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Job Market Outlook</span>
                        </h3>
                        <p className="text-muted-foreground">{selectedPath.prospects}</p>
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