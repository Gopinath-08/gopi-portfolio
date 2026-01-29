import { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  image?: string;
  url?: string;
  className?: string;
}

const MobileFrame = ({ children, image, url, className = '' }: MobileFrameProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Mobile Frame */}
      <div className="relative mx-auto" style={{ width: '280px', maxWidth: '100%' }}>
        {/* Phone Frame */}
        <div className="relative bg-foreground rounded-[2.5rem] p-2 shadow-2xl">
          {/* Screen Bezel */}
          <div className="bg-foreground rounded-[2rem] p-1">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10" />
            
            {/* Screen */}
            <div className="relative bg-background rounded-[1.5rem] overflow-hidden aspect-[9/19.5] group">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Mobile app preview"
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
                      <span className="px-3 py-1.5 bg-primary text-primary-foreground font-sans text-xs font-medium rounded">
                        View App →
                      </span>
                    </a>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-xs">Preview not available</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
      </div>
    </div>
  );
};

export default MobileFrame;

