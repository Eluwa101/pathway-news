import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Video, Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Devotional {
  id: string;
  title: string;
  speaker: string;
  event_date: string;
  event_time: string;
  live_link: string;
  topics: string[];
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
  topics: string[];
}

export default function UpcomingEvents() {
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
        .select('id, title, speaker, event_date, event_time, live_link, topics')
        .eq('is_published', true)
        .gt('event_date', now)
        .order('event_date', { ascending: true })
        .limit(2);

      if (devotionalsError) throw devotionalsError;

      // Fetch upcoming career events
      const { data: careerEventsData, error: careerEventsError } = await supabase
        .from('career_events')
        .select('id, title, speaker, position, industry, event_date, live_link, registration_url, registration_required, topics')
        .eq('is_published', true)
        .gt('event_date', now)
        .order('event_date', { ascending: true })
        .limit(2);

      if (careerEventsError) throw careerEventsError;

      setDevotionals(devotionalsData || []);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
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

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span>Upcoming Events</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const hasEvents = devotionals.length > 0 || careerEvents.length > 0;

  if (!hasEvents) {
    return (
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span>Upcoming Events</span>
        </h2>
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground mb-6">
              Stay tuned for upcoming devotionals and career chats
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline">
                <Link to="/student-tools/devotionals">Browse Devotionals</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/student-tools/career-chats">Browse Career Chats</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span>Upcoming Events</span>
        </h2>
        <Button asChild variant="outline">
          <Link to="/student-tools/clock-calendar">View All Events</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Devotionals */}
        {devotionals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Devotionals</span>
            </h3>
            {devotionals.map((devotional) => (
              <Card key={devotional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{devotional.title}</CardTitle>
                      <p className="text-primary font-medium">{devotional.speaker}</p>
                    </div>
                    <Badge variant="default">Devotional</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(devotional.event_date)}</span>
                      </div>
                      {devotional.event_time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{devotional.event_time}</span>
                        </div>
                      )}
                    </div>
                    
                    {devotional.topics && devotional.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {devotional.topics.slice(0, 2).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                        {devotional.topics.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{devotional.topics.length - 2}</Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {devotional.live_link ? (
                        <Button size="sm" className="flex-1" asChild>
                          <a href={devotional.live_link} target="_blank" rel="noopener noreferrer">
                            Join Now
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1" asChild>
                          <Link to="/student-tools/devotionals">Join Now</Link>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/student-tools/devotionals">View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Career Events */}
        {careerEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <Video className="h-5 w-5 text-blue-500" />
              <span>Career Chats</span>
            </h3>
            {careerEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                      <p className="text-primary font-medium">{event.speaker}</p>
                      {event.position && (
                        <p className="text-sm text-muted-foreground">{event.position}</p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      {event.industry && (
                        <Badge className={getIndustryColor(event.industry)}>
                          {event.industry}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                    </div>
                    
                    {event.topics && event.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.topics.slice(0, 2).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                        {event.topics.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{event.topics.length - 2}</Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {event.registration_required && event.registration_url ? (
                        <Button size="sm" className="flex-1" asChild>
                          <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                            Register Now
                          </a>
                        </Button>
                      ) : event.live_link ? (
                        <Button size="sm" className="flex-1" asChild>
                          <a href={event.live_link} target="_blank" rel="noopener noreferrer">
                            Join Now
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1" asChild>
                          <Link to="/student-tools/career-chats">Join Now</Link>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/student-tools/career-chats">View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}