import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import MobileFrame from './MobileFrame';
import WebsiteFrame from './WebsiteFrame';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.getProjects();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const projects = data || [];

  return (
    <section id="projects" className="py-32 bg-card relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Asymmetric header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-serif text-foreground mb-8 leading-tight tracking-tight">
            Projects
          </h2>
          <p className="text-lg text-foreground/90 max-w-2xl font-sans leading-relaxed">
            Selected work demonstrating technical depth and problem-solving approach.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load projects'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please check your connection and try again.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <motion.article
                key={project.id || project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="relative mb-6">
                  {/* Use appropriate frame based on project type */}
                  <div className="relative">
                    {project.type === 'mobile' ? (
                      <MobileFrame
                        image={project.image}
                        url={project.liveUrl}
                        className="flex justify-center"
                      />
                    ) : (
                      <WebsiteFrame
                        image={project.image}
                        url={project.liveUrl}
                      />
                    )}
                  </div>
                  
                  {/* Action buttons - always visible but subtle */}
                  <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="View live site"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-background border border-border text-foreground hover:border-primary transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="View source code"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                  
                  {/* Project type badge */}
                  {project.type && (
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm border border-border px-2.5 py-1 font-mono text-xs font-medium uppercase z-10">
                      {project.type}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-foreground/80 mb-4 text-sm leading-relaxed font-sans">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-card border border-primary/30 text-xs font-mono text-foreground/70 hover:border-accent hover:text-accent transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
