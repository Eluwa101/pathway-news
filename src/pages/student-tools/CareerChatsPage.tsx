import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock, Play, Download, Users } from 'lucide-react';
import { WatchModal } from '@/components/ui/watch-modal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CareerEvent {
  id: string;
  title: string;
  description: string;
  speaker: string;
  position: string;
  industry: string;
  event_date: string;
  location: string;
  registration_url: string;
  live_link: string;
  recording_link: string;
  download_link: string;
  topics: string[];
  attendees: number;
  status: string;
  registration_required: boolean;
  is_published: boolean;
  created_at: string;
}

export default function CareerChatsPage() {
  const [careerEvents, setCareerEvents] = useState<CareerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [watchModal, setWatchModal] = useState<{ isOpen: boolean; event: CareerEvent | null }>({
    isOpen: false,
    event: null
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCareerEvents();
  }, []);

  const fetchCareerEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('career_events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setCareerEvents(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch career events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-update status based on current date
  const getEventStatus = (event: CareerEvent) => {
    if (!event.event_date) return event.status;
    const eventDate = new Date(event.event_date);
    const now = new Date();
    return eventDate > now ? 'upcoming' : 'completed';
  };

  const upcomingChats = careerEvents.filter(event => getEventStatus(event) === 'upcoming');
  const pastChats = careerEvents.filter(event => getEventStatus(event) === 'completed');

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

  const handleWatch = (event: CareerEvent) => {
    setWatchModal({ isOpen: true, event });
  };

  const CareerChatCard = ({ chat, isPast = false }: { chat: CareerEvent, isPast?: boolean }) => (
    <Card className="mb-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">{chat.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            {chat.industry && (
              <Badge className={getIndustryColor(chat.industry)}>
                {chat.industry}
              </Badge>
            )}
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Completed" : "Upcoming"}
            </Badge>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-medium text-primary">
            {chat.speaker}
          </div>
          {chat.position && (
            <div className="text-sm text-muted-foreground">
              {chat.position}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{chat.event_date ? formatDate(chat.event_date) : 'TBD'}</span>
            </div>
            {chat.attendees > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{chat.attendees} attendees</span>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground">
            {chat.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {chat.topics?.map((topic, index) => (
              <Badge key={index} variant="outline">{topic}</Badge>
            ))}
          </div>
          
          <div className="flex space-x-2 pt-2">
            {!isPast ? (
              <>
                <Button 
                  className="flex items-center space-x-2"
                  asChild={!!chat.live_link}
                  onClick={!chat.live_link ? () => handleWatch(chat) : undefined}
                >
                  {chat.live_link ? (
                    <a href={chat.live_link} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4" />
                      <span>Join Live</span>
                    </a>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Join Live</span>
                    </>
                  )}
                </Button>
                {chat.registration_required && chat.registration_url && (
                  <Button variant="outline" asChild>
                    <a href={chat.registration_url} target="_blank" rel="noopener noreferrer">
                      Register Now
                    </a>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => handleWatch(chat)}
                >
                  <Play className="h-4 w-4" />
                  <span>Watch</span>
                </Button>
                {chat.download_link && (
                  <Button variant="outline" className="flex items-center space-x-2" asChild>
                    <a href={chat.download_link} download>
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Video className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading career chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
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

      <WatchModal 
        isOpen={watchModal.isOpen}
        onClose={() => setWatchModal({ isOpen: false, event: null })}
        title={watchModal.event?.title || ''}
        recordingLink={watchModal.event?.recording_link}
        downloadLink={watchModal.event?.download_link}
        type="career-chat"
      />
    </div>
  );
}