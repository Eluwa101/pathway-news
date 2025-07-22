import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Clock, Video, Heart } from 'lucide-react';
import DigitalClock from '@/components/ui/digital-clock';

const upcomingEvents = [
  {
    id: 1,
    title: "Weekly Devotional",
    type: "devotional",
    date: "2024-01-22",
    time: "7:00 PM MT",
    speaker: "Elder David A. Bednar",
    description: "Faith and Learning: The Divine Connection"
  },
  {
    id: 2,
    title: "Career Chat: Business Leadership",
    type: "career",
    date: "2024-01-24",
    time: "6:00 PM MT",
    speaker: "Sarah Johnson, CEO",
    description: "Building leadership skills in the modern workplace"
  },
  {
    id: 3,
    title: "Tech Industry Career Chat",
    type: "career",
    date: "2024-01-26",
    time: "7:30 PM MT",
    speaker: "Michael Chen, Software Engineer",
    description: "Breaking into the technology sector"
  },
  {
    id: 4,
    title: "Midweek Devotional",
    type: "devotional",
    date: "2024-01-25",
    time: "8:00 PM MT",
    speaker: "Sister Joy D. Jones",
    description: "Finding joy in the journey of education"
  }
];

export default function ClockCalendarPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const devotionals = upcomingEvents.filter(event => event.type === "devotional");
  const careerChats = upcomingEvents.filter(event => event.type === "career");

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const EventCard = ({ event }: { event: typeof upcomingEvents[0] }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {event.type === "devotional" ? (
              <Heart className="h-5 w-5 text-red-500" />
            ) : (
              <Video className="h-5 w-5 text-blue-500" />
            )}
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </div>
          <Badge variant={event.type === "devotional" ? "default" : "secondary"}>
            {event.type === "devotional" ? "Devotional" : "Career Chat"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>{formatEventDate(event.date)} at {event.time}</span>
          </div>
          <div className="text-sm font-medium text-primary">
            Speaker: {event.speaker}
          </div>
          <p className="text-sm text-muted-foreground">
            {event.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student Tools</h1>
            <p className="text-muted-foreground">
              Stay on track with time management and upcoming events
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Digital Clock */}
            <div className="lg:col-span-1">
              <DigitalClock />
            </div>

            {/* Events Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarDays className="h-5 w-5" />
                    <span>This Week's Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">All Events</TabsTrigger>
                      <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
                      <TabsTrigger value="career">Career Chats</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {upcomingEvents.map(event => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="devotionals" className="mt-4">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {devotionals.map(event => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="career" className="mt-4">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {careerChats.map(event => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}