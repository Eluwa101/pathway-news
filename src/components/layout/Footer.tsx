import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">BYU-Pathway Worldwide</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students worldwide through accessible education, career development, and spiritual growth.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Building futures, one student at a time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/student-tools/clock-calendar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Student Tools
                </Link>
              </li>
              <li>
                <Link to="/career-map" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Career Planning
                </Link>
              </li>
              <li>
                <Link to="/resources/books" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Digital Resources
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@byupathway.edu</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (855) 472-8498</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>50 E North Temple St<br />Salt Lake City, UT 84150</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Connect With Us</h3>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="icon" className="h-9 w-9">
                <a href="https://www.facebook.com/BYUPathway" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>

              <Button asChild variant="outline" size="icon" className="h-9 w-9">
                <a href="https://www.instagram.com/byupathwayworldwide/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="h-9 w-9">
                <a href="https://www.linkedin.com/school/byupathway" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="h-9 w-9">
                <a href="https://www.youtube.com/@BYUPathwayWorldwideOfficial/featured" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                  <span className="sr-only">YouTube</span>
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Follow us for updates, inspiration, and student success stories.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Eluwa Victor Monday. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="https://help.byupathway.edu/" className="text-muted-foreground hover:text-primary transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}