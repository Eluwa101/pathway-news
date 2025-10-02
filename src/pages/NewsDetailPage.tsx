import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Tag, Flame, Share2, Image as ImageIcon } from "lucide-react";
import MediaRenderer from "@/components/ui/media-renderer";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  is_hot: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  video_url?: string;
  image_urls?: string[];
}

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setIsLoading(true);
    
    // Fetch the main article
    const { data: articleData, error: articleError } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (articleError) {
      toast({
        title: "Error",
        description: "Failed to fetch article",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (articleData) {
      setArticle(articleData);

      // Fetch related articles (same category, excluding current article)
      const { data: relatedData } = await supabase
        .from('news')
        .select('*')
        .eq('category', articleData.category)
        .eq('is_published', true)
        .neq('id', id)
        .order('created_at', { ascending: false })
        .limit(3);

      setRelatedArticles(relatedData || []);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: "bg-blue-100 text-blue-800",
      "student-life": "bg-green-100 text-green-800",
      career: "bg-purple-100 text-purple-800",
      spiritual: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard"
      });
    }
  };

  const convertYouTubeUrl = (url: string) => {
    // Convert YouTube watch URLs to embed URLs
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
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
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
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
    </div>
  );
};

export default NewsDetailPage;