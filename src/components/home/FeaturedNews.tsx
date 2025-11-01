// React hooks for state and lifecycle management
import { useState, useEffect, useRef } from 'react';
// UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
// Icons
import { TrendingUp } from 'lucide-react';
// Routing
import { Link } from 'react-router-dom';
// Supabase client for database queries
import { supabase } from '@/integrations/supabase/client';
// Toast notifications
import { useToast } from '@/hooks/use-toast';
// Carousel autoplay plugin
import Autoplay from "embla-carousel-autoplay";

// Interface for news article data structure
interface NewsItem {
  id: string; // Unique identifier
  title: string; // Article title
  summary: string; // Brief description
  category: string; // Article category
  is_hot: boolean; // Flag for trending news
  featured_on_homepage: boolean; // Flag for homepage feature
  created_at: string; // Publication timestamp
  image_urls?: string[]; // cover image URL
}

// Main component for displaying featured news on the homepage
export default function FeaturedNews() {
  // State to store featured news articles
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  // Toast notifications
  const { toast } = useToast();

  // Autoplay plugin configuration for carousel
  const autoplayPlugin = useRef<any>(
    Autoplay({
      delay: 5000, // Auto-advance every 5 seconds
      stopOnInteraction: false, // Keep playing after user interaction
      stopOnMouseEnter: true, // Pause when mouse hovers
      playOnInit: true, // Start playing immediately
      stopOnFocusIn: false // Don't stop on focus
    })
  );

  // Fetch featured news on component mount
  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  // Function to fetch featured news from database
  const fetchFeaturedNews = async () => {
    try {
      setIsLoading(true);
      // Query Supabase for published news marked as featured
      const { data, error } = await supabase
        .from('news')
        .select('id, title, summary, category, is_hot, featured_on_homepage, created_at, image_urls')
        .eq('is_published', true) // Only published articles
        .eq('featured_on_homepage', true) // Only featured articles
        .order('created_at', { ascending: false }); // Most recent first

      if (error) throw error;
      setFeaturedNews(data || []);
    } catch (error) {
      // Log error and show user notification
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
            <p className="text-primary-foreground/80 line-clamp-3 mb-3">{featuredNews[0].summary}</p>
            <Button asChild variant="secondary" className="w-full h-7 text-xs px-3 py-1">
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
        onMouseEnter={() => autoplayPlugin.current.stop()}
        onMouseLeave={() => autoplayPlugin.current.play()}
      >
        <CarouselContent>
          {featuredNews.map((news) => (
            <CarouselItem
              key={news.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3 px-2 md:px-4"
            >
              <Card className="bg-primary text-primary-foreground hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                {/* Header Section */}
                <CardHeader className="space-y-3">
                  {/* Top Row: Badge + Date */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={news.is_hot ? "destructive" : "secondary"}
                      className="text-xs md:text-sm"
                    >
                      {news.is_hot ? "🔥 Hot" : news.category}
                    </Badge>
                    <span className="text-xs md:text-sm text-primary-foreground/70">
                      {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Image Section */}
                  {news.image_urls && news.image_urls.length > 0 && (
                    <div className="flex justify-center">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={news.image_urls[0]}
                          alt={`Cover image for ${news.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <CardTitle className="text-base md:text-lg font-semibold line-clamp-2 text-center text-primary-foreground">
                    {news.title}
                  </CardTitle>
                </CardHeader>

                {/* Content Section */}
                <CardContent className="flex flex-col justify-between flex-grow">
                  <p className="text-sm md:text-base text-primary-foreground/80 line-clamp-3 text-center mb-4">
                    {news.summary}
                  </p>

                  <div className="flex justify-center">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs md:text-sm px-4 py-1 w-auto"
                    >
                      <Link to={`/news/${news.id}`}>Read More</Link>
                    </Button>
                  </div>
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