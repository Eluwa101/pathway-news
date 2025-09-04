import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Video, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DigitalClock from '@/components/ui/digital-clock';

interface Devotional {
  id: string;
  title: string;
  speaker: string;
  event_date: string;
  event_time: string;
  live_link: string;
  description: string;
}

interface CareerEvent {
  id: string;
  title: string;
  speaker: string;
  position: string;
  industry: string;
  event_date: string;
  live_link: string;
  registration_url: string;
  registration_required: boolean;
  description: string;
}

export default function ClockCalendarPage() {
  const [selectedTab, setSelectedTab] = useState("devotionals");
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [careerEvents, setCareerEvents] = useState<CareerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const now = new Date().toISOString();

      // Fetch upcoming devotionals
      const { data: devotionalsData, error: devotionalsError } = await supabase
        .from('devotionals')
        .select('id, title, speaker, event_date, event_time, live_link, content')
        .eq('is_published', true)
        .gt('event_date', now)
        .order('event_date', { ascending: true })
        .limit(10);

      if (devotionalsError) throw devotionalsError;

      // Fetch upcoming career events
      const { data: careerEventsData, error: careerEventsError } = await supabase
        .from('career_events')
        .select('id, title, speaker, position, industry, event_date, live_link, registration_url, registration_required, description')
        .eq('is_published', true)
        .gt('event_date', now)
        .order('event_date', { ascending: true })
        .limit(10);

      if (careerEventsError) throw careerEventsError;

      setDevotionals((devotionalsData || []).map(d => ({ ...d, description: d.content })));
      setCareerEvents(careerEventsData || []);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch upcoming events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  const formatEventTime = (dateString: string, timeString?: string) => {
    if (timeString) return timeString;
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  const DevotionalCard = ({ event }: { event: Devotional }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </div>
          <Badge variant="default">Devotional</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>{formatEventDate(event.event_date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{formatEventTime(event.event_date, event.event_time)}</span>
          </div>
          <div className="text-sm font-medium text-primary">
            Speaker: {event.speaker}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
          <div className="flex space-x-2">
            {event.live_link ? (
              <Button size="sm" asChild>
                <a href={event.live_link} target="_blank" rel="noopener noreferrer">
                  Join Now
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                Link Coming Soon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CareerEventCard = ({ event }: { event: CareerEvent }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </div>
          <Badge variant="secondary">Career Chat</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>{formatEventDate(event.event_date)}</span>
          </div>
          <div className="text-sm font-medium text-primary">
            Speaker: {event.speaker}
            {event.position && <span className="block text-muted-foreground">{event.position}</span>}
            {event.industry && <span className="block text-muted-foreground">{event.industry}</span>}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
          <div className="flex space-x-2">
            {event.registration_required && event.registration_url ? (
              <Button size="sm" asChild>
                <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                  Register Now
                </a>
              </Button>
            ) : event.live_link ? (
              <Button size="sm" asChild>
                <a href={event.live_link} target="_blank" rel="noopener noreferrer">
                  Join Now
                </a>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                Link Coming Soon
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
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
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
                      <TabsTrigger value="career">Career Chats</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="devotionals" className="mt-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                              <CardContent className="p-6">
                                <div className="h-6 bg-muted rounded mb-4"></div>
                                <div className="h-4 bg-muted rounded mb-2"></div>
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : devotionals.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {devotionals.map(event => (
                            <DevotionalCard key={event.id} event={event} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Upcoming Devotionals</h3>
                          <p className="text-muted-foreground mb-4">
                            Check back soon for upcoming spiritual gatherings
                          </p>
                          <Button asChild variant="outline">
                            <Link to="/student-tools/devotionals">Browse Past Devotionals</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="career" className="mt-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                              <CardContent className="p-6">
                                <div className="h-6 bg-muted rounded mb-4"></div>
                                <div className="h-4 bg-muted rounded mb-2"></div>
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : careerEvents.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {careerEvents.map(event => (
                            <CareerEventCard key={event.id} event={event} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Upcoming Career Chats</h3>
                          <p className="text-muted-foreground mb-4">
                            Check back soon for upcoming career guidance sessions
                          </p>
                          <Button asChild variant="outline">
                            <Link to="/student-tools/career-chats">Browse Past Career Chats</Link>
                          </Button>
                        </div>
                      )}
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