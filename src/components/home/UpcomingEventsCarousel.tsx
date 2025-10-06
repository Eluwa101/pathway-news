import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, VideoIcon, Download, ExternalLink, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WatchModal } from '@/components/ui/watch-modal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface BaseEvent {
  id: string;
  title: string;
  speaker: string;
  event_date: string;
  topics?: string[];
  status?: string;
  featured_on_homepage?: boolean;
  live_link?: string;
  recording_link?: string;
  download_link?: string;
  cover_image_url?: string;
}

interface Devotional extends BaseEvent {
  event_time?: string;
}

interface CareerEvent extends BaseEvent {
  position?: string;
  industry?: string;
  attendees?: number;
  registration_required?: boolean;
  registration_url?: string;
}

type CombinedEvent = (Devotional | CareerEvent) & { type: 'devotional' | 'career' };

export default function UpcomingEventsCarousel() {
  const [allEvents, setAllEvents] = useState<CombinedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CombinedEvent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setIsLoading(true);
      const now = new Date().toISOString();

      // Fetch featured devotionals
      const { data: devotionalsData, error: devotionalsError } = await supabase
        .from('devotionals')
        .select('*')
        .eq('is_published', true)
        .eq('featured_on_homepage', true)
        .gte('event_date', now)
        .order('event_date', { ascending: true })
        .limit(3);

      if (devotionalsError) throw devotionalsError;

      // Fetch featured career events
      const { data: careerEventsData, error: careerEventsError } = await supabase
        .from('career_events')
        .select('*')
        .eq('is_published', true)
        .eq('featured_on_homepage', true)
        .gte('event_date', now)
        .order('event_date', { ascending: true })
        .limit(3);

      if (careerEventsError) throw careerEventsError;

      // Combine and type the events
      const devotionals: CombinedEvent[] = (devotionalsData || []).map(d => ({ ...d, type: 'devotional' as const }));
      const careerEvents: CombinedEvent[] = (careerEventsData || []).map(c => ({ ...c, type: 'career' as const }));
      
      const combined = [...devotionals, ...careerEvents]
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

      setAllEvents(combined);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIndustryColor = (industry: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Finance': 'bg-purple-100 text-purple-800',
      'Education': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-pink-100 text-pink-800',
    };
    return colors[industry as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section>
      <div className="flex items-center space-x-2 mb-6 bg-primary">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Upcoming Events</h2>
      </div>
      
      {isLoading ? (
        <div className="flex space-x-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse min-w-[300px]">
              <CardHeader>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : allEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground">
              Check back later for devotionals and career events
            </p>
          </CardContent>
        </Card>
      ) : (
        <Carousel 
          className="w-full" 
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {allEvents.map((event) => (
              <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                <Card className="hover:shadow-lg transition-shadow h-full max-w-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {/* Small round cover image */}
                      {event.cover_image_url && (
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={event.cover_image_url} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="text-xs">
                            {event.type === 'devotional' ? 'Devotional' : 'Career Chat'}
                          </Badge>
                          {event.featured_on_homepage && (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-2 text-base leading-tight">{event.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="text-xs">{event.speaker}</span>
                          {'position' in event && event.position && <span className="text-xs">• {event.position}</span>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {'industry' in event && event.industry && (
                        <Badge variant="outline" className="text-xs">
                          {event.industry}
                        </Badge>
                      )}
                      {event.topics && event.topics.length > 0 && (
                        event.topics.slice(0, 1).map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {event.live_link && event.status === 'live' && (
                        <Button asChild size="sm" variant="default" className="text-xs h-7">
                          <a href={event.live_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join
                          </a>
                        </Button>
                      )}
                      
                      {'registration_required' in event && event.registration_required && event.registration_url && event.status === 'upcoming' && (
                        <Button asChild size="sm" variant="outline" className="text-xs h-7">
                          <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Register
                          </a>
                        </Button>
                      )}
                      
                      {event.recording_link && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <VideoIcon className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-8" />
          <CarouselNext className="-right-8" />
        </Carousel>
      )}

      {selectedEvent && (
        <WatchModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          recordingLink={selectedEvent.recording_link || undefined}
          downloadLink={selectedEvent.download_link || undefined}
          type={selectedEvent.type === 'career' ? 'career-chat' : selectedEvent.type}
        />
      )}
    </section>
  );
}