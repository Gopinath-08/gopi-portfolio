import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Check for interactive elements
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Only show on desktop
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
          transition: 'transform 0.15s cubic-bezier(0.1, 0.7, 0.2, 1)',
        }}
      >
        <div
          className={`w-5 h-5 rounded-full border-2 border-primary transition-all duration-300 ${
            isHovering ? 'scale-150 bg-primary/30 border-primary' : 'scale-100'
          } ${isClicking ? 'scale-75 border-primary/50' : ''}`}
        />
      </div>

      {/* Trailing cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          transition: 'transform 0.25s cubic-bezier(0.1, 0.7, 0.2, 1)',
        }}
      >
        <div
          className={`w-2 h-2 rounded-full bg-primary transition-all duration-300 ${
            isHovering ? 'scale-300 opacity-100' : 'opacity-60'
          } ${isClicking ? 'scale-150' : ''}`}
        />
      </div>

      {/* Ripple effect on click */}
      {isClicking && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9997] hidden md:block"
          style={{
            transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
          }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full border-2 border-primary"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}
    </>
  );
};

export default CustomCursor;

