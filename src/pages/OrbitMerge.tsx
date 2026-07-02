import { ArrowLeft, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import orbitMergeUrl from "./orbit-merge.html?url";

const OrbitMerge = () => {
  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.();
  };

  return (
    <main className="relative h-screen overflow-hidden bg-[#070a12]">
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-6 sm:right-6">
        <Link
          to="/play"
          aria-label="Back to Play"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-[#0c111d]/90 text-white shadow-lg backdrop-blur transition-colors hover:border-[#7dd8b0]/60 hover:text-[#7dd8b0]"
        >
          <ArrowLeft size={19} />
        </Link>
        <button
          type="button"
          aria-label="Enter fullscreen"
          title="Enter fullscreen"
          onClick={enterFullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-[#0c111d]/90 text-white shadow-lg backdrop-blur transition-colors hover:border-[#7dd8b0]/60 hover:text-[#7dd8b0]"
        >
          <Maximize2 size={18} />
        </button>
      </div>
      <iframe
        src={orbitMergeUrl}
        title="Orbit Merge game"
        className="h-full w-full border-0"
        allow="autoplay; fullscreen"
      />
    </main>
  );
};

export default OrbitMerge;
