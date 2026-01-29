import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react';
import profileImage from '@/assets/profile.png';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Asymmetric layout - content offset left */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 items-center">
            {/* Content - intentionally left-aligned, not centered */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-left"
            >

              <motion.h1
                variants={itemVariants}
                className="text-6xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[0.95] mb-8 tracking-tight"
                style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
              >
                <span className="block">Gopinath</span>
                <span className="block text-primary">Majhi</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl font-sans font-normal text-accent mt-4 tracking-normal">
                  Full-Stack Developer
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10 leading-relaxed font-sans"
                style={{ maxWidth: '32rem' }}
              >
                Building web and mobile applications with modern technologies. 
                Focused on clean architecture, performance, and meaningful user experiences.
              </motion.p>

              <motion.div variants={itemVariants} className="flex items-center gap-6 mb-12">
                <motion.a
                  href="#contact"
                  className="px-8 py-3 bg-primary text-primary-foreground font-sans font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact
                  <span className="text-sm">→</span>
                </motion.a>
                <motion.a
                  href="#projects"
                  className="px-8 py-3 border-2 border-foreground text-foreground font-sans font-medium hover:bg-foreground hover:text-background transition-all inline-flex items-center gap-2"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Projects
                  <span className="text-sm">→</span>
                </motion.a>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8 border-t border-border/50">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-foreground/50">Connect</span>
                  <div className="flex items-center gap-4">
                    {[
                      { Icon: Github, href: 'https://github.com/Gopinath-08', label: 'GitHub' },
                      { Icon: Linkedin, href: 'https://www.linkedin.com/in/gopinath-majhi-76b0b81b8', label: 'LinkedIn' },
                      { Icon: Twitter, href: 'https://x.com/GopinathMajhi13', label: 'Twitter' },
                    ].map(({ Icon, href, label }) => (
                      <motion.a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border/50 hover:border-primary hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all"
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={label}
                      >
                        <Icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Profile Image - Right side, clean */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <img
                  src={profileImage}
                  alt="Gopinath Majhi"
                  className="w-full h-full object-cover rounded-lg border border-border"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - minimal, editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-6"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-foreground/50 hover:text-foreground transition-colors group"
          >
            <span className="text-xs font-mono uppercase tracking-wider">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={18} className="text-primary" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
