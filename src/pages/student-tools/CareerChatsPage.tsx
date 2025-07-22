import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock, Play, Download, Users } from 'lucide-react';

const careerChats = [
  {
    id: 1,
    title: "Business Leadership in the Digital Age",
    speaker: "Sarah Johnson",
    position: "CEO, TechCorp Solutions",
    date: "2024-01-24",
    time: "6:00 PM MT",
    status: "upcoming",
    description: "Learn essential leadership skills for navigating modern business challenges and building effective teams.",
    topics: ["Leadership", "Management", "Digital Transformation"],
    industry: "Business",
    attendees: 250,
    liveLink: "https://example.com/live",
    registrationRequired: true
  },
  {
    id: 2,
    title: "Breaking into the Technology Sector",
    speaker: "Michael Chen",
    position: "Senior Software Engineer, Google",
    date: "2024-01-26",
    time: "7:30 PM MT",
    status: "upcoming",
    description: "Discover pathways to enter the tech industry, from coding bootcamps to computer science degrees.",
    topics: ["Technology", "Software Development", "Career Transition"],
    industry: "Technology",
    attendees: 400,
    liveLink: "https://example.com/live2",
    registrationRequired: true
  },
  {
    id: 3,
    title: "Healthcare Administration Careers",
    speaker: "Dr. Maria Rodriguez",
    position: "Hospital Administrator, Regional Medical Center",
    date: "2024-01-17",
    time: "6:30 PM MT",
    status: "completed",
    description: "Explore opportunities in healthcare management and the skills needed to succeed in this growing field.",
    topics: ["Healthcare", "Administration", "Management"],
    industry: "Healthcare",
    attendees: 180,
    recordingLink: "https://example.com/recording1",
    downloadLink: "https://example.com/download1"
  },
  {
    id: 4,
    title: "Financial Planning and Advisory",
    speaker: "Robert Kim",
    position: "Certified Financial Planner, Wealth Partners",
    date: "2024-01-10",
    time: "7:00 PM MT",
    status: "completed",
    description: "Learn about career opportunities in financial planning and the path to becoming a certified advisor.",
    topics: ["Finance", "Planning", "Investment"],
    industry: "Finance",
    attendees: 320,
    recordingLink: "https://example.com/recording2",
    downloadLink: "https://example.com/download2"
  },
  {
    id: 5,
    title: "Education and Teaching Excellence",
    speaker: "Jennifer Taylor",
    position: "Principal, Lincoln Elementary",
    date: "2024-01-03",
    time: "8:00 PM MT",
    status: "completed",
    description: "Discover the rewards and challenges of a career in education and how to make a lasting impact.",
    topics: ["Education", "Teaching", "Leadership"],
    industry: "Education",
    attendees: 150,
    recordingLink: "https://example.com/recording3",
    downloadLink: "https://example.com/download3"
  }
];

export default function CareerChatsPage() {
  const upcomingChats = careerChats.filter(chat => chat.status === "upcoming");
  const pastChats = careerChats.filter(chat => chat.status === "completed");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getIndustryColor = (industry: string) => {
    const colors: { [key: string]: string } = {
      'Business': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-purple-100 text-purple-800'
    };
    return colors[industry] || 'bg-gray-100 text-gray-800';
  };

  const CareerChatCard = ({ chat, isPast = false }: { chat: typeof careerChats[0], isPast?: boolean }) => (
    <Card className="mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">{chat.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Badge className={getIndustryColor(chat.industry)}>
              {chat.industry}
            </Badge>
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Completed" : "Upcoming"}
            </Badge>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-medium text-primary">
            {chat.speaker}
          </div>
          <div className="text-sm text-muted-foreground">
            {chat.position}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(chat.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{chat.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{chat.attendees} attendees</span>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {chat.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {chat.topics.map((topic, index) => (
              <Badge key={index} variant="outline">{topic}</Badge>
            ))}
          </div>
          
          <div className="flex space-x-2 pt-2">
            {!isPast ? (
              <>
                <Button className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Join Live</span>
                </Button>
                {chat.registrationRequired && (
                  <Button variant="outline">
                    Register Now
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Watch Recording</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Career Chats</h1>
            <p className="text-muted-foreground">
              Connect with industry professionals and explore career opportunities
            </p>
          </div>

          {/* Upcoming Career Chats */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Video className="h-6 w-6 text-blue-500" />
              <span>Upcoming Career Chats</span>
            </h2>
            {upcomingChats.length > 0 ? (
              <div className="space-y-4">
                {upcomingChats.map(chat => (
                  <CareerChatCard key={chat.id} chat={chat} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming career chats scheduled.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Career Chats */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Past Career Chats</h2>
            <div className="space-y-4">
              {pastChats.map(chat => (
                <CareerChatCard key={chat.id} chat={chat} isPast={true} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}