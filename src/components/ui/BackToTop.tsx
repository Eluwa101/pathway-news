// Component for back-to-top button that appears when user scrolls down
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  // Track if button should be visible (user has scrolled down)
  const [isVisible, setIsVisible] = useState(false);

  // Listen to scroll events and show/hide button
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup function to remove listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top of page smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg z-50"
      size="icon"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
