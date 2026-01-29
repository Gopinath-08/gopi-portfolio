import { ReactNode, useState, useRef, useEffect } from 'react';
import { Monitor, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface WebsiteFrameProps {
  children: ReactNode;
  image?: string;
  url?: string;
  className?: string;
}

const WebsiteFrame = ({ children, image, url, className = '' }: WebsiteFrameProps) => {
  const [showLivePreview, setShowLivePreview] = useState(true); // Always try live preview first
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canShowLive = url && url.startsWith('http');
  const hasImage = image && image.trim() !== '';

  // Check if iframe is blocked
  useEffect(() => {
    if (showLivePreview && canShowLive && iframeRef.current) {
      const timer = setTimeout(() => {
        try {
          // Try to access iframe content - if blocked, this will throw
          const iframe = iframeRef.current;
          if (iframe && iframe.contentWindow) {
            // If we can't access the contentWindow or it's null, likely blocked
            try {
              iframe.contentWindow.location;
            } catch (e) {
              // Cross-origin or blocked - fall back to image if available
              setIframeBlocked(true);
            }
          }
        } catch (e) {
          // Iframe blocked - fall back to image if available
          setIframeBlocked(true);
        }
      }, 2000); // Wait 2 seconds to see if content loads

      return () => clearTimeout(timer);
    }
  }, [showLivePreview, canShowLive]);

  // Reset iframe blocked state when switching modes
  useEffect(() => {
    if (!showLivePreview) {
      setIframeBlocked(false);
    }
  }, [showLivePreview]);

  return (
    <div className={`relative ${className}`}>
      {/* Browser Frame */}
      <div className="relative bg-muted rounded-lg overflow-hidden shadow-2xl border-2 border-border">
        {/* Browser Header */}
        <div className="bg-muted px-4 py-2.5 flex items-center gap-2 border-b border-border">
          {/* Browser Controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
          
          {/* Address Bar */}
          <div className="flex-1 mx-4 bg-background rounded px-3 py-1.5 text-xs font-mono text-foreground/60 truncate">
            {url || 'example.com'}
          </div>
          
          {/* Browser Icons */}
          <div className="flex gap-2 text-foreground/40">
            <div className="w-4 h-4 border border-current rounded" />
            <div className="w-4 h-4 border border-current rounded" />
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="relative bg-background aspect-video overflow-hidden group">
          {showLivePreview && canShowLive && !iframeBlocked ? (
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                src={url}
                className="w-full h-full border-0 pointer-events-none"
                title={`Live preview of ${url}`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
                onError={() => setIframeBlocked(true)}
              />
              {/* Clickable overlay that redirects to the website */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/0 hover:bg-foreground/5 transition-colors duration-300 group/overlay"
                aria-label={`Visit ${url}`}
              >
                <span className="px-4 py-2 bg-primary text-primary-foreground font-sans text-sm font-medium opacity-0 group-hover/overlay:opacity-100 transition-opacity">
                  Click to Visit Site →
                </span>
              </a>
            </div>
          ) : hasImage ? (
            <>
              <img
                src={image}
                alt="Website preview"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay with link on hover */}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="px-4 py-2 bg-primary text-primary-foreground font-sans text-sm font-medium">
                    View Live Site →
                  </span>
                </a>
              )}
            </>
          ) : canShowLive && !hasImage ? (
            <div className="relative w-full h-full">
              {iframeBlocked ? (
                // Fallback when iframe is blocked and no image available
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-8 text-center">
                  <ExternalLink className="w-12 h-12 text-primary mb-4" />
                  <p className="text-foreground mb-2 font-medium">Preview Not Available</p>
                  <p className="text-foreground/70 text-sm mb-6 max-w-md">
                    This website cannot be embedded for security reasons. Click below to visit the site directly.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    Visit {new URL(url!).hostname} →
                  </a>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={url}
                    className="w-full h-full border-0 pointer-events-none"
                    title={`Live preview of ${url}`}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                    onError={() => setIframeBlocked(true)}
                  />
                  {/* Clickable overlay that redirects to the website */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/0 hover:bg-foreground/5 transition-colors duration-300 group/overlay"
                    aria-label={`Visit ${url}`}
                  >
                    <span className="px-4 py-2 bg-primary text-primary-foreground font-sans text-sm font-medium opacity-0 group-hover/overlay:opacity-100 transition-opacity">
                      Click to Visit Site →
                    </span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">Preview not available</span>
            </div>
          )}
        </div>

        {/* Toggle Button - only show if both image and live URL are available */}
        {canShowLive && hasImage && (
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="absolute top-2 right-2 p-2 bg-background/90 backdrop-blur-sm border border-border hover:border-primary transition-colors rounded z-20"
            aria-label={showLivePreview ? 'Show image preview' : 'Show live preview'}
            title={showLivePreview ? 'Show image preview' : 'Show live preview'}
          >
            {showLivePreview ? (
              <ImageIcon size={16} className="text-foreground" />
            ) : (
              <Monitor size={16} className="text-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default WebsiteFrame;

