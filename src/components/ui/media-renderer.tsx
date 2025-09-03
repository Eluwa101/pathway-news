import { useState } from 'react';
import { Play, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaRendererProps {
  src: string;
  alt?: string;
  type?: 'image' | 'video' | 'auto';
  className?: string;
  showModal?: boolean;
}

export default function MediaRenderer({ 
  src, 
  alt = "Media content", 
  type = 'auto', 
  className = "",
  showModal = true 
}: MediaRendererProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p>Media not available</p>
        </div>
      </div>
    );
  }

  const determineMediaType = (url: string): 'image' | 'video' => {
    if (type !== 'auto') return type;
    
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    
    const lowerSrc = url.toLowerCase();
    
    if (videoExtensions.some(ext => lowerSrc.includes(ext))) return 'video';
    if (imageExtensions.some(ext => lowerSrc.includes(ext))) return 'image';
    
    // Check for video hosting platforms
    if (lowerSrc.includes('youtube.com') || lowerSrc.includes('youtu.be') || 
        lowerSrc.includes('vimeo.com') || lowerSrc.includes('zoom.us')) {
      return 'video';
    }
    
    return 'image'; // Default to image
  };

  const mediaType = determineMediaType(src);

  const handleError = () => {
    setHasError(true);
  };

  const handleClick = () => {
    if (showModal) {
      setIsModalOpen(true);
    }
  };

  const renderMedia = (isInModal = false) => {
    const baseClasses = isInModal 
      ? "w-full h-auto max-h-[80vh] object-contain" 
      : `rounded-lg object-cover ${className}`;

    if (mediaType === 'video') {
      return (
        <div className="relative group">
          <video 
            src={src}
            className={baseClasses}
            controls={isInModal}
            onError={handleError}
            poster={src.replace(/\.[^/.]+$/, '.jpg')} // Try to find poster image
          />
          {!isInModal && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                <Play className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <img 
        src={src}
        alt={alt}
        className={`${baseClasses} ${showModal && !isInModal ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onError={handleError}
        onClick={!isInModal ? handleClick : undefined}
      />
    );
  };

  return (
    <>
      {renderMedia()}
      
      {showModal && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-4 pb-0">
              <DialogTitle className="sr-only">{alt}</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4 z-10"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="p-4 pt-0">
              {renderMedia(true)}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}