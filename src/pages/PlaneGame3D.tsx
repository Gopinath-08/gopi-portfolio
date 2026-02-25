import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore - ES module import
import { PlaneGame } from '../main.js';

const PlaneGame3DPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PlaneGame | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const handlePause = useCallback(() => {
    if (gameRef.current) {
      if (isPaused) {
        gameRef.current.start();
      } else {
        gameRef.current.stop();
      }
      setIsPaused(!isPaused);
    }
  }, [isPaused]);

  const handleStart = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.start();
      setShowMenu(false);
      setIsPaused(false);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      gameRef.current = new PlaneGame(containerRef.current);
      // Start the game immediately (no menu blocking)
      if (gameRef.current) {
        gameRef.current.start();
        setShowMenu(false);
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.cleanup();
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#1a1a2e] overflow-hidden">
      <div className="relative z-10">
        <div className="absolute top-4 left-4 z-50">
          <Link
            to="/play"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm border border-cyan-500/50 rounded-lg text-white hover:bg-cyan-500/20 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-sans text-sm">Back</span>
          </Link>
        </div>

        <div ref={containerRef} className="w-full h-screen" />

        {/* Menu */}
        {showMenu && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-3xl font-serif text-white mb-4 text-center">3D Plane Game</h2>
              <p className="text-white/70 text-center mb-6 font-sans">
                Experience arcade-style flight physics! Use WASD to control pitch and roll, Q/E for yaw, and Shift for boost.
              </p>
              <button
                onClick={handleStart}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-sans transition-colors"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Pause Button */}
        {!showMenu && (
          <div className="absolute top-20 right-6 z-50">
            <button
              onClick={handlePause}
              className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white hover:bg-black/80 transition-colors"
            >
              <div className="text-xs font-semibold font-sans">
                {isPaused ? 'Resume' : 'Pause'}
              </div>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default PlaneGame3DPage;
