import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';

import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Projects from '@/components/Projects';

const Scene3D = lazy(() => import('@/components/Scene3D'));

const Index = () => {
  return (
    <main className="relative overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0">
          <Scene3D />
        </div>
      </Suspense>

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
