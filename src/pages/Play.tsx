import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Code, Gamepad2, Sparkles, Zap, Palette, Music, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PatternBackground from '@/components/PatternBackground';

const Play = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const playItems = [
    {
      icon: Zap,
      title: 'Nothing to Hide',
      description: 'An unsettling surveillance experience. Browse normally. There is no reason to feel watched.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      link: '/play/nothing-to-hide',
      featured: false,
    },
    {
      icon: Sparkles,
      title: 'Dead Philosophers',
      description: 'मृत दार्शनिकों से मिलें · Chat with Chanakya, Shankaracharya, Aristotle & more. Ancient wisdom for modern problems.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      link: '/play/dead-philosophers',
      featured: true,
    },
    {
      icon: Code,
      title: 'Code Snippets',
      description: 'Interactive code examples and experiments',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
      link: null,
      featured: false,
    },
    {
      icon: Sparkles,
      title: 'Experiments',
      description: 'Creative coding experiments and prototypes',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      link: null,
      featured: false,
    },
    {
      icon: Palette,
      title: 'Visual Art',
      description: 'Creative visual projects and animations',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
      link: null,
      featured: false,
    },
    {
      icon: Music,
      title: 'Audio Visual',
      description: 'Interactive audio-visual experiences',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      link: null,
      featured: false,
    },
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: 'Fun and engaging browser-based games',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
      link: null,
      featured: false,
    },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Subtle pattern background */}
      <PatternBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <section className="py-32 bg-background relative" ref={ref}>
          <div className="container mx-auto px-6 relative z-10">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-sans text-sm">Back to Home</span>
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mb-20"
            >
              <h1 className="text-6xl md:text-7xl font-serif text-foreground mb-8 leading-tight tracking-tight">
                Play
              </h1>
              <p className="text-lg text-foreground/90 max-w-2xl font-sans leading-relaxed">
                Interactive experiments, creative coding projects, and fun demos. 
                A space to explore ideas and push boundaries.
              </p>
            </motion.div>

            {/* Play Items Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playItems.map((item, index) => {
                const CardContent = (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative"
                  >
                    <div
                      className={`
                        relative p-8 border-2 rounded-lg transition-all duration-300
                        ${item.borderColor} ${item.bgColor}
                        hover:border-primary hover:shadow-lg hover:scale-[1.02]
                        ${item.link ? 'cursor-pointer' : 'cursor-default'}
                        h-full
                        ${item.featured ? 'border-primary/50 bg-primary/5' : ''}
                      `}
                      onClick={() => item.link && navigate(item.link)}
                    >
                      {/* Icon */}
                      <motion.div
                        className={`mb-6 ${item.color}`}
                        animate={hoveredCard === index ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon size={40} strokeWidth={1.5} />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground/70 font-sans leading-relaxed">
                        {item.description}
                      </p>

                      {item.link && (
                        <div className="mt-4 text-sm text-primary font-sans">
                          Play Now →
                        </div>
                      )}

                      {/* Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                      />
                    </div>
                  </motion.div>
                );

                return CardContent;
              })}
            </div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <p className="text-sm font-mono text-foreground/50 uppercase tracking-wider">
                More interactive experiences coming soon
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Play;

