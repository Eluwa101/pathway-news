import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Clock, Play, Download } from 'lucide-react';
import { WatchModal } from '@/components/ui/watch-modal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Devotional {
  id: string;
  title: string;
  content: string;
  scripture_reference: string;
  author: string;
  speaker: string;
  event_date: string;
  event_time: string;
  live_link: string;
  recording_link: string;
  download_link: string;
  topics: string[];
  status: string;
  is_published: boolean;
  created_at: string;
}

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [watchModal, setWatchModal] = useState<{ isOpen: boolean; devotional: Devotional | null }>({
    isOpen: false,
    devotional: null
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDevotionals();
  }, []);

  const fetchDevotionals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('devotionals')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setDevotionals(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch devotionals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-update status based on current date
  const getDevotionalStatus = (devotional: Devotional) => {
    if (!devotional.event_date) return devotional.status;
    const eventDate = new Date(devotional.event_date);
    const now = new Date();
    return eventDate > now ? 'upcoming' : 'completed';
  };

  const upcomingDevotionals = devotionals.filter(d => getDevotionalStatus(d) === 'upcoming');
  const pastDevotionals = devotionals.filter(d => getDevotionalStatus(d) === 'completed');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleWatch = (devotional: Devotional) => {
    setWatchModal({ isOpen: true, devotional });
  };

  const DevotionalCard = ({ devotional, isPast = false }: { devotional: Devotional, isPast?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <CardTitle className="text-xl">{devotional.title}</CardTitle>
          </div>
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? "Completed" : "Upcoming"}
          </Badge>
        </div>
        <div className="text-lg font-medium text-primary">
          {devotional.speaker}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{devotional.event_date ? formatDate(devotional.event_date) : 'TBD'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{devotional.event_time || 'TBD'}</span>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {devotional.content}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {devotional.topics?.map((topic, index) => (
              <Badge key={index} variant="outline">{topic}</Badge>
            ))}
          </div>
          
          <div className="flex space-x-2 pt-2">
            {!isPast ? (
              <Button 
                className="flex items-center space-x-2"
                asChild={!!devotional.live_link}
                onClick={!devotional.live_link ? () => handleWatch(devotional) : undefined}
              >
                {devotional.live_link ? (
                  <a href={devotional.live_link} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4" />
                    <span>Watch Live</span>
                  </a>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Join Live</span>
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2"
                  onClick={() => handleWatch(devotional)}
                >
                  <Play className="h-4 w-4" />
                  <span>Watch</span>
                </Button>
                {devotional.download_link && (
                  <Button variant="outline" className="flex items-center space-x-2" asChild>
                    <a href={devotional.download_link} download>
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
          <Heart className="h-12 w-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading devotionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Devotionals</h1>
            <p className="text-muted-foreground">
              Spiritual guidance and inspiration for your educational journey
            </p>
          </div>

          {/* Upcoming Devotionals */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span>Upcoming Devotionals</span>
            </h2>
            {upcomingDevotionals.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingDevotionals.map(devotional => (
                  <DevotionalCard key={devotional.id} devotional={devotional} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming devotionals scheduled.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Devotionals */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Past Devotionals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastDevotionals.map(devotional => (
                <DevotionalCard key={devotional.id} devotional={devotional} isPast={true} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <WatchModal 
        isOpen={watchModal.isOpen}
        onClose={() => setWatchModal({ isOpen: false, devotional: null })}
        title={watchModal.devotional?.title || ''}
        recordingLink={watchModal.devotional?.recording_link}
        downloadLink={watchModal.devotional?.download_link}
        type="devotional"
      />
    </div>
  );
}