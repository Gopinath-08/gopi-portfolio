<<<<<<< HEAD
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Play from "./pages/Play";
import NothingToHide from "./pages/NothingToHide";
import DeadPhilosophers from "./pages/DeadPhilosophers";
import OrbitMerge from "./pages/OrbitMerge";
import PlaneGame3D from "./pages/PlaneGame3D";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/play" element={<Play />} />
            <Route path="/play/nothing-to-hide" element={<NothingToHide />} />
            <Route path="/play/dead-philosophers" element={<DeadPhilosophers />} />
            <Route path="/play/orbit-merge" element={<OrbitMerge />} />
            <Route path="/play/sky-flow" element={<PlaneGame3D />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
=======
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Play from "./pages/Play";
import NothingToHide from "./pages/NothingToHide";
import DeadPhilosophers from "./pages/DeadPhilosophers";
import OrbitMerge from "./pages/OrbitMerge";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/play" element={<Play />} />
            <Route path="/play/nothing-to-hide" element={<NothingToHide />} />
            <Route path="/play/dead-philosophers" element={<DeadPhilosophers />} />
            <Route path="/play/orbit-merge" element={<OrbitMerge />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
>>>>>>> 91789f59d7bf73768e9cdb48b6a41f9a6c3f3de1
