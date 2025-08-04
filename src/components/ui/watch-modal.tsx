import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, X } from 'lucide-react';

interface WatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  recordingLink?: string;
  downloadLink?: string;
  type: 'devotional' | 'career-chat';
}

export const WatchModal: React.FC<WatchModalProps> = ({
  isOpen,
  onClose,
  title,
  recordingLink,
  downloadLink,
  type
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {recordingLink ? (
            <div className="space-y-4">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {recordingLink.includes('youtube.com') || recordingLink.includes('youtu.be') ? (
                  <iframe
                    src={recordingLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={title}
                  />
                ) : recordingLink.includes('vimeo.com') ? (
                  <iframe
                    src={recordingLink.replace('vimeo.com/', 'player.vimeo.com/video/')}
                    className="w-full h-full"
                    allowFullScreen
                    title={title}
                  />
                ) : (
                  <video
                    src={recordingLink}
                    controls
                    className="w-full h-full"
                    title={title}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={recordingLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
                {downloadLink && (
                  <Button asChild variant="outline">
                    <a href={downloadLink} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Recording not available for this {type.replace('-', ' ')}.
              </p>
              {downloadLink && (
                <Button asChild>
                  <a href={downloadLink} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download Materials
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};