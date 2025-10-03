import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map, Target, BookOpen, TrendingUp, Plus, X, Download, FileText, Network, Edit, Calendar, Clock, Camera, Image as ImageIcon, Send, Sparkles, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCareerAdvisor } from '@/hooks/useCareerAdvisor';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [viewMode, setViewMode] = useState("ai-chat");
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showCustomInterest, setShowCustomInterest] = useState(false);
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { messages, isLoading, sendMessage, clearConversation, generateCareerPlan: generateAIPlan } = useCareerAdvisor();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mindMapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    await sendMessage(userInput);
    setUserInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGenerateCareerPlan = async () => {
    // Validate that user has filled in preferences
    if (preferences.interests.length === 0 || preferences.skills.length === 0 || !preferences.industry || !preferences.goals) {
      toast({
        title: "Incomplete Preferences",
        description: "Please fill in your interests, skills, industry, and goals before generating a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPlan(true);
    
    try {
      const aiPlan = await generateAIPlan(preferences);
      setCareerPlan(aiPlan);
      setViewMode("plan");
      toast({
        title: "AI Career Plan Generated!",
        description: "Your personalized career plan is ready."
      });
    } catch (error) {
      // Error already handled in the hook
      console.error("Failed to generate career plan:", error);
    } finally {
      setIsGeneratingPlan(false);
    }
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

  const exportMindMapImage = async () => {
    if (!mindMapRef.current) return;
    
    try {
      const canvas = await html2canvas(mindMapRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = 'career-mindmap.png';
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: "Mind Map Exported",
        description: "Your visual career map has been saved as an image."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export the mind map image.",
        variant: "destructive"
      });
    }
  };

  const exportComprehensivePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Comprehensive Career Plan', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const splitText = pdf.splitTextToSize(careerPlan, pageWidth - 40);
      
      for (let i = 0; i < splitText.length; i++) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(splitText[i], 20, yPosition);
        yPosition += 6;
      }

      if (mindMapRef.current) {
        const canvas = await html2canvas(mindMapRef.current, {
          backgroundColor: '#ffffff',
          scale: 1,
          useCORS: true,
          allowTaint: true
        });
        
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Visual Career Map', pageWidth / 2, 20, { align: 'center' });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (imgHeight <= pageHeight - 40) {
          pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
        } else {
          const scaledHeight = pageHeight - 40;
          const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
          pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, 30, scaledWidth, scaledHeight);
        }
      }

      if (timelineRef.current) {
        const timelineCanvas = await html2canvas(timelineRef.current, {
          backgroundColor: '#ffffff',
          scale: 1,
          useCORS: true,
          allowTaint: true
        });
        
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Career Timeline', pageWidth / 2, 20, { align: 'center' });
        
        const timelineImgData = timelineCanvas.toDataURL('image/png');
        const timelineImgWidth = pageWidth - 40;
        const timelineImgHeight = (timelineCanvas.height * timelineImgWidth) / timelineCanvas.width;
        
        if (timelineImgHeight <= pageHeight - 40) {
          pdf.addImage(timelineImgData, 'PNG', 20, 30, timelineImgWidth, timelineImgHeight);
        } else {
          const scaledHeight = pageHeight - 40;
          const scaledWidth = (timelineCanvas.width * scaledHeight) / timelineCanvas.height;
          pdf.addImage(timelineImgData, 'PNG', (pageWidth - scaledWidth) / 2, 30, scaledWidth, scaledHeight);
        }
      }

      pdf.save('comprehensive-career-plan.pdf');
      
      toast({
        title: "PDF Exported",
        description: "Your comprehensive career plan has been saved as PDF."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export the comprehensive PDF.",
        variant: "destructive"
      });
    }
  };

  const downloadComprehensiveMarkdown = () => {
    let comprehensiveMarkdown = careerPlan;
    
    comprehensiveMarkdown += '\n\n## Mind Map Overview\n\n';
    comprehensiveMarkdown += 'The visual mind map shows the interconnections between:\n';
    comprehensiveMarkdown += `- **Central Goal**: ${preferences.goals || 'Career Development'}\n`;
    comprehensiveMarkdown += `- **Interests**: ${preferences.interests.join(', ')}\n`;
    comprehensiveMarkdown += `- **Skills**: ${preferences.skills.join(', ')}\n`;
    comprehensiveMarkdown += `- **Industry**: ${preferences.industry}\n`;
    comprehensiveMarkdown += `- **Work Style**: ${preferences.workStyle}\n`;
    comprehensiveMarkdown += `- **Timeline**: ${preferences.timeframe}\n`;
    comprehensiveMarkdown += `- **Plan Type**: ${preferences.planType}\n\n`;
    
    comprehensiveMarkdown += '## Visual Career Map\n\n';
    comprehensiveMarkdown += 'The visual career map displays all your preferences in an interconnected diagram, showing how your interests, skills, and goals align with your chosen industry and work style.\n\n';
    
    comprehensiveMarkdown += '## Interactive Timeline\n\n';
    comprehensiveMarkdown += 'The timeline view breaks down your career development into actionable phases with specific milestones and deliverables.\n\n';
    
    const blob = new Blob([comprehensiveMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comprehensive-career-plan.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Comprehensive Plan Downloaded",
      description: "Your complete career plan with all views has been downloaded."
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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="space-y-4 sm:space-y-6">
          <div className="px-2">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Career Advisor</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get personalized career guidance powered by AI
            </p>
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="grid w-full grid-cols-6 h-auto overflow-x-auto">
              <TabsTrigger value="ai-chat" className="flex-col sm:flex-row text-[10px] sm:text-sm py-1.5 px-1 sm:py-2 sm:px-3 min-w-0">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-0 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">AI Chat</span>
                <span className="sm:hidden truncate">AI</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex-col sm:flex-row text-[10px] sm:text-sm py-1.5 px-1 sm:py-2 sm:px-3 min-w-0">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-0 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">Preferences</span>
                <span className="sm:hidden truncate">Prefs</span>
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex-col sm:flex-row text-[10px] sm:text-sm py-1.5 px-1 sm:py-2 sm:px-3 min-w-0">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-0 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">Career Plan</span>
                <span className="sm:hidden truncate">Plan</span>
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="flex-col sm:flex-row text-[10px] sm:text-sm py-1.5 px-1 sm:py-2 sm:px-3 min-w-0">
                <Network className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-0 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">Visual Map</span>
                <span className="sm:hidden truncate">Map</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-col sm:flex-row text-[10px] sm:text-sm py-1.5 px-1 sm:py-2 sm:px-3 min-w-0">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-0 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">Timeline</span>
                <span className="sm:hidden truncate">Time</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex-col sm:flex-row text-[10px] sm:text-sm py-1.5 px-1 sm:py-2 sm:px-3 min-w-0">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mb-0.5 sm:mb-0 sm:mr-2 shrink-0" />
                <span className="hidden sm:inline truncate">Export</span>
                <span className="sm:hidden truncate">Export</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-chat" className="space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    AI Career Advisor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] w-full pr-4 mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm mb-4">Start a conversation to get personalized career guidance!</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserInput("What career path is best for someone interested in theology and counseling?")}
                            className="text-xs"
                          >
                            Theology + Counseling
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserInput("How can I discern God's calling for my career?")}
                            className="text-xs"
                          >
                            Discerning God's Calling
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserInput("What skills do I need for ministry work?")}
                            className="text-xs"
                          >
                            Ministry Skills
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserInput("How do I prepare for missions work?")}
                            className="text-xs"
                          >
                            Missions Preparation
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-lg p-4 ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-4">
                              <div className="flex items-center gap-2">
                                <div className="animate-pulse">Thinking...</div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about career paths, spiritual gifts, or guidance..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !userInput.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      className="mt-2 w-full"
                    >
                      Clear Conversation
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 sm:space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI-Enhanced Career Planning
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out your preferences below, then let AI create a personalized, actionable career plan with specific timelines and milestones.
                  </p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Interests */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">What are your interests?</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowCustomInterest(!showCustomInterest)}
                        className="h-8 w-8 p-0"
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
                          className="justify-start text-xs px-2 h-8 overflow-hidden"
                        >
                          {preferences.interests.includes(interest) && <X className="h-3 w-3 mr-1 shrink-0" />}
                          <span className="truncate">{interest}</span>
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
                      <CardTitle className="text-base sm:text-lg">What are your strengths?</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowCustomSkill(!showCustomSkill)}
                        className="h-8 w-8 p-0"
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
                          className="justify-start text-xs px-2 h-8 overflow-hidden"
                        >
                          {preferences.skills.includes(skill) && <X className="h-3 w-3 mr-1 shrink-0" />}
                          <span className="truncate">{skill}</span>
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
                    <CardTitle className="text-base sm:text-lg">Preferred Industry</CardTitle>
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
                    <CardTitle className="text-base sm:text-lg">Work Style Preference</CardTitle>
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
                    <CardTitle className="text-base sm:text-lg">Plan Type</CardTitle>
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
                    <CardTitle className="text-base sm:text-lg">Career Timeline</CardTitle>
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
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Career Goals</CardTitle>
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

              <div className="flex justify-center px-2 sm:px-4">
                <Button 
                  size="sm"
                  onClick={handleGenerateCareerPlan}
                  disabled={preferences.interests.length === 0 || preferences.skills.length === 0 || isGeneratingPlan}
                  className="w-full sm:w-auto h-9 px-4 text-sm sm:h-10 sm:px-6 sm:text-base"
                >
                  {isGeneratingPlan ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Analyzing Your Preferences...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Career Plan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="plan" className="space-y-6">
              {careerPlan ? (
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-lg sm:text-xl">Your Personalized Career Plan</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="outline" onClick={printPlan} size="sm" className="text-xs sm:text-sm">
                          <span className="hidden sm:inline">Print Plan</span>
                          <span className="sm:hidden">Print</span>
                        </Button>
                        <Button onClick={downloadPlan} size="sm" className="text-xs sm:text-sm">
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
                    <div className="flex items-center justify-between">
                      <CardTitle>Visual Career Map</CardTitle>
                      <Button onClick={exportMindMapImage} variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Export Image
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div ref={mindMapRef} className="relative min-h-[600px] bg-gradient-to-br from-background to-muted/20 rounded-lg p-12 overflow-hidden">
                      {/* Central Career Goal */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-lg font-bold shadow-xl border-2 border-primary-foreground/20 max-w-xs text-center">
                          {preferences.goals ? preferences.goals.slice(0, 40) + (preferences.goals.length > 40 ? '...' : '') : 'Career Goal'}
                        </div>
                      </div>
                      
                      {/* Interests Branch - Top Left */}
                      {preferences.interests.length > 0 && (
                        <div className="absolute top-8 left-8 max-w-xs">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg mb-3 shadow-lg font-semibold text-center">
                            🎯 Interests
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {preferences.interests.slice(0, 4).map((interest, index) => (
                              <div key={interest} 
                                className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-1.5 rounded-md text-sm shadow-md font-medium text-center"
                              >
                                {interest}
                              </div>
                            ))}
                            {preferences.interests.length > 4 && (
                              <div className="text-center text-sm text-muted-foreground">
                                +{preferences.interests.length - 4} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Skills Branch - Top Right */}
                      {preferences.skills.length > 0 && (
                        <div className="absolute top-8 right-8 max-w-xs">
                          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg mb-3 shadow-lg font-semibold text-center">
                            ⚡ Skills
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {preferences.skills.slice(0, 4).map((skill, index) => (
                              <div key={skill} 
                                className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-md text-sm shadow-md font-medium text-center"
                              >
                                {skill}
                              </div>
                            ))}
                            {preferences.skills.length > 4 && (
                              <div className="text-center text-sm text-muted-foreground">
                                +{preferences.skills.length - 4} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Industry Branch - Bottom Left */}
                      {preferences.industry && (
                        <div className="absolute bottom-16 left-8">
                          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-center mb-2">
                            🏢 Industry
                          </div>
                          <div className="bg-gradient-to-r from-teal-400 to-teal-500 text-white px-3 py-1.5 rounded-md shadow-md font-medium text-center">
                            {preferences.industry}
                          </div>
                        </div>
                      )}
                      
                      {/* Work Style Branch - Bottom Right */}
                      {preferences.workStyle && (
                        <div className="absolute bottom-16 right-8">
                          <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-center mb-2">
                            💼 Work Style
                          </div>
                          <div className="bg-gradient-to-r from-violet-400 to-violet-500 text-white px-3 py-1.5 rounded-md shadow-md font-medium text-center">
                            {preferences.workStyle}
                          </div>
                        </div>
                      )}
                      
                      {/* Timeline Branch - Bottom Center */}
                      {preferences.timeframe && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-center mb-2">
                            ⏰ Timeline
                          </div>
                          <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white px-3 py-1.5 rounded-md shadow-md font-medium text-center">
                            {preferences.timeframe === 'immediate' ? '0-6 months' :
                             preferences.timeframe === 'short' ? '6-12 months' :
                             preferences.timeframe === 'medium' ? '1-2 years' : '2+ years'}
                          </div>
                        </div>
                      )}
                      
                      {/* Plan Type Branch - Top Center */}
                      {preferences.planType && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold text-center mb-2">
                            📋 Plan Type
                          </div>
                          <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white px-3 py-1.5 rounded-md shadow-md font-medium text-center">
                            {preferences.planType === 'short' ? 'Short-term' :
                             preferences.planType === 'long' ? 'Long-term' : 'Comprehensive'}
                          </div>
                        </div>
                      )}
                      
                      {/* Connecting Lines */}
                      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                        <defs>
                          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                          </pattern>
                          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.1"/>
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                          </radialGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        <circle cx="50%" cy="50%" r="200" fill="url(#centerGlow)" />
                        
                        {/* Animated connecting lines */}
                        <line x1="50%" y1="50%" x2="17%" y2="17%" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" strokeDasharray="5,5">
                          <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50%" y1="50%" x2="83%" y2="17%" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" strokeDasharray="5,5">
                          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" strokeDasharray="5,5">
                          <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" strokeDasharray="5,5">
                          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50%" y1="50%" x2="50%" y2="87%" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" strokeDasharray="5,5">
                          <animate attributeName="stroke-dashoffset" values="10;0" dur="2s" repeatCount="indefinite"/>
                        </line>
                        <line x1="50%" y1="50%" x2="50%" y2="12%" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.4" strokeDasharray="5,5">
                          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                        </line>
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
                    <div className="flex items-center justify-between">
                      <CardTitle>Career Timeline View</CardTitle>
                      <Button onClick={exportMindMapImage} variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Export Timeline
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div ref={timelineRef} className="space-y-6">
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
                <CardContent className="space-y-6">
                  {careerPlan ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={downloadPlan} className="h-20 flex-col space-y-2">
                          <Download className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">Basic Markdown</div>
                            <div className="text-xs text-muted-foreground">Career plan text only</div>
                          </div>
                        </Button>
                        
                        <Button onClick={printPlan} variant="outline" className="h-20 flex-col space-y-2">
                          <FileText className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">Print Plan</div>
                            <div className="text-xs text-muted-foreground">Physical copy for reference</div>
                          </div>
                        </Button>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-4">Comprehensive Export Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <Button onClick={downloadComprehensiveMarkdown} variant="secondary" className="h-auto py-4 flex-col space-y-2">
                            <Download className="h-5 w-5 sm:h-6 sm:w-6" />
                            <div className="text-center">
                              <div className="text-xs sm:text-sm font-medium">Complete Markdown</div>
                              <div className="text-xs text-muted-foreground">All views included</div>
                            </div>
                          </Button>
                          
                          <Button onClick={exportComprehensivePDF} variant="secondary" className="h-auto py-4 flex-col space-y-2">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                            <div className="text-center">
                              <div className="text-xs sm:text-sm font-medium">Comprehensive PDF</div>
                              <div className="text-xs text-muted-foreground">Plan + Map + Timeline</div>
                            </div>
                          </Button>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-4">Individual Components</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <Button onClick={exportMindMapImage} variant="outline" className="h-auto py-3 flex-col space-y-1">
                            <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                            <div className="text-xs sm:text-sm font-medium">Export Mind Map</div>
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              if (timelineRef.current) {
                                html2canvas(timelineRef.current, {
                                  backgroundColor: '#ffffff',
                                  scale: 2,
                                  useCORS: true,
                                  allowTaint: true
                                }).then(canvas => {
                                  const link = document.createElement('a');
                                  link.download = 'career-timeline.png';
                                  link.href = canvas.toDataURL();
                                  link.click();
                                  toast({
                                    title: "Timeline Exported",
                                    description: "Your career timeline has been saved as an image."
                                  });
                                }).catch(() => {
                                  toast({
                                    title: "Export Failed",
                                    description: "Could not export the timeline image.",
                                    variant: "destructive"
                                  });
                                });
                              }
                            }}
                            variant="outline" 
                            className="h-auto py-3 flex-col space-y-1"
                          >
                            <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <div className="text-xs sm:text-sm font-medium">Export Timeline</div>
                          </Button>
                        </div>
                      </div>
                    </>
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
