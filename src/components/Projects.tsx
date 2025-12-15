import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Prompty App',
    description: 'Prompty helps you discover, save, and use powerful AI prompts with ease. Explore curated prompts that boost creativity, productivity, and better results across ChatGPT and other AI tools—all in a clean, intuitive experience.',
    tags: ['React Native', 'TypeScript', 'Express', 'MongoDB'],
    image: 'https://play-lh.googleusercontent.com/Z0KWpAZm31-5hDdt3Q1Ofcuf1KIlmZ0Df8ZXbpvl9tUj-d5u2AQcQzNwf8zM81N-lQFTWVrge-YrLvDYVl48=w832-h470-rw',
    liveUrl: 'https://play.google.com/store/apps/details?id=com.prompty.app',
    githubUrl: 'https://github.com/Gopinath-08',
  },
  {
    title: 'Prompty App',
    description: 'Prompty helps you discover, save, and use powerful AI prompts with ease. Explore curated prompts that boost creativity, productivity, and better results across ChatGPT and other AI tools—all in a clean, intuitive experience.',
    tags: ['React Native', 'TypeScript', 'Express', 'MongoDB'],
    image: 'https://play-lh.googleusercontent.com/Z0KWpAZm31-5hDdt3Q1Ofcuf1KIlmZ0Df8ZXbpvl9tUj-d5u2AQcQzNwf8zM81N-lQFTWVrge-YrLvDYVl48=w832-h470-rw',
    liveUrl: 'https://play.google.com/store/apps/details?id=com.prompty.app',
    githubUrl: 'https://github.com/Gopinath-08',
  },
  
 
];

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mt-4 mb-6">
            Featured <span className="text-gradient-accent">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A selection of projects that showcase my expertise and passion for building exceptional products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group bg-background rounded-3xl overflow-hidden shadow-card hover-lift"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex gap-3">
                    <motion.a
                      href={project.liveUrl}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-primary text-primary-foreground rounded-full"
                    >
                      <ExternalLink size={18} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-background text-foreground rounded-full"
                    >
                      <Github size={18} />
                    </motion.a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
