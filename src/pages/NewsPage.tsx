import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, Tag, Flame } from "lucide-react";

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

const NewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const { toast } = useToast();

  const categories = ["academic", "student-life", "career", "spiritual"];
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory, selectedTag]);

  const fetchNews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news articles",
        variant: "destructive"
      });
    } else {
      setArticles(data || []);
      // Extract all unique tags
      const allTags = data?.flatMap(article => article.tags || []) || [];
      const uniqueTags = Array.from(new Set(allTags));
      setAvailableTags(uniqueTags);
    }
    setIsLoading(false);
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter(article => 
        article.tags && article.tags.includes(selectedTag)
      );
    }

    setFilteredArticles(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Latest News</h1>
        <p className="text-muted-foreground text-lg">Stay updated with the latest from BYU-Pathway Connect</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
      </div>

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
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
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.created_at)}
                </div>
                
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  <Link to={`/news/${article.id}`}>
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground line-clamp-3">
                  {article.summary}
                </p>
                
                {article.tags && article.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{article.tags.length - 3} more</span>
                    )}
                  </div>
                )}
                
                <Link to={`/news/${article.id}`}>
                  <Button variant="outline" className="w-full">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;