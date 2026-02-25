import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Lightbulb, Rocket, Users, Github, Star, GitFork } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Default stats as fallback
const defaultStats = [
  { value: '2+', label: 'Years Experience', icon: Code2 },
  { value: '50+', label: 'Projects Completed', icon: Github },
  { value: '10+', label: 'Happy Clients', icon: Users },
  { value: '5+', label: 'Awards Won', icon: Rocket },
];

const values = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable code that stands the test of time.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Embracing new technologies to deliver cutting-edge solutions.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Working closely with clients to understand and exceed expectations.',
  },
  {
    icon: Rocket,
    title: 'Performance',
    description: 'Optimizing every aspect for fast and efficient user experiences.',
  },
];

const About = () => {
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

  // Build stats from GitHub data or use defaults
  const stats = githubStats
    ? [
        { value: `${githubStats.totalRepos}+`, label: 'Repositories', icon: Github },
        { value: `${githubStats.totalStars}+`, label: 'Stars Earned', icon: Star },
        { value: `${githubStats.totalForks}+`, label: 'Forks', icon: GitFork },
        { value: '2+', label: 'Years Experience', icon: Code2 },
      ]
    : defaultStats;

  return (
    <section id="about" className="py-32 bg-card relative" ref={ref}>
      <div className="container mx-auto px-6 relative z-10">
        {/* Asymmetric layout - left aligned header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mb-20"
        >
          <h2 className="text-6xl md:text-7xl font-serif text-foreground mb-8 leading-tight tracking-tight">
            About
          </h2>
          <div className="max-w-2xl">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-sans mb-6">
              Full-Stack Developer from <span className="font-semibold text-primary">Balangir, Odisha</span>. 
              Building web and mobile applications with React, Node.js, and React Native.
            </p>
            <p className="text-base text-foreground/80 leading-relaxed font-sans">
              Focused on clean code, thoughtful design, and solving real problems through technology.
            </p>
          </div>
        </motion.div>

        {/* Stats - Horizontal layout, editorial style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-8 mb-24 pb-12 border-b border-border"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex-1 min-w-[140px]"
            >
              <div className="flex items-baseline gap-3 mb-1">
                <p className="text-5xl md:text-6xl font-serif text-primary leading-none">{stat.value}</p>
                <stat.icon size={20} className="text-accent mt-2" />
              </div>
              <p className="text-sm font-sans text-foreground/70 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Values - Two column layout, editorial style */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-l-2 border-accent pl-6 py-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <value.icon size={20} className="text-primary" />
                <h3 className="text-xl font-serif text-foreground">{value.title}</h3>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed font-sans">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
