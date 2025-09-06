import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Autoplay from "embla-carousel-autoplay";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  is_hot: boolean;
  featured_on_homepage: boolean;
  created_at: string;
}

export default function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const autoplayPlugin = useRef<any>(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: true,
    })
  );

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  const fetchFeaturedNews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('id, title, summary, category, is_hot, featured_on_homepage, created_at')
        .eq('is_published', true)
        .eq('featured_on_homepage', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeaturedNews(data || []);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch featured news",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Latest News</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>
    );
  }

  // If no featured news, show fallback content or empty state
  if (featuredNews.length === 0) {
    return (
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Latest News</h2>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Featured News</h3>
            <p className="text-muted-foreground mb-6">
              Admins can select news articles to feature on the homepage
            </p>
            <Button asChild variant="outline">
              <Link to="/news">Browse All News</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Show single card if only one news item
  if (featuredNews.length === 1) {
    return (
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Latest News</h2>
        </div>
        
        <Card className="bg-primary text-primary-foreground hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <Badge variant={featuredNews[0].is_hot ? "destructive" : "secondary"}>
                {featuredNews[0].is_hot ? "🔥 Hot" : featuredNews[0].category}
              </Badge>
              <span className="text-sm text-primary-foreground/70">
                {new Date(featuredNews[0].created_at).toLocaleDateString()}
              </span>
            </div>
            <CardTitle className="line-clamp-2 text-primary-foreground">{featuredNews[0].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-foreground/80 line-clamp-3 mb-4">{featuredNews[0].summary}</p>
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link to={`/news/${featuredNews[0].id}`}>Read More</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Latest News</h2>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {featuredNews.map((news) => (
            <CarouselItem key={news.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="bg-primary text-primary-foreground hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant={news.is_hot ? "destructive" : "secondary"}>
                      {news.is_hot ? "🔥 Hot" : news.category}
                    </Badge>
                    <span className="text-sm text-primary-foreground/70">
                      {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-primary-foreground">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/80 line-clamp-3 mb-4">{news.summary}</p>
                  <Button asChild variant="secondary" size="sm" className="w-full">
                    <Link to={`/news/${news.id}`}>Read More</Link>
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}