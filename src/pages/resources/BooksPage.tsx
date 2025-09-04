import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Download, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  file_url: string;
  cover_image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const BookCard = ({ book }: { book: Book }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow max-w-sm">
      <div className="flex h-28">
        <div className="w-20 h-full bg-muted flex items-center justify-center flex-shrink-0">
          {book.cover_image_url ? (
            <img 
              src={book.cover_image_url} 
              alt={book.title}
              className="w-full h-full object-cover rounded-l-lg"
            />
          ) : (
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-2 pt-3 px-3">
            <div className="space-y-1">
              <CardTitle className="text-sm line-clamp-1 leading-tight">{book.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{book.author}</p>
              <Badge variant="outline" className="text-xs w-fit">{book.category}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 px-3 pb-3 flex-1 flex flex-col justify-between">
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {book.description}
            </p>
            
            <Button 
              size="sm"
              className="w-full text-xs h-7"
              onClick={() => window.open(book.file_url, '_blank')}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-muted border-t-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading Digital Library</p>
            <p className="text-sm text-muted-foreground">Preparing your study materials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Digital Books</h1>
            <p className="text-muted-foreground">
              Access your course textbooks and study materials
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search books, authors, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No books found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}