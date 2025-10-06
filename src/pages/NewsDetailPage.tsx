// React hooks for state and lifecycle
import { useState, useEffect } from "react";
// React Helmet for dynamic meta tags
import { Helmet } from 'react-helmet-async';
// Routing hooks and components
import { useParams, Link } from "react-router-dom";
// UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Supabase client for database queries
import { supabase } from "@/integrations/supabase/client";
// Toast notifications
import { useToast } from "@/hooks/use-toast";
// Icons
import { ArrowLeft, Calendar, Tag, Flame, Share2, Image as ImageIcon } from "lucide-react";
// Component for rendering images and videos
import MediaRenderer from "@/components/ui/media-renderer";
// Back to top button
import { BackToTop } from "@/components/ui/BackToTop";

// Interface defining news article data structure
interface NewsArticle {
  id: string; // Unique identifier
  title: string; // Article title
  summary: string; // Brief description
  content: string; // Full article content (HTML)
  category: string; // Article category
  tags: string[]; // Associated tags
  is_hot: boolean; // Trending flag
  is_published: boolean; // Publication status
  created_at: string; // Creation timestamp
  updated_at: string; // Last update timestamp
  video_url?: string; // Optional video URL
  image_urls?: string[]; // Optional array of image URLs
}

// Main component for displaying full news article details
const NewsDetailPage = () => {
  // Get article ID from URL parameters
  const { id } = useParams<{ id: string }>();
  // State for the main article
  const [article, setArticle] = useState<NewsArticle | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  // State for related articles in same category
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  // Toast notifications
  const { toast } = useToast();

  // Fetch article when ID changes
  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Function to fetch article and related articles from database
  const fetchArticle = async () => {
    setIsLoading(true);
    
    // Fetch the main article by ID (only if published)
    const { data: articleData, error: articleError } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('is_published', true) // Only show published articles
      .single();

    // Handle fetch errors
    if (articleError) {
      toast({
        title: "Error",
        description: "Failed to fetch article",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // If article found, set it and fetch related articles
    if (articleData) {
      setArticle(articleData);

      // Fetch related articles (same category, excluding current article)
      const { data: relatedData } = await supabase
        .from('news')
        .select('*')
        .eq('category', articleData.category) // Same category
        .eq('is_published', true) // Only published
        .neq('id', id) // Exclude current article
        .order('created_at', { ascending: false }) // Most recent first
        .limit(3); // Limit to 3 articles

      setRelatedArticles(relatedData || []);
    }
    setIsLoading(false);
  };

  // Format date for display (e.g., "January 1, 2025, 12:00 PM")
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get color styling based on article category
  const getCategoryColor = (category: string) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      "student-life": "bg-green-100 text-green-800",
      career: "bg-purple-100 text-purple-800",
      spiritual: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Handle sharing article via Web Share API or clipboard
  const handleShare = async () => {
    try {
      // Try native share if available (mobile)
      await navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard"
      });
    }
  };

  // Convert YouTube URLs to embeddable format
  const convertYouTubeUrl = (url: string) => {
    // Handle standard YouTube watch URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle shortened youtu.be URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // Return original if not YouTube
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/news">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - BYU-Pathway News</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {article.image_urls && article.image_urls[0] && (
          <meta property="og:image" content={article.image_urls[0]} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        {article.image_urls && article.image_urls[0] && (
          <meta name="twitter:image" content={article.image_urls[0]} />
        )}
      </Helmet>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/news">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 lg:col-start-3">
          <article className="space-y-6">
            {/* Article Header */}
            <header className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={getCategoryColor(article.category)}>
                  {article.category.replace('-', ' ').toUpperCase()}
                </Badge>
                {article.is_hot && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    HOT
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-foreground leading-tight">
                {article.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Published {formatDate(article.created_at)}</span>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Article Summary */}
            <div className="bg-muted/50 rounded-lg p-6">
              <p className="text-lg text-muted-foreground italic">
                {article.summary}
              </p>
            </div>

            {/* Featured Video (Top Media Space - Videos Only) */}
            {article.video_url && (
              <div className="my-8">
                <h3 className="text-lg font-semibold mb-4">Featured Video</h3>
                {article.video_url.includes('youtube.com') || article.video_url.includes('youtu.be') ? (
                  <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <iframe
                      src={convertYouTubeUrl(article.video_url)}
                      title={`Video for ${article.title}`}
                      className="w-full h-full"
                      allowFullScreen
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <MediaRenderer 
                    src={article.video_url}
                    alt={`Video for ${article.title}`}
                    type="video"
                    className="w-full h-64 md:h-96 rounded-lg"
                    showModal={true}
                  />
                )}
              </div>
            )}

            {/* Image Gallery - Below video */}
            {article.image_urls && article.image_urls.length > 0 && (
              <div className="my-8">
                <h3 className="text-lg font-semibold mb-4">Image Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {article.image_urls.map((imageUrl, index) => (
                    <MediaRenderer 
                      key={index}
                      src={imageUrl}
                      alt={`Gallery image ${index + 1} for ${article.title}`}
                      type="image"
                      className="w-full h-32 rounded-lg object-cover"
                      showModal={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>
        </div>

        {/* Related Articles - Below Main Content */}
        {relatedArticles.length > 0 && (
          <div className="lg:col-span-8 lg:col-start-3 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.slice(0, 3).map((relatedArticle) => (
                    <div key={relatedArticle.id} className="space-y-2 pb-4 border-b md:border-b-0 last:border-b-0">
                      <Badge className={getCategoryColor(relatedArticle.category)} variant="outline">
                        {relatedArticle.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                      
                      <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                        <Link to={`/news/${relatedArticle.id}`}>
                          {relatedArticle.title}
                        </Link>
                      </h4>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {relatedArticle.summary}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        {formatDate(relatedArticle.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <BackToTop />
    </div>
    </>
  );
};

export default NewsDetailPage;