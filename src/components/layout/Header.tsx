import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen, Users, Map, Wrench, Home, Zap, Newspaper, Settings, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Pathway News</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center space-x-1">
                    <Wrench className="h-4 w-4" />
                    <span>Student Tools</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <NavigationMenuLink asChild>
                        <Link to="/student-tools/clock-calendar" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent">
                          <div className="text-sm font-medium leading-none">Calendar & Events</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Digital clock, calendar, and upcoming events
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/student-tools/devotionals" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent">
                          <div className="text-sm font-medium leading-none">Devotionals</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Upcoming devotionals and spiritual resources
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/student-tools/career-chats" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent">
                          <div className="text-sm font-medium leading-none">Career Chats</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Career guidance and networking events
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/career-map" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                    <Map className="h-4 w-4" />
                    <span>Career Map</span>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <NavigationMenuLink asChild>
                        <Link to="/resources/books" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent">
                          <div className="text-sm font-medium leading-none">Digital Books</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            PDF textbooks and study materials
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/resources/jobs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent">
                          <div className="text-sm font-medium leading-none">Career Opportunities</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Job listings and career opportunities
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/utility-apps" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                    <Zap className="h-4 w-4" />
                    <span>Utility Apps</span>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/community" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                    <Users className="h-4 w-4" />
                    <span>Community</span>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/news" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent">
                    <Newspaper className="h-4 w-4" />
                    <span>News</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/student-tools/clock-calendar" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Calendar & Events
            </Link>
            <Link to="/student-tools/devotionals" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Devotionals
            </Link>
            <Link to="/student-tools/career-chats" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Career Chats
            </Link>
            <Link to="/career-map" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Career Map
            </Link>
            <Link to="/resources/books" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Digital Books
            </Link>
            <Link to="/resources/jobs" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Career Opportunities
            </Link>
            <Link to="/utility-apps" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Utility Apps
            </Link>
            <Link to="/community" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              Community
            </Link>
            <Link to="/news" className="block px-3 py-2 rounded-md hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
              News
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}