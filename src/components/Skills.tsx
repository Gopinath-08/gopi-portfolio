import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Default skills as fallback
const defaultSkills = [
  { name: 'React / React Native', level: 80, category: 'Frontend' },
  { name: 'JavaScript / TypeScript', level: 80, category: 'Frontend' },
  { name: 'Node.js', level: 88, category: 'Backend' },
  { name: 'Python / C++', level: 85, category: 'Backend' },
  { name: 'MongoDB', level: 87, category: 'Database' },
  { name: 'AWS / GCP / JWT', level: 82, category: 'DevOps' },
  { name: 'Docker', level: 80, category: 'DevOps' },
  { name: 'RESTFull', level: 85, category: 'API' },
];

const defaultTechnologies = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
  'AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
  'Tailwind CSS', 'Framer Motion', 'Three.js', 'WebGL',
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: githubStats } = useQuery({
    queryKey: ['github-stats'],
    queryFn: async () => {
      const response = await apiClient.getGitHubStats();
      return response.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });

  // Calculate skill levels based on GitHub language usage
  const skills = useMemo(() => {
    if (!githubStats?.languages) return defaultSkills;

    const languageCounts = githubStats.languages;
    const totalRepos = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);
    
    // Map GitHub languages to skills with calculated levels
    const languageMap: Record<string, { name: string; category: string }> = {
      'JavaScript': { name: 'JavaScript / TypeScript', category: 'Frontend' },
      'TypeScript': { name: 'JavaScript / TypeScript', category: 'Frontend' },
      'React': { name: 'React / React Native', category: 'Frontend' },
      'Python': { name: 'Python / C++', category: 'Backend' },
      'Java': { name: 'Java', category: 'Backend' },
      'Go': { name: 'Go', category: 'Backend' },
    };

    const skillMap = new Map<string, { name: string; level: number; category: string }>();

    Object.entries(languageCounts).forEach(([lang, count]) => {
      const mapped = languageMap[lang] || { name: lang, category: 'Other' };
      const percentage = Math.round((count / totalRepos) * 100);
      const level = Math.min(95, Math.max(60, percentage * 10)); // Scale to 60-95 range

      const existing = skillMap.get(mapped.name);
      if (!existing || existing.level < level) {
        skillMap.set(mapped.name, { ...mapped, level });
      }
    });

    // Combine with default skills, prioritizing GitHub data
    const combined = [...Array.from(skillMap.values()), ...defaultSkills];
    const unique = Array.from(
      new Map(combined.map(skill => [skill.name, skill])).values()
    );

    return unique.slice(0, 8); // Limit to 8 skills
  }, [githubStats]);

  // Build technologies list from GitHub languages + defaults
  const technologies = useMemo(() => {
    if (!githubStats?.languages) return defaultTechnologies;

    const githubLangs = Object.keys(githubStats.languages);
    const combined = [...githubLangs, ...defaultTechnologies];
    return Array.from(new Set(combined)).slice(0, 20); // Limit to 20 technologies
  }, [githubStats]);

  return (
    <section id="skills" className="py-32 bg-background relative" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Asymmetric header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-serif text-foreground mb-8 leading-tight tracking-tight">
            Skills
          </h2>
          <p className="text-lg text-foreground/90 max-w-2xl font-sans leading-relaxed">
            Technologies and tools I use to build production applications.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-20 items-start">
          {/* Skill Bars - Editorial style */}
          <div className="space-y-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="border-l-2 border-accent pl-6"
              >
                <div className="flex justify-between items-baseline mb-3">
                  <span className="font-sans font-medium text-foreground text-sm uppercase tracking-wider">{skill.name}</span>
                  <span className="text-xs font-mono text-primary font-bold">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-primary"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technology Tags - Minimal, structured */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-24"
          >
            <h3 className="text-sm font-mono uppercase tracking-wider text-foreground/50 mb-6">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-card border border-primary/30 text-xs font-mono text-foreground/80 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
