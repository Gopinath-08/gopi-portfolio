import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, GraduationCap, Award, Code2 } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  company?: string;
  description: string;
  icon: typeof Briefcase;
  achievements: string[];
}

const LeadershipTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const timeline: TimelineItem[] = [
    {
      year: '2024',
      title: 'Technical Leadership',
      company: 'Full-Stack Development',
      description: 'Leading cross-functional teams in building scalable web and mobile applications',
      icon: Briefcase,
      achievements: [
        'Architected microservices infrastructure',
        'Reduced deployment time by 60%',
        'Led team of 10+ developers',
      ],
    },
    {
      year: '2023',
      title: 'Senior Developer',
      description: 'Specialized in React, Node.js, and cloud infrastructure',
      icon: Code2,
      achievements: [
        'Built 50+ production applications',
        'Implemented CI/CD pipelines',
        'Optimized performance by 40%',
      ],
    },
    {
      year: '2022',
      title: 'Full-Stack Developer',
      description: 'Started journey in modern web development',
      icon: GraduationCap,
      achievements: [
        'Mastered React ecosystem',
        'Deployed first production app',
        'Contributed to open source',
      ],
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Career Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
            Leadership <span className="text-gradient-accent">Timeline</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A track record of continuous growth and technical excellence
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline line */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
              )}

              <div className="flex gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg relative z-10">
                    <item.icon className="text-white" size={24} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-2xl font-bold text-primary">{item.year}</span>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                      {item.company && (
                        <p className="text-sm text-muted-foreground">{item.company}</p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  
                  <div className="space-y-2">
                    {item.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTimeline;

