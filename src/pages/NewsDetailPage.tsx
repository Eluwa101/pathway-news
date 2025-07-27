import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Tag, Flame, Share2 } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/news">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>
      </div>

      {/* Article Content */}
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

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4 space-y-3">
                  <Badge className={getCategoryColor(relatedArticle.category)} size="sm">
                    {relatedArticle.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                  
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    <Link to={`/news/${relatedArticle.id}`}>
                      {relatedArticle.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedArticle.summary}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    {formatDate(relatedArticle.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetailPage;