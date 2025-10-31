import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, TrendingUp, Users, BookOpen, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import UpcomingEventsCarousel from '@/components/home/UpcomingEventsCarousel';
import FeaturedNews from '@/components/home/FeaturedNews';
import heroImage from '@/assets/hero-image.jpg';
import { BackToTop } from '@/components/ui/BackToTop';

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
  { label: "Active Students", value: "Over 70,000+", icon: Users },
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
              Welcome to <span className="text-primary">Pathway News</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Your gateway to education, career growth, and spiritual development. 
              Stay connected with the latest news, tools, and resources.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground md:h-11 md:px-8 text-sm md:text-base">
                <Link to="/student-tools/clock-calendar">
                  <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Student Tools
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground md:h-11 md:px-8 text-sm md:text-base">
                <Link to="/career-map">
                  <Map className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Career Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 space-y-12 max-w-7xl">
        {/* Upcoming Events */}
        <UpcomingEventsCarousel/>

      {/* Quick Stats (Compact Horizontal Scroll on Mobile) */}
      <section className="my-4">
        <div
          className="
            flex space-x-2 overflow-x-auto md:grid md:grid-cols-3 md:gap-4
            scrollbar-hide pb-2
          "
        >
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="
                flex-shrink-0 w-28 sm:w-32 md:w-auto 
                text-center p-2 md:p-3 rounded-lg shadow-sm
              "
            >
              <CardContent className="py-2 px-1 sm:py-3 sm:px-2">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1" />
                <div className="text-sm sm:text-base font-semibold text-primary mb-0.5">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  {stat.label}
                </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow h-fit">
              <CardHeader className="text-center pb-3">
                <CalendarDays className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Calendar & Events</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-center text-muted-foreground text-sm mb-3">
                  View upcoming devotionals and career chats.
                </p>
                <Button asChild className="w-full text-xs md:text-sm" size="sm">
                  <Link to="/student-tools/clock-calendar">Open Calendar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow h-fit">
              <CardHeader className="text-center pb-3">
                <BookOpen className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-base">Digital Resources</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-center text-muted-foreground text-sm mb-3">
                  Access a wide range of textbooks and study materials easily.
                </p>
                <Button asChild className="w-full text-xs md:text-sm" size="sm">
                  <Link to="/resources/books">Browse Resources</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow h-fit">
              <CardHeader className="text-center pb-3">
                <Map className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Career Planning</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-center text-muted-foreground text-sm mb-3">
                  Plan your career path with interactive tools.
                </p>
                <Button asChild className="w-full text-xs md:text-sm" size="sm">
                  <Link to="/career-map">Start Planning</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow h-fit">
              <CardHeader className="text-center pb-3">
                <Users className="h-8 w-8 text-primary mx-auto" />
                <CardTitle className="text-lg">Connect</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-center text-muted-foreground text-sm mb-3">
                  Join study groups and connect with fellow students.
                </p>
                <Button asChild className="w-full text-xs md:text-sm" size="sm">
                  <Link to="/community">Join Community</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <BackToTop />
    </div>
  );
}