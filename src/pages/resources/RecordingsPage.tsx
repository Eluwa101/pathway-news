import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Download, Search, Video, Heart, Calendar, Clock } from 'lucide-react';

const recordings = {
  careerChats: [
    {
      id: 1,
      title: "Healthcare Administration Careers",
      speaker: "Dr. Maria Rodriguez",
      date: "2024-01-17",
      duration: "45:32",
      views: 180,
      description: "Explore opportunities in healthcare management and the skills needed to succeed.",
      topics: ["Healthcare", "Administration", "Management"],
      videoUrl: "https://example.com/video1",
      downloadUrl: "https://example.com/download1",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Financial Planning and Advisory",
      speaker: "Robert Kim, CFP",
      date: "2024-01-10",
      duration: "52:18",
      views: 320,
      description: "Learn about career opportunities in financial planning and certification paths.",
      topics: ["Finance", "Planning", "Investment"],
      videoUrl: "https://example.com/video2",
      downloadUrl: "https://example.com/download2",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Education and Teaching Excellence",
      speaker: "Jennifer Taylor",
      date: "2024-01-03",
      duration: "38:45",
      views: 150,
      description: "Discover the rewards and challenges of a career in education.",
      topics: ["Education", "Teaching", "Leadership"],
      videoUrl: "https://example.com/video3",
      downloadUrl: "https://example.com/download3",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
    }
  ],
  devotionals: [
    {
      id: 4,
      title: "The Purpose of Education",
      speaker: "President Russell M. Nelson",
      date: "2024-01-15",
      duration: "28:15",
      views: 450,
      description: "Understanding the eternal significance of learning and education in our lives.",
      topics: ["Education", "Purpose", "Eternal Perspective"],
      videoUrl: "https://example.com/video4",
      downloadUrl: "https://example.com/download4",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Overcoming Academic Challenges",
      speaker: "Elder Dieter F. Uchtdorf",
      date: "2024-01-08",
      duration: "35:42",
      views: 380,
      description: "Practical and spiritual insights for overcoming difficulties in education.",
      topics: ["Challenges", "Resilience", "Faith"],
      videoUrl: "https://example.com/video5",
      downloadUrl: "https://example.com/download5",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      title: "Learning with Faith",
      speaker: "Sister Bonnie H. Cordon",
      date: "2023-12-18",
      duration: "31:28",
      views: 290,
      description: "How faith enhances our ability to learn and understand truth.",
      topics: ["Faith", "Learning", "Understanding"],
      videoUrl: "https://example.com/video6",
      downloadUrl: "https://example.com/download6",
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
    }
  ]
};

export default function RecordingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const allRecordings = [...recordings.careerChats, ...recordings.devotionals];
  
  const getFilteredRecordings = (type: string) => {
    let recordingsToFilter;
    if (type === "career") {
      recordingsToFilter = recordings.careerChats;
    } else if (type === "devotionals") {
      recordingsToFilter = recordings.devotionals;
    } else {
      recordingsToFilter = allRecordings;
    }

    return recordingsToFilter.filter(recording =>
      recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const RecordingCard = ({ recording, type }: { recording: typeof allRecordings[0], type?: string }) => {
    const isDevotional = recording.topics.includes("Faith") || recording.topics.includes("Purpose") || recording.topics.includes("Eternal Perspective");
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-muted relative">
          <img 
            src={recording.thumbnail} 
            alt={recording.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="h-6 w-6 text-black" />
            </div>
          </div>
          <div className="absolute top-2 left-2">
            <Badge className={isDevotional ? "bg-red-500" : "bg-blue-500"}>
              {isDevotional ? (
                <>
                  <Heart className="h-3 w-3 mr-1" />
                  Devotional
                </>
              ) : (
                <>
                  <Video className="h-3 w-3 mr-1" />
                  Career Chat
                </>
              )}
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {recording.duration}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-lg">{recording.title}</CardTitle>
          <p className="text-sm font-medium text-primary">{recording.speaker}</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recording.description}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(recording.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Play className="h-3 w-3" />
                <span>{recording.views} views</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {recording.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button size="sm" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Watch
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recordings</h1>
            <p className="text-muted-foreground">
              Watch past career chats and devotionals
            </p>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recordings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Recordings</TabsTrigger>
              <TabsTrigger value="career">
                <Video className="h-4 w-4 mr-2" />
                Career Chats
              </TabsTrigger>
              <TabsTrigger value="devotionals">
                <Heart className="h-4 w-4 mr-2" />
                Devotionals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRecordings("all").map(recording => (
                  <RecordingCard key={recording.id} recording={recording} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="career" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRecordings("career").map(recording => (
                  <RecordingCard key={recording.id} recording={recording} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="devotionals" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRecordings("devotionals").map(recording => (
                  <RecordingCard key={recording.id} recording={recording} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {getFilteredRecordings(selectedTab).length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No recordings found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}