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
    title: "Business Fundamentals",
    author: "Dr. Sarah Mitchell",
    subject: "Business",
    pages: 324,
    format: "PDF",
    size: "2.4 MB",
    description: "Comprehensive introduction to business principles, management, and strategy.",
    downloadLink: "https://example.com/book1.pdf",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: true
  },
  {
    id: 2,
    title: "Introduction to Computer Science",
    author: "Prof. Michael Chen",
    subject: "Technology",
    pages: 456,
    format: "PDF",
    size: "3.8 MB",
    description: "Fundamental concepts in programming, algorithms, and computer systems.",
    downloadLink: "https://example.com/book2.pdf",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=300&fit=crop",
    semester: "Spring 2024",
    required: true
  },
  {
    id: 3,
    title: "Healthcare Systems Management",
    author: "Dr. Maria Rodriguez",
    subject: "Healthcare",
    pages: 398,
    format: "PDF",
    size: "2.9 MB",
    description: "Managing healthcare organizations, quality improvement, and patient care.",
    downloadLink: "https://example.com/book3.pdf",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: false
  },
  {
    id: 4,
    title: "Financial Planning Essentials",
    author: "Robert Kim, CFP",
    subject: "Finance",
    pages: 278,
    format: "PDF",
    size: "2.1 MB",
    description: "Personal and corporate financial planning strategies and best practices.",
    downloadLink: "https://example.com/book4.pdf",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=300&fit=crop",
    semester: "Spring 2024",
    required: true
  },
  {
    id: 5,
    title: "Educational Psychology",
    author: "Dr. Jennifer Taylor",
    subject: "Education",
    pages: 342,
    format: "PDF",
    size: "2.6 MB",
    description: "Understanding how students learn and effective teaching methodologies.",
    downloadLink: "https://example.com/book5.pdf",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
    semester: "Fall 2024",
    required: false
  },
  {
    id: 6,
    title: "Study Skills for Success",
    author: "Academic Success Team",
    subject: "Study Skills",
    pages: 156,
    format: "PDF",
    size: "1.2 MB",
    description: "Proven techniques for effective studying, time management, and test preparation.",
    downloadLink: "https://example.com/book6.pdf",
    coverImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=300&fit=crop",
    semester: "All Semesters",
    required: false
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