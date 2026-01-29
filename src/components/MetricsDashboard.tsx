import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Users, Code, Award, Zap, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface Metric {
  icon: typeof TrendingUp;
  value: string;
  label: string;
  change?: string;
  color: string;
}

const MetricsDashboard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: githubStats } = useQuery({
    queryKey: ['github-stats'],
    queryFn: async () => {
      const response = await apiClient.getGitHubStats();
      return response.data;
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  const metrics: Metric[] = [
    {
      icon: Code,
      value: githubStats ? `${githubStats.totalRepos}+` : '50+',
      label: 'Projects Delivered',
      change: '+15% YoY',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      value: '10+',
      label: 'Teams Led',
      change: 'Cross-functional',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      value: '2+',
      label: 'Years Leadership',
      change: 'Exponential Growth',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      value: '99.9%',
      label: 'Uptime SLA',
      change: 'Enterprise Grade',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Target,
      value: '$2M+',
      label: 'Cost Savings',
      change: 'Infrastructure',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Award,
      value: '5+',
      label: 'Awards & Recognition',
      change: 'Industry Leading',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Impact Metrics</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4">
            Delivering <span className="text-gradient-accent">Measurable Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Data-driven leadership with proven track record of scaling technology and teams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-10`}>
                    <metric.icon className={`text-foreground`} size={24} />
                  </div>
                  {metric.change && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {metric.change}
                    </span>
                  )}
                </div>
                
                <div className="mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: 'spring' }}
                    className="text-4xl font-bold text-foreground mb-1"
                  >
                    {metric.value}
                  </motion.div>
                  <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsDashboard;

