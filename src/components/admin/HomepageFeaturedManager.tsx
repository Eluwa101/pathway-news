import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Heart, Video, Newspaper, Loader2 } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  is_hot: boolean;
  featured_on_homepage: boolean;
  created_at: string;
}

interface DevotionalItem {
  id: string;
  title: string;
  speaker: string;
  event_date: string;
  status: string;
  featured_on_homepage: boolean;
}

interface CareerEventItem {
  id: string;
  title: string;
  speaker: string;
  industry: string;
  event_date: string;
  status: string;
  featured_on_homepage: boolean;
}

export default function HomepageFeaturedManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [devotionals, setDevotionals] = useState<DevotionalItem[]>([]);
  const [careerEvents, setCareerEvents] = useState<CareerEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setIsLoading(true);
      
      // Fetch news
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('id, title, summary, category, is_hot, featured_on_homepage, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (newsError) throw newsError;

      // Fetch devotionals
      const { data: devotionalsData, error: devotionalsError } = await supabase
        .from('devotionals')
        .select('id, title, speaker, event_date, status, featured_on_homepage')
        .eq('is_published', true)
        .order('event_date', { ascending: false });

      if (devotionalsError) throw devotionalsError;

      // Fetch career events
      const { data: careerEventsData, error: careerEventsError } = await supabase
        .from('career_events')
        .select('id, title, speaker, industry, event_date, status, featured_on_homepage')
        .eq('is_published', true)
        .order('event_date', { ascending: false });

      if (careerEventsError) throw careerEventsError;

      setNews(newsData || []);
      setDevotionals(devotionalsData || []);
      setCareerEvents(careerEventsData || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (table: 'news' | 'devotionals' | 'career_events', id: string, currentStatus: boolean) => {
    setUpdatingItems(prev => new Set(prev).add(id));
    
    try {
      const { error } = await supabase
        .from(table)
        .update({ featured_on_homepage: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      if (table === 'news') {
        setNews(prev => prev.map(item => 
          item.id === id ? { ...item, featured_on_homepage: !currentStatus } : item
        ));
      } else if (table === 'devotionals') {
        setDevotionals(prev => prev.map(item => 
          item.id === id ? { ...item, featured_on_homepage: !currentStatus } : item
        ));
      } else if (table === 'career_events') {
        setCareerEvents(prev => prev.map(item => 
          item.id === id ? { ...item, featured_on_homepage: !currentStatus } : item
        ));
      }

      toast({
        title: "Success",
        description: `Item ${!currentStatus ? 'added to' : 'removed from'} homepage`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string, eventDate?: string) => {
    if (eventDate) {
      const isUpcoming = new Date(eventDate) > new Date();
      return (
        <Badge variant={isUpcoming ? "default" : "secondary"}>
          {isUpcoming ? "Upcoming" : "Past"}
        </Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading content...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Homepage Featured Content</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Select which content to feature on the homepage. Featured items will be displayed prominently to all visitors.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span>News ({news.filter(n => n.featured_on_homepage).length})</span>
            </TabsTrigger>
            <TabsTrigger value="devotionals" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Devotionals ({devotionals.filter(d => d.featured_on_homepage).length})</span>
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Career Events ({careerEvents.filter(c => c.featured_on_homepage).length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">News Articles</h3>
                <Badge variant="outline">
                  {news.filter(n => n.featured_on_homepage).length} featured
                </Badge>
              </div>
              
              {news.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No published news articles found.</p>
              ) : (
                <div className="space-y-3">
                  {news.map((item) => (
                    <Card key={item.id} className={item.featured_on_homepage ? "border-yellow-200 bg-yellow-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {item.summary}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{item.category}</Badge>
                              {item.is_hot && <Badge variant="destructive">Hot</Badge>}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {updatingItems.has(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`news-${item.id}`} className="text-sm">
                                  Featured
                                </Label>
                                <Switch
                                  id={`news-${item.id}`}
                                  checked={item.featured_on_homepage}
                                  onCheckedChange={() => toggleFeatured('news', item.id, item.featured_on_homepage)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="devotionals" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Devotionals</h3>
                <Badge variant="outline">
                  {devotionals.filter(d => d.featured_on_homepage).length} featured
                </Badge>
              </div>
              
              {devotionals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No published devotionals found.</p>
              ) : (
                <div className="space-y-3">
                  {devotionals.map((item) => (
                    <Card key={item.id} className={item.featured_on_homepage ? "border-yellow-200 bg-yellow-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-primary font-medium mt-1">{item.speaker}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              {getStatusBadge(item.status, item.event_date)}
                              <span className="text-xs text-muted-foreground">
                                {item.event_date ? formatDate(item.event_date) : 'No date set'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {updatingItems.has(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`devotional-${item.id}`} className="text-sm">
                                  Featured
                                </Label>
                                <Switch
                                  id={`devotional-${item.id}`}
                                  checked={item.featured_on_homepage}
                                  onCheckedChange={() => toggleFeatured('devotionals', item.id, item.featured_on_homepage)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="career" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Career Events</h3>
                <Badge variant="outline">
                  {careerEvents.filter(c => c.featured_on_homepage).length} featured
                </Badge>
              </div>
              
              {careerEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No published career events found.</p>
              ) : (
                <div className="space-y-3">
                  {careerEvents.map((item) => (
                    <Card key={item.id} className={item.featured_on_homepage ? "border-yellow-200 bg-yellow-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-primary font-medium mt-1">{item.speaker}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              {item.industry && (
                                <Badge variant="outline">{item.industry}</Badge>
                              )}
                              {getStatusBadge(item.status, item.event_date)}
                              <span className="text-xs text-muted-foreground">
                                {item.event_date ? formatDate(item.event_date) : 'No date set'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {updatingItems.has(item.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`career-${item.id}`} className="text-sm">
                                  Featured
                                </Label>
                                <Switch
                                  id={`career-${item.id}`}
                                  checked={item.featured_on_homepage}
                                  onCheckedChange={() => toggleFeatured('career_events', item.id, item.featured_on_homepage)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}