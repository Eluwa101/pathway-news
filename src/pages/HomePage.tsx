import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, TrendingUp, Users, BookOpen, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import FeaturedNews from '@/components/home/FeaturedNews';
import heroImage from '@/assets/hero-image.jpg';

const hotNews = [
  {
    id: 1,
    title: "New Career Services Program Launched",
    summary: "BYU-Pathway introduces comprehensive career guidance for all students.",
    category: "Career",
    date: "2024-01-20",
    isHot: true
  },
  {
    id: 2,
    title: "Spring Semester Registration Opens",
    summary: "Students can now register for spring semester courses starting February 1st.",
    category: "Academic",
    date: "2024-01-18",
    isHot: true
  },
  {
    id: 3,
    title: "Student Success Workshop Series",
    summary: "Join us for weekly workshops on study skills, time management, and more.",
    category: "Student Life",
    date: "2024-01-15",
    isHot: false
  }
];

const quickStats = [
  { label: "Active Students", value: "15,000+", icon: Users },
  { label: "Courses Available", value: "200+", icon: BookOpen },
  { label: "Career Paths", value: "50+", icon: Map },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center space-y-6 text-white">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to <span className="text-primary">BYU-Pathway</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Your gateway to education, career growth, and spiritual development. 
              Stay connected with the latest news, tools, and resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/student-tools/clock-calendar">
                  <Clock className="mr-2 h-5 w-5" />
                  Student Tools
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-foreground">
                <Link to="/career-map">
                  <Map className="mr-2 h-5 w-5" />
                  Career Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Upcoming Events */}
        <UpcomingEvents />

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured News Section */}
        <FeaturedNews />

        {/* Quick Access Tools */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CalendarDays className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Calendar & Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  View upcoming devotionals, career chats, and important dates.
                </p>
                <Button asChild className="w-full">
                  <Link to="/student-tools/clock-calendar">Open Calendar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Digital Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Access textbooks, recordings, and study materials.
                </p>
                <Button asChild className="w-full">
                  <Link to="/resources/books">Browse Resources</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Map className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Career Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Plan your career path with interactive tools and guidance.
                </p>
                <Button asChild className="w-full">
                  <Link to="/career-map">Start Planning</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Join study groups and connect with fellow students.
                </p>
                <Button asChild className="w-full">
                  <Link to="/community">Join Community</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}