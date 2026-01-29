import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Projects from '@/components/Projects';
import PatternBackground from '@/components/PatternBackground';

const Index = () => {
  return (
    <main className="relative min-h-screen">
      {/* Subtle pattern background */}
      <PatternBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
