import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Download, Search, Filter } from 'lucide-react';

const books = [
  {
    id: 1,
    title: "Principles of Management",
    author: "Dr. Richard L. Daft",
    subject: "Business",
    pages: 624,
    format: "PDF",
    size: "15.2 MB",
    description: "Comprehensive guide to modern management practices and organizational behavior.",
    downloadLink: "https://example.com/book1.pdf",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: true
  },
  {
    id: 2,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    subject: "Technology",
    pages: 1292,
    format: "PDF",
    size: "28.7 MB",
    description: "The definitive guide to algorithms and data structures for computer science students.",
    downloadLink: "https://example.com/book2.pdf",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=300&fit=crop",
    semester: "Spring 2024",
    required: true
  },
  {
    id: 3,
    title: "Healthcare Operations Management",
    author: "Dr. Yasar A. Ozcan",
    subject: "Healthcare",
    pages: 456,
    format: "PDF",
    size: "8.3 MB",
    description: "Strategic approaches to managing healthcare delivery systems and operations.",
    downloadLink: "https://example.com/book3.pdf",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: false
  },
  {
    id: 4,
    title: "Personal Financial Planning",
    author: "Randy Billingsley",
    subject: "Finance",
    pages: 736,
    format: "PDF",
    size: "12.1 MB",
    description: "Comprehensive guide to personal finance, investments, and retirement planning.",
    downloadLink: "https://example.com/book4.pdf",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=300&fit=crop",
    semester: "Spring 2024",
    required: true
  },
  {
    id: 5,
    title: "Educational Psychology: Theory and Practice",
    author: "Dr. Robert E. Slavin",
    subject: "Education",
    pages: 528,
    format: "PDF",
    size: "18.9 MB",
    description: "Research-based approaches to understanding student learning and motivation.",
    downloadLink: "https://example.com/book5.pdf",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: false
  },
  {
    id: 6,
    title: "Study Skills and Learning Strategies",
    author: "Dr. Claire E. Weinstein",
    subject: "Study Skills",
    pages: 284,
    format: "PDF",
    size: "4.7 MB",
    description: "Evidence-based techniques for effective studying, memory, and academic success.",
    downloadLink: "https://example.com/book6.pdf",
    coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=300&fit=crop",
    semester: "All Semesters",
    required: false
  },
  {
    id: 7,
    title: "Statistics for Business and Economics",
    author: "Paul Newbold",
    subject: "Mathematics",
    pages: 896,
    format: "PDF",
    size: "22.4 MB",
    description: "Essential statistical methods and applications for business decision making.",
    downloadLink: "https://example.com/book7.pdf",
    coverImage: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=200&h=300&fit=crop",
    semester: "Spring 2024",
    required: true
  },
  {
    id: 8,
    title: "Marketing Management",
    author: "Philip Kotler",
    subject: "Business",
    pages: 832,
    format: "PDF",
    size: "19.8 MB",
    description: "The world's leading marketing textbook covering strategy, planning, and implementation.",
    downloadLink: "https://example.com/book8.pdf",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: true
  }
];

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");

  const subjects = [...new Set(books.map(book => book.subject))];
  const semesters = [...new Set(books.map(book => book.semester))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || book.subject === selectedSubject;
    const matchesSemester = selectedSemester === "all" || book.semester === selectedSemester;
    
    return matchesSearch && matchesSubject && matchesSemester;
  });

  const BookCard = ({ book }: { book: typeof books[0] }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        <div className="w-24 h-32 bg-muted flex items-center justify-center">
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <BookOpen className="h-8 w-8" />
          </div>
        </div>
        
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              <div className="flex space-x-1">
                <Badge variant={book.required ? "default" : "secondary"}>
                  {book.required ? "Required" : "Optional"}
                </Badge>
                <Badge variant="outline">{book.subject}</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{book.pages} pages</span>
                <span>{book.format}</span>
                <span>{book.size}</span>
                <span>{book.semester}</span>
              </div>
              
              <Button className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
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
            <div className="flex items-center space-x-2 text-sm">
              <Filter className="h-4 w-4" />
              <span>Filter: {selectedSubject !== "all" && selectedSubject} {selectedSemester !== "all" && selectedSemester}</span>
            </div>
          </div>

          {/* Books Grid */}
          <div className="space-y-4">
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