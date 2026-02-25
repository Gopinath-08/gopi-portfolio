import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NothingToHide = () => {
  return (
    <main className="fixed inset-0 flex flex-col bg-background z-0">
      {/* Back button - above iframe so it's always visible */}
      <div className="absolute top-4 left-4 z-[10001]">
        <Link
          to="/play"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-background/90 border border-border text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Back to Play
        </Link>
      </div>

      <iframe
        src="/nothing-to-hide.html"
        title="Nothing to Hide"
        className="flex-1 w-full border-0"
        sandbox="allow-scripts allow-forms allow-same-origin"
      />
    </main>
  );
};

export default NothingToHide;
